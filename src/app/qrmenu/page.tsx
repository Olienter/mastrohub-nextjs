'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import UnifiedHeader from '@/components/layout/UnifiedHeader';
import Button from '@/components/ui/Button';
import { 
  QrCode, 
  Download, 
  Settings, 
  Eye, 
  Share2, 
  Copy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Users,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Palette,
  Image,
  FileImage,
  FileText,
  FileDown
} from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeData {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  scans: number;
  lastScanned?: Date;
  isActive: boolean;
  description?: string;
  tags?: string[];
  menuId?: string; // Connection with Menu Maker
  customization?: {
    foregroundColor: string;
    backgroundColor: string;
    size: number;
    logo?: string;
    format: 'png' | 'svg' | 'pdf';
  };
}

interface QRCodeCustomization {
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  logo?: string;
  format: 'png' | 'svg' | 'pdf';
}

export default function QRMenuPage() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCodeData | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customization, setCustomization] = useState<QRCodeCustomization>({
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    size: 300,
    format: 'png'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockQRCodes: QRCodeData[] = [
      {
        id: '1',
        name: 'Main Menu - Restaurant XYZ',
        url: 'https://mastrohub.com/menu/restaurant-xyz',
        createdAt: new Date(),
        scans: 156,
        lastScanned: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isActive: true,
        description: 'Main restaurant menu with complete offerings',
        tags: ['main menu', 'complete offerings'],
        menuId: 'menu-1',
        customization: {
          foregroundColor: '#1F2937',
          backgroundColor: '#FFFFFF',
          size: 300,
          format: 'png'
        }
      },
      {
        id: '2',
        name: 'Daily Menu - Monday',
        url: 'https://mastrohub.com/menu/daily-monday',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        scans: 89,
        lastScanned: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isActive: true,
        description: 'Daily menu for Monday with special offers',
        tags: ['daily menu', 'special offers'],
        menuId: 'menu-2',
        customization: {
          foregroundColor: '#059669',
          backgroundColor: '#FFFFFF',
          size: 300,
          format: 'png'
        }
      },
      {
        id: '3',
        name: 'Vegan Menu',
        url: 'https://mastrohub.com/menu/vegan-options',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        scans: 45,
        isActive: false,
        description: 'Special vegan menu for customers',
        tags: ['vegan', 'special'],
        menuId: 'menu-3',
        customization: {
          foregroundColor: '#DC2626',
          backgroundColor: '#FFFFFF',
          size: 300,
          format: 'png'
        }
      }
    ];
    setQrCodes(mockQRCodes);
  }, []);

  // Filtering and search
  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qr.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && qr.isActive) ||
                         (filter === 'inactive' && !qr.isActive);
    return matchesSearch && matchesFilter;
  });

  const generateQRCode = async (url: string, customOptions?: QRCodeCustomization) => {
    setIsGenerating(true);
    try {
      const options = customOptions || selectedQR?.customization || {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        size: 300,
        format: 'png'
      };

      const qrDataUrl = await QRCode.toDataURL(url, {
        width: options.size,
        margin: 2,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor
        }
      });
      setQrImageUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrImageUrl) {
      const link = document.createElement('a');
      link.href = qrImageUrl;
      link.download = `qr-code-${selectedQR?.name || 'menu'}.${selectedQR?.customization?.format || 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyURL = async () => {
    if (selectedQR) {
      try {
        await navigator.clipboard.writeText(selectedQR.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying:', error);
      }
    }
  };

  const createNewQRCode = () => {
    const newQR: QRCodeData = {
      id: Date.now().toString(),
      name: `New QR Code - ${new Date().toLocaleDateString()}`,
      url: `https://mastrohub.com/menu/${user?.id || 'user'}-${Date.now()}`,
      createdAt: new Date(),
      scans: 0,
      isActive: true,
      description: 'New QR code for your menu',
      customization: {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        size: 300,
        format: 'png'
      }
    };
    setQrCodes(prev => [newQR, ...prev]);
    setSelectedQR(newQR);
    generateQRCode(newQR.url);
  };

  const createQRFromMenu = () => {
    // Simulation of creating QR code from Menu Maker data
    const menuQR: QRCodeData = {
      id: Date.now().toString(),
      name: 'Menu from Menu Maker',
      url: `https://mastrohub.com/menu/${user?.id || 'user'}-menu-maker-${Date.now()}`,
      createdAt: new Date(),
      scans: 0,
      isActive: true,
      description: 'QR code created from Menu Maker data',
      menuId: 'menu-maker-integration',
      customization: {
        foregroundColor: '#1F2937',
        backgroundColor: '#FFFFFF',
        size: 300,
        format: 'png'
      }
    };
    setQrCodes(prev => [menuQR, ...prev]);
    setSelectedQR(menuQR);
    generateQRCode(menuQR.url);
  };

  const editQRCode = (qr: QRCodeData) => {
    setEditingQR(qr);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editingQR) {
      setQrCodes(prev => prev.map(qr => 
        qr.id === editingQR.id ? editingQR : qr
      ));
      if (selectedQR?.id === editingQR.id) {
        setSelectedQR(editingQR);
      }
      setShowEditModal(false);
      setEditingQR(null);
    }
  };

  const deleteQRCode = (qrId: string) => {
    if (confirm('Are you sure you want to delete this QR code?')) {
      setQrCodes(prev => prev.filter(qr => qr.id !== qrId));
      if (selectedQR?.id === qrId) {
        setSelectedQR(null);
        setQrImageUrl('');
      }
    }
  };

  const toggleQRStatus = (qrId: string) => {
    setQrCodes(prev => prev.map(qr => 
      qr.id === qrId ? { ...qr, isActive: !qr.isActive } : qr
    ));
  };

  const openCustomizationModal = () => {
    if (selectedQR) {
      setCustomization(selectedQR.customization || {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        size: 300,
        format: 'png'
      });
      setShowCustomizationModal(true);
    }
  };

  const saveCustomization = () => {
    if (selectedQR) {
      const updatedQR = {
        ...selectedQR,
        customization: customization
      };
      setQrCodes(prev => prev.map(qr => 
        qr.id === selectedQR.id ? updatedQR : qr
      ));
      setSelectedQR(updatedQR);
      generateQRCode(updatedQR.url, customization);
      setShowCustomizationModal(false);
    }
  };

  // Header actions
  const headerActions = (
    <>
      <Button
        onClick={createNewQRCode}
        icon={Plus}
        size="sm"
      >
        Create New QR
      </Button>
      <Button
        onClick={createQRFromMenu}
        icon={QrCode}
        variant="secondary"
        size="sm"
      >
        QR from Menu
      </Button>
    </>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Unified Header */}
        <UnifiedHeader
          title="QR Menu"
          subtitle="Create and manage QR codes for your menus"
          toolName="QR Menu"
          userInfo={user?.email}
          notifications={4}
          rightActions={headerActions}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - QR codes list */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
                {/* Search and filters */}
                <div className="mb-6">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search QR codes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setFilter('all')}
                      variant={filter === 'all' ? 'primary' : 'ghost'}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => setFilter('active')}
                      variant={filter === 'active' ? 'primary' : 'ghost'}
                      size="sm"
                    >
                      Active
                    </Button>
                    <Button
                      onClick={() => setFilter('inactive')}
                      variant={filter === 'inactive' ? 'primary' : 'ghost'}
                      size="sm"
                    >
                      Inactive
                    </Button>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your QR Codes ({filteredQRCodes.length})
                </h2>
                
                <div className="space-y-3">
                  {filteredQRCodes.map((qr) => (
                    <div
                      key={qr.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedQR?.id === qr.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => {
                            setSelectedQR(qr);
                            generateQRCode(qr.url, qr.customization);
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                              qr.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {qr.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {qr.description && (
                            <p className="text-sm text-gray-600 mb-2 truncate">{qr.description}</p>
                          )}
                          <p className="text-sm text-gray-500 mb-2">
                            Created: {qr.createdAt.toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Eye className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{qr.scans} scans</span>
                            </span>
                            {qr.lastScanned && (
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{new Date(qr.lastScanned).toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>
                          {qr.tags && qr.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {qr.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded truncate">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              editQRCode(qr);
                            }}
                            variant="ghost"
                            size="sm"
                            icon={Edit}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleQRStatus(qr.id);
                            }}
                            variant="ghost"
                            size="sm"
                            icon={qr.isActive ? TrendingDown : TrendingUp}
                          >
                            {qr.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQRCode(qr.id);
                            }}
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - QR code preview and settings */}
            <div className="lg:col-span-2">
              {selectedQR ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedQR.name}</h2>
                      <p className="text-gray-600 mt-1">URL: {selectedQR.url}</p>
                      {selectedQR.description && (
                        <p className="text-gray-500 mt-1">{selectedQR.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        onClick={copyURL}
                        variant="ghost"
                        size="sm"
                        icon={copied ? CheckCircle : Copy}
                      >
                        {copied ? 'Copied' : 'Copy URL'}
                      </Button>
                      <Button
                        onClick={downloadQRCode}
                        variant="ghost"
                        size="sm"
                        icon={Download}
                      >
                        Download
                      </Button>
                      <Button
                        onClick={openCustomizationModal}
                        variant="ghost"
                        size="sm"
                        icon={Palette}
                      >
                        Customize
                      </Button>
                      <Button
                        onClick={() => editQRCode(selectedQR)}
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* QR code preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-50 rounded-lg p-8 mb-4">
                        {isGenerating ? (
                          <div className="flex items-center justify-center w-64 h-64">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                          </div>
                        ) : qrImageUrl ? (
                          <img 
                            src={qrImageUrl} 
                            alt="QR code" 
                            className="w-64 h-64 object-contain"
                          />
                        ) : (
                          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Scan this QR code</p>
                        <p className="text-xs text-gray-500">Customers will see your menu</p>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Statistics</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-blue-900">{selectedQR.scans}</span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">Total scans</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            <span className="font-semibold text-green-900">
                              {selectedQR.lastScanned ? 'Active' : 'None'}
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">Last scan</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Devices</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Smartphone className="w-4 h-4 text-gray-500" />
                            <span>Mobile devices: 65%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Tablet className="w-4 h-4 text-gray-500" />
                            <span>Tablets: 20%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Monitor className="w-4 h-4 text-gray-500" />
                            <span>Desktop: 15%</span>
                          </div>
                        </div>
                      </div>

                      {selectedQR.menuId && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Menu Maker Connection</h4>
                          <p className="text-sm text-blue-700">
                            This QR code is connected to menu ID: {selectedQR.menuId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-12 text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select QR Code
                  </h3>
                  <p className="text-gray-600">
                    Select a QR code from the left side or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit QR Code</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingQR.name}
                    onChange={(e) => setEditingQR({...editingQR, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingQR.description || ''}
                    onChange={(e) => setEditingQR({...editingQR, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={editingQR.url}
                    onChange={(e) => setEditingQR({...editingQR, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingQR.isActive}
                    onChange={(e) => setEditingQR({...editingQR, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={saveEdit}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingQR(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Customization Modal */}
        {showCustomizationModal && selectedQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize QR Code</h3>
              
              <div className="space-y-6">
                {/* Colors */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foreground Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customization.foregroundColor}
                          onChange={(e) => setCustomization({...customization, foregroundColor: e.target.value})}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={customization.foregroundColor}
                          onChange={(e) => setCustomization({...customization, foregroundColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customization.backgroundColor}
                          onChange={(e) => setCustomization({...customization, backgroundColor: e.target.value})}
                          className="w-12 h-10 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={customization.backgroundColor}
                          onChange={(e) => setCustomization({...customization, backgroundColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size: {customization.size}px
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="50"
                    value={customization.size}
                    onChange={(e) => setCustomization({...customization, size: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>200px</span>
                    <span>600px</span>
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['png', 'svg', 'pdf'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setCustomization({...customization, format})}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          customization.format === format
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {format === 'png' && <FileImage className="w-4 h-4" />}
                          {format === 'svg' && <FileText className="w-4 h-4" />}
                          {format === 'pdf' && <FileDown className="w-4 h-4" />}
                          {format.toUpperCase()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload your restaurant logo to embed in QR code
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                    <div className="w-32 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <QrCode className="w-20 h-20" style={{ color: customization.foregroundColor }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={saveCustomization}
                  className="flex-1"
                >
                  Apply Changes
                </Button>
                <Button
                  onClick={() => setShowCustomizationModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
