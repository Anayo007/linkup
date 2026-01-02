import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalMatches,
      matchesToday,
      openReports,
      reportsToday,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.match.count(),
      prisma.match.count({ where: { createdAt: { gte: today } } }),
      prisma.report.count({ where: { status: 'open' } }),
      prisma.report.count({ where: { createdAt: { gte: today } } }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        newUsersToday,
        totalMatches,
        matchesToday,
        openReports,
        reportsToday,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
