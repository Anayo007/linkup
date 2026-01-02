import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { profile: { name: { contains: search } } },
      ];
    }

    if (status === 'banned') {
      where.isBanned = true;
    } else if (status === 'active') {
      where.isBanned = false;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: true,
          photos: { take: 1, orderBy: { position: 'asc' } },
          _count: {
            select: {
              reportsReceived: true,
              likesGiven: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        profile: user.profile ? {
          name: user.profile.name,
          city: user.profile.city,
          photo: user.photos[0]?.url,
        } : null,
        reportsCount: user._count.reportsReceived,
        likesCount: user._count.likesGiven,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case 'ban':
        updateData = { isBanned: true };
        break;
      case 'unban':
        updateData = { isBanned: false };
        break;
      case 'makeAdmin':
        updateData = { isAdmin: true };
        break;
      case 'removeAdmin':
        updateData = { isAdmin: false };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        profile: true,
        photos: { take: 1, orderBy: { position: 'asc' } },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        profile: user.profile ? {
          name: user.profile.name,
          photo: user.photos[0]?.url,
        } : null,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Delete user and all related data (cascading)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
