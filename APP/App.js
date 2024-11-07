// src/App.js

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; // Import your navigation setup
// import 'nativewind/tailwind.css'; // Import the Tailwind styles
import { CartProvider } from './src/contexts/CartContext';;

const App = () => {
  return (
      <CartProvider>
          <AppNavigator />
      </CartProvider>
  );
};

export default App;
