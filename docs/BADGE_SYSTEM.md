# Badge System Documentation

## Overview

The Badge System is a comprehensive gamification feature that rewards users for their engagement and contributions to the platform. It includes achievement tracking, progress monitoring, level progression, and real-time notifications.

## Features

### Core Components

1. **Badge Engine** (`src/lib/badges.ts`)
   - Manages badge definitions and requirements
   - Handles badge checking and awarding
   - Tracks user progress and levels
   - Provides utility functions for badge operations

2. **Badge Display** (`src/components/badges/BadgeDisplay.tsx`)
   - Visual representation of badges
   - Progress tracking with animated progress bars
   - Filtering by category and unlock status
   - Interactive badge details modal

3. **Progress Tracker** (`src/components/badges/ProgressTracker.tsx`)
   - User level and experience tracking
   - Activity statistics visualization
   - Achievement preview
   - Level progression indicators

4. **Badge Notifications** (`src/components/badges/BadgeNotification.tsx`)
   - Real-time badge unlock notifications
   - Animated celebration effects
   - Auto-dismiss functionality
   - Global notification management

## Badge Types

### Content Badges
- **First Steps**: Published your first article
- **Regular Writer**: Published 5 articles
- **Prolific Author**: Published 10 articles

### Engagement Badges
- **Engaged Reader**: Left 10 comments
- **Reactive**: Given 50 reactions
- **Bookworm**: Bookmarked 20 articles

### Community Badges
- **Community Contributor**: Made significant contributions
- **Early Adopter**: Joined during early days

### Special Badges
- **Moderator**: Helping keep the community safe
- **Administrator**: Platform administrator

## Rarity Levels

- **Common** (Gray): Basic achievements
- **Rare** (Blue): Moderate difficulty
- **Epic** (Purple): Challenging achievements
- **Legendary** (Yellow): Exceptional accomplishments

## Database Schema

### Tables

1. **user_badges**
   ```sql
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key to profiles)
   - badge_id (TEXT)
   - unlocked_at (TIMESTAMP)
   - progress (INTEGER)
   - max_progress (INTEGER)
   ```

2. **user_progress**
   ```sql
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key to profiles)
   - articles_count (INTEGER)
   - comments_count (INTEGER)
   - reactions_given (INTEGER)
   - reactions_received (INTEGER)
   - bookmarks_count (INTEGER)
   - days_active (INTEGER)
   - total_points (INTEGER)
   - level (INTEGER)
   - profile_complete (BOOLEAN)
   ```

3. **notifications**
   ```sql
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key to profiles)
   - type (TEXT)
   - title (TEXT)
   - message (TEXT)
   - data (JSONB)
   - is_read (BOOLEAN)
   ```

## API Endpoints

### GET /api/badges
- `userId`: User ID to fetch data for
- `type`: Type of data to fetch (`user_badges`, `user_progress`, `check_badges`)

### POST /api/badges
- `userId`: User ID
- `action`: Action to perform (`update_progress`, `check_badges`)
- `data`: Additional data for the action

## Usage Examples

### Basic Badge Display
```tsx
import BadgeDisplay from '@/components/badges/BadgeDisplay';

<BadgeDisplay 
  showProgress={true}
  showUnlockedOnly={false}
/>
```

### Progress Tracking
```tsx
import ProgressTracker from '@/components/badges/ProgressTracker';

<ProgressTracker userId={user.id} />
```

### Badge Engine Operations
```tsx
import { BadgeEngine } from '@/lib/badges';

// Check for new badges
const newBadges = await BadgeEngine.checkBadges(userId);

// Get user progress
const progress = await BadgeEngine.getUserProgress(userId);

// Calculate level
const level = BadgeEngine.calculateLevel(progress.total_points);
```

### Custom Hook Usage
```tsx
import { useBadges } from '@/hooks/useBadges';

const { badges, userBadges, userProgress, checkBadges } = useBadges(userId);
```

## Points System

### Earning Points
- **Article Creation**: +10 points
- **Comment Creation**: +5 points
- **Reaction Given**: +2 points
- **Bookmark Creation**: +3 points
- **Badge Unlock**: Variable points based on rarity

### Level Calculation
- Level = Math.floor(totalPoints / 100) + 1
- Each level requires 100 points
- Progress percentage calculated from current level to next

## Automatic Progress Tracking

The system automatically tracks user progress through database triggers:

1. **Article Triggers**: Updates `articles_count` and `total_points`
2. **Comment Triggers**: Updates `comments_count` and `total_points`
3. **Reaction Triggers**: Updates `reactions_given` and `total_points`
4. **Bookmark Triggers**: Updates `bookmarks_count` and `total_points`

## Notification System

### Real-time Notifications
- Automatic badge unlock detection
- Animated notification display
- Auto-dismiss after 5 seconds
- Manual dismiss option

### Notification Types
- **Badge Unlocked**: When user earns a new badge
- **Level Up**: When user reaches a new level
- **Achievement Progress**: When approaching badge requirements

## Security

### Row Level Security (RLS)
- Users can only access their own badges and progress
- Admins have full access to all user data
- System can create notifications for users

### Data Validation
- Badge requirements validation
- Progress data integrity checks
- User authentication verification

## Performance Considerations

### Indexing
- Indexes on `user_id`, `badge_id`, `unlocked_at`
- Indexes on progress tracking columns
- Composite indexes for common queries

### Caching
- Badge definitions cached in memory
- User progress cached with periodic refresh
- Notification state managed locally

## Customization

### Adding New Badges
1. Define badge in `BADGES` array in `src/lib/badges.ts`
2. Add requirements and point values
3. Update database schema if needed
4. Test badge unlocking logic

### Modifying Requirements
1. Update badge requirements in `BADGES` array
2. Modify progress tracking triggers if needed
3. Update UI components to reflect changes

### Custom Badge Categories
1. Add new category to `BadgeCategory` type
2. Update badge definitions
3. Modify UI filtering logic

## Testing

### Unit Tests
- Badge engine functions
- Progress calculation
- Level computation
- Requirement checking

### Integration Tests
- API endpoint functionality
- Database trigger operations
- Notification system
- UI component interactions

### Manual Testing
- Badge unlocking scenarios
- Progress tracking accuracy
- Notification display
- UI responsiveness

## Troubleshooting

### Common Issues

1. **Badges not unlocking**
   - Check user progress data
   - Verify badge requirements
   - Ensure triggers are working

2. **Progress not updating**
   - Check database triggers
   - Verify user authentication
   - Check API endpoint responses

3. **Notifications not showing**
   - Check notification provider setup
   - Verify badge checking logic
   - Check UI component rendering

### Debug Tools
- Badge demo page: `/badge-demo`
- Progress tracking logs
- Database query monitoring
- API response inspection

## Future Enhancements

### Planned Features
- Badge sharing on social media
- Badge leaderboards
- Custom badge creation
- Badge trading system
- Seasonal badge events

### Technical Improvements
- Real-time WebSocket notifications
- Advanced caching strategies
- Performance optimizations
- Mobile-specific UI improvements 