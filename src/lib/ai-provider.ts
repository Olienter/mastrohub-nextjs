// Multi-Provider AI System
export interface AIResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  provider: 'openai' | 'anthropic' | 'ollama'
  model: string
}

export type AIProviderType = 'openai' | 'anthropic' | 'ollama'

export class AIProvider {
  private openaiApiKey: string
  private anthropicApiKey: string
  private ollamaBaseUrl: string
  private defaultProvider: AIProviderType

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || ''
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    this.defaultProvider = (process.env.AI_PROVIDER as AIProviderType) || 'openai'
  }

  async generateResponse(
    prompt: string, 
    context?: any, 
    provider: AIProviderType = this.defaultProvider
  ): Promise<AIResponse> {
    try {
      switch (provider) {
        case 'openai':
          return await this.callOpenAI(prompt, context)
        case 'anthropic':
          return await this.callAnthropic(prompt, context)
        case 'ollama':
          return await this.callOllama(prompt, context)
        default:
          return await this.callOpenAI(prompt, context)
      }
    } catch (error) {
      console.error(`AI Provider Error (${provider}):`, error)
      
      // Fallback to mock response for development
      return {
        content: this.getMockResponse(prompt),
        provider: 'openai',
        model: 'gpt-4o'
      }
    }
  }

  private async callOpenAI(prompt: string, context?: any): Promise<AIResponse> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a restaurant expert and menu consultant. 
            You help restaurant owners create comprehensive manuals for their menu items.
            Always respond in a helpful, professional manner.
            When asked to format as JSON, ensure valid JSON structure.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      provider: 'openai',
      model: 'gpt-4o'
    }
  }

  private async callAnthropic(prompt: string, context?: any): Promise<AIResponse> {
    if (!this.anthropicApiKey) {
      throw new Error('Anthropic API key not configured')
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `You are a restaurant expert and menu consultant. 
            You help restaurant owners create comprehensive manuals for their menu items.
            Always respond in a helpful, professional manner.
            When asked to format as JSON, ensure valid JSON structure.
            
            ${prompt}`
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      content: data.content[0].text,
      usage: data.usage,
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    }
  }

  private async callOllama(prompt: string, context?: any): Promise<AIResponse> {
    const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: `You are a restaurant expert and menu consultant. 
        You help restaurant owners create comprehensive manuals for their menu items.
        Always respond in a helpful, professional manner.
        When asked to format as JSON, ensure valid JSON structure.
        
        ${prompt}`,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      content: data.response,
      provider: 'ollama',
      model: 'llama3.2:3b'
    }
  }

  async generateSmartQuestion(context: string, questionNumber: number, provider?: AIProviderType): Promise<string> {
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
    Return only the question, no additional text.
    `

    const response = await this.generateResponse(prompt, undefined, provider)
    return response.content
  }

  async analyzeAnswer(answer: string, questionNumber: number, context: string, provider?: AIProviderType): Promise<any> {
    const prompt = `
    Analyze this answer: "${answer}" for question #${questionNumber}
    
    Context: ${context}
    
    Extract relevant information and update the menu context.
    Return as JSON with key-value pairs of extracted information.
    `

    const response = await this.generateResponse(prompt, undefined, provider)
    try {
      return JSON.parse(response.content)
    } catch {
      return { analysis: response.content }
    }
  }

  // Get available providers based on configuration
  getAvailableProviders(): AIProviderType[] {
    const providers: AIProviderType[] = []
    
    if (this.openaiApiKey) providers.push('openai')
    if (this.anthropicApiKey) providers.push('anthropic')
    providers.push('ollama') // Always available if Ollama is running
    
    return providers
  }

  // Get provider info for UI
  getProviderInfo(provider: AIProviderType) {
    const info = {
      openai: {
        name: 'OpenAI GPT-4o',
        description: 'Latest and fastest AI model',
        cost: 'Paid per token',
        speed: 'Very fast'
      },
      anthropic: {
        name: 'Anthropic Claude 3.5',
        description: 'Best for text understanding',
        cost: 'Paid per token',
        speed: 'Fast'
      },
      ollama: {
        name: 'Ollama (Local)',
        description: 'Free local AI model',
        cost: 'Free',
        speed: 'Medium'
      }
    }
    
    return info[provider]
  }

  private getMockResponse(prompt: string): string {
    // Mock responses for development when API is not available
    if (prompt.includes('chef manual')) {
      return JSON.stringify({
        equipment: ['Chef knife', 'Cutting board', 'Pan'],
        substitutions: ['Olive oil for butter', 'Chicken for beef'],
        garnishing: 'Fresh parsley and black pepper',
        servingTemperature: 'hot',
        portionSizes: { small: 200, medium: 300, large: 400 },
        qualityNotes: 'Use fresh ingredients and high-quality products',
        timingNotes: 'Start preparation 15 minutes before serving'
      })
    }
    
    if (prompt.includes('waiter manual')) {
      return JSON.stringify({
        customerDescription: 'A delicious and well-prepared dish',
        recommendations: ['Pair with recommended wine', 'Add extra garnish'],
        pairing: ['Red wine', 'Sparkling water'],
        specialRequests: ['No dairy', 'Extra spicy', 'Gluten-free'],
        portionInfo: 'Generous portion, suitable for main course',
        alternatives: ['Vegetarian version', 'Spicy version'],
        servingTime: 5
      })
    }
    
    if (prompt.includes('marketing manual')) {
      return JSON.stringify({
        story: 'A traditional recipe with modern twist',
        hashtags: ['#delicious', '#restaurant', '#food'],
        seasonality: ['autumn', 'winter'],
        targetAudience: ['Food lovers', 'Business professionals'],
        trends: ['Local ingredients', 'Authentic preparation'],
        background: 'Chef learned this recipe from grandmother',
        chefStory: 'Created during our first season',
        localIngredients: ['Local vegetables', 'Fresh herbs']
      })
    }
    
    if (prompt.includes('analytics')) {
      return JSON.stringify({
        popularity: 85,
        profitability: 65,
        seasonalTrends: ['Year-round favorite'],
        customerRatings: 4.5,
        returnRate: 75,
        preparationEfficiency: 90
      })
    }
    
    if (prompt.includes('supply chain')) {
      return JSON.stringify({
        suppliers: ['Local market', 'Wholesale supplier'],
        minimumOrder: 10,
        deliveryTime: 2,
        storageInstructions: 'Keep refrigerated, use within 3 days',
        shelfLife: 3,
        backupSuppliers: ['Alternative market', 'Online supplier']
      })
    }
    
    if (prompt.includes('financial')) {
      return JSON.stringify({
        ingredientCosts: 8.50,
        laborCosts: 3.20,
        margin: 65,
        pricingStrategy: 'Premium positioning',
        competitorPrices: [22, 25, 28],
        seasonalPriceChanges: ['+10% in winter', '-5% in summer']
      })
    }
    
    if (prompt.includes('sustainability')) {
      return JSON.stringify({
        localIngredients: ['Local vegetables', 'Fresh herbs'],
        organicIngredients: ['Organic vegetables', 'Free-range eggs'],
        wasteReduction: 'Compost scraps, reuse containers',
        carbonFootprint: 2.5,
        seasonalAvailability: ['Spring', 'Summer', 'Autumn']
      })
    }
    
    // Friendly restaurant assistant responses
    if (prompt.includes('profitable') || prompt.includes('revenue')) {
      return JSON.stringify({
        answer: "Great question! 🎯 Looking at your menu, your 'Truffle Pasta Carbonara' is your star performer with a 65% profit margin. That's fantastic! I'd suggest promoting it as your signature dish. Your 'Grilled Salmon' is also doing well at 58% margin. Want me to help you optimize pricing for the other items?",
        confidence: 0.95,
        suggestions: ["Feature the Carbonara in your marketing", "Consider seasonal pricing for salmon", "Review pricing on lower-margin items"],
        relatedData: {"topPerformer": "Truffle Pasta Carbonara", "avgMargin": 52},
        actionItems: ["Update menu to highlight signature dishes", "Review pricing strategy", "Plan seasonal promotions"]
      })
    }
    
    if (prompt.includes('customer') || prompt.includes('behavior')) {
      return JSON.stringify({
        answer: "Your customers are loving the premium experience! 👥 I can see they're particularly drawn to your authentic Italian dishes and fresh ingredients. The average order value of €25 shows they're willing to pay for quality. Your repeat customer rate of 75% is excellent - they're clearly happy!",
        confidence: 0.92,
        suggestions: ["Create a loyalty program", "Ask for customer feedback", "Share behind-the-scenes content"],
        relatedData: {"avgOrderValue": 25, "repeatRate": 75, "topCategories": ["Italian", "Seafood"]},
        actionItems: ["Launch customer feedback survey", "Design loyalty program", "Create social media content"]
      })
    }
    
    if (prompt.includes('marketing') || prompt.includes('promotion')) {
      return JSON.stringify({
        answer: "Perfect timing for marketing! 📈 Your authentic Italian theme is a goldmine. I'd suggest focusing on your 'Truffle Pasta Carbonara' story - customers love hearing about traditional recipes. Your local ingredients angle is also strong. Want me to help you craft some social media campaigns?",
        confidence: 0.94,
        suggestions: ["Share chef's story on social media", "Create seasonal promotions", "Partner with local food bloggers"],
        relatedData: {"signatureDish": "Truffle Pasta Carbonara", "localIngredients": 80, "socialMediaReady": true},
        actionItems: ["Create Instagram story series", "Plan seasonal menu launch", "Reach out to local influencers"]
      })
    }
    
    if (prompt.includes('trend') || prompt.includes('future')) {
      return JSON.stringify({
        answer: "Exciting times ahead! 🚀 I'm seeing a strong trend toward authentic, locally-sourced dining experiences - which is exactly what you're offering! Your focus on traditional Italian cuisine is perfectly positioned. I'd suggest preparing for increased demand for your signature dishes.",
        confidence: 0.91,
        suggestions: ["Stock up on premium ingredients", "Train staff on wine pairings", "Plan for seasonal menu updates"],
        relatedData: {"trendDirection": "Authentic dining", "seasonalDemand": "increasing", "premiumPositioning": "strong"},
        actionItems: ["Update supplier contracts", "Enhance staff training", "Plan seasonal menu"]
      })
    }
    
    // Default friendly response
    return JSON.stringify({
      answer: "Thanks for asking! 😊 I'd love to help you with that. Could you give me a bit more context about what specific aspect of your restaurant you'd like to explore? I'm here to help with menu optimization, business insights, marketing strategies, and much more!",
      confidence: 0.85,
      suggestions: ["Tell me about your menu", "Ask about profitability", "Get marketing tips"],
      relatedData: {"availableTopics": ["menu", "finance", "marketing", "operations"]},
      actionItems: ["Explore menu analysis", "Review business metrics", "Plan marketing strategy"]
    })
  }
}

// Singleton instance
export const aiProvider = new AIProvider()
