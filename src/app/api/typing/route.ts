import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import pusherServer, { getMatchChannel, PUSHER_EVENTS } from '@/lib/pusher';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId, isTyping } = await request.json();

    if (!matchId) {
      return NextResponse.json({ error: 'Match ID required' }, { status: 400 });
    }

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { name: true },
    });

    // Trigger typing event
    const event = isTyping ? PUSHER_EVENTS.TYPING_START : PUSHER_EVENTS.TYPING_STOP;
    await pusherServer.trigger(getMatchChannel(matchId), event, {
      userId: user.id,
      userName: profile?.name || 'Someone',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Typing indicator error:', error);
    return NextResponse.json({ error: 'Failed to send typing indicator' }, { status: 500 });
  }
}
