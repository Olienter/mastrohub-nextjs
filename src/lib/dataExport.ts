export interface ExportData {
  menuItems: any[];
  analytics: any[];
  settings: any;
  timestamp: Date;
  version: string;
}

export class DataManager {
  static exportData(): ExportData {
    return {
      menuItems: [], // Get from store
      analytics: [], // Get from store
      settings: {}, // Get from store
      timestamp: new Date(),
      version: '1.0.0'
    };
  }

  static importData(data: ExportData): boolean {
    try {
      // Validate data structure
      if (!data.menuItems || !data.analytics || !data.settings) {
        throw new Error('Invalid data structure');
      }

      // Import data to stores
      // This would update all relevant stores
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  static exportToCSV(data: any[], filename: string) {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ];
    
    return csvRows.join('\n');
  }
} 