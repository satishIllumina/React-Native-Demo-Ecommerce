import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // Load cart from AsyncStorage when the component comes into focus
      const loadCart = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("cart");
          setCartItems(jsonValue != null ? JSON.parse(jsonValue) : []);
        } catch (e) {
          console.error("Error loading cart from AsyncStorage:", e);
        }
      };
      loadCart();
    }, [])
  );

  const calculateTotal = () => {
    return cartItems
      ?.reduce((total, item) => {
        const itemTotal = item.price * (item.quantity || 1); // Ensure quantity defaults to 1
        return total + itemTotal;
      }, 0)
      .toFixed(2);
  };

  const updateCart = async (updatedCart) => {
    setCartItems(updatedCart);
    const jsonValue = JSON.stringify(updatedCart);
    await AsyncStorage.setItem("cart", jsonValue);
  };

  const incrementQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const decrementQuantity = (productId) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0); // Remove items with quantity 0
    updateCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    updateCart(updatedCart);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decrementQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => incrementQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems?.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty!</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2c3e50",
    marginVertical: 20,
    textAlign: "center",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  details: {
    marginLeft: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    marginTop: 10,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  totalContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
  },
  emptyCartText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CartScreen;
