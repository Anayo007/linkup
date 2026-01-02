import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import pusherServer, { getMatchChannel, getUserChannel, PUSHER_EVENTS } from '@/lib/pusher';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId } = await params;

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

    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to get messages' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId } = await params;
    const { text, imageUrl } = await request.json();

    if (!text && !imageUrl) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
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

    // Check if other user has blocked current user
    const otherUserId = match.user1Id === user.id ? match.user2Id : match.user1Id;
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: otherUserId, blockedId: user.id },
          { blockerId: user.id, blockedId: otherUserId },
        ],
      },
    });

    if (block) {
      return NextResponse.json({ error: 'Cannot send message' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: user.id,
        text: text || '',
        imageUrl,
      },
    });

    // Update match's lastMessageAt
    await prisma.match.update({
      where: { id: matchId },
      data: { lastMessageAt: new Date() },
    });

    // Get sender's profile for the notification
    const senderProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { name: true },
    });

    // Trigger real-time event to the match channel
    await pusherServer.trigger(getMatchChannel(matchId), PUSHER_EVENTS.NEW_MESSAGE, {
      message: {
        ...message,
        senderName: senderProfile?.name || 'Someone',
      },
    });

    // Also notify the other user's personal channel (for notifications when not in chat)
    await pusherServer.trigger(getUserChannel(otherUserId), PUSHER_EVENTS.NEW_MESSAGE, {
      matchId,
      message: {
        ...message,
        senderName: senderProfile?.name || 'Someone',
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
