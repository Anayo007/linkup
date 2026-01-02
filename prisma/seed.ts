import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const prompts = [
  // Fun
  { text: "My most controversial opinion is...", category: "fun" },
  { text: "The way to my heart is...", category: "fun" },
  { text: "My simple pleasures are...", category: "fun" },
  { text: "I geek out on...", category: "fun" },
  { text: "My go-to karaoke song is...", category: "fun" },
  { text: "Two truths and a lie...", category: "fun" },
  { text: "The best way to ask me out is...", category: "fun" },
  { text: "My most irrational fear is...", category: "fun" },
  { text: "I'm weirdly attracted to...", category: "fun" },
  { text: "My hidden talent is...", category: "fun" },
  { text: "The last thing I Googled was...", category: "fun" },
  { text: "My comfort TV show is...", category: "fun" },
  
  // Values
  { text: "I value...", category: "values" },
  { text: "I'm looking for someone who...", category: "values" },
  { text: "The most important thing in a relationship is...", category: "values" },
  { text: "I believe that...", category: "values" },
  { text: "My love language is...", category: "values" },
  { text: "I'm most grateful for...", category: "values" },
  { text: "Something I've learned the hard way is...", category: "values" },
  { text: "I want someone who...", category: "values" },
  { text: "My biggest green flag is...", category: "values" },
  { text: "I feel most supported when...", category: "values" },
  { text: "The quality I value most in others is...", category: "values" },
  { text: "My non-negotiable is...", category: "values" },
  
  // Lifestyle
  { text: "A typical Sunday for me looks like...", category: "lifestyle" },
  { text: "My ideal first date is...", category: "lifestyle" },
  { text: "On weekends you'll find me...", category: "lifestyle" },
  { text: "My favorite way to unwind is...", category: "lifestyle" },
  { text: "I'm currently obsessed with...", category: "lifestyle" },
  { text: "My dream holiday destination is...", category: "lifestyle" },
  { text: "The best meal I've ever had was...", category: "lifestyle" },
  { text: "My morning routine includes...", category: "lifestyle" },
  { text: "I spend too much money on...", category: "lifestyle" },
  { text: "My favorite local spot is...", category: "lifestyle" },
  { text: "I'm training for...", category: "lifestyle" },
  { text: "My next adventure will be...", category: "lifestyle" },
  
  // Relationship
  { text: "Together, we could...", category: "relationship" },
  { text: "I'll know it's time to delete the app when...", category: "relationship" },
  { text: "The key to my heart is...", category: "relationship" },
  { text: "I'm looking for...", category: "relationship" },
  { text: "My ideal relationship looks like...", category: "relationship" },
  { text: "I'll fall for you if...", category: "relationship" },
  { text: "Let's debate this topic...", category: "relationship" },
  { text: "I promise I won't judge you if...", category: "relationship" },
  { text: "We'll get along if...", category: "relationship" },
  { text: "I'm convinced that...", category: "relationship" },
  { text: "Dating me is like...", category: "relationship" },
  { text: "I guarantee you that...", category: "relationship" },
];

