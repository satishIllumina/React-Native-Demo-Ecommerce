import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../app/(tabs)/index"; // Home screen component
import CartScreen from "../app/(tabs)/cart"; // Cart screen component

const Stack = createStackNavigator();

const App = () => {
  const [cart, setCart] = useState([]); // Cart state to be shared across screens

  const addToCart = (product) => {
    setCart((prevCart) => {
      const isAlreadyInCart = prevCart.find((item) => item.id === product.id);
      if (isAlreadyInCart) return prevCart; // Prevent duplicate products in the cart
      return [...prevCart, product];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen {...props} cart={cart} addToCart={addToCart} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Cart">
          {(props) => (
            <CartScreen
              {...props}
              cart={cart}
              removeFromCart={removeFromCart}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
