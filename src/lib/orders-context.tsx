"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './cart-context';

export type Order = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNumber?: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'gpay' | 'cash' | 'qr';
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
  preparationTime?: number;
  createdAt: string;
  updatedAt: string;
};

type OrdersContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrderStatus: (id: string, status: Order['status'], preparationTime?: number) => void;
  getStudentOrders: (studentId: string) => Order[];
  getAllOrders: () => Order[];
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedOrders = localStorage.getItem('canteen_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('canteen_orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = (id: string, status: Order['status'], preparationTime?: number) => {
    setOrders(prev => prev.map(order => 
      order.id === id 
        ? { ...order, status, preparationTime, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const getStudentOrders = (studentId: string) => {
    return orders.filter(order => order.studentId === studentId);
  };

  const getAllOrders = () => {
    return orders;
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus, getStudentOrders, getAllOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}