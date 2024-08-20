import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Image,
  Pressable,
  ScrollView,
  Text,
  HStack,
} from "native-base";
import HomeSearch from "./HomeSearch";
import { useNavigation } from "@react-navigation/native";
import colors from "../Color";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // Assuming db is your Firebase Firestore instance
import { MaterialIcons } from "@expo/vector-icons";

function HealthAndPersonalCategory() {
  const navigation = useNavigation();
  const [healthProducts, setHealthProducts] = useState([]);

  useEffect(() => {
    const fetchHealthProducts = async () => {
      try {
        const q = query(
          collection(db, "Items"),
          where("tag", "==", "Health & Personal Care")
        );
        const querySnapshot = await getDocs(q);
        const fetchedHealthProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedHealthProducts.push({ id: doc.id, ...doc.data() });
        });
        setHealthProducts(fetchedHealthProducts);
      } catch (error) {
        console.error("Error fetching health products:", error);
      }
    };

    fetchHealthProducts();
  }, []);

  return (
    <Box flex={1}>
      <HomeSearch />
      <Text
        mt={5}
        mb={1}
        ml={2}
        fontSize={38}
        fontWeight="bold"
        color={colors.subRed1}
      >
        HEALTH & PERSONAL CARE
      </Text>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <Flex
          flexWrap="wrap"
          direction="row"
          justifyContent="space-between"
          px={6}
        >
          {healthProducts.map((product) => (
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
                w="full"
                h={24}
                resizeMode="contain"
              />
              <Box alignSelf="flex-end" position="absolute" mr="5%" mt="2%">
                {product.isOnSale === "Yes" && (
                  <MaterialIcons name="stars" size={24} color={colors.paypal} />
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
}

export default HealthAndPersonalCategory;
