"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/lib/orders-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Minus, Plus, Trash2, CreditCard, Smartphone, QrCode } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CartPage() {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'gpay' | 'cash' | 'qr'>('cash');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!user) {
    router.push('/student/login');
    return null;
  }

  const handleCheckout = () => {
    if (items.length === 0) return;

    const newOrderId = addOrder({
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      studentRollNumber: user.rollNumber,
      items: items,
      total: total,
      paymentMethod: paymentMethod,
      status: 'pending',
    });

    setOrderId(newOrderId);
    clearCart();
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-orange-600">Your Cart</h1>
            <p className="text-sm text-muted-foreground">{items.length} items</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => router.push('/menu')} className="bg-orange-500 hover:bg-orange-600">
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                        {item.customizations && item.customizations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customizations.map((custom) => (
                              <Badge key={custom} variant="outline" className="text-xs">
                                {custom}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (5%)</span>
                      <span>₹{(total * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">₹{(total * 1.05).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                      <div className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="w-4 h-4" />
                          Cash on Delivery
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="gpay" id="gpay" />
                        <Label htmlFor="gpay" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Smartphone className="w-4 h-4" />
                          Google Pay
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-md">
                        <RadioGroupItem value="qr" id="qr" />
                        <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer flex-1">
                          <QrCode className="w-4 h-4" />
                          QR Code
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={handleCheckout}
                  >
                    Place Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-green-600">Order Placed!</DialogTitle>
            <DialogDescription className="text-center">
              Your order has been successfully placed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-green-50 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="text-2xl font-bold text-green-600">{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You will receive a notification once your order is accepted by the canteen staff.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowConfirmation(false);
                  router.push('/menu');
                }}
              >
                Continue Ordering
              </Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setShowConfirmation(false);
                  router.push('/student/orders');
                }}
              >
                View Orders
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
