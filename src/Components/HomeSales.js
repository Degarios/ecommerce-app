import { useNavigation } from "@react-navigation/native";
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
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../Color";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

function HomeSales() {
  const navigation = useNavigation();
  const [salesProducts, setSalesProducts] = useState([]);

  // Fetch sales items from Firestore on component mount
  useEffect(() => {
    const fetchSalesProducts = async () => {
      const q = query(collection(db, "Items"), where("isOnSale", "==", "Yes"));
      const querySnapshot = await getDocs(q);
      const fetchedSalesProducts = [];
      querySnapshot.forEach((doc) => {
        fetchedSalesProducts.push({ id: doc.id, ...doc.data() });
      });
      setSalesProducts(fetchedSalesProducts);
    };

    fetchSalesProducts();
  }, []);

  return (
    <Box flex={1} flexDirection="column" mb="10.8%">
      <HStack justifyContent="space-between">
        <Text
          mt={5}
          mb={1}
          ml={2}
          fontSize={38}
          fontWeight="bold"
          color={colors.subRed1}
        >
          Sales
        </Text>
        <Box mt={6} mb={1} mr={2}>
          <AntDesign
            name="arrowright"
            size={38}
            color={colors.subRed1}
            onPress={() =>
              navigation.navigate("SalesCategory", { salesProducts })
            }
          />
        </Box>
      </HStack>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <Flex
          flexWrap="wrap"
          direction="row"
          justifyContent="space-between"
          px={6}
        >
          {salesProducts.map((product) => (
            <Pressable
              key={product.id}
              w="48.9%"
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
                    <Heading size="sm" bold ml={1}>
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

export default HomeSales;
