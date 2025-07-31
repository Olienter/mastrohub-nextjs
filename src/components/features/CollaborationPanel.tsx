'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeStore } from '@/lib/realtime';

export default function CollaborationPanel() {
  const { users, isConnected, connect, disconnect } = useRealtimeStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-4 w-80 bg-neutral-800/90 backdrop-blur border border-white/20 rounded-xl p-4 z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Team Collaboration</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-white/60 text-sm">{isConnected ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg"
            >
              <div className="relative">
                <span className="text-2xl">{user.avatar}</span>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-neutral-800 ${
                  user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/60 text-sm">{user.currentPage}</p>
              </div>
              {user.isOnline && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Active users</span>
          <span className="text-white font-semibold">{users.filter(u => u.isOnline).length}</span>
        </div>
      </div>
    </motion.div>
  );
} 