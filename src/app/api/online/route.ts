import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Update user's last active timestamp
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update online status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// Check if a user is online (active in last 5 minutes)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastActive: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Consider online if active in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isOnline = targetUser.lastActive && targetUser.lastActive > fiveMinutesAgo;

    return NextResponse.json({ 
      isOnline,
      lastActive: targetUser.lastActive,
    });
  } catch (error) {
    console.error('Get online status error:', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
