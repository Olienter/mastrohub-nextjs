"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Share2, MessageCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface ArticleReactionsProps {
  articleId: string;
  initialStats?: {
    likes: number;
    loves: number;
    bookmarks: number;
    comments: number;
    views: number;
  };
  className?: string;
}

export default function ArticleReactions({ 
  articleId, 
  initialStats = { likes: 0, loves: 0, bookmarks: 0, comments: 0, views: 0 },
  className = '' 
}: ArticleReactionsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [userReactions, setUserReactions] = useState<{
    like: boolean;
    love: boolean;
    bookmark: boolean;
  }>({ like: false, love: false, bookmark: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserReactions();
    loadStats();
  }, [articleId, user]);

  const loadUserReactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('user_id', user.id)
        .eq('target_type', 'article')
        .eq('target_id', articleId);

      if (error) throw error;

      const reactions = {
        like: false,
        love: false,
        bookmark: false
      };

      data.forEach((reaction) => {
        if (reaction.reaction_type in reactions) {
          reactions[reaction.reaction_type as keyof typeof reactions] = true;
        }
      });

      setUserReactions(reactions);
    } catch (error) {
      console.error('Error loading user reactions:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Load reaction counts
      const { data: reactions, error: reactionsError } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('target_type', 'article')
        .eq('target_id', articleId);

      if (reactionsError) throw reactionsError;

      // Load bookmark count
      const { count: bookmarkCount, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      if (bookmarkError) throw bookmarkError;

      // Load comment count
      const { count: commentCount, error: commentError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId)
        .eq('is_deleted', false);

      if (commentError) throw commentError;

      const newStats = {
        likes: reactions.filter(r => r.reaction_type === 'like').length,
        loves: reactions.filter(r => r.reaction_type === 'love').length,
        bookmarks: bookmarkCount || 0,
        comments: commentCount || 0,
        views: stats.views // Keep existing view count
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleReaction = async (reactionType: 'like' | 'love' | 'bookmark') => {
    if (!user) return;

    setIsLoading(true);
    try {
      const isCurrentlyReacted = userReactions[reactionType];

      if (isCurrentlyReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('target_type', 'article')
          .eq('target_id', articleId)
          .eq('reaction_type', reactionType);

        if (error) throw error;

        setUserReactions(prev => ({ ...prev, [reactionType]: false }));
        setStats(prev => ({ ...prev, [reactionType + 's']: Math.max(0, prev[reactionType + 's' as keyof typeof prev] - 1) }));
      } else {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .upsert({
            user_id: user.id,
            target_type: 'article',
            target_id: articleId,
            reaction_type: reactionType
          });

        if (error) throw error;

        setUserReactions(prev => ({ ...prev, [reactionType]: true }));
        setStats(prev => ({ ...prev, [reactionType + 's']: prev[reactionType + 's' as keyof typeof prev] + 1 }));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this article on MastroHub',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const ReactionButton = ({ 
    type, 
    icon: Icon, 
    label, 
    color 
  }: { 
    type: 'like' | 'love' | 'bookmark'; 
    icon: any; 
    label: string; 
    color: string; 
  }) => (
    <motion.button
      onClick={() => handleReaction(type)}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        userReactions[type]
          ? color
          : 'text-slate-400 hover:text-slate-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={18} className={userReactions[type] ? 'fill-current' : ''} />
      <span className="text-sm font-medium">{stats[type + 's' as keyof typeof stats]}</span>
    </motion.button>
  );

  return (
    <div className={`flex items-center justify-between p-4 bg-slate-800/80 rounded-lg border border-slate-700/50 ${className}`}>
      <div className="flex items-center space-x-4">
        <ReactionButton
          type="like"
          icon={Heart}
          label="Like"
          color="text-blue-400"
        />
        
        <ReactionButton
          type="love"
          icon={Heart}
          label="Love"
          color="text-red-400"
        />

        <ReactionButton
          type="bookmark"
          icon={Bookmark}
          label="Bookmark"
          color="text-yellow-400"
        />

        <div className="flex items-center space-x-2 px-4 py-2 text-slate-400">
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{stats.comments}</span>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 text-slate-400">
          <Eye size={18} />
          <span className="text-sm font-medium">{stats.views}</span>
        </div>
      </div>

      <motion.button
        onClick={handleShare}
        className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-slate-300 rounded-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Share</span>
      </motion.button>
    </div>
  );
} 