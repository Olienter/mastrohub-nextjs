import { supabase } from './supabase';

// Badge types and categories
export type BadgeType = 
  | 'first_article' 
  | 'article_milestone' 
  | 'comment_milestone' 
  | 'reaction_milestone' 
  | 'bookmark_milestone' 
  | 'profile_complete' 
  | 'early_adopter' 
  | 'community_contributor' 
  | 'moderator' 
  | 'admin';

export type BadgeCategory = 'content' | 'engagement' | 'community' | 'achievement' | 'special';

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: BadgeRequirement[];
  points: number;
  unlocked_at?: Date;
}

export interface BadgeRequirement {
  type: 'articles' | 'comments' | 'reactions' | 'bookmarks' | 'days_active' | 'profile_complete';
  count: number;
  condition?: 'exact' | 'at_least' | 'consecutive';
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: Date;
  progress?: number;
  max_progress?: number;
}

export interface UserProgress {
  user_id: string;
  articles_count: number;
  comments_count: number;
  reactions_given: number;
  reactions_received: number;
  bookmarks_count: number;
  days_active: number;
  total_points: number;
  level: number;
  last_activity: Date;
  profile_complete: boolean;
}

// Badge definitions
export const BADGES: Badge[] = [
  {
    id: 'first_article',
    type: 'first_article',
    name: 'First Steps',
    description: 'Published your first article',
    category: 'content',
    icon: '📝',
    color: '#10B981',
    rarity: 'common',
    requirements: [{ type: 'articles', count: 1, condition: 'exact' }],
    points: 10
  },
  {
    id: 'article_milestone_5',
    type: 'article_milestone',
    name: 'Regular Writer',
    description: 'Published 5 articles',
    category: 'content',
    icon: '✍️',
    color: '#3B82F6',
    rarity: 'common',
    requirements: [{ type: 'articles', count: 5, condition: 'at_least' }],
    points: 25
  },
  {
    id: 'article_milestone_10',
    type: 'article_milestone',
    name: 'Prolific Author',
    description: 'Published 10 articles',
    category: 'content',
    icon: '📚',
    color: '#8B5CF6',
    rarity: 'rare',
    requirements: [{ type: 'articles', count: 10, condition: 'at_least' }],
    points: 50
  },
  {
    id: 'comment_milestone_10',
    type: 'comment_milestone',
    name: 'Engaged Reader',
    description: 'Left 10 comments',
    category: 'engagement',
    icon: '💬',
    color: '#F59E0B',
    rarity: 'common',
    requirements: [{ type: 'comments', count: 10, condition: 'at_least' }],
    points: 15
  },
  {
    id: 'reaction_milestone_50',
    type: 'reaction_milestone',
    name: 'Reactive',
    description: 'Given 50 reactions',
    category: 'engagement',
    icon: '❤️',
    color: '#EF4444',
    rarity: 'common',
    requirements: [{ type: 'reactions', count: 50, condition: 'at_least' }],
    points: 20
  },
  {
    id: 'bookmark_milestone_20',
    type: 'bookmark_milestone',
    name: 'Bookworm',
    description: 'Bookmarked 20 articles',
    category: 'engagement',
    icon: '🔖',
    color: '#06B6D4',
    rarity: 'common',
    requirements: [{ type: 'bookmarks', count: 20, condition: 'at_least' }],
    points: 15
  },
  {
    id: 'profile_complete',
    type: 'profile_complete',
    name: 'Complete Profile',
    description: 'Filled out your complete profile',
    category: 'achievement',
    icon: '👤',
    color: '#8B5CF6',
    rarity: 'rare',
    requirements: [{ type: 'profile_complete', count: 1, condition: 'exact' }],
    points: 30
  },
  {
    id: 'early_adopter',
    type: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined during the early days',
    category: 'special',
    icon: '🚀',
    color: '#F59E0B',
    rarity: 'epic',
    requirements: [{ type: 'days_active', count: 30, condition: 'at_least' }],
    points: 100
  },
  {
    id: 'community_contributor',
    type: 'community_contributor',
    name: 'Community Contributor',
    description: 'Made significant contributions to the community',
    category: 'community',
    icon: '🌟',
    color: '#10B981',
    rarity: 'epic',
    requirements: [
      { type: 'articles', count: 5, condition: 'at_least' },
      { type: 'comments', count: 20, condition: 'at_least' },
      { type: 'reactions', count: 100, condition: 'at_least' }
    ],
    points: 150
  },
  {
    id: 'moderator',
    type: 'moderator',
    name: 'Moderator',
    description: 'Helping keep the community safe',
    category: 'special',
    icon: '🛡️',
    color: '#8B5CF6',
    rarity: 'legendary',
    requirements: [],
    points: 500
  },
  {
    id: 'admin',
    type: 'admin',
    name: 'Administrator',
    description: 'Platform administrator',
    category: 'special',
    icon: '👑',
    color: '#EF4444',
    rarity: 'legendary',
    requirements: [],
    points: 1000
  }
];

// Badge engine functions
export class BadgeEngine {
  // Get all available badges
  static async getBadges(): Promise<Badge[]> {
    return BADGES;
  }

