import { useState } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState<any[]>([]);
  
  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return prev;
        }
      }
      
      return product.stock > 0 ? [...prev, { ...product, quantity: 1 }] : prev;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ).filter(i => i.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  };
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    total, 
    itemCount, 
    clearCart 
  };
};