import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'framer-motion';
import { ChefHat, MapPin, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MenuView = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchMenuData();
  }, [menuId]);

  const fetchMenuData = async () => {
    try {
      const [menuRes, dishesRes] = await Promise.all([
        axios.get(`${API}/menus/${menuId}`),
        axios.get(`${API}/dishes/${menuId}`)
      ]);
      setMenu(menuRes.data);
      setDishes(dishesRes.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(dishes.map(d => d.category))];
  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(d => d.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFF8F3]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF6B6B] animate-spin mx-auto mb-4" />
          <p className="text-[#6B5B50]">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFF8F3]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2C1810] mb-2">Menu not found</h2>
          <Button onClick={() => navigate('/')} className="bg-[#FF6B6B] hover:bg-[#E85555] text-white">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${menu.theme_color}15, #FFF8F3, ${menu.theme_color}10)`
      }}
    >
      {/* Header */}
      <div 
        className="relative bg-white shadow-lg"
        style={{ borderBottom: `4px solid ${menu.theme_color}` }}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-4"
            data-testid="back-home-from-menu-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-start gap-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: menu.theme_color }}
            >
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C1810] mb-2" data-testid="menu-cafe-name">
                {menu.cafe_name}
              </h1>
              {menu.cafe_description && (
                <p className="text-lg text-[#6B5B50] max-w-2xl" data-testid="menu-cafe-description">
                  {menu.cafe_description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Category Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize px-6 py-2 rounded-full data-[state=active]:text-white"
                    style={{
                      backgroundColor: selectedCategory === category ? menu.theme_color : 'transparent',
                      color: selectedCategory === category ? 'white' : '#6B5B50'
                    }}
                    data-testid={`category-${category}`}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Dishes Grid */}
          {filteredDishes.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-[#6B5B50]">No dishes in this category yet</p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-2xl transition-all h-full"
                    data-testid={`menu-dish-${index}`}
                  >
                    {dish.image_url && (
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={dish.image_url} 
                          alt={dish.name}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div 
                          className="absolute bottom-3 right-3 px-4 py-2 rounded-full font-bold text-lg text-white shadow-lg"
                          style={{ backgroundColor: menu.theme_color }}
                        >
                          ${dish.price.toFixed(2)}
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6 space-y-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#2C1810] mb-1">{dish.name}</h3>
                        <p 
                          className="text-sm font-medium"
                          style={{ color: menu.theme_color }}
                        >
                          {dish.category}
                        </p>
                      </div>
                      {dish.description && (
                        <p className="text-[#6B5B50] leading-relaxed">{dish.description}</p>
                      )}
                      {!dish.image_url && (
                        <div 
                          className="text-3xl font-bold mt-4"
                          style={{ color: menu.theme_color }}
                        >
                          ${dish.price.toFixed(2)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 border-t-4" style={{ borderColor: menu.theme_color }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-6 h-6" style={{ color: menu.theme_color }} />
            <p className="text-[#6B5B50]">Powered by <span className="font-bold text-gradient">SavoroAI</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuView;