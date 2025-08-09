'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Menu,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowRight,
  Star,
  Clock,
  Target,
  Zap,
  Brain,
  Camera,
  FileText,
  ShoppingCart,
  Award,
  Activity
} from 'lucide-react'

import { LaunchManager } from '@/lib/launch'
import { PerformanceManager } from '@/lib/performance'
import { SecurityManager } from '@/lib/security'
import { TestingFramework } from '@/lib/testing'

interface DashboardMetric {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: string
  href?: string
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  gradient: string
}

export default function Home() {
  const [launchStatus, setLaunchStatus] = useState<string>('initializing')
  const [performanceScore, setPerformanceScore] = useState<number>(0)
  const [securityScore, setSecurityScore] = useState<number>(0)
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize launch manager
        const launchManager = LaunchManager.getInstance()
        await launchManager.initialize()
        
        // Get launch status
        const status = launchManager.getLaunchStatus()
        setLaunchStatus(status)

        // Initialize performance monitoring
        const performance = PerformanceManager.getInstance()
        performance.init()
        
        // Get performance summary
        const perfSummary = performance.getPerformanceSummary()
        setPerformanceScore(perfSummary.performanceScore)

        // Initialize security manager
        const security = SecurityManager.getInstance()
        
        // Run security tests
        const securityTests = [
          security.sanitizeInput('<script>alert("test")</script>'),
          security.validateXSS('<script>alert("test")</script>'),
          security.validateSQLInjection('SELECT * FROM users'),
          security.validatePasswordStrength('StrongPass123!')
        ]
        
        const securityResults = securityTests.filter(Boolean)
        setSecurityScore((securityResults.length / securityTests.length) * 100)

        // Initialize testing framework
        const testing = TestingFramework.getInstance()
        
        // Run basic tests
        const testReport = await testing.runAllTests()
        setTestResults(testReport)

        setIsLoading(false)
        console.log('🚀 MastroHub successfully initialized!')
      } catch (error) {
        console.error('Failed to initialize MastroHub:', error)
        setLaunchStatus('failed')
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const metrics: DashboardMetric[] = [
    {
      title: 'Total Revenue',
      value: '€12,450',
      change: 12.5,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-600',
      href: '/analytics-insights'
    },
    {
      title: 'Active Orders',
      value: '24',
      change: 8.2,
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'text-blue-600',
      href: '/restaurant-curator'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: 2.1,
      icon: <Star className="w-5 h-5" />,
      color: 'text-yellow-600',
      href: '/analytics-insights'
    },
    {
      title: 'Average Service Time',
      value: '8.5 min',
      change: -5.3,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-purple-600',
      href: '/performance'
    }
  ]

  const quickActions: QuickAction[] = [
    {
      title: 'Menu Maker',
      description: 'Create and optimize menus with AI',
      icon: <Menu className="w-6 h-6" />,
      href: '/menu-maker',
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'AI Assistant',
      description: 'Intelligent recommendations and analytics',
      icon: <Brain className="w-6 h-6" />,
      href: '/ai-assistant',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Analytics',
      description: 'Advanced metrics and reports',
      icon: <BarChart3 className="w-6 h-6" />,
      href: '/analytics-insights',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Supply Chain',
      description: 'Manage suppliers and inventory',
      icon: <ShoppingCart className="w-6 h-6" />,
      href: '/supply-chain',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-300">Initializing MastroHub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md shadow-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  MastroHub
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                  launchStatus === 'ready' 
                    ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                    : launchStatus === 'failed'
                    ? 'bg-red-900/50 text-red-300 border border-red-700/50'
                    : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50'
                }`}>
                  {launchStatus === 'ready' ? 'Ready' : launchStatus === 'failed' ? 'Error' : 'Initializing'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">MastroHub</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Comprehensive restaurant management platform with AI assistant that combines modern technologies with intuitive design.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-slate-700/50 ${metric.color}`}>
                  {metric.icon}
                </div>
                <div className={`text-sm font-medium ${
                  metric.change > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-slate-300 text-sm">{metric.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
            <Link 
              href="/dashboard" 
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={action.href}>
                  <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{action.title}</h4>
                    <p className="text-slate-300 text-sm">{action.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
            <button className="text-blue-400 hover:text-blue-300 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { action: 'New Order', time: '2 minutes', status: 'pending' },
              { action: 'Menu Updated', time: '15 minutes', status: 'completed' },
              { action: 'AI Analysis Complete', time: '1 hour', status: 'completed' },
              { action: 'New Customer', time: '2 hours', status: 'completed' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="font-medium text-white">{item.action}</span>
                </div>
                <span className="text-sm text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
