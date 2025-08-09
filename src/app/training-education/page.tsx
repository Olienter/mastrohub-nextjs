'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  Package,
  Target,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  Brain,
  Lightbulb,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Grid,
  List,
  Menu,
  Leaf,
  ArrowLeft,
  UtensilsCrossed,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Star as StarIcon,
  Tag,
  Hash,
  Eye as EyeIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Brain as BrainIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  BarChart3 as BarChart3Icon,
  Lightbulb as LightbulbIcon,
  Wand2,
  Camera,
  Users as UsersIcon,
  BookOpen,
  GraduationCap,
  Settings as SettingsIcon,
  Bell,
  User,
  Crown,
  Trophy,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Percent,
  Package as PackageIcon,
  FileText,
  Printer,
  Share2,
  Upload,
  RotateCcw,
  Calculator,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Hash as HashIcon,
  PenTool,
  Folder as FolderIcon,
  AlertCircle as AlertCircleIcon,
  Mail,
  Smartphone,
  QrCode,
  Megaphone,
  Users as UsersIcon2,
  BarChart3 as BarChart3Icon2,
  Lightbulb as LightbulbIcon2,
  Target as TargetIcon2,
  TrendingUp as TrendingUpIcon2,
  DollarSign as DollarSignIcon2,
  MessageCircle as MessageCircleIcon,
  Share2 as Share2Icon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  RefreshCw as RefreshCwIcon,
  Settings as SettingsIcon2,
  Eye as EyeIcon2,
  EyeOff as EyeOffIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Clock as ClockIcon2,
  Star as StarIcon2,
  AlertCircle as AlertCircleIcon2,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Zap as ZapIcon2,
  Brain as BrainIcon2,
  Lightbulb as LightbulbIcon3,
  ArrowRight as ArrowRightIcon,
  Save as SaveIcon,
  X as XIcon,
  Grid as GridIcon,
  List as ListIcon,
  Menu as MenuIcon,
  Leaf as LeafIcon,
  ArrowLeft as ArrowLeftIcon,
  UtensilsCrossed as UtensilsCrossedIcon,
  Tag as TagIcon,
  Hash as HashIcon2,
  Heart as HeartIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Sparkles as SparklesIcon,
  Wand2 as Wand2Icon,
  Camera as CameraIcon,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  Bell as BellIcon,
  User as UserIcon,
  Crown as CrownIcon,
  Trophy as TrophyIcon,
  Percent as PercentIcon,
  Printer as PrinterIcon,
  RotateCcw as RotateCcwIcon,
  Calculator as CalculatorIcon,
  Image as ImageIcon2,
  PenTool as PenToolIcon,
  Folder as FolderIcon2,
  Play,
  Video,
  BookOpen as BookOpenIcon2,
  Award,
  Award as Certificate,
  Clock as ClockIcon3,
  Users as UsersIcon3,
  Target as TargetIcon3,
  TrendingUp as TrendingUpIcon3,
  BarChart3 as BarChart3Icon3,
  Lightbulb as LightbulbIcon4,
  Brain as BrainIcon3,
  Zap as ZapIcon3,
  Star as StarIcon3,
  CheckCircle as CheckCircleIcon2,
  AlertCircle as AlertCircleIcon3,
  Info as InfoIcon2,
  Plus as PlusIcon2,
  Edit as EditIcon2,
  Trash2 as Trash2Icon2,
  Save as SaveIcon2,
  X as XIcon2,
  Search as SearchIcon2,
  Filter as FilterIcon2,
  RefreshCw as RefreshCwIcon2,
  Settings as SettingsIcon3,
  Eye as EyeIcon3,
  EyeOff as EyeOffIcon2,
  ChevronDown as ChevronDownIcon2,
  ChevronUp as ChevronUpIcon2,
  Clock as ClockIcon4,
  Star as StarIcon4,
  AlertCircle as AlertCircleIcon4,
  CheckCircle as CheckCircleIcon3,
  Info as InfoIcon3,
  Zap as ZapIcon4,
  Brain as BrainIcon4,
  Lightbulb as LightbulbIcon5,
  ArrowRight as ArrowRightIcon2,
  Save as SaveIcon3,
  X as XIcon3,
  Grid as GridIcon2,
  List as ListIcon2,
  Menu as MenuIcon2,
  Leaf as LeafIcon2,
  ArrowLeft as ArrowLeftIcon2,
  UtensilsCrossed as UtensilsCrossedIcon2,
  Tag as TagIcon2,
  Hash as HashIcon3,
  Heart as HeartIcon2,
  MoreHorizontal as MoreHorizontalIcon2,
  Sparkles as SparklesIcon2,
  Wand2 as Wand2Icon2,
  Camera as CameraIcon2,
  BookOpen as BookOpenIcon3,
  GraduationCap as GraduationCapIcon2,
  Bell as BellIcon2,
  User as UserIcon2,
  Crown as CrownIcon2,
  Trophy as TrophyIcon2,
  Percent as PercentIcon2,
  Printer as PrinterIcon2,
  RotateCcw as RotateCcwIcon2,
  Calculator as CalculatorIcon2,
  Image as ImageIcon3,
  PenTool as PenToolIcon2,
  Folder as FolderIcon3
} from 'lucide-react';

