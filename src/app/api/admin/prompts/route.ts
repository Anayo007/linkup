import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Get all prompts (admin)
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prompts = await prisma.prompt.findMany({
      orderBy: [{ category: 'asc' }, { text: 'asc' }],
      include: {
        _count: {
          select: { answers: true },
        },
      },
    });

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Get prompts error:', error);
    return NextResponse.json({ error: 'Failed to get prompts' }, { status: 500 });
  }
}

// Create new prompt
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, category } = await request.json();

    if (!text || !category) {
      return NextResponse.json({ error: 'Text and category required' }, { status: 400 });
    }

    const prompt = await prisma.prompt.create({
      data: { text, category },
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Create prompt error:', error);
    return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 });
  }
}

// Update prompt
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, text, category, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Prompt ID required' }, { status: 400 });
    }

    const prompt = await prisma.prompt.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Update prompt error:', error);
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
  }
}

// Delete prompt
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Prompt ID required' }, { status: 400 });
    }

    // Check if prompt has answers
    const answerCount = await prisma.promptAnswer.count({
      where: { promptId: id },
    });

    if (answerCount > 0) {
      // Just deactivate instead of deleting
      await prisma.prompt.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ message: 'Prompt deactivated (has existing answers)' });
    }

    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Prompt deleted' });
  } catch (error) {
    console.error('Delete prompt error:', error);
    return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 });
  }
}
