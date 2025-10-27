import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon,
  QrCode,
  Loader2,
  ArrowLeft,
  Save
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreateMenu = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState({
    cafe_name: '',
    cafe_description: '',
    theme_color: '#FF6B6B'
  });
  const [menuId, setMenuId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [showDishDialog, setShowDishDialog] = useState(false);
  const [currentDish, setCurrentDish] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Appetizer',
    image_url: ''
  });
  const [generatingAI, setGeneratingAI] = useState({ description: false, image: false });
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCode, setQRCode] = useState(null);

  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Special'];

  const handleCreateMenu = async () => {
    if (!menuData.cafe_name.trim()) {
      toast.error('Please enter café name');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/menus`, menuData);
      setMenuId(response.data.id);
      setStep(2);
      toast.success('Menu created! Now add your dishes');
    } catch (error) {
      console.error('Error creating menu:', error);
      toast.error('Failed to create menu');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!currentDish.name.trim()) {
      toast.error('Please enter dish name first');
      return;
    }
    
    setGeneratingAI({ ...generatingAI, description: true });
    try {
      const response = await axios.post(`${API}/generate-description`, {
        dish_name: currentDish.name,
        category: currentDish.category
      });
      setCurrentDish({ ...currentDish, description: response.data.description });
      toast.success('Description generated!');
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description');
    } finally {
      setGeneratingAI({ ...generatingAI, description: false });
    }
  };

  const handleGenerateImage = async () => {
    if (!currentDish.name.trim()) {
      toast.error('Please enter dish name first');
      return;
    }
    
    setGeneratingAI({ ...generatingAI, image: true });
    try {
      const response = await axios.post(`${API}/generate-image`, {
        dish_name: currentDish.name,
        description: currentDish.description || `A delicious ${currentDish.name}`
      });
      setCurrentDish({ ...currentDish, image_url: response.data.image_url });
      toast.success('Image generated!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setGeneratingAI({ ...generatingAI, image: false });
    }
  };

  const handleAddDish = async () => {
    if (!currentDish.name.trim() || !currentDish.price) {
      toast.error('Please fill in dish name and price');
      return;
    }
    
    setLoading(true);
    try {
      const dishData = {
        menu_id: menuId,
        ...currentDish,
        price: parseFloat(currentDish.price)
      };
      const response = await axios.post(`${API}/dishes`, dishData);
      setDishes([...dishes, response.data]);
      setShowDishDialog(false);
      setCurrentDish({
        name: '',
        description: '',
        price: '',
        category: 'Appetizer',
        image_url: ''
      });
      toast.success('Dish added successfully!');
    } catch (error) {
      console.error('Error adding dish:', error);
      toast.error('Failed to add dish');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await axios.delete(`${API}/dishes/${dishId}`);
      setDishes(dishes.filter(d => d.id !== dishId));
      toast.success('Dish deleted');
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Failed to delete dish');
    }
  };

  const handleGenerateQR = async () => {
    if (dishes.length === 0) {
      toast.error('Please add at least one dish before generating QR code');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${API}/qr/${menuId}`);
      setQRCode(response.data);
      setShowQRDialog(true);
      toast.success('QR Code generated!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.download = `${menuData.cafe_name}-menu-qr.png`;
      link.href = qrCode.qr_code;
      link.click();
      toast.success('QR Code downloaded!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFF8F3]">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-[#FF6B6B]" />
              <h1 className="text-3xl font-bold text-gradient">SavoroAI</h1>
            </div>
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              className="flex items-center gap-2"
              data-testid="back-home-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Step 1: Create Menu */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-bold text-[#2C1810]">
                  Create Your Café Menu
                </CardTitle>
                <CardDescription className="text-base">
                  Let's start by setting up your café's digital menu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cafe-name" className="text-base font-medium">Café Name *</Label>
                  <Input
                    id="cafe-name"
                    data-testid="cafe-name-input"
                    placeholder="Enter your café name"
                    value={menuData.cafe_name}
                    onChange={(e) => setMenuData({ ...menuData, cafe_name: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cafe-description" className="text-base font-medium">Café Description</Label>
                  <Textarea
                    id="cafe-description"
                    data-testid="cafe-description-input"
                    placeholder="Tell us about your café..."
                    value={menuData.cafe_description}
                    onChange={(e) => setMenuData({ ...menuData, cafe_description: e.target.value })}
                    rows={4}
                    className="text-base resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme-color" className="text-base font-medium">Theme Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="theme-color"
                      data-testid="theme-color-input"
                      type="color"
                      value={menuData.theme_color}
                      onChange={(e) => setMenuData({ ...menuData, theme_color: e.target.value })}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      value={menuData.theme_color}
                      onChange={(e) => setMenuData({ ...menuData, theme_color: e.target.value })}
                      className="h-12 flex-1"
                      placeholder="#FF6B6B"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleCreateMenu}
                  disabled={loading}
                  className="w-full h-12 bg-[#FF6B6B] hover:bg-[#E85555] text-white text-base font-semibold"
                  data-testid="create-menu-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Continue to Add Dishes
                      <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Add Dishes */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#2C1810]">{menuData.cafe_name}</h2>
                <p className="text-[#6B5B50] mt-1">Add dishes to your menu</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDishDialog(true)}
                  className="bg-[#FF6B6B] hover:bg-[#E85555] text-white"
                  data-testid="add-dish-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Dish
                </Button>
                <Button
                  onClick={handleGenerateQR}
                  disabled={loading || dishes.length === 0}
                  className="bg-[#2C1810] hover:bg-[#3C2820] text-white"
                  data-testid="generate-qr-btn"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <QrCode className="w-4 h-4 mr-2" />
                  )}
                  Generate QR Code
                </Button>
              </div>
            </div>

            {dishes.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-[#FFF8F3] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-10 h-10 text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2C1810] mb-2">No dishes yet</h3>
                <p className="text-[#6B5B50] mb-6">Start by adding your first dish</p>
                <Button
                  onClick={() => setShowDishDialog(true)}
                  className="bg-[#FF6B6B] hover:bg-[#E85555] text-white"
                  data-testid="add-first-dish-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Dish
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dishes.map((dish, index) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all" data-testid={`dish-card-${index}`}>
                      {dish.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={dish.image_url} 
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-[#FF6B6B]">
                            ${dish.price}
                          </div>
                        </div>
                      )}
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-[#2C1810]">{dish.name}</h3>
                            <p className="text-xs text-[#FF6B6B] font-medium">{dish.category}</p>
                          </div>
                          <Button
                            onClick={() => handleDeleteDish(dish.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            data-testid={`delete-dish-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {dish.description && (
                          <p className="text-sm text-[#6B5B50] line-clamp-2">{dish.description}</p>
                        )}
                        {!dish.image_url && (
                          <div className="text-2xl font-bold text-[#FF6B6B]">${dish.price}</div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Add Dish Dialog */}
      <Dialog open={showDishDialog} onOpenChange={setShowDishDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Dish</DialogTitle>
            <DialogDescription>
              Fill in the details or use AI to generate content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dish-name">Dish Name *</Label>
              <Input
                id="dish-name"
                data-testid="dish-name-input"
                placeholder="e.g., Margherita Pizza"
                value={currentDish.name}
                onChange={(e) => setCurrentDish({ ...currentDish, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={currentDish.category} 
                onValueChange={(value) => setCurrentDish({ ...currentDish, category: value })}
              >
                <SelectTrigger data-testid="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                data-testid="dish-price-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={currentDish.price}
                onChange={(e) => setCurrentDish({ ...currentDish, price: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Description</Label>
                <Button
                  onClick={handleGenerateDescription}
                  disabled={generatingAI.description}
                  variant="outline"
                  size="sm"
                  className="text-[#FF6B6B] border-[#FF6B6B]"
                  data-testid="generate-description-btn"
                >
                  {generatingAI.description ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="description"
                data-testid="dish-description-input"
                placeholder="Describe your dish..."
                value={currentDish.description}
                onChange={(e) => setCurrentDish({ ...currentDish, description: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Dish Image</Label>
                <Button
                  onClick={handleGenerateImage}
                  disabled={generatingAI.image}
                  variant="outline"
                  size="sm"
                  className="text-[#FF6B6B] border-[#FF6B6B]"
                  data-testid="generate-image-btn"
                >
                  {generatingAI.image ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
              {currentDish.image_url && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[#FF6B6B]/20">
                  <img 
                    src={currentDish.image_url} 
                    alt="Dish preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowDishDialog(false)}
                variant="outline"
                className="flex-1"
                data-testid="cancel-dish-btn"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddDish}
                disabled={loading}
                className="flex-1 bg-[#FF6B6B] hover:bg-[#E85555] text-white"
                data-testid="save-dish-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Dish
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Your Menu QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view your menu
            </DialogDescription>
          </DialogHeader>
          {qrCode && (
            <div className="space-y-4 py-4">
              <div className="bg-white p-6 rounded-lg border-2 border-[#FF6B6B]/20 flex justify-center" data-testid="qr-code-display">
                <img src={qrCode.qr_code} alt="Menu QR Code" className="w-64 h-64" />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B5B50] mb-2">Menu URL:</p>
                <p className="text-xs text-[#2C1810] font-mono bg-[#FFF8F3] p-2 rounded break-all">
                  {qrCode.menu_url}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadQR}
                  className="flex-1 bg-[#FF6B6B] hover:bg-[#E85555] text-white"
                  data-testid="download-qr-btn"
                >
                  Download QR Code
                </Button>
                <Button
                  onClick={() => navigate(`/menu/${menuId}`)}
                  variant="outline"
                  className="flex-1"
                  data-testid="view-menu-btn"
                >
                  View Menu
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateMenu;