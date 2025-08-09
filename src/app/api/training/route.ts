import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get workspace_id from query params
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    const type = searchParams.get('type'); // courses, progress, assignments
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 403 });
    }

    // Get data based on type
    let data;
    switch (type) {
      case 'courses':
        data = await getCourses(workspaceId);
        break;
      case 'progress':
        data = await getEmployeeProgress(workspaceId, session.user.id);
        break;
      case 'assignments':
        data = await getCourseAssignments(workspaceId);
        break;
      default:
        // Return all training data
        const [courses, progress, assignments] = await Promise.all([
          getCourses(workspaceId),
          getEmployeeProgress(workspaceId, session.user.id),
          getCourseAssignments(workspaceId)
        ]);
        data = { courses, progress, assignments };
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Training API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspace_id, action, data: requestData } = body;

    if (!workspace_id || !action) {
      return NextResponse.json({ 
        error: 'workspace_id and action are required' 
      }, { status: 400 });
    }

    // Verify user has access to this workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspace_id)
      .eq('user_id', session.user.id)
      .single();

    if (workspaceError || !workspace) {
      return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 403 });
    }

    // Handle different actions
    let result;
    switch (action) {
      case 'create_course':
        result = await createCourse(workspace_id, requestData);
        break;
      case 'assign_course':
        result = await assignCourse(workspace_id, requestData);
        break;
      case 'update_progress':
        result = await updateProgress(workspace_id, session.user.id, requestData);
        break;
      case 'complete_lesson':
        result = await completeLesson(workspace_id, session.user.id, requestData);
        break;
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Training API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
async function getCourses(workspaceId: string) {
  // Mock courses data
  return [
    {
      id: '1',
      title: 'Food Safety Fundamentals',
      description: 'Essential food safety practices for restaurant staff',
      category: 'safety',
      difficulty: 'beginner',
      duration: 45,
      lessons: 6,
      video_count: 4,
      quiz_count: 2,
      certificate_available: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-15',
      status: 'active',
      instructor: 'Chef Maria Rodriguez',
      thumbnail: '/images/courses/food-safety.jpg',
      tags: ['safety', 'compliance', 'hygiene']
    },
    {
      id: '2',
      title: 'Customer Service Excellence',
      description: 'Master the art of exceptional customer service',
      category: 'service',
      difficulty: 'intermediate',
      duration: 60,
      lessons: 8,
      video_count: 6,
      quiz_count: 3,
      certificate_available: true,
      created_at: '2024-01-05',
      updated_at: '2024-01-20',
      status: 'active',
      instructor: 'Sarah Johnson',
      thumbnail: '/images/courses/customer-service.jpg',
      tags: ['service', 'communication', 'satisfaction']
    },
    {
      id: '3',
      title: 'Menu Management & Pricing',
      description: 'Learn to create profitable menus and set optimal prices',
      category: 'management',
      difficulty: 'advanced',
      duration: 90,
      lessons: 10,
      video_count: 8,
      quiz_count: 4,
      certificate_available: true,
      created_at: '2024-01-10',
      updated_at: '2024-01-25',
      status: 'active',
      instructor: 'Chef Michael Chen',
      thumbnail: '/images/courses/menu-management.jpg',
      tags: ['management', 'pricing', 'profitability']
    },
    {
      id: '4',
      title: 'Kitchen Equipment Mastery',
      description: 'Safe and efficient use of commercial kitchen equipment',
      category: 'technical',
      difficulty: 'intermediate',
      duration: 75,
      lessons: 7,
      video_count: 5,
      quiz_count: 3,
      certificate_available: false,
      created_at: '2024-01-15',
      updated_at: '2024-01-30',
      status: 'active',
      instructor: 'Chef David Wilson',
      thumbnail: '/images/courses/kitchen-equipment.jpg',
      tags: ['equipment', 'safety', 'efficiency']
    }
  ];
}

async function getEmployeeProgress(workspaceId: string, userId: string) {
  // Mock employee progress data
  return {
    overall_progress: 0.68,
    completed_courses: 2,
    total_courses: 4,
    certificates_earned: 2,
    current_course: {
      id: '3',
      title: 'Menu Management & Pricing',
      progress: 0.45,
      current_lesson: 5,
      total_lessons: 10,
      estimated_completion: '2024-02-15'
    },
    recent_activities: [
      {
        type: 'lesson_completed',
        course_id: '2',
        course_title: 'Customer Service Excellence',
        lesson_title: 'Handling Difficult Customers',
        completed_at: '2024-01-28T10:30:00Z',
        score: 85
      },
      {
        type: 'quiz_passed',
        course_id: '1',
        course_title: 'Food Safety Fundamentals',
        quiz_title: 'Hygiene Practices Quiz',
        completed_at: '2024-01-25T14:15:00Z',
        score: 92
      },
      {
        type: 'certificate_earned',
        course_id: '1',
        course_title: 'Food Safety Fundamentals',
        earned_at: '2024-01-25T14:20:00Z'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Safety First',
        description: 'Completed food safety course with 90%+ score',
        earned_at: '2024-01-25T14:20:00Z',
        icon: '🛡️'
      },
      {
        id: '2',
        title: 'Service Star',
        description: 'Completed customer service course',
        earned_at: '2024-01-28T10:30:00Z',
        icon: '⭐'
      }
    ]
  };
}

async function getCourseAssignments(workspaceId: string) {
  // Mock course assignments data
  return [
    {
      id: '1',
      course_id: '1',
      course_title: 'Food Safety Fundamentals',
      assigned_to: 'all_staff',
      assigned_by: 'Chef Maria Rodriguez',
      assigned_at: '2024-01-01T09:00:00Z',
      due_date: '2024-02-01T23:59:59Z',
      status: 'assigned',
      priority: 'high',
      completion_rate: 0.85
    },
    {
      id: '2',
      course_id: '2',
      course_title: 'Customer Service Excellence',
      assigned_to: 'front_of_house',
      assigned_by: 'Manager Sarah Johnson',
      assigned_at: '2024-01-05T10:00:00Z',
      due_date: '2024-02-15T23:59:59Z',
      status: 'assigned',
      priority: 'medium',
      completion_rate: 0.60
    },
    {
      id: '3',
      course_id: '3',
      course_title: 'Menu Management & Pricing',
      assigned_to: 'management',
      assigned_by: 'Owner Michael Chen',
      assigned_at: '2024-01-10T11:00:00Z',
      due_date: '2024-03-01T23:59:59Z',
      status: 'assigned',
      priority: 'medium',
      completion_rate: 0.30
    }
  ];
}

async function createCourse(workspaceId: string, data: any) {
  const { title, description, category, difficulty, duration, instructor } = data;
  
  // Mock course creation
  const course = {
    id: Date.now().toString(),
    title,
    description,
    category,
    difficulty,
    duration,
    lessons: 0,
    video_count: 0,
    quiz_count: 0,
    certificate_available: true,
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0],
    status: 'draft',
    instructor,
    thumbnail: null,
    tags: []
  };

  return {
    message: 'Course created successfully',
    course
  };
}

