export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  popularity: number;
  profitMargin: number;
}

export interface AIAnalysis {
  recommendations: string[];
  profitOptimization: string[];
  wasteReduction: string[];
  pricingSuggestions: string[];
}

export class AIEngine {
  static analyzeMenu(menuItems: MenuItem[]): AIAnalysis {
    const totalRevenue = menuItems.reduce((sum, item) => sum + item.price, 0);
    const totalCost = menuItems.reduce((sum, item) => sum + item.cost, 0);
    const avgProfitMargin = ((totalRevenue - totalCost) / totalRevenue) * 100;
    
    const recommendations: any[] = [];
    const profitOptimization: any[] = [];
    const wasteReduction: any[] = [];
    const pricingSuggestions: any[] = [];
    
    // AI Analysis Logic
    menuItems.forEach(item => {
      const margin = ((item.price - item.cost) / item.price) * 100;
      
      if (margin < 60) {
        profitOptimization.push(`Consider increasing price for "${item.name}" to improve margin`);
      }
      
      if (item.popularity < 0.3) {
        wasteReduction.push(`"${item.name}" has low popularity - consider removing or improving`);
      }
      
      if (margin > 80) {
        pricingSuggestions.push(`"${item.name}" has excellent margin - could be a star item`);
      }
    });
    
    if (avgProfitMargin < 65) {
      recommendations.push('Overall profit margin is below industry average. Consider menu optimization.');
    }
    
    return {
      recommendations,
      profitOptimization,
      wasteReduction,
      pricingSuggestions
    };
  }
  
  static generatePricingSuggestions(item: MenuItem): number[] {
    const basePrice = item.price;
    const cost = item.cost;
    
    // AI pricing suggestions with different margin targets
    return [
      Math.round((cost / 0.5) * 100) / 100, // 50% margin
      Math.round((cost / 0.6) * 100) / 100, // 40% margin
      Math.round((cost / 0.7) * 100) / 100, // 30% margin
    ];
  }
} 