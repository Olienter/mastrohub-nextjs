"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Reply, Edit3, Trash2, MoreVertical, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: string;
  content: string;
  author_id: string;
  author: {
    full_name: string;
    username: string;
    avatar_url?: string;
  };
  parent_id?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  reactions: {
    like: number;
    love: number;
  };
  user_reaction?: 'like' | 'love' | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  articleId: string;
  className?: string;
}

export default function CommentSection({ articleId, className = '' }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(full_name, username, avatar_url),
          reactions:reactions(reaction_type)
        `)
        .eq('article_id', articleId)
        .is('parent_id', null)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load replies for each comment
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              author:profiles(full_name, username, avatar_url),
              reactions:reactions(reaction_type)
            `)
            .eq('parent_id', comment.id)
            .eq('is_deleted', false)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          author_id: user.id,
          content: newComment.trim(),
          parent_id: replyingTo
        });

      if (error) throw error;

      setNewComment('');
      setReplyingTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({
          content: editContent.trim(),
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('author_id', user?.id);

      if (error) throw error;

      setEditingComment(null);
      setEditContent('');
      await loadComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('author_id', user?.id);

      if (error) throw error;

      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReaction = async (commentId: string, reactionType: 'like' | 'love') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reactions')
        .upsert({
          user_id: user.id,
          target_type: 'comment',
          target_id: commentId,
          reaction_type: reactionType
        });

      if (error) throw error;

      await loadComments();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-8 border-l-2 border-slate-600 pl-4' : ''}`}
    >
      <div className="flex space-x-3 mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {comment.author.avatar_url ? (
              <img
                src={comment.author.avatar_url}
                alt={comment.author.full_name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              comment.author.full_name.charAt(0)
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-white">
              {comment.author.full_name}
            </span>
            <span className="text-xs text-slate-400">
              @{comment.author.username}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(comment.created_at)}
            </span>
            {comment.is_edited && (
              <span className="text-xs text-slate-400">(edited)</span>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white resize-none"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1 bg-slate-600 text-white text-sm rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300 mb-2">
              {comment.content}
            </p>
          )}

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleReaction(comment.id, 'like')}
              className={`flex items-center space-x-1 text-xs ${
                comment.user_reaction === 'like'
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              <Heart size={14} />
              <span>{comment.reactions.like || 0}</span>
            </button>

            <button
              onClick={() => handleReaction(comment.id, 'love')}
              className={`flex items-center space-x-1 text-xs ${
                comment.user_reaction === 'love'
                  ? 'text-red-400'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart size={14} className="fill-current" />
              <span>{comment.reactions.love || 0}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-300"
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}

            {user?.id === comment.author_id && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditContent(comment.content);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-300"
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex space-x-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white resize-none"
                  rows={2}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={isLoading || !newComment.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-2">
        <MessageCircle className="text-slate-400" size={20} />
        <h3 className="text-lg font-semibold text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* New comment form */}
      {user && (
        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.full_name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  (user.user_metadata?.full_name || user.email).charAt(0)
                )}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={isLoading || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Post Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 