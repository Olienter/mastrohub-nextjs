import { NextRequest, NextResponse } from 'next/server';

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  category: string;
  readTime: number;
  tags: string[];
  excerpt: string;
}

// Mock database
let articles: Article[] = [
  {
    id: '1',
    title: 'Menu Engineering: Increase Revenue by 45%',
    author: 'Sarah Johnson',
    content: 'Menu engineering is a systematic approach to analyzing a restaurant menu\'s performance to maximize profitability. This comprehensive guide will show you how to identify your most and least profitable items, optimize pricing strategies, and create a menu that drives sales while maintaining customer satisfaction.',
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    category: 'Menu Engineering',
    readTime: 8,
    tags: ['menu', 'profitability', 'pricing'],
    excerpt: 'Learn how to analyze your menu performance and optimize for maximum profitability.'
  },
  {
    id: '2',
    title: 'Smart Pricing Strategies for Restaurants',
    author: 'Mike Chen',
    content: 'Pricing is one of the most critical decisions in restaurant management. This article explores advanced pricing strategies including psychological pricing, value-based pricing, and dynamic pricing models that can help you maximize revenue while maintaining customer loyalty.',
    status: 'pending',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
    category: 'Pricing',
    readTime: 6,
    tags: ['pricing', 'strategy', 'revenue'],
    excerpt: 'Discover advanced pricing strategies to maximize your restaurant\'s revenue.'
  },
  {
    id: '3',
    title: 'Food Waste Reduction Techniques',
    author: 'Emma Davis',
    content: 'Reducing food waste is not only environmentally responsible but also financially beneficial. This comprehensive guide covers inventory management, portion control, creative menu planning, and technology solutions that can help you reduce waste by up to 30%.',
    status: 'pending',
    createdAt: '2024-01-13T09:20:00Z',
    updatedAt: '2024-01-13T09:20:00Z',
    category: 'Sustainability',
    readTime: 10,
    tags: ['waste', 'sustainability', 'inventory'],
    excerpt: 'Learn practical techniques to reduce food waste and improve your bottom line.'
  },
  {
    id: '4',
    title: 'Customer Experience Optimization',
    author: 'David Wilson',
    content: 'Creating exceptional customer experiences is key to building loyalty and driving repeat business. This article covers everything from staff training and service standards to ambiance and technology integration.',
    status: 'approved',
    createdAt: '2024-01-12T14:15:00Z',
    updatedAt: '2024-01-12T14:15:00Z',
    category: 'Customer Experience',
    readTime: 7,
    tags: ['customer', 'experience', 'service'],
    excerpt: 'Optimize your customer experience to build loyalty and drive repeat business.'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const author = searchParams.get('author');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredArticles = [...articles];

    // Filter by status
    if (status) {
      filteredArticles = filteredArticles.filter(article => article.status === status);
    }

    // Filter by category
    if (category) {
      filteredArticles = filteredArticles.filter(article => 
        article.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by author
    if (author) {
      filteredArticles = filteredArticles.filter(article => 
        article.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    // Apply pagination
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    return NextResponse.json({
      articles: paginatedArticles,
      total: filteredArticles.length,
      limit,
      offset,
      hasMore: offset + limit < filteredArticles.length
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, content, category, tags, excerpt } = body;

    // Validation
    if (!title || !author || !content) {
      return NextResponse.json(
        { error: 'Title, author, and content are required' },
        { status: 400 }
      );
    }

    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      author,
      content,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: category || 'General',
      readTime: Math.ceil(content.split(' ').length / 200), // Rough estimate
      tags: tags || [],
      excerpt: excerpt || content.substring(0, 150) + '...'
    };

    articles.push(newArticle);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const articleIndex = articles.findIndex(article => article.id === id);
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Update article
    articles[articleIndex] = {
      ...articles[articleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(articles[articleIndex]);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const articleIndex = articles.findIndex(article => article.id === id);
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    articles.splice(articleIndex, 1);

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
} 