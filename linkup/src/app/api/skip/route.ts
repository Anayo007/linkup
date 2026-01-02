import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

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

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Undo last skip
    const lastSkip = await prisma.skip.findFirst({
      where: { skipperId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lastSkip) {
      await prisma.skip.delete({
        where: { id: lastSkip.id },
      });
    }

    return NextResponse.json({ success: true, undoneSkipId: lastSkip?.skippedId });
  } catch (error) {
    console.error('Undo skip error:', error);
    return NextResponse.json({ error: 'Failed to undo skip' }, { status: 500 });
  }
}
