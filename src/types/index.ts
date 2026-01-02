export interface User {
  id: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  isSuspended: boolean;
  createdAt: Date;
  lastActive: Date;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  dob: Date;
  gender: string;
  interestedIn: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  education?: string;
  height?: number;
  religion?: string;
  drinking?: string;
  smoking?: string;
  locationLat?: number;
  locationLng?: number;
  city?: string;
  prefAgeMin: number;
  prefAgeMax: number;
  prefDistance: number;
  prefGender?: string;
  isHidden: boolean;
  isPaused: boolean;
  onboardingComplete: boolean;
}

export interface Photo {
  id: string;
  userId: string;
  url: string;
  position: number;
  createdAt: Date;
}

export interface Prompt {
  id: string;
  text: string;
  category: string;
  isActive: boolean;
}

export interface PromptAnswer {
  id: string;
  userId: string;
  promptId: string;
  prompt: Prompt;
  answer: string;
  position: number;
  createdAt: Date;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  targetType: 'photo' | 'prompt';
  photoId?: string;
  promptAnswerId?: string;
  comment?: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  lastMessageAt?: Date;
  otherUser?: DiscoveryProfile;
  lastMessage?: Message;
  likeInfo?: Like;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  notes?: string;
  status: 'open' | 'reviewed' | 'banned';
  adminNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  reporter?: User;
  reported?: User & { profile?: Profile };
}

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  bio?: string;
  jobTitle?: string;
  company?: string;
  education?: string;
  height?: number;
  city?: string;
  distance?: number;
  photos: Photo[];
  promptAnswers: (PromptAnswer & { prompt: Prompt })[];
}

export interface OnboardingData {
  name: string;
  dob: string;
  gender: string;
  interestedIn: string;
  city: string;
  locationLat?: number;
  locationLng?: number;
  photos: string[];
  promptAnswers: { promptId: string; answer: string }[];
  jobTitle?: string;
  company?: string;
  education?: string;
  height?: number;
  religion?: string;
  drinking?: string;
  smoking?: string;
  prefAgeMin: number;
  prefAgeMax: number;
  prefDistance: number;
  prefGender?: string;
}
