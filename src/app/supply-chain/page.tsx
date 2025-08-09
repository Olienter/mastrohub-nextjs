'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import {
  Truck, Package, ShoppingCart, TrendingUp, Users, AlertTriangle, CheckCircle, Clock, DollarSign,
  Star, Phone, Mail, Calendar, ArrowUpRight, ArrowDownRight, Plus, Search, Filter, Download,
  Eye, Edit, Trash2, RefreshCw, BarChart3, PieChart, Activity
} from 'lucide-react';

// Interfaces for type safety
interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  rating: number;
  reliability: number;
  deliveryTime: string;
  lastOrder: string;
  totalSpent: number;
  status: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'out';
}

interface Order {
  id: string;
  supplier: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    cost: number;
  }>;
  totalCost: number;
  orderDate: string;
  expectedDelivery: string;
  status: string;
  priority: string;
}

interface Analytics {
  totalSpent: number;
  monthlySpending: number;
  topSuppliers: Array<{
    name: string;
    spent: number;
    percentage: number;
  }>;
  inventoryValue: number;
  lowStockItems: number;
  pendingOrders: number;
  averageDeliveryTime: number;
  costSavings: number;
}

export default function SupplyChain() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [activeTab, setActiveTab] = useState<'suppliers' | 'inventory' | 'orders' | 'analytics'>('suppliers');
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    loadSupplyChainData();
  }, [activeTab]);

  const loadSupplyChainData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/supply-chain?action=${activeTab}`);
      const result = await response.json();
      
      if (result.success) {
        switch (activeTab) {
          case 'suppliers':
            setSuppliers(result.data);
            break;
          case 'inventory':
            setInventory(result.data);
            break;
          case 'orders':
            setOrders(result.data);
            break;
          case 'analytics':
            setAnalytics(result.data);
            break;
        }
      }
    } catch (error) {
      console.error('Error loading supply chain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'suppliers', name: 'Dodávatelia', icon: Users },
    { id: 'inventory', name: 'Zásoby', icon: Package },
    { id: 'orders', name: 'Objednávky', icon: ShoppingCart },
    { id: 'analytics', name: 'Analýzy', icon: BarChart3 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'out': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Supply Chain Management</h1>
                <p className="mt-2 text-gray-600">
                  Správa dodávateľov, zásob a objednávok pre optimálnu prevádzku
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={loadSupplyChainData}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Obnoviť
                </button>
                <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nová objednávka
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Suppliers Tab */}
                {activeTab === 'suppliers' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Dodávatelia</h2>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            placeholder="Hľadať dodávateľa..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {suppliers.map((supplier) => (
                        <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                              <p className="text-sm text-gray-500">{supplier.category}</p>
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">{supplier.rating}</span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-center text-sm">
                              <Users className="w-4 h-4 text-gray-400 mr-2" />
                              <span>{supplier.contact.name}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 text-gray-400 mr-2" />
                              <span>{supplier.contact.email}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-4 h-4 text-gray-400 mr-2" />
                              <span>{supplier.contact.phone}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Truck className="w-4 h-4 text-gray-400 mr-2" />
                              <span>{supplier.deliveryTime}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Spolahlivosť</span>
                              <span className="font-medium">{supplier.reliability}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span className="text-gray-500">Celkové výdavky</span>
                              <span className="font-medium">{formatCurrency(supplier.totalSpent)}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center space-x-2">
                            <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                              <Edit className="w-4 h-4 mr-1" />
                              Upraviť
                            </button>
                            <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100">
                              <Eye className="w-4 h-4 mr-1" />
                              Detail
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Zásoby</h2>
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Pridať položku
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Položka
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategória
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Zásoby
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cena/ks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dodávateľ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Stav
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Akcie
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {inventory.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.category}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {item.currentStock} {item.unit}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Min: {item.minStock} | Max: {item.maxStock}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatCurrency(item.costPerUnit)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.supplier}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                  {item.status === 'low' ? 'Nízke zásoby' : item.status === 'normal' ? 'Normálne' : 'Vyčerpané'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Objednávky</h2>
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nová objednávka
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                              <p className="text-sm text-gray-500">{order.supplier}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                                {order.priority === 'high' ? 'Vysoká' : order.priority === 'normal' ? 'Normálna' : 'Nízka'}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'confirmed' ? 'text-green-600 bg-green-100' :
                                order.status === 'in-transit' ? 'text-blue-600 bg-blue-100' :
                                'text-gray-600 bg-gray-100'
                              }`}>
                                {order.status === 'confirmed' ? 'Potvrdená' : 
                                 order.status === 'in-transit' ? 'V preprave' : order.status}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-sm text-gray-500 mb-2">Položky:</div>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <span>{item.name} ({item.quantity} {item.unit})</span>
                                  <span className="font-medium">{formatCurrency(item.cost)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Objednané: {formatDate(order.orderDate)}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Truck className="w-4 h-4 mr-1" />
                                <span>Dodanie: {formatDate(order.expectedDelivery)}</span>
                              </div>
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrency(order.totalCost)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center space-x-2">
                            <button className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100">
                              <Eye className="w-4 h-4 mr-1" />
                              Detail
                            </button>
                            <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100">
                              <Edit className="w-4 h-4 mr-1" />
                              Upraviť
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && analytics && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Analýzy</h2>
                      <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" />
                        Exportovať
                      </button>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <DollarSign className="w-8 h-8 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Celkové výdavky</p>
                            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analytics.totalSpent)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Package className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Hodnota zásob</p>
                            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analytics.inventoryValue)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="w-8 h-8 text-orange-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Nízke zásoby</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.lowStockItems}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <ShoppingCart className="w-8 h-8 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Čakajúce objednávky</p>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.pendingOrders}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Suppliers */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Najlepší dodávatelia</h3>
                      <div className="space-y-4">
                        {analytics.topSuppliers.map((supplier, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                                <p className="text-xs text-gray-500">{supplier.percentage.toFixed(1)}% z celkových výdavkov</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{formatCurrency(supplier.spent)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priemerný čas dodania</h3>
                        <div className="flex items-center">
                          <Clock className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">{analytics.averageDeliveryTime} dni</p>
                            <p className="text-sm text-gray-500">Priemerný čas od objednávky po dodanie</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Úspory nákladov</h3>
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analytics.costSavings)}</p>
                            <p className="text-sm text-gray-500">Celkové úspory z optimalizácie</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
