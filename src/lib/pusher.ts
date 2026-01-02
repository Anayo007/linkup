import Pusher from 'pusher';

// Server-side Pusher instance
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export default pusherServer;

// Channel naming conventions
export const getMatchChannel = (matchId: string) => `private-match-${matchId}`;
export const getUserChannel = (userId: string) => `private-user-${userId}`;
export const getPresenceChannel = () => 'presence-online';

// Event types
export const PUSHER_EVENTS = {
  NEW_MESSAGE: 'new-message',
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  MESSAGE_READ: 'message-read',
  NEW_MATCH: 'new-match',
  USER_ONLINE: 'user-online',
  USER_OFFLINE: 'user-offline',
} as const;
