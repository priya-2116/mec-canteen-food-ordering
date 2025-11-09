"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useOrders, Order } from '@/lib/orders-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, Bell, CheckCircle, XCircle, Clock, FileText, AlertCircle, BellRing } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [preparationTime, setPreparationTime] = useState('');
  const [showInvoice, setShowInvoice] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null);
  const [previousPendingCount, setPreviousPendingCount] = useState(0);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  if (!user || user.role !== 'admin') {
    router.push('/admin/login');
    return null;
  }

  const allOrders = getAllOrders();
  const pendingOrders = allOrders.filter(o => o.status === 'pending');
  const activeOrders = allOrders.filter(o => ['accepted', 'preparing', 'ready'].includes(o.status));
  const completedOrders = allOrders.filter(o => o.status === 'completed');

  // Notification system for new orders
  useEffect(() => {
    if (pendingOrders.length > previousPendingCount && previousPendingCount > 0) {
      setShowNotificationAlert(true);
      // Play notification sound (browser will handle this)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzk77RgGwc2j9bxy3grBSh+zPLaizsKEl+16+ymVBIKR6Lh87NgGwU'); 
      audio.play().catch(() => {/* ignore */});
      
      setTimeout(() => setShowNotificationAlert(false), 5000);
    }
    setPreviousPendingCount(pendingOrders.length);
  }, [pendingOrders.length, previousPendingCount]);

  const handleAcceptOrder = (order: Order) => {
    setSelectedOrder(order);
    setPreparationTime('');
  };

  const confirmAcceptOrder = () => {
    if (selectedOrder && preparationTime) {
      updateOrderStatus(selectedOrder.id, 'accepted', parseInt(preparationTime));
      setSelectedOrder(null);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    setShowRejectDialog(orderId);
    setRejectReason('');
  };

  const confirmRejectOrder = () => {
    if (showRejectDialog) {
      updateOrderStatus(showRejectDialog, 'rejected');
      setShowRejectDialog(null);
      setRejectReason('');
    }
  };

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
  };

  const generateInvoice = (order: Order) => {
    setShowInvoice(order);
  };

  const printInvoice = () => {
    window.print();
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className={order.status === 'pending' ? 'border-orange-500 border-2 shadow-lg' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Order {order.id}
              {order.status === 'pending' && (
                <Badge className="bg-orange-500 animate-pulse">
                  <BellRing className="w-3 h-3 mr-1" />
                  NEW
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm font-semibold mt-1">{order.studentName}</p>
            <p className="text-xs text-muted-foreground">Roll: {order.studentRollNumber}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`uppercase ${
              order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
              order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
              order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
              order.status === 'ready' ? 'bg-green-100 text-green-700' :
              order.status === 'completed' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}
          >
            {order.status}
          </Badge>
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
        <div className="text-sm">
          <Badge variant="outline" className="uppercase">{order.paymentMethod}</Badge>
        </div>
        {order.preparationTime && (
          <div className="bg-blue-50 p-2 rounded text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <p>Prep Time: {order.preparationTime} min</p>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {order.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex-1"
                onClick={() => handleAcceptOrder(order)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => handleRejectOrder(order.id)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          {order.status === 'accepted' && (
            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => handleUpdateStatus(order.id, 'preparing')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Start Preparing
            </Button>
          )}
          {order.status === 'preparing' && (
            <Button
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => handleUpdateStatus(order.id, 'ready')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark as Ready
            </Button>
          )}
          {order.status === 'ready' && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleUpdateStatus(order.id, 'completed')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete Order
            </Button>
          )}
          {(order.status === 'completed' || order.status === 'ready') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateInvoice(order)}
            >
              <FileText className="w-4 h-4 mr-1" />
              Invoice
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Canteen Order Management</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className={`w-5 h-5 ${pendingOrders.length > 0 ? 'animate-bounce text-orange-500' : ''}`} />
              {pendingOrders.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 animate-pulse">
                  {pendingOrders.length}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* New Order Notification Banner */}
      {showNotificationAlert && (
        <div className="bg-orange-500 text-white py-3 px-4 flex items-center justify-center gap-2 animate-pulse">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">New Order Received! Check Pending Orders.</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className={pendingOrders.length > 0 ? 'border-orange-500 border-2' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Pending Orders
                {pendingOrders.length > 0 && <AlertCircle className="w-4 h-4 text-orange-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${pendingOrders.length > 0 ? 'text-orange-600 animate-pulse' : 'text-gray-400'}`}>
                {pendingOrders.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{activeOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedOrders.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <Badge className="ml-2 h-5 px-1.5 bg-orange-500">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <p className="text-muted-foreground">No pending orders - All caught up! 🎉</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <p className="text-sm font-semibold text-orange-800">
                      {pendingOrders.length} order{pendingOrders.length > 1 ? 's' : ''} awaiting verification
                    </p>
                  </div>
                </div>
                {pendingOrders.map(order => <OrderCard key={order.id} order={order} />)}
              </>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No active orders</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedOrders.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">No completed orders</p>
                </CardContent>
              </Card>
            ) : (
              completedOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allOrders.map(order => <OrderCard key={order.id} order={order} />)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Accept Order Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Accept Order - {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Verify order details and set preparation time
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedOrder && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div><strong>Student:</strong> {selectedOrder.studentName}</div>
                <div><strong>Items:</strong></div>
                <ul className="ml-4 list-disc">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>{item.name} x {item.quantity}</li>
                  ))}
                </ul>
                <div><strong>Total:</strong> ₹{selectedOrder.total}</div>
                <div><strong>Payment:</strong> {selectedOrder.paymentMethod.toUpperCase()}</div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="prepTime">Preparation Time (minutes) *</Label>
              <Input
                id="prepTime"
                type="number"
                placeholder="e.g., 15"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                min="1"
                max="120"
              />
              <p className="text-xs text-muted-foreground">Student will be notified of the estimated time</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={confirmAcceptOrder}
                disabled={!preparationTime || parseInt(preparationTime) <= 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm & Accept
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={!!showRejectDialog} onOpenChange={(open) => !open && setShowRejectDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Reject Order
            </DialogTitle>
            <DialogDescription>
              Please confirm order rejection. Student will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action will cancel the order and notify the student.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Reason for Rejection (Optional)</Label>
              <Textarea
                id="rejectReason"
                placeholder="e.g., Item not available, Kitchen closed, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowRejectDialog(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmRejectOrder}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={!!showInvoice} onOpenChange={(open) => !open && setShowInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Invoice</DialogTitle>
          </DialogHeader>
          {showInvoice && (
            <div className="space-y-6 print:p-8" id="invoice">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold">Madras Engineering College</h2>
                <p className="text-sm text-muted-foreground">Canteen Invoice</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Order ID:</p>
                  <p>{showInvoice.id}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p>{new Date(showInvoice.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Student Name:</p>
                  <p>{showInvoice.studentName}</p>
                </div>
                <div>
                  <p className="font-semibold">Roll Number:</p>
                  <p>{showInvoice.studentRollNumber}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showInvoice.items.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">₹{item.price}</td>
                        <td className="text-right">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan={3} className="text-right py-2">Total:</td>
                      <td className="text-right py-2">₹{showInvoice.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Thank you for your order!</p>
              </div>

              <Button onClick={printInvoice} className="w-full print:hidden">
                Print Invoice
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}