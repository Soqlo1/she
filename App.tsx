import React, { useEffect } from 'react';
import HomeScreen from './HomeScreen';

export default function App() {
  useEffect(() => {
    // Инициализация Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram) {
      window.Telegram.WebApp.ready();
      
      // Настраиваем цвета в соответствии с темой Telegram
      document.body.style.backgroundColor = 
        window.Telegram.WebApp.colorScheme === 'dark' ? '#1f1f1f' : '#ffffff';
    }
  }, []);

  return <HomeScreen />;
}