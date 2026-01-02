import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import pusherServer from '@/lib/pusher';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channel = params.get('channel_name');

    if (!socketId || !channel) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Validate channel access
    if (channel.startsWith('private-match-')) {
      const matchId = channel.replace('private-match-', '');
      const match = await prisma.match.findFirst({
        where: {
          id: matchId,
          OR: [
            { user1Id: user.id },
            { user2Id: user.id },
          ],
        },
      });

      if (!match) {
        return NextResponse.json({ error: 'Not authorized for this channel' }, { status: 403 });
      }
    } else if (channel.startsWith('private-user-')) {
      const userId = channel.replace('private-user-', '');
      if (userId !== user.id) {
        return NextResponse.json({ error: 'Not authorized for this channel' }, { status: 403 });
      }
    }

    // For presence channels
    if (channel.startsWith('presence-')) {
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { name: true },
      });

      const presenceData = {
        user_id: user.id,
        user_info: {
          name: profile?.name || 'User',
        },
      };

      const auth = pusherServer.authorizeChannel(socketId, channel, presenceData);
      return NextResponse.json(auth);
    }

    // For private channels
    const auth = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
