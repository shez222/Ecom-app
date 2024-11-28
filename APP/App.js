// src/App.js

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator'; // Import your navigation setup
// import 'nativewind/tailwind.css'; // Import the Tailwind styles
import { CartProvider } from './src/contexts/CartContext';
import { FavouritesProvider } from './src/contexts/FavouritesContext';
import { UserProvider as UserContextProvider } from './src/contexts/UserContext';


const App = () => {
  return (
    <UserContextProvider>
      <FavouritesProvider>
        <CartProvider>
            <AppNavigator />
        </CartProvider>
      </FavouritesProvider>
    </UserContextProvider>

  );
};

export default App;
