import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Get app settings
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create app settings
    let settings = await prisma.appSettings.findUnique({
      where: { id: 'app_settings' },
    });

    if (!settings) {
      settings = await prisma.appSettings.create({
        data: { id: 'app_settings' },
      });
    }

    // Get subscription tiers
    let tiers = await prisma.subscriptionTier.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    // Create default tiers if none exist
    if (tiers.length === 0) {
      await prisma.subscriptionTier.createMany({
        data: [
          {
            name: 'free',
            displayName: 'Free',
            description: 'Get started with basic features',
            monthlyPrice: 0,
            yearlyPrice: 0,
            dailyLikes: 10,
            dailyUndos: 0,
            seeWhoLikesYou: false,
            advancedFilters: false,
            readReceipts: false,
            prioritySupport: false,
            profileBoost: false,
            noAds: false,
            sortOrder: 0,
          },
          {
            name: 'plus',
            displayName: 'LinkUp Plus',
            description: 'More likes, more matches',
            monthlyPrice: 1499,
            yearlyPrice: 9999,
            dailyLikes: 50,
            dailyUndos: 5,
            seeWhoLikesYou: true,
            advancedFilters: true,
            readReceipts: false,
            prioritySupport: false,
            profileBoost: false,
            noAds: true,
            badgeColor: '#3B82F6',
            badgeIcon: '⭐',
            sortOrder: 1,
          },
          {
            name: 'premium',
            displayName: 'LinkUp Premium',
            description: 'The ultimate dating experience',
            monthlyPrice: 2999,
            yearlyPrice: 19999,
            dailyLikes: -1,
            dailyUndos: -1,
            seeWhoLikesYou: true,
            advancedFilters: true,
            readReceipts: true,
            prioritySupport: true,
            profileBoost: true,
            noAds: true,
            badgeColor: '#F59E0B',
            badgeIcon: '👑',
            sortOrder: 2,
          },
        ],
      });

      tiers = await prisma.subscriptionTier.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    }

    return NextResponse.json({ settings, tiers });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

// Update app settings
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'settings') {
      const settings = await prisma.appSettings.upsert({
        where: { id: 'app_settings' },
        update: data,
        create: { id: 'app_settings', ...data },
      });
      return NextResponse.json({ settings });
    }

    if (type === 'tier') {
      const { id, ...tierData } = data;
      const tier = await prisma.subscriptionTier.update({
        where: { id },
        data: tierData,
      });
      return NextResponse.json({ tier });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
