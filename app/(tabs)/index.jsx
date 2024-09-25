import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
      // Load cart and wishlist from AsyncStorage when HomeScreen loads
      const loadCartAndWishlist = async () => {
        const cartValue = await AsyncStorage.getItem("cart");
        setCart(cartValue != null ? JSON.parse(cartValue) : []);

        const wishlistValue = await AsyncStorage.getItem("wishlist");
        setWishlist(wishlistValue != null ? JSON.parse(wishlistValue) : []);
      };
      loadCartAndWishlist();
    }, [])
  );

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    setCart((prevCart) => {
      const isAlreadyInCart = prevCart.find((item) => item.id === product.id);
      if (isAlreadyInCart) return prevCart; // Prevent duplicate products in the cart
      return [...prevCart, product];
    });
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToWishlist = async (product) => {
    setWishlist((prevWishlist) => {
      const isAlreadyInWishlist = prevWishlist.find(
        (item) => item.id === product.id
      );
      if (isAlreadyInWishlist) return prevWishlist; // Prevent duplicate products in the wishlist
      return [...prevWishlist, product];
    });
    await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.price}>${item.price}</Text>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addToWishlistButton}
        onPress={() => addToWishlist(item)}
      >
        <Text style={styles.addToWishlistText}>Add to Wishlist</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Text style={styles.cartButton}>Cart ({cart.length})</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={3}
          columnWrapperStyle={styles.row}
        />
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cartButton: {
    fontSize: 18,
    color: "#3498db",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
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
  addToWishlistButton: {
    marginTop: 10,
    backgroundColor: "#f39c12",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addToWishlistText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;
