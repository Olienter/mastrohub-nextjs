export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id?: string;
  category_name?: string;
  image_url?: string;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  allergens?: string[];
  preparation_time?: number;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  manuals?: {
    chef?: any;
    waiter?: any;
    marketing?: any;
    analytics?: any;
    supply_chain?: any;
    financial?: any;
    sustainability?: any;
  };
}

export interface MenuContext {
  dishName: string
  category: 'appetizer' | 'main' | 'dessert' | 'drink'
  ingredients: string[]
  price: number
  prepTime: number
  cuisine?: string
  dietary?: string[]
  seasonality?: string
  targetAudience?: string
}

export interface MenuData {
  chefManual: {
    equipment: string[]
    substitutions: string[]
    garnishing: string
    servingTemperature: 'hot' | 'warm' | 'cold'
    portionSizes: {
      small: number
      medium: number
      large: number
    }
    qualityNotes: string
    timingNotes: string
  }
  waiterManual: {
    customerDescription: string
    recommendations: string[]
    pairing: string[]
    specialRequests: string[]
    portionInfo: string
    alternatives: string[]
    servingTime: number
  }
  marketingManual: {
    story: string
    hashtags: string[]
    seasonality: string[]
    targetAudience: string[]
    trends: string[]
    background: string
    chefStory: string
    localIngredients: string[]
  }
  analytics: {
    popularity: number
    profitability: number
    seasonalTrends: string[]
    customerRatings: number
    returnRate: number
    preparationEfficiency: number
  }
  supplyChain: {
    suppliers: string[]
    minimumOrder: number
    deliveryTime: number
    storageInstructions: string
    shelfLife: number
    backupSuppliers: string[]
  }
  financial: {
    ingredientCosts: number
    laborCosts: number
    margin: number
    pricingStrategy: string
    competitorPrices: number[]
    seasonalPriceChanges: string[]
  }
  sustainability: {
    localIngredients: string[]
    organicIngredients: string[]
    wasteReduction: string
    carbonFootprint: number
    seasonalAvailability: string[]
  }
}

export interface RestaurantContext {
  // Menu Items
  menuItems: MenuItem[]
  
  // Restaurant Info
  restaurantName: string
  cuisine: string
  location: string
  targetAudience: string[]
  priceRange: 'budget' | 'mid-range' | 'premium' | 'luxury'
  
  // Business Data
  totalRevenue: number
  averageOrderValue: number
  customerCount: number
  popularItems: string[]
  seasonalTrends: string[]
  
  // Tools and Features
  availableTools: string[]
  qrMenuEnabled: boolean
  analyticsEnabled: boolean
  marketingEnabled: boolean
}

export interface AIAssistantResponse {
  answer: string
  confidence: number
  suggestions: string[]
  relatedData: any
  actionItems: string[]
}

export class AIAgent {
  private context: MenuContext
  private restaurantContext: RestaurantContext
  private answers: Record<string, string> = {}

  constructor(initialContext: Partial<MenuContext>, restaurantContext?: RestaurantContext) {
    this.context = { ...initialContext } as MenuContext
    this.restaurantContext = restaurantContext || this.getDefaultRestaurantContext()
  }

  // Restaurant Assistant Methods
  async askRestaurantAssistant(question: string): Promise<AIAssistantResponse> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    You are a friendly, knowledgeable restaurant consultant assistant. You have access to all restaurant data and help restaurant owners with any questions.

    RESTAURANT CONTEXT:
    ${context}

    USER QUESTION: ${question}

    Respond in a warm, conversational tone like a helpful friend who knows the restaurant business well. Be encouraging, supportive, and provide practical advice.

    Your response should:
    1. Answer the question directly and helpfully
    2. Use specific data from the restaurant when relevant
    3. Provide actionable suggestions
    4. Be encouraging and positive
    5. Use natural language with occasional emojis where appropriate
    6. Show you understand their business

