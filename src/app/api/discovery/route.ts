import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateAge, calculateDistance } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get blocked users (both directions)
    const blocks = await prisma.block.findMany({
      where: {
        OR: [{ blockerId: user.id }, { blockedId: user.id }],
      },
    });
    const blockedIds = blocks.map(b => b.blockerId === user.id ? b.blockedId : b.blockerId);

    // Get users already liked
    const likes = await prisma.like.findMany({
      where: { fromUserId: user.id },
    });
    const likedIds = likes.map(l => l.toUserId);

    // Get users already skipped
    const skips = await prisma.skip.findMany({
      where: { skipperId: user.id },
    });
    const skippedIds = skips.map(s => s.skippedId);

    // Get matched users
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });
    const matchedIds = matches.map(m => m.user1Id === user.id ? m.user2Id : m.user1Id);

    // Exclude all these users
    const excludeIds = [...new Set([user.id, ...blockedIds, ...likedIds, ...skippedIds, ...matchedIds])];

    // Build gender filter - map preference to actual gender values
    let genderFilter = {};
    if (profile.prefGender && profile.prefGender !== 'everyone') {
      // Map 'men' -> 'man', 'women' -> 'woman'
      const genderValue = profile.prefGender === 'men' ? 'man' : 
                          profile.prefGender === 'women' ? 'woman' : 
                          profile.prefGender;
      genderFilter = { gender: genderValue };
    }

    // Get potential matches
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { notIn: excludeIds },
        onboardingComplete: true,
        isHidden: false,
        isPaused: false,
        ...genderFilter,
        user: {
          isBanned: false,
          isSuspended: false,
        },
      },
      include: {
        user: {
          select: { id: true, lastActive: true },
        },
      },
      take: 20,
    });

    // Filter by age and distance, then format
    const discoveryProfiles = await Promise.all(
      profiles
        .filter(p => {
          const age = calculateAge(p.dob);
          return age >= profile.prefAgeMin && age <= profile.prefAgeMax;
        })
        .filter(p => {
          if (!profile.locationLat || !profile.locationLng || !p.locationLat || !p.locationLng) {
            return true;
          }
          const distance = calculateDistance(
            profile.locationLat, profile.locationLng,
            p.locationLat, p.locationLng
          );
          return distance <= profile.prefDistance;
        })
        .map(async (p) => {
          const photos = await prisma.photo.findMany({
            where: { userId: p.userId },
            orderBy: { position: 'asc' },
          });

          const promptAnswers = await prisma.promptAnswer.findMany({
            where: { userId: p.userId },
            include: { prompt: true },
            orderBy: { position: 'asc' },
          });

          const distance = profile.locationLat && profile.locationLng && p.locationLat && p.locationLng
            ? calculateDistance(profile.locationLat, profile.locationLng, p.locationLat, p.locationLng)
            : undefined;

          return {
            id: p.userId,
            name: p.name,
            age: calculateAge(p.dob),
            bio: p.bio,
            jobTitle: p.jobTitle,
            company: p.company,
            education: p.education,
            height: p.height,
            city: p.city,
            distance,
            photos,
            promptAnswers,
          };
        })
    );

    return NextResponse.json({ profiles: discoveryProfiles });
  } catch (error) {
    console.error('Discovery error:', error);
    return NextResponse.json({ error: 'Failed to get profiles' }, { status: 500 });
  }
}
