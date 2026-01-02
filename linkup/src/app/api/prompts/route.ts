import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Get prompts error:', error);
    return NextResponse.json({ error: 'Failed to get prompts' }, { status: 500 });
  }
}
