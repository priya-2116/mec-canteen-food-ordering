"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, MapPin, Clock, Sparkles, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import { menuItems } from '@/lib/menu-data';

export default function HomePage() {
  const router = useRouter();
  const comboOffers = menuItems.filter(item => item.isCombo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <UtensilsCrossed className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Madras Engineering College
            </h1>
            <p className="text-2xl md:text-3xl mb-8 font-semibold">Canteen Online Ordering</p>
            <p className="text-lg mb-8 text-white/90">
              Order delicious meals from your campus canteen. Fast, convenient, and contactless!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6"
                onClick={() => router.push('/student/register')}
              >
                <Users className="w-5 h-5 mr-2" />
                Student Sign Up
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
                onClick={() => router.push('/student/login')}
              >
                Student Login
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
                onClick={() => router.push('/admin/login')}
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Timing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="w-6 h-6 text-orange-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Main Campus Canteen</p>
                <p className="font-semibold">Madras Engineering College</p>
                <p className="text-sm text-muted-foreground">
                  Near Central Block, Ground Floor
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Chennai, Tamil Nadu
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="w-6 h-6 text-orange-600" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Breakfast:</span>
                  <span className="text-muted-foreground">7:00 AM - 10:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Lunch:</span>
                  <span className="text-muted-foreground">12:00 PM - 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Snacks:</span>
                  <span className="text-muted-foreground">3:00 PM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Dinner:</span>
                  <span className="text-muted-foreground">6:00 PM - 9:00 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Combo Offers */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-4xl font-bold text-gray-900">Special Combo Offers</h2>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-lg text-muted-foreground">Save more with our exclusive combo deals!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comboOffers.map((combo) => (
              <Card key={combo.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-purple-200">
                <div className="relative h-48">
                  <Image
                    src={combo.image}
                    alt={combo.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-purple-600 text-white">
                    COMBO DEAL
                  </Badge>
                  <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                    SAVE ₹{combo.originalPrice! - combo.price}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{combo.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{combo.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">₹{combo.price}</span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 font-semibold text-lg px-8 py-6"
              onClick={() => router.push('/student/login')}
            >
              Order Now & Save!
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Order Online?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 border-2 hover:border-orange-300 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Save Time</h3>
              <p className="text-muted-foreground">
                Skip the queue! Order in advance and pick up when ready.
              </p>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-orange-300 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <UtensilsCrossed className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Customize Your Meal</h3>
              <p className="text-muted-foreground">
                Add extra toppings, choose your preferences - make it your way!
              </p>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-orange-300 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">Special Deals</h3>
              <p className="text-muted-foreground">
                Exclusive combo offers and discounts only for online orders!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Multiple Payment Options</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Pay your way - we support cash, Google Pay, and QR code scanning!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="text-lg px-6 py-3 bg-orange-500">💵 Cash on Pickup</Badge>
              <Badge className="text-lg px-6 py-3 bg-blue-500">📱 Google Pay</Badge>
              <Badge className="text-lg px-6 py-3 bg-purple-500">📲 QR Code</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of students ordering delicious meals every day!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6"
              onClick={() => router.push('/student/register')}
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
              onClick={() => router.push('/menu')}
            >
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="w-6 h-6" />
            <p className="font-semibold text-lg">MEC Canteen Online</p>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Madras Engineering College. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}