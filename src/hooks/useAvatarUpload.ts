import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const useAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const uploadAvatar = useCallback(async (file: File): Promise<UploadResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Upload failed' };
      }

      const data = await response.json();
      
      // Update auth store with new avatar
      // This would typically be handled by the auth context
      
      return { success: true, url: data.url };

    } catch (error) {
      console.error('Avatar upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [user]);

  const deleteAvatar = useCallback(async (path: string): Promise<UploadResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const response = await fetch(`/api/upload/avatar?path=${encodeURIComponent(path)}&userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Delete failed' };
      }

      return { success: true };

    } catch (error) {
      console.error('Avatar delete error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      };
    }
  }, [user]);

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading,
    progress
  };
}; 