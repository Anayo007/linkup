import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          include: { profile: true },
        },
        reported: {
          include: { 
            profile: true,
            photos: { orderBy: { position: 'asc' }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const { reportId, status, adminNotes, action } = await request.json();

    if (!reportId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes,
        reviewedAt: new Date(),
      },
    });

    if (action === 'ban') {
      await prisma.user.update({
        where: { id: report.reportedId },
        data: { isBanned: true },
      });
    } else if (action === 'suspend') {
      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + 7);
      await prisma.user.update({
        where: { id: report.reportedId },
        data: { 
          isSuspended: true,
          suspendedUntil: suspendUntil,
        },
      });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
