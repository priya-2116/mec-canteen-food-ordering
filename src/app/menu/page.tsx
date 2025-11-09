"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { menuItems, MenuItem } from '@/lib/menu-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Leaf, Drumstick, LogOut, User, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function MenuPage() {
  const { user, logout } = useAuth();
  const { addToCart, itemCount } = useCart();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'breakfast' | 'lunch' | 'snacks' | 'dinner'>('all');
  const [filterVeg, setFilterVeg] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  if (!user) {
    router.push('/student/login');
    return null;
  }

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterVeg && !item.isVeg) return false;
    return true;
  });

  const handleAddToCart = (item: MenuItem, customizations?: string[]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      isVeg: item.isVeg,
      customizations,
    });
    setSelectedItem(null);
    setSelectedCustomizations([]);
  };

  const openCustomizationDialog = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setSelectedItem(item);
      setSelectedCustomizations([]);
    } else {
      handleAddToCart(item);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-orange-600">MEC Canteen</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                  {itemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/student/orders')}
            >
              <ShoppingBag className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="snacks">Snacks</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant={filterVeg ? "default" : "outline"}
            onClick={() => setFilterVeg(!filterVeg)}
            className={filterVeg ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Leaf className="w-4 h-4 mr-2" />
            Veg Only
          </Button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.isCombo && (
                  <Badge className="absolute top-2 left-2 bg-purple-600">
                    COMBO OFFER
                  </Badge>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg">
                      Not Available
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {item.name}
                      {item.isVeg ? (
                        <Leaf className="w-4 h-4 text-green-600" />
                      ) : (
                        <Drumstick className="w-4 h-4 text-red-600" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() => openCustomizationDialog(item)}
                    disabled={!item.available}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Customization Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize {selectedItem?.name}</DialogTitle>
            <DialogDescription>Select your customization options</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem?.customizations?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedCustomizations.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCustomizations([...selectedCustomizations, option]);
                    } else {
                      setSelectedCustomizations(selectedCustomizations.filter(c => c !== option));
                    }
                  }}
                />
                <Label htmlFor={option} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => selectedItem && handleAddToCart(selectedItem, selectedCustomizations)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}