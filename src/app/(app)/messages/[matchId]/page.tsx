'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, MoreVertical, Flag, Ban, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useChatPusher } from '@/hooks/usePusher';

interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  readAt?: string;
}

interface MatchInfo {
  id: string;
  otherUser: {
    id: string;
    name: string;
    photo?: string;
  };
}

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle new message from Pusher
  const handleNewMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      // Avoid duplicates
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  // Handle typing indicators
  const handleTypingStart = useCallback((userId: string, userName: string) => {
    setIsOtherTyping(true);
    setTypingUserName(userName);
    
    // Auto-hide after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsOtherTyping(false);
    }, 3000);
  }, []);

  const handleTypingStop = useCallback(() => {
    setIsOtherTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  // Use Pusher for real-time messaging
  const { handleTyping, stopTyping } = useChatPusher({
    matchId,
    currentUserId,
    onNewMessage: handleNewMessage,
    onTypingStart: handleTypingStart,
    onTypingStop: handleTypingStop,
  });

  const [isOtherOnline, setIsOtherOnline] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchCurrentUser();
    // Removed polling - now using Pusher for real-time updates
  }, [matchId]);

  // Check online status periodically
  useEffect(() => {
    const checkOnlineStatus = async () => {
      if (!matchInfo?.otherUser.id) return;
      try {
        const res = await fetch(`/api/online?userId=${matchInfo.otherUser.id}`);
        const data = await res.json();
        setIsOtherOnline(data.isOnline);
      } catch (error) {
        console.error('Failed to check online status:', error);
      }
    };

    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [matchInfo?.otherUser.id]);

  // Update own online status
  useEffect(() => {
    const updateOnlineStatus = async () => {
      try {
        await fetch('/api/online', { method: 'POST' });
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    };

    updateOnlineStatus();
    const interval = setInterval(updateOnlineStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/${matchId}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.status === 404) {
        router.push('/matches');
        return;
      }
      const data = await res.json();
      setMessages(data.messages || []);
      
      // Also fetch match info
      const matchRes = await fetch('/api/matches');
      const matchData = await matchRes.json();
      const match = matchData.matches?.find((m: MatchInfo) => m.id === matchId);
      if (match) {
        setMatchInfo(match);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    // Stop typing indicator when sending
    stopTyping();
    
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${matchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTyping();
    }
  };

  const handleBlock = async () => {
    if (!matchInfo) return;
    
    if (!confirm(`Are you sure you want to block ${matchInfo.otherUser.name}? This will unmatch you.`)) {
      return;
    }

    try {
      await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: matchInfo.otherUser.id }),
      });
      router.push('/matches');
    } catch (error) {
      console.error('Failed to block:', error);
    }
  };

  const handleReport = async () => {
    if (!matchInfo || !reportReason) return;

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedId: matchInfo.otherUser.id,
          reason: reportReason,
          notes: reportNotes,
        }),
      });
      setShowReportModal(false);
      alert('Report submitted. Thank you for helping keep LinkUp safe.');
    } catch (error) {
      console.error('Failed to report:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-coral-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => router.push('/matches')} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {matchInfo?.otherUser.photo ? (
                <img
                  src={matchInfo.otherUser.photo}
                  alt={matchInfo.otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-coral-100 flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
              )}
            </div>
            {/* Online indicator */}
            {isOtherOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">{matchInfo?.otherUser.name}</h1>
            {isOtherOnline && (
              <p className="text-xs text-green-500">Online</p>
            )}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-48 z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowReportModal(true);
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-gray-700"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleBlock();
                }}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-red-600"
              >
                <Ban className="w-4 h-4" />
                Block
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-coral-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isOtherTyping && (
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{typingUserName || matchInfo?.otherUser.name} is typing...</span>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 safe-area-bottom">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-coral-600 transition-colors"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Report {matchInfo?.otherUser.name}</h2>
            
            <div className="space-y-3 mb-4">
              {[
                'Inappropriate content',
                'Harassment or bullying',
                'Fake profile',
                'Spam',
                'Underage user',
                'Other',
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={`w-full p-3 rounded-xl text-left border-2 transition-colors ${
                    reportReason === reason
                      ? 'border-coral-500 bg-coral-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={reportNotes}
              onChange={(e) => setReportNotes(e.target.value)}
              placeholder="Additional details (optional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none resize-none mb-4"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50"
              >
                Submit report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
