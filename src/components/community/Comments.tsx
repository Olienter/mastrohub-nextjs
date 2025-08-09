"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  MoreHorizontal,
  User,
  CheckCircle
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  authorTitle?: string;
  isExpert: boolean;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isLiked: boolean;
}

interface CommentsProps {
  articleId: string;
  comments: Comment[];
}

export default function Comments({ articleId, comments: initialComments }: CommentsProps) {
  const [localComments, setLocalComments] = React.useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = React.useState('');
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyToCommentId, setReplyToCommentId] = React.useState<string | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
      isExpert: false
    };

    setLocalComments([comment, ...localComments]);
    setNewComment('');
  };

  const handleLikeComment = (commentId: string) => {
    setLocalComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      )
    );
  };

  const handleReplyToComment = (commentId: string) => {
    setReplyToCommentId(commentId);
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setReplyToCommentId(null);
    setIsReplying(false);
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !replyToCommentId) return;

    const reply: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
      isExpert: false
    };

    setLocalComments(prev => 
      prev.map(comment => 
        comment.id === replyToCommentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );
    setNewComment('');
    setReplyToCommentId(null);
    setIsReplying(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Comments ({localComments.length})
      </h3>

      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-6 h-6 text-gray-500" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post
          </button>
        </div>
      </form>

      <AnimatePresence>
        {localComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: localComments.indexOf(comment) * 0.05 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <img src={comment.authorAvatar} alt={comment.author} className="w-10 h-10 rounded-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{comment.author}</span>
                  <span className="text-xs text-gray-500">{comment.authorTitle}</span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-gray-800 text-sm">{comment.content}</p>
                <div className="flex items-center gap-2 mt-2 text-gray-600 text-xs">
                  <button onClick={() => handleLikeComment(comment.id)}>
                    <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                    {comment.likes}
                  </button>
                  <button onClick={() => handleReplyToComment(comment.id)}>
                    <Reply className="w-4 h-4" /> Reply
                  </button>
                  <MoreHorizontal className="w-4 h-4" />
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4">
                    <Comments
                      articleId={articleId}
                      comments={comment.replies}
                    />
                  </div>
                )}
              </div>
            </div>

            {isReplying && replyToCommentId === comment.id && (
              <form onSubmit={handleSubmitReply} className="ml-14 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-6 h-6 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Reply to this comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelReply}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 