import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lessons: number;
  video_count: number;
  quiz_count: number;
  certificate_available: boolean;
  created_at: string;
  updated_at: string;
  status: 'active' | 'draft' | 'archived';
  instructor: string;
  thumbnail: string | null;
  tags: string[];
}

interface EmployeeProgress {
  overall_progress: number;
  completed_courses: number;
  total_courses: number;
  certificates_earned: number;
  current_course: {
    id: string;
    title: string;
    progress: number;
    current_lesson: number;
    total_lessons: number;
    estimated_completion: string;
  };
  recent_activities: Array<{
    type: string;
    course_id: string;
    course_title: string;
    lesson_title?: string;
    quiz_title?: string;
    completed_at: string;
    score?: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earned_at: string;
    icon: string;
  }>;
}

interface CourseAssignment {
  id: string;
  course_id: string;
  course_title: string;
  assigned_to: string;
  assigned_by: string;
  assigned_at: string;
  due_date: string;
  status: 'assigned' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  completion_rate: number;
}

export default function TrainingEducation() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  
  // State
  const [trainingData, setTrainingData] = useState<{
    courses: Course[];
    progress: EmployeeProgress;
    assignments: CourseAssignment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'progress' | 'assignments' | 'certificates'>('overview');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showAssignCourse, setShowAssignCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Load training data
  const loadTrainingData = async () => {
    if (!currentWorkspace) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/training?workspace_id=${currentWorkspace.id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load training data');
      }
      
      setTrainingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadTrainingData();
    }
  }, [currentWorkspace]);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <AlertCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Workspace Selected</h2>
            <p className="text-gray-500">Please select a workspace to view training data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/restaurant-curator" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Restaurant Curator
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Training & Education</h1>
                <p className="text-sm text-gray-600">{currentWorkspace.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAssignCourse(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Assign Course
              </button>
              
              <button
                onClick={() => setShowCreateCourse(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <RefreshCwIcon className="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600">Loading training data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex">
              <AlertCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading training data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Training Data */}
        {trainingData && !loading && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpenIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Courses</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {trainingData.courses.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Courses</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {trainingData.progress.completed_courses}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Certificates Earned</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {trainingData.progress.certificates_earned}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUpIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Overall Progress</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {Math.round(trainingData.progress.overall_progress * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: BarChart3Icon },
                    { id: 'courses', name: 'Courses', icon: BookOpenIcon },
                    { id: 'progress', name: 'My Progress', icon: TrendingUpIcon },
                    { id: 'assignments', name: 'Assignments', icon: TargetIcon },
                    { id: 'certificates', name: 'Certificates', icon: Award }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Current Course Progress */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Course</h3>
                  {trainingData.progress.current_course ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-md font-medium text-gray-900">
                          {trainingData.progress.current_course.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          Lesson {trainingData.progress.current_course.current_lesson} of {trainingData.progress.current_course.total_lessons}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trainingData.progress.current_course.progress * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{Math.round(trainingData.progress.current_course.progress * 100)}% Complete</span>
                        <span>Est. completion: {trainingData.progress.current_course.estimated_completion}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No active course</p>
                  )}
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    {trainingData.progress.recent_activities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === 'lesson_completed' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                          {activity.type === 'quiz_passed' && <Award className="h-5 w-5 text-blue-500" />}
                          {activity.type === 'certificate_earned' && <Certificate className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'lesson_completed' && `${activity.lesson_title} completed`}
                            {activity.type === 'quiz_passed' && `${activity.quiz_title} passed`}
                            {activity.type === 'certificate_earned' && `Certificate earned for ${activity.course_title}`}
                          </p>
                          <p className="text-sm text-gray-500">{activity.course_title}</p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">
                          {activity.score && `${activity.score}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainingData.progress.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div className="flex-shrink-0 text-2xl">{achievement.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="text-center py-12">
                <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Available Courses</h3>
                <p className="text-gray-600">Course catalog will be implemented here</p>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="text-center py-12">
                <TrendingUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">My Progress</h3>
                <p className="text-gray-600">Detailed progress tracking will be implemented here</p>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="text-center py-12">
                <TargetIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Course Assignments</h3>
                <p className="text-gray-600">Assignment management will be implemented here</p>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="text-center py-12">
                <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Certificates</h3>
                <p className="text-gray-600">Certificate management will be implemented here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
