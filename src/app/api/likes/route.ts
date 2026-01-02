import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { toUserId, targetType, photoId, promptAnswerId, comment } = await request.json();

    if (!toUserId || !targetType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: { fromUserId: user.id, toUserId },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked this user' }, { status: 400 });
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        fromUserId: user.id,
        toUserId,
        targetType,
        photoId: targetType === 'photo' ? photoId : null,
        promptAnswerId: targetType === 'prompt' ? promptAnswerId : null,
        comment,
      },
    });

    // Check if mutual like exists (match!)
    const mutualLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: { fromUserId: toUserId, toUserId: user.id },
      },
    });

    let match = null;
    if (mutualLike) {
      // Create match (ensure consistent ordering)
      const [user1Id, user2Id] = [user.id, toUserId].sort();
      
      match = await prisma.match.create({
        data: { user1Id, user2Id },
      });
    }

    return NextResponse.json({ 
      like, 
      match,
      isMatch: !!match,
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get likes received (people who liked me)
    const likesReceived = await prisma.like.findMany({
      where: { toUserId: user.id },
      include: {
        fromUser: {
          include: {
            profile: true,
            photos: { orderBy: { position: 'asc' }, take: 1 },
          },
        },
        photo: true,
        promptAnswer: { include: { prompt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ likes: likesReceived });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json({ error: 'Failed to get likes' }, { status: 500 });
  }
}
