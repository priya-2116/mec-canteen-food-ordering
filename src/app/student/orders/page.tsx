"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useOrders } from '@/lib/orders-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

export default function StudentOrdersPage() {
  const { user } = useAuth();
  const { getStudentOrders } = useOrders();
  const router = useRouter();

  if (!user) {
    router.push('/student/login');
    return null;
  }

  const orders = getStudentOrders(user.id);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: 'secondary', icon: Clock, label: 'Pending' },
      accepted: { variant: 'default', icon: CheckCircle, label: 'Accepted' },
      preparing: { variant: 'default', icon: Package, label: 'Preparing' },
      ready: { variant: 'default', icon: CheckCircle, label: 'Ready' },
      completed: { variant: 'default', icon: CheckCircle, label: 'Completed' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-orange-600">My Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button onClick={() => router.push('/menu')} className="bg-orange-500 hover:bg-orange-600">
                Start Ordering
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                          {item.customizations && item.customizations.length > 0 && (
                            <span className="text-muted-foreground text-xs ml-1">
                              ({item.customizations.join(', ')})
                            </span>
                          )}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{order.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <Badge variant="outline" className="uppercase">{order.paymentMethod}</Badge>
                  </div>
                  {order.preparationTime && (
                    <div className="bg-blue-50 p-3 rounded-md text-sm">
                      <p className="font-semibold text-blue-900">Preparation Time: {order.preparationTime} minutes</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