    Format your response as JSON:
    {
      "answer": "Your friendly, helpful answer here",
      "confidence": 0.95,
      "suggestions": ["Helpful suggestion 1", "Helpful suggestion 2"],
      "relatedData": {"key": "value"},
      "actionItems": ["Action 1", "Action 2"]
    }
    `

    const response = await this.callAI(prompt)
    try {
      return JSON.parse(response)
    } catch {
      return {
        answer: response,
        confidence: 0.8,
        suggestions: [],
        relatedData: {},
        actionItems: []
      }
    }
  }

  // Menu Analysis
  async analyzeMenu(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Analyze this restaurant's menu and provide insights:

    ${context}

    Provide analysis on:
    1. Menu balance and variety
    2. Pricing strategy
    3. Profitability analysis
    4. Popular vs unpopular items
    5. Seasonal opportunities
    6. Improvement suggestions

    Format as JSON with detailed insights.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Business Recommendations
  async getBusinessRecommendations(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Based on this restaurant data, provide business recommendations:

    ${context}

    Focus on:
    1. Revenue optimization
    2. Cost reduction
    3. Customer satisfaction
    4. Marketing opportunities
    5. Operational efficiency
    6. Growth strategies

    Format as JSON with prioritized recommendations.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Menu Optimization
  async optimizeMenu(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Optimize this restaurant's menu for maximum profitability and customer satisfaction:

    ${context}

    Provide:
    1. Items to keep, modify, or remove
    2. New item suggestions
    3. Pricing adjustments
    4. Seasonal menu changes
    5. Cross-selling opportunities
    6. Cost optimization

    Format as JSON with specific recommendations.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Marketing Strategy
  async generateMarketingStrategy(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Create a comprehensive marketing strategy for this restaurant:

    ${context}

    Include:
    1. Target audience analysis
    2. Social media strategy
    3. Local marketing tactics
    4. Seasonal campaigns
    5. Partnership opportunities
    6. Budget allocation

    Format as JSON with detailed marketing plan.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Financial Analysis
  async analyzeFinances(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Provide detailed financial analysis for this restaurant:

    ${context}

    Analyze:
    1. Revenue trends
    2. Cost structure
    3. Profitability by item
    4. Cash flow optimization
    5. Investment opportunities
    6. Risk assessment

    Format as JSON with financial insights.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Supply Chain Optimization
  async optimizeSupplyChain(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Optimize the supply chain for this restaurant:

    ${context}

    Focus on:
    1. Supplier evaluation
    2. Cost reduction
    3. Quality improvement
    4. Inventory management
    5. Local sourcing
    6. Sustainability

    Format as JSON with supply chain recommendations.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Customer Insights
  async analyzeCustomerBehavior(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Analyze customer behavior and preferences for this restaurant:

    ${context}

    Provide insights on:
    1. Customer demographics
    2. Ordering patterns
    3. Peak hours analysis
    4. Customer feedback
    5. Loyalty opportunities
    6. Service improvements

    Format as JSON with customer insights.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  // Predictive Analytics
  async predictTrends(): Promise<any> {
    const context = this.buildRestaurantContext()
    
    const prompt = `
    Predict future trends and opportunities for this restaurant:

    ${context}

    Predict:
    1. Seasonal demand changes
    2. Menu item popularity
    3. Revenue projections
    4. Market opportunities
    5. Competitive threats
    6. Growth potential

    Format as JSON with predictions and confidence levels.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  async askSmartQuestion(questionNumber: number): Promise<string> {
    const baseQuestions = [
      "What's the name of this dish?",
      "What category is it? (appetizer/main/dessert/drink)",
      "What are the main ingredients? (list 3-5 most important)",
      "What's the price in euros?",
      "How long does it take to prepare in minutes?"
    ]

    if (questionNumber <= 5) {
      return baseQuestions[questionNumber - 1]
    }

    // AI generates smart follow-up questions based on context
    return await this.generateSmartQuestion(questionNumber)
  }

