"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface AvatarUploadProps {
  currentAvatar?: string;
  onUpload: (file: File) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AvatarUpload({ 
  currentAvatar, 
  onUpload, 
  size = 'md',
  className = '' 
}: AvatarUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      await onUpload(file);
      
      // Clear preview after successful upload
      setTimeout(() => {
        setPreview(null);
      }, 2000);

    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Display */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
        {/* Current Avatar or Preview */}
        {(currentAvatar || preview) ? (
          <Image
            src={preview || currentAvatar || ''}
            alt="Avatar"
            fill
            className="object-cover"
            sizes={`(max-width: 768px) 100vw, ${size === 'lg' ? '128px' : size === 'md' ? '96px' : '64px'}`}
          />
        ) : (
          <Camera className="text-white" size={size === 'lg' ? 32 : size === 'md' ? 24 : 16} />
        )}

        {/* Upload Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload className="text-white" size={20} />
        </motion.div>

        {/* Uploading Indicator */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <div className="flex items-center space-x-2 text-white">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Indicator */}
        <AnimatePresence>
          {preview && !isUploading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="text-white" size={12} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drag & Drop Zone */}
      <motion.div
        className={`absolute inset-0 rounded-full border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-transparent'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
          >
            <AlertCircle size={12} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Button */}
      {preview && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={12} />
        </motion.button>
      )}
    </div>
  );
} 