import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const testArticle = {
  id: crypto.randomUUID(),
  title: 'Kitchen Efficiency: 10 Time-Saving Techniques That Boost Productivity by 60%',
  excerpt: 'Learn proven kitchen management strategies that professional chefs use to streamline operations and maximize efficiency in busy restaurant environments.',
  content: `
# Kitchen Efficiency: 10 Time-Saving Techniques That Boost Productivity by 60%

In the fast-paced world of professional kitchens, efficiency isn't just about speed—it's about creating a systematic approach that maximizes productivity while maintaining quality. Here are the proven techniques that top restaurants use to transform their kitchen operations.

## The Mise en Place Revolution

### 1. Strategic Prep Organization
The French term "mise en place" (everything in its place) is the foundation of kitchen efficiency. Professional kitchens prep 80% of their ingredients before service, reducing cooking time by up to 40%.

**Implementation:**
- Prep all vegetables, proteins, and sauces 2-3 hours before service
- Use color-coded containers for different ingredient categories
- Implement a "first in, first out" rotation system

### 2. Workstation Optimization
Design your kitchen layout based on workflow, not aesthetics. The most efficient kitchens follow the "triangle rule" where the stove, sink, and refrigerator form an efficient triangle.

## Advanced Time Management

### 3. Batch Cooking Techniques
Cook multiple items simultaneously using different heat zones and timing strategies.

**Examples:**
- Roast vegetables while proteins rest
- Use multiple oven racks efficiently
- Implement staggered cooking schedules

### 4. Smart Equipment Utilization
Modern kitchen equipment can handle multiple tasks simultaneously.

**Efficiency Boosters:**
- Use convection ovens for faster, more even cooking
- Implement sous vide for precise temperature control
- Utilize pressure cookers for quick braising

## Team Coordination Strategies

### 5. Communication Systems
Clear communication prevents mistakes and speeds up service.

**Best Practices:**
- Use standardized call-back procedures
- Implement visual order tracking systems
- Regular team briefings before each service

### 6. Cross-Training Staff
Versatile team members can fill multiple roles during peak times.

**Training Focus:**
- Basic prep skills for all team members
- Emergency station coverage procedures
- Quality control standards across stations

## Technology Integration

### 7. Digital Order Management
Modern POS systems can optimize kitchen workflow automatically.

**Features to Implement:**
- Real-time order tracking
- Automatic timing alerts
- Integrated inventory management

### 8. Smart Inventory Control
Prevent waste and ensure ingredient availability.

**Systems:**
- Automated reorder points
- Real-time usage tracking
- Predictive ordering based on sales data

## Quality Control Efficiency

### 9. Standardized Procedures
Consistency saves time and reduces errors.

**Documentation:**
- Recipe cards with exact measurements
- Step-by-step plating guides
- Quality checklists for each dish

### 10. Continuous Improvement
Regular analysis of kitchen performance identifies bottlenecks.

**Metrics to Track:**
- Order-to-plate time
- Prep time per dish
- Waste percentages
- Customer satisfaction scores

## Implementation Timeline

### Week 1-2: Assessment
- Map current kitchen workflow
- Identify major bottlenecks
- Document current prep procedures

### Week 3-4: Training
- Train staff on new procedures
- Implement mise en place system
- Establish communication protocols

### Week 5-6: Optimization
- Fine-tune timing and coordination
- Adjust equipment placement
- Refine quality control procedures

## Expected Results

- **40-60% reduction** in prep time
- **30% decrease** in food waste
- **25% improvement** in order accuracy
- **50% faster** service during peak hours

## Conclusion

Kitchen efficiency is a combination of systematic organization, smart technology, and team coordination. By implementing these proven techniques, restaurants can significantly improve their operational efficiency while maintaining or even enhancing food quality and customer satisfaction.
  `,
  image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
  category: 'Kitchen Management',
  read_time: 12,
  author: 'Oliebodnar',
  author_title: 'Kitchen Efficiency Expert',
  author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  published_at: new Date().toISOString(),
  slug: 'kitchen-efficiency-time-saving-techniques',
  featured: false,
  tags: ['kitchen efficiency', 'time management', 'restaurant operations', 'productivity'],
  view_count: 0,
  like_count: 0,
  fact_checked: true,
  last_updated: new Date().toISOString(),
  status: 'published'
};

export async function POST(request: NextRequest) {
  try {
    // Insert test article into Supabase
    const { data, error } = await supabase
      .from('articles')
      .insert(testArticle)
      .select()
      .single();

    if (error) {
      console.error('Error inserting test article:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test article added successfully',
      article: data
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add test article' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all articles from Supabase
    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      articles: articles || [],
      count: articles?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch articles' 
    }, { status: 500 });
  }
} 