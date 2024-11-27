// src/App.js

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; // Import your navigation setup
// import 'nativewind/tailwind.css'; // Import the Tailwind styles
import { CartProvider } from './src/contexts/CartContext';
import { FavouritesProvider } from './src/contexts/FavouritesContext';


const App = () => {
  return (
    <FavouritesProvider>
      <CartProvider>
          <AppNavigator />
      </CartProvider>
    </FavouritesProvider>
  );
};

export default App;
