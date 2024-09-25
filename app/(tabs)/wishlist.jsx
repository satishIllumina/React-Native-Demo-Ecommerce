import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const WishhList = () => {
  const [wishList, setWishList] = useState([]);
  const [cart, setCart] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      // Load cart and wishlist from AsyncStorage when HomeScreen loads
      const loadCartAndWishlist = async () => {
        const cartValue = await AsyncStorage.getItem("cart");
        setCart(cartValue != null ? JSON.parse(cartValue) : []);
      };
      loadCartAndWishlist();
    }, [])
  );

  const addToCart = async (product) => {
    setCart((prevCart) => {
      const isAlreadyInCart = prevCart.find((item) => item.id === product.id);
      if (isAlreadyInCart) return prevCart; // Prevent duplicate products in the cart
      return [...prevCart, product];
    });
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  };
  useFocusEffect(
    React.useCallback(() => {
      // Load cart from AsyncStorage when the component comes into focus
      const loadCart = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("wishlist");
          setWishList(jsonValue != null ? JSON.parse(jsonValue) : []);
        } catch (e) {
          console.error("Error loading cart from AsyncStorage:", e);
        }
      };
      loadCart();
    }, [])
  );

  console.log(wishList, "cart");

  const removeFromCart = async (productId) => {
    const updatedWishlist = wishList.filter((item) => item.id !== productId); // Filter out the item
    setWishList(updatedWishlist); // Update the state to trigger a re-render
    const jsonValue = JSON.stringify(updatedWishlist);
    await AsyncStorage.setItem("wishlist", jsonValue); // Save updated cart to AsyncStorage
  };

  // const renderCartItem = ({ item }) => (
  //   <View style={styles.cartItem}>
  //     <Image source={{ uri: item.thumbnail }} style={styles.image} />
  //     <View style={styles.details}>
  //       <Text style={styles.title}>{item.title}</Text>
  //       <Text style={styles.price}>${item.price}</Text>
  //       <TouchableOpacity onPress={() => removeFromCart(item.id)}>
  //         <Text style={styles.removeButton}>Remove</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  // );

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text numberOfLines={3} ellipsizeMode="tail" style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.price}>${item.price}</Text>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Wishlist</Text>
      {wishList?.length === 0 ? (
        <Text style={styles.emptyCartText}>Your Wishlist is empty!</Text>
      ) : (
        <>
          {/* <FlatList
            data={wishList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
          /> */}
          <FlatList
            data={wishList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            numColumns={3}
            columnWrapperStyle={styles.row}
          />
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
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: (screenWidth - 60) / 3,
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
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#34495e",
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
    marginTop: 5,
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addToCartText: {
    color: "#fff",
    fontWeight: "bold",
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

export default WishhList;