  // Get user's unlocked badges
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching user badges:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error in getUserBadges:', error);
      return [];
    }
  }

  // Get user progress
  static async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no record exists, create one
        if (error.code === 'PGRST116') {
          const defaultProgress = {
            user_id: userId,
            articles_count: 0,
            comments_count: 0,
            reactions_given: 0,
            reactions_received: 0,
            bookmarks_count: 0,
            days_active: 0,
            total_points: 0,
            level: 1,
            last_activity: new Date().toISOString(),
            profile_complete: false
          };

          const { data: newData, error: insertError } = await supabase
            .from('user_progress')
            .upsert(defaultProgress, { onConflict: 'user_id' })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user progress:', insertError);
            // Log additional details for debugging
            console.error('Insert error details:', {
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
              code: insertError.code
            });
            return null;
          }

          return newData;
        }

        console.error('Error fetching user progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error in getUserProgress:', error);
      return null;
    }
  }

  // Update user progress
  static async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating user progress:', error);
      }
    } catch (error) {
      console.error('Unexpected error in updateUserProgress:', error);
    }
  }

  // Check and award badges
  static async checkBadges(userId: string): Promise<Badge[]> {
    const userProgress = await this.getUserProgress(userId);
    const userBadges = await this.getUserBadges(userId);
    const unlockedBadgeIds = new Set(userBadges.map(ub => ub.badge_id));
    
    const newlyUnlocked: Badge[] = [];

    for (const badge of BADGES) {
      if (unlockedBadgeIds.has(badge.id)) continue;

      if (await this.checkBadgeRequirements(badge, userProgress)) {
        await this.awardBadge(userId, badge);
        newlyUnlocked.push(badge);
      }
    }

    return newlyUnlocked;
  }

  // Check if user meets badge requirements
  private static async checkBadgeRequirements(badge: Badge, userProgress: UserProgress | null): Promise<boolean> {
    if (!userProgress) return false;

    for (const requirement of badge.requirements) {
      const currentValue = this.getRequirementValue(requirement.type, userProgress);
      
      switch (requirement.condition) {
        case 'exact':
          if (currentValue !== requirement.count) return false;
          break;
        case 'at_least':
          if (currentValue < requirement.count) return false;
          break;
        case 'consecutive':
          // For consecutive requirements, we'd need to track daily activity
          if (currentValue < requirement.count) return false;
          break;
        default:
          if (currentValue < requirement.count) return false;
      }
    }

    return true;
  }

  // Get value for a specific requirement type
  private static getRequirementValue(type: string, userProgress: UserProgress): number {
    switch (type) {
      case 'articles':
        return userProgress.articles_count;
      case 'comments':
        return userProgress.comments_count;
      case 'reactions':
        return userProgress.reactions_given;
      case 'bookmarks':
        return userProgress.bookmarks_count;
      case 'days_active':
        return userProgress.days_active;
      case 'profile_complete':
        // This would need to be checked against actual profile data
        return userProgress.profile_complete ? 1 : 0;
      default:
        return 0;
    }
  }

  // Award a badge to a user
  private static async awardBadge(userId: string, badge: Badge): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badge.id,
          unlocked_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error awarding badge:', error);
        return;
      }

      // Update user points
      const userProgress = await this.getUserProgress(userId);
      if (userProgress) {
        await this.updateUserProgress(userId, {
          total_points: userProgress.total_points + badge.points
        });
      }

      // Trigger notification or other side effects
      await this.onBadgeUnlocked(userId, badge);
    } catch (error) {
      console.error('Unexpected error in awardBadge:', error);
    }
  }

  // Handle badge unlock events
  private static async onBadgeUnlocked(userId: string, badge: Badge): Promise<void> {
    try {
      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'badge',
          title: 'New Badge Unlocked!',
          message: `Congratulations! You've earned the "${badge.name}" badge.`,
          created_at: new Date().toISOString()
        });

      // Could also trigger other events like:
      // - Send email notification
      // - Update user level
      // - Trigger achievements
    } catch (error) {
      console.error('Unexpected error in onBadgeUnlocked:', error);
    }
  }

  // Get user level based on total points
  static calculateLevel(totalPoints: number): number {
    return Math.floor(totalPoints / 100) + 1;
  }

  // Get progress to next level
  static getLevelProgress(totalPoints: number): { current: number; next: number; progress: number } {
    const currentLevel = this.calculateLevel(totalPoints);
    const pointsForCurrentLevel = (currentLevel - 1) * 100;
    const pointsForNextLevel = currentLevel * 100;
    const progress = ((totalPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;

    return {
      current: currentLevel,
      next: currentLevel + 1,
      progress: Math.min(progress, 100)
    };
  }

  // Get badge by ID
  static getBadgeById(badgeId: string): Badge | undefined {
    return BADGES.find(badge => badge.id === badgeId);
  }

  // Get badges by category
  static getBadgesByCategory(category: BadgeCategory): Badge[] {
    return BADGES.filter(badge => badge.category === category);
  }

  // Get badges by rarity
  static getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
    return BADGES.filter(badge => badge.rarity === rarity);
  }
}

// Hook for using badge engine in components
export const useBadgeEngine = () => {
  return {
    getBadges: BadgeEngine.getBadges,
    getUserBadges: BadgeEngine.getUserBadges,
    getUserProgress: BadgeEngine.getUserProgress,
    checkBadges: BadgeEngine.checkBadges,
    calculateLevel: BadgeEngine.calculateLevel,
    getLevelProgress: BadgeEngine.getLevelProgress,
    getBadgeById: BadgeEngine.getBadgeById,
    getBadgesByCategory: BadgeEngine.getBadgesByCategory,
    getBadgesByRarity: BadgeEngine.getBadgesByRarity
  };
}; 