async function assignCourse(workspaceId: string, data: any) {
  const { course_id, assigned_to, due_date, priority } = data;
  
  // Mock course assignment
  const assignment = {
    id: Date.now().toString(),
    course_id,
    assigned_to,
    assigned_by: 'Admin',
    assigned_at: new Date().toISOString(),
    due_date,
    status: 'assigned',
    priority,
    completion_rate: 0
  };

  return {
    message: 'Course assigned successfully',
    assignment
  };
}

async function updateProgress(workspaceId: string, userId: string, data: any) {
  const { course_id, lesson_id, progress, score } = data;
  
  // Mock progress update
  const progressUpdate = {
    user_id: userId,
    course_id,
    lesson_id,
    progress,
    score,
    completed_at: new Date().toISOString(),
    time_spent: Math.floor(Math.random() * 30) + 10 // 10-40 minutes
  };

  return {
    message: 'Progress updated successfully',
    progress: progressUpdate
  };
}

async function completeLesson(workspaceId: string, userId: string, data: any) {
  const { course_id, lesson_id, score } = data;
  
  // Mock lesson completion
  const completion = {
    user_id: userId,
    course_id,
    lesson_id,
    score,
    completed_at: new Date().toISOString(),
    certificate_earned: score >= 80
  };

  return {
    message: 'Lesson completed successfully',
    completion
  };
}
