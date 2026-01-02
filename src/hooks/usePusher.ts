'use client';

import { useEffect, useRef, useCallback } from 'react';
import PusherClient from 'pusher-js';
import { PUSHER_EVENTS } from '@/lib/pusher';

let pusherInstance: PusherClient | null = null;

const getPusherClient = () => {
  if (!pusherInstance && typeof window !== 'undefined') {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    
    if (key && cluster) {
      pusherInstance = new PusherClient(key, {
        cluster,
        authEndpoint: '/api/pusher/auth',
      });
    }
  }
  return pusherInstance;
};

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  readAt?: string;
  senderName?: string;
}

interface UseChatPusherOptions {
  matchId: string;
  currentUserId: string;
  onNewMessage: (message: Message) => void;
  onTypingStart?: (userId: string, userName: string) => void;
  onTypingStop?: (userId: string) => void;
}

export function useChatPusher({
  matchId,
  currentUserId,
  onNewMessage,
  onTypingStart,
  onTypingStop,
}: UseChatPusherOptions) {
  const channelRef = useRef<ReturnType<PusherClient['subscribe']> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher || !matchId) return;

    const channelName = `private-match-${matchId}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Listen for new messages
    channel.bind(PUSHER_EVENTS.NEW_MESSAGE, (data: { message: Message }) => {
      // Only add message if it's from the other user (we already added our own)
      if (data.message.senderId !== currentUserId) {
        onNewMessage(data.message);
      }
    });

    // Listen for typing indicators
    if (onTypingStart) {
      channel.bind(PUSHER_EVENTS.TYPING_START, (data: { userId: string; userName: string }) => {
        if (data.userId !== currentUserId) {
          onTypingStart(data.userId, data.userName);
        }
      });
    }

    if (onTypingStop) {
      channel.bind(PUSHER_EVENTS.TYPING_STOP, (data: { userId: string }) => {
        if (data.userId !== currentUserId) {
          onTypingStop(data.userId);
        }
      });
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [matchId, currentUserId, onNewMessage, onTypingStart, onTypingStop]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (isTypingRef.current === isTyping) return;
    isTypingRef.current = isTyping;

    try {
      await fetch('/api/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, isTyping }),
      });
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }, [matchId]);

  // Handle input change for typing indicator
  const handleTyping = useCallback(() => {
    sendTypingIndicator(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 2000);
  }, [sendTypingIndicator]);

  // Stop typing when component unmounts or message is sent
  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTypingIndicator(false);
  }, [sendTypingIndicator]);

  return { handleTyping, stopTyping };
}

// Hook for user-level notifications (new matches, messages when not in chat)
interface UseUserPusherOptions {
  userId: string;
  onNewMatch?: (data: { matchId: string; userName: string; userPhoto: string }) => void;
  onNewMessage?: (data: { matchId: string; message: Message }) => void;
}

export function useUserPusher({ userId, onNewMatch, onNewMessage }: UseUserPusherOptions) {
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher || !userId) return;

    const channelName = `private-user-${userId}`;
    const channel = pusher.subscribe(channelName);

    if (onNewMatch) {
      channel.bind(PUSHER_EVENTS.NEW_MATCH, onNewMatch);
    }

    if (onNewMessage) {
      channel.bind(PUSHER_EVENTS.NEW_MESSAGE, onNewMessage);
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [userId, onNewMatch, onNewMessage]);
}
