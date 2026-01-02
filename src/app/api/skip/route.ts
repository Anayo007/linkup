import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Undo limits by subscription tier
const UNDO_LIMITS = {
  free: 0,      // No undos for free
  plus: 5,      // 5 undos per day
  premium: Infinity, // Unlimited undos
};

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skippedId } = await request.json();

    if (!skippedId) {
      return NextResponse.json({ error: 'Missing skippedId' }, { status: 400 });
    }

    // Create skip (upsert to handle duplicates)
    await prisma.skip.upsert({
      where: {
        skipperId_skippedId: { skipperId: user.id, skippedId },
      },
      update: {},
      create: {
        skipperId: user.id,
        skippedId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Skip error:', error);
    return NextResponse.json({ error: 'Failed to skip' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get full user data with subscription info
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        subscriptionTier: true,
        dailyUndosUsed: true,
        dailyLikesResetAt: true, // Using same reset time as likes
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if daily undos need to be reset (new day)
    const now = new Date();
    const resetAt = new Date(fullUser.dailyLikesResetAt);
    const isNewDay = now.toDateString() !== resetAt.toDateString();

    let dailyUndosUsed = isNewDay ? 0 : fullUser.dailyUndosUsed;

    // Check undo limit
    const tier = fullUser.subscriptionTier as keyof typeof UNDO_LIMITS;
    const limit = UNDO_LIMITS[tier] ?? UNDO_LIMITS.free;

    if (dailyUndosUsed >= limit) {
      return NextResponse.json({ 
        error: limit === 0 ? 'Undo is a premium feature' : 'Daily undo limit reached',
        limitReached: true,
        limit,
        tier: fullUser.subscriptionTier,
      }, { status: 429 });
    }

    // Undo last skip
    const lastSkip = await prisma.skip.findFirst({
      where: { skipperId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastSkip) {
      return NextResponse.json({ error: 'No skip to undo' }, { status: 400 });
    }

    // Delete skip and increment undo count
    await prisma.$transaction([
      prisma.skip.delete({
        where: { id: lastSkip.id },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          dailyUndosUsed: isNewDay ? 1 : { increment: 1 },
        },
      }),
    ]);

    return NextResponse.json({ 
      success: true, 
      undoneSkipId: lastSkip.skippedId,
      undosRemaining: limit === Infinity ? null : limit - (dailyUndosUsed + 1),
    });
  } catch (error) {
    console.error('Undo skip error:', error);
    return NextResponse.json({ error: 'Failed to undo skip' }, { status: 500 });
  }
}
