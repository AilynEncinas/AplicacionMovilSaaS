import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  unreadCount: number;
  increment: (amount?: number) => void;
  reset: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const increment = (amount: number = 1) => setUnreadCount(prev => prev + amount);
  const reset = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, increment, reset }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  return context;
};