import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge } from '@/lib/utils';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
      include: {
        user1: {
          include: {
            profile: true,
            photos: { orderBy: { position: 'asc' }, take: 1 },
          },
        },
        user2: {
          include: {
            profile: true,
            photos: { orderBy: { position: 'asc' }, take: 1 },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
    });

    // Format matches with other user info
    const formattedMatches = await Promise.all(
      matches.map(async (match) => {
        const otherUser = match.user1Id === user.id ? match.user2 : match.user1;
        
        // Get the like info (what they liked about each other)
        const theirLike = await prisma.like.findUnique({
          where: {
            fromUserId_toUserId: { fromUserId: otherUser.id, toUserId: user.id },
          },
          include: {
            photo: true,
            promptAnswer: { include: { prompt: true } },
          },
        });

        return {
          id: match.id,
          createdAt: match.createdAt,
          lastMessageAt: match.lastMessageAt,
          otherUser: {
            id: otherUser.id,
            name: otherUser.profile?.name || 'Unknown',
            age: otherUser.profile ? calculateAge(otherUser.profile.dob) : 0,
            photo: otherUser.photos[0]?.url,
          },
          lastMessage: match.messages[0] || null,
          likeInfo: theirLike,
        };
      })
    );

    return NextResponse.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json({ error: 'Failed to get matches' }, { status: 500 });
  }
}
