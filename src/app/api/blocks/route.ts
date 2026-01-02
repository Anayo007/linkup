import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blockedId } = await request.json();

    if (!blockedId) {
      return NextResponse.json({ error: 'Missing blockedId' }, { status: 400 });
    }

    // Create block
    await prisma.block.upsert({
      where: {
        blockerId_blockedId: { blockerId: user.id, blockedId },
      },
      update: {},
      create: {
        blockerId: user.id,
        blockedId,
      },
    });

    // Remove any existing match
    await prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: user.id, user2Id: blockedId },
          { user1Id: blockedId, user2Id: user.id },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Block error:', error);
    return NextResponse.json({ error: 'Failed to block user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockedId = searchParams.get('blockedId');

    if (!blockedId) {
      return NextResponse.json({ error: 'Missing blockedId' }, { status: 400 });
    }

    await prisma.block.delete({
      where: {
        blockerId_blockedId: { blockerId: user.id, blockedId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unblock error:', error);
    return NextResponse.json({ error: 'Failed to unblock user' }, { status: 500 });
  }
}