const sampleUsers = [
  {
    email: "emma@example.com",
    name: "Emma",
    dob: new Date("1996-05-15"),
    gender: "woman",
    interestedIn: "men",
    bio: "Coffee enthusiast, book lover, and weekend hiker. Looking for someone to explore London's hidden gems with.",
    jobTitle: "Marketing Manager",
    company: "Tech Startup",
    education: "University of Manchester",
    city: "London",
    locationLat: 51.5074,
    locationLng: -0.1278,
    height: "168",
    religion: "Agnostic",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample1.jpg", "/uploads/sample2.jpg", "/uploads/sample3.jpg"],
    promptAnswers: [
      { promptIndex: 24, answer: "Brunch with friends, a long walk in the park, and catching up on my reading list" },
      { promptIndex: 3, answer: "True crime podcasts and vintage furniture restoration" },
      { promptIndex: 36, answer: "Explore every coffee shop in London and find the perfect flat white" },
    ],
  },
  {
    email: "james@example.com",
    name: "James",
    dob: new Date("1993-08-22"),
    gender: "man",
    interestedIn: "women",
    bio: "Software engineer by day, amateur chef by night. Always up for trying new restaurants.",
    jobTitle: "Software Engineer",
    company: "Google",
    education: "Imperial College London",
    city: "London",
    locationLat: 51.5200,
    locationLng: -0.1000,
    height: "183",
    religion: "Atheist",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample4.jpg", "/uploads/sample5.jpg", "/uploads/sample6.jpg"],
    promptAnswers: [
      { promptIndex: 25, answer: "A cozy wine bar with good conversation, or cooking dinner together at home" },
      { promptIndex: 0, answer: "Pineapple absolutely belongs on pizza and I will die on this hill" },
      { promptIndex: 14, answer: "Quality time - I'd rather have one deep conversation than ten surface-level ones" },
    ],
  },
  {
    email: "sophie@example.com",
    name: "Sophie",
    dob: new Date("1997-03-10"),
    gender: "woman",
    interestedIn: "men",
    bio: "Yoga instructor and plant mum. Looking for someone who doesn't take themselves too seriously.",
    jobTitle: "Yoga Instructor",
    company: "Self-employed",
    education: "University of Bristol",
    city: "London",
    locationLat: 51.4900,
    locationLng: -0.1500,
    height: "165",
    religion: "Spiritual",
    drinking: "Rarely",
    smoking: "Never",
    photos: ["/uploads/sample7.jpg", "/uploads/sample8.jpg", "/uploads/sample9.jpg"],
    promptAnswers: [
      { promptIndex: 27, answer: "A morning yoga session, farmers market, and cooking something new" },
      { promptIndex: 17, answer: "Someone who can make me laugh and isn't afraid to be vulnerable" },
      { promptIndex: 42, answer: "We both love spontaneous adventures and deep conversations" },
    ],
  },
  {
    email: "oliver@example.com",
    name: "Oliver",
    dob: new Date("1991-11-28"),
    gender: "man",
    interestedIn: "women",
    bio: "Architect with a passion for sustainable design. Weekend footballer and pub quiz champion.",
    jobTitle: "Architect",
    company: "Foster + Partners",
    education: "Cambridge University",
    city: "London",
    locationLat: 51.5300,
    locationLng: -0.0800,
    height: "180",
    religion: "Christian",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample10.jpg", "/uploads/sample11.jpg", "/uploads/sample12.jpg"],
    promptAnswers: [
      { promptIndex: 29, answer: "Barcelona - the architecture, the food, the beaches. Perfect combination" },
      { promptIndex: 12, answer: "Honesty, kindness, and a good sense of humor" },
      { promptIndex: 39, answer: "Someone who's ambitious but knows how to switch off and enjoy life" },
    ],
  },
  {
    email: "lily@example.com",
    name: "Lily",
    dob: new Date("1995-07-04"),
    gender: "woman",
    interestedIn: "men",
    bio: "Junior doctor surviving on coffee and determination. Looking for someone to share takeaway and Netflix with.",
    jobTitle: "Junior Doctor",
    company: "NHS",
    education: "King's College London",
    city: "London",
    locationLat: 51.4800,
    locationLng: -0.1200,
    height: "162",
    religion: "Agnostic",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample13.jpg", "/uploads/sample14.jpg", "/uploads/sample15.jpg"],
    promptAnswers: [
      { promptIndex: 11, answer: "Grey's Anatomy - yes, I know it's unrealistic, but I can't help it" },
      { promptIndex: 1, answer: "Good food, bad puns, and someone who remembers the little things" },
      { promptIndex: 37, answer: "When we can sit in comfortable silence together" },
    ],
  },
  {
    email: "alex@example.com",
    name: "Alex",
    dob: new Date("1994-01-19"),
    gender: "non-binary",
    interestedIn: "everyone",
    bio: "Creative director and part-time DJ. Always looking for the next great exhibition or gig.",
    jobTitle: "Creative Director",
    company: "Design Agency",
    education: "Central Saint Martins",
    city: "London",
    locationLat: 51.5100,
    locationLng: -0.0700,
    height: "175",
    religion: "Atheist",
    drinking: "Socially",
    smoking: "Socially",
    photos: ["/uploads/sample16.jpg", "/uploads/sample17.jpg", "/uploads/sample18.jpg"],
    promptAnswers: [
      { promptIndex: 4, answer: "Anything by ABBA - no shame, just pure joy" },
      { promptIndex: 28, answer: "Vinyl shopping, gallery hopping, or finding a new rooftop bar" },
      { promptIndex: 44, answer: "Exploring art galleries and debating whether modern art is actually art" },
    ],
  },
  {
    email: "charlotte@example.com",
    name: "Charlotte",
    dob: new Date("1992-09-12"),
    gender: "woman",
    interestedIn: "men",
    bio: "Lawyer by profession, foodie by passion. Can recommend a restaurant for any occasion.",
    jobTitle: "Corporate Lawyer",
    company: "Magic Circle Firm",
    education: "Oxford University",
    city: "London",
    locationLat: 51.5150,
    locationLng: -0.0900,
    height: "170",
    religion: "Jewish",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample19.jpg", "/uploads/sample20.jpg", "/uploads/sample21.jpg"],
    promptAnswers: [
      { promptIndex: 30, answer: "Omakase at a tiny sushi counter in Tokyo - life-changing" },
      { promptIndex: 15, answer: "My family, my friends, and the ability to travel" },
      { promptIndex: 40, answer: "Meaningful conversations over great food" },
    ],
  },
  {
    email: "tom@example.com",
    name: "Tom",
    dob: new Date("1990-04-25"),
    gender: "man",
    interestedIn: "women",
    bio: "Finance professional who'd rather be hiking. Training for my first marathon.",
    jobTitle: "Investment Analyst",
    company: "Goldman Sachs",
    education: "LSE",
    city: "London",
    locationLat: 51.5050,
    locationLng: -0.1100,
    height: "185",
    religion: "Agnostic",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample22.jpg", "/uploads/sample23.jpg", "/uploads/sample24.jpg"],
    promptAnswers: [
      { promptIndex: 34, answer: "Running the London Marathon - wish me luck!" },
      { promptIndex: 26, answer: "Exploring the countryside, trying new hiking trails, or recovering on the sofa" },
      { promptIndex: 13, answer: "Trust and communication - everything else follows" },
    ],
  },
  {
    email: "maya@example.com",
    name: "Maya",
    dob: new Date("1998-12-03"),
    gender: "woman",
    interestedIn: "everyone",
    bio: "Photographer and travel addict. Always planning my next adventure.",
    jobTitle: "Photographer",
    company: "Freelance",
    education: "Arts University Bournemouth",
    city: "London",
    locationLat: 51.4950,
    locationLng: -0.1400,
    height: "163",
    religion: "Buddhist",
    drinking: "Rarely",
    smoking: "Never",
    photos: ["/uploads/sample25.jpg", "/uploads/sample26.jpg", "/uploads/sample27.jpg"],
    promptAnswers: [
      { promptIndex: 35, answer: "A road trip through Japan during cherry blossom season" },
      { promptIndex: 8, answer: "People who are passionate about something, anything" },
      { promptIndex: 41, answer: "You show me your favorite hidden spot in the city" },
    ],
  },
  {
    email: "daniel@example.com",
    name: "Daniel",
    dob: new Date("1989-06-17"),
    gender: "man",
    interestedIn: "women",
    bio: "Chef and restaurant owner. Will cook for you on the first date if you're lucky.",
    jobTitle: "Head Chef",
    company: "Own Restaurant",
    education: "Le Cordon Bleu",
    city: "London",
    locationLat: 51.5250,
    locationLng: -0.1350,
    height: "178",
    religion: "Catholic",
    drinking: "Socially",
    smoking: "Never",
    photos: ["/uploads/sample28.jpg", "/uploads/sample29.jpg", "/uploads/sample30.jpg"],
    promptAnswers: [
      { promptIndex: 32, answer: "Cookware and kitchen gadgets - my kitchen is basically a professional setup" },
      { promptIndex: 6, answer: "Come to my restaurant and let me cook for you" },
      { promptIndex: 43, answer: "I'll make you the best meal you've ever had" },
    ],
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.like.deleteMany();
  await prisma.skip.deleteMany();
  await prisma.block.deleteMany();
  await prisma.report.deleteMany();
  await prisma.promptAnswer.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.user.deleteMany();

  console.log('📝 Creating prompts...');
  
  // Create prompts
  const createdPrompts = await Promise.all(
    prompts.map((prompt) =>
      prisma.prompt.create({
        data: {
          text: prompt.text,
          category: prompt.category,
        },
      })
    )
  );

  console.log(`✅ Created ${createdPrompts.length} prompts`);

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@linkup.app',
      passwordHash: adminPassword,
      isAdmin: true,
      emailVerified: true,
    },
  });

  console.log('👥 Creating sample users...');
  
  // Create sample users
  for (const userData of sampleUsers) {
    const password = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: password,
        emailVerified: true,
      },
    });

    // Create profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        name: userData.name,
        dob: userData.dob,
        gender: userData.gender,
        interestedIn: userData.interestedIn,
        bio: userData.bio,
        jobTitle: userData.jobTitle,
        company: userData.company,
        education: userData.education,
        city: userData.city,
        locationLat: userData.locationLat,
        locationLng: userData.locationLng,
        height: userData.height ? parseInt(userData.height) : null,
        religion: userData.religion,
        drinking: userData.drinking,
        smoking: userData.smoking,
        prefAgeMin: 22,
        prefAgeMax: 40,
        prefDistance: 25,
        prefGender: userData.interestedIn === 'men' ? 'men' : userData.interestedIn === 'women' ? 'women' : 'everyone',
        onboardingComplete: true,
      },
    });

    // Create photos (using placeholder URLs)
    for (let i = 0; i < userData.photos.length; i++) {
      await prisma.photo.create({
        data: {
          userId: user.id,
          url: `https://picsum.photos/seed/${userData.email}${i}/400/600`,
          position: i,
        },
      });
    }

    // Create prompt answers
    for (let i = 0; i < userData.promptAnswers.length; i++) {
      const pa = userData.promptAnswers[i];
      await prisma.promptAnswer.create({
        data: {
          userId: user.id,
          promptId: createdPrompts[pa.promptIndex].id,
          answer: pa.answer,
          position: i,
        },
      });
    }

    console.log(`  ✅ Created user: ${userData.name}`);
  }

  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('📧 Admin login: admin@linkup.app / admin123');
  console.log('📧 Sample user login: emma@example.com / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
