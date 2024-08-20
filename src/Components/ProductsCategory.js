import React from "react";
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
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

function ProductsCategory({ route }) {
  const navigation = useNavigation();
  const title = route.params.paramKey;
  const products = route.params.products || [];

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
        {title}
      </Text>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <Flex
          flexWrap="wrap"
          direction="row"
          justifyContent="space-between"
          px={6}
        >
          {products.map((product) => (
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

export default ProductsCategory;
