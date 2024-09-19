import React, { useState } from "react";
import Home from "../../components/Home";
import { View } from "react-native";

const index = () => {
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
    <View>
      <Home cart={cart} addToCart={addToCart} />
    </View>
  );
};

export default index;
