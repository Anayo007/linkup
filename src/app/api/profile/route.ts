import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    const photos = await prisma.photo.findMany({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
    });

    const promptAnswers = await prisma.promptAnswer.findMany({
      where: { userId: user.id },
      include: { prompt: true },
      orderBy: { position: 'asc' },
    });

    return NextResponse.json({ profile, photos, promptAnswers });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      name, dob, gender, interestedIn, bio, jobTitle, company, education,
      height, religion, drinking, smoking, city, locationLat, locationLng,
      prefAgeMin, prefAgeMax, prefDistance, prefGender,
      photos, promptAnswers,
    } = data;

    // Validate age (18+)
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return NextResponse.json({ error: 'You must be 18 or older' }, { status: 400 });
    }

    // Convert height to integer if provided
    const heightInt = height ? parseInt(height, 10) : null;

    // Create or update profile
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        name, dob: new Date(dob), gender, interestedIn, bio, jobTitle, company,
        education, height: heightInt, religion, drinking, smoking, city, locationLat, locationLng,
        prefAgeMin: prefAgeMin || 18, prefAgeMax: prefAgeMax || 50,
        prefDistance: prefDistance || 50, prefGender,
        onboardingComplete: true,
      },
      create: {
        userId: user.id, name, dob: new Date(dob), gender, interestedIn, bio,
        jobTitle, company, education, height: heightInt, religion, drinking, smoking,
        city, locationLat, locationLng,
        prefAgeMin: prefAgeMin || 18, prefAgeMax: prefAgeMax || 50,
        prefDistance: prefDistance || 50, prefGender,
        onboardingComplete: true,
      },
    });

    // Handle photos
    if (photos && photos.length > 0) {
      await prisma.photo.deleteMany({ where: { userId: user.id } });
      await prisma.photo.createMany({
        data: photos.map((url: string, index: number) => ({
          userId: user.id,
          url,
          position: index,
        })),
      });
    }

    // Handle prompt answers
    if (promptAnswers && promptAnswers.length > 0) {
      await prisma.promptAnswer.deleteMany({ where: { userId: user.id } });
      await prisma.promptAnswer.createMany({
        data: promptAnswers.map((pa: { promptId: string; answer: string }, index: number) => ({
          userId: user.id,
          promptId: pa.promptId,
          answer: pa.answer,
          position: index,
        })),
      });
    }

    return NextResponse.json({ profile, message: 'Profile saved successfully' });
  } catch (error: any) {
    console.error('Save profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to save profile', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data,
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
