import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  Input,
  Pressable,
  Text,
  Flex,
  ScrollView,
  Heading,
} from "native-base";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // db is your Firebase Firestore instance
import { useCart } from "../context/CartContext";
import colors from "../Color";

function HomeSearch({ isFocused, screen }) {
  const navigation = useNavigation();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Items"));
        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedProducts);
        setFilteredData(fetchedProducts); // Initialize filteredData with all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (queryText) => {
    setSearchQuery(queryText);
    const formattedQuery = queryText.toLowerCase();

    const filteredData = products.filter((product) => {
      return contains(product, formattedQuery);
    });

    setFilteredData(filteredData);
  };

  const contains = ({ name, description, tag }, query) => {
    if (
      name.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      tag.toLowerCase().includes(query)
    ) {
      return true;
    }
    return false;
  };

  const cartItemCount = cart.length;

  if (screen === "Search") {
    return (
      <Box flex={1} bg={colors.white}>
        <HStack
          space={3}
          w="full"
          px={6}
          bg={colors.neonRed1}
          py={4}
          alignItems="center"
          safeAreaTop
        >
          <Input
            placeholder="Search ...."
            w="85%"
            autoCapitalize="none"
            autoCorrect={false}
            bg={colors.white}
            type="search"
            variant="filled"
            h={12}
            borderWidth={0}
            _focus={{
              bg: colors.white,
            }}
            returnKeyType="search"
            onFocus={() => {
              navigation.navigate("Search");
            }}
            autoFocus={isFocused}
            onChangeText={(query) => handleSearch(query)}
          />
          <Pressable onPress={() => navigation.goBack()}>
            <Text fontSize={21.5} fontWeight="bold" color="white">
              Cancel
            </Text>
          </Pressable>
        </HStack>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <Flex
            flexWrap="wrap"
            direction="row"
            justifyContent="space-between"
            px={6}
          >
            {filteredData.map((product) => (
              <Pressable
                key={product.id}
                w="47%"
                bg={colors.white}
                rounded="md"
                shadow={2}
                pt={0.3}
                my={3}
                pb={2}
                overflow="hidden"
                onPress={() => navigation.navigate("Single", product)}
              >
                <Image
                  source={{ uri: product.image }}
                  alt={product.name}
                  style={{ width: "100%", height: 100 }} // Adjust dimensions as needed
                  resizeMode="contain"
                />
                <Box alignSelf="flex-end" position="absolute" mr="5%" mt="2%">
                  {product.isOnSale == "Yes" && (
                    <MaterialIcons
                      name="stars"
                      size={24}
                      color={colors.paypal}
                    />
                  )}
                </Box>
                <Box px={4} pt={1}>
                  {product.isOnSale !== "Yes" ? (
                    <Heading size="sm" bold>
                      GHC: {product.price}
                    </Heading>
                  ) : (
                    <HStack>
                      <Heading size="sm" bold>
                        GHC:
                      </Heading>
                      <Heading
                        size="sm"
                        bold
                        textDecorationLine="line-through"
                        textDecorationColor={colors.deepestRed}
                        ml={1}
                      >
                        {product.price}
                      </Heading>
                      <Heading size="sm" bold ml={3}>
                        {product.salesPrice}
                      </Heading>
                    </HStack>
                  )}
                  <Text fontSize={10} mt={1} isTruncated w="full">
                    {product.name}
                  </Text>
                </Box>
              </Pressable>
            ))}
          </Flex>
        </ScrollView>
      </Box>
    );
  } else {
    return (
      <HStack
        w="full"
        px={6}
        bg={colors.neonRed1}
        py={4}
        alignItems="center"
        safeAreaTop
        space={3}
      >
        <Text
          color={colors.white}
          fontSize={21}
          fontWeight="bold"
          ml={-5}
          top={1.5}
        >
          PribeT
        </Text>
        <Input
          placeholder="Search ...."
          w="85%"
          autoCapitalize="none"
          autoCorrect={false}
          bg={colors.white}
          type="search"
          variant="filled"
          h={12}
          ml={-2}
          borderWidth={0}
          _focus={{
            bg: colors.white,
          }}
          returnKeyType="search"
          onFocus={() => navigation.navigate("Search")}
          autoFocus={isFocused}
          onChangeText={(query) => handleSearch(query)}
        />
        <Pressable ml={-1} mt={3} onPress={() => navigation.navigate("Cart")}>
          <FontAwesome5 name="shopping-basket" size={24} color={colors.white} />
          {cartItemCount > 0 && (
            <Box
              px={1}
              rounded="full"
              position="absolute"
              top={-13}
              left={2}
              bg={colors.main}
              _text={{
                color: colors.white,
                fontSize: "11px",
              }}
            >
              {cartItemCount}
            </Box>
          )}
        </Pressable>
      </HStack>
    );
  }
}

export default HomeSearch;