  private async generateSmartQuestion(questionNumber: number): Promise<string> {
    const context = this.buildContext()
    
    const prompt = `
    Based on this menu item context: ${context}
    
    Generate question #${questionNumber} that will help create comprehensive manuals.
    The question should be specific to this dish type and gather information for:
    - Chef manual (equipment, techniques, timing)
    - Waiter manual (description, pairing, service)
    - Marketing manual (story, hashtags, audience)
    - Analytics (popularity, profitability)
    - Supply chain (ingredients, storage)
    - Financial (costs, pricing)
    - Sustainability (local, organic, waste)
    
    Make it conversational and specific to this dish.
    `

    // This would call OpenAI/Claude API
    return await this.callAI(prompt)
  }

  async processAnswer(questionNumber: number, answer: string): Promise<void> {
    this.answers[`q${questionNumber}`] = answer
    
    // Update context based on answer
    await this.updateContext(questionNumber, answer)
  }

  private async updateContext(questionNumber: number, answer: string): Promise<void> {
    switch (questionNumber) {
      case 1:
        this.context.dishName = answer
        break
      case 2:
        this.context.category = answer as any
        break
      case 3:
        this.context.ingredients = answer.split(',').map(i => i.trim())
        break
      case 4:
        this.context.price = parseFloat(answer)
        break
      case 5:
        this.context.prepTime = parseInt(answer)
        break
      default:
        // AI analyzes answer and updates context
        await this.analyzeAnswer(questionNumber, answer)
    }
  }

  async generateAllManuals(): Promise<MenuData> {
    const context = this.buildContext()
    
    const chefManual = await this.generateChefManual(context)
    const waiterManual = await this.generateWaiterManual(context)
    const marketingManual = await this.generateMarketingManual(context)
    const analytics = await this.generateAnalytics(context)
    const supplyChain = await this.generateSupplyChain(context)
    const financial = await this.generateFinancial(context)
    const sustainability = await this.generateSustainability(context)

    return {
      chefManual,
      waiterManual,
      marketingManual,
      analytics,
      supplyChain,
      financial,
      sustainability
    }
  }

  private async generateChefManual(context: string): Promise<MenuData['chefManual']> {
    const prompt = `
    Create a chef manual for: ${context}
    
    Include:
    - Required equipment
    - Critical preparation steps
    - Timing and temperature
    - Common mistakes to avoid
    - Ingredient substitutions
    - Plating instructions
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private async generateWaiterManual(context: string): Promise<MenuData['waiterManual']> {
    const prompt = `
    Create a waiter manual for: ${context}
    
    Include:
    - Customer-facing description
    - Wine/drink pairing suggestions
    - Alternative recommendations
    - Common customer questions
    - Allergen information
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private async generateMarketingManual(context: string): Promise<MenuData['marketingManual']> {
    const prompt = `
    Create a marketing manual for: ${context}
    
    Include:
    - Compelling story/narrative
    - Relevant hashtags
    - Target audience segments
    - Seasonal promotion ideas
    - Social media content ideas
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private async generateAnalytics(context: string): Promise<MenuData['analytics']> {
    const prompt = `
    Create analytics insights for: ${context}
    
    Include:
    - Popularity assessment (high/medium/low)
    - Profitability percentage
    - Seasonal trends
    - Customer feedback themes
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private async generateSupplyChain(context: string): Promise<MenuData['supplyChain']> {
    const prompt = `
    Create supply chain information for: ${context}
    
    Include:
    - Key suppliers needed
    - Storage requirements
    - Shelf life information
    - Critical ingredients to monitor
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private async generateFinancial(context: string): Promise<MenuData['financial']> {
    const prompt = `
    Create financial analysis for: ${context}
    
    Include:
    - Estimated cost breakdown
    - Profit margin percentage
    - Pricing strategy
    - ROI considerations
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private async generateSustainability(context: string): Promise<MenuData['sustainability']> {
    const prompt = `
    Create sustainability assessment for: ${context}
    
    Include:
    - Percentage of local ingredients
    - Organic ingredient options
    - Carbon footprint assessment
    - Waste reduction strategies
    
    Format as JSON.
    `

    const response = await this.callAI(prompt)
    return JSON.parse(response)
  }

  private buildContext(): string {
    return `
    Dish: ${this.context.dishName}
    Category: ${this.context.category}
    Ingredients: ${this.context.ingredients?.join(', ')}
    Price: €${this.context.price}
    Prep Time: ${this.context.prepTime} minutes
    Cuisine: ${this.context.cuisine || 'Not specified'}
    Dietary: ${this.context.dietary?.join(', ') || 'None'}
    Seasonality: ${this.context.seasonality || 'Year-round'}
    Target Audience: ${this.context.targetAudience || 'General'}
    `
  }

  private buildRestaurantContext(): string {
    return `
    RESTAURANT: ${this.restaurantContext.restaurantName}
    CUISINE: ${this.restaurantContext.cuisine}
    LOCATION: ${this.restaurantContext.location}
    TARGET AUDIENCE: ${this.restaurantContext.targetAudience.join(', ')}
    PRICE RANGE: ${this.restaurantContext.priceRange}
    
    BUSINESS METRICS:
    - Total Revenue: €${this.restaurantContext.totalRevenue}
    - Average Order Value: €${this.restaurantContext.averageOrderValue}
    - Customer Count: ${this.restaurantContext.customerCount}
    - Popular Items: ${this.restaurantContext.popularItems.join(', ')}
    - Seasonal Trends: ${this.restaurantContext.seasonalTrends.join(', ')}
    
    MENU ITEMS (${this.restaurantContext.menuItems.length} items):
    ${this.restaurantContext.menuItems.map(item => `
      - ${item.name}: €${item.price} (${item.category_name || 'Uncategorized'})
        Preparation Time: ${item.preparation_time || 15} min
        Tags: ${item.tags?.join(', ') || 'None'}
    `).join('')}
    
    AVAILABLE TOOLS:
    - ${this.restaurantContext.availableTools.join(', ')}
    - QR Menu: ${this.restaurantContext.qrMenuEnabled ? 'Enabled' : 'Disabled'}
    - Analytics: ${this.restaurantContext.analyticsEnabled ? 'Enabled' : 'Disabled'}
    - Marketing: ${this.restaurantContext.marketingEnabled ? 'Enabled' : 'Disabled'}
    `
  }

  private getDefaultRestaurantContext(): RestaurantContext {
    return {
      menuItems: [],
      restaurantName: 'MastroHub Restaurant',
      cuisine: 'International',
      location: 'City Center',
      targetAudience: ['Business professionals', 'Food enthusiasts'],
      priceRange: 'premium',
      totalRevenue: 50000,
      averageOrderValue: 25,
      customerCount: 2000,
      popularItems: ['Truffle Pasta Carbonara', 'Grilled Salmon'],
      seasonalTrends: ['Summer salads', 'Winter comfort food'],
      availableTools: ['Menu Maker', 'QR Menu', 'Analytics', 'Marketing'],
      qrMenuEnabled: true,
      analyticsEnabled: true,
      marketingEnabled: true
    }
  }

  // Update restaurant context with real data
  updateRestaurantContext(newContext: Partial<RestaurantContext>) {
    this.restaurantContext = { ...this.restaurantContext, ...newContext }
  }

  private async callAI(prompt: string): Promise<string> {
    // This would integrate with OpenAI/Claude API
    // For now, return mock response
    return "Mock AI response - replace with actual API call"
  }

  private async analyzeAnswer(questionNumber: number, answer: string): Promise<void> {
    // AI analyzes the answer and updates context accordingly
    const prompt = `
    Analyze this answer: "${answer}" for question #${questionNumber}
    Update the menu context with relevant information.
    `
    
    // This would call AI to analyze and update context
    // For now, just log
    console.log(`Analyzing answer ${questionNumber}: ${answer}`)
  }
}
