import {
  Box,
  Heading,
  HStack,
  Image,
  ScrollView,
  Spacer,
  Text,
} from "native-base";
import React, { useState } from "react";
import NumericInput from "react-native-numeric-input";
import colors from "../Color";
import Buttone from "../Components/Buttone";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

function SingleProductScreen({ route }) {
  const [value, setValue] = useState(1); // Set default value to 1
  const navigation = useNavigation();
  const product = route.params;
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", product: { ...product, quantity: value } });
    navigation.navigate("Cart"); // Navigate after adding to cart
  };

  return (
    <Box safeArea flex={1} bg={colors.white}>
      <ScrollView px={5} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.image }}
          alt="Image"
          w="full"
          h={300}
          resizeMode="contain"
        />
        <Box alignSelf="flex-end" position="absolute" mt="2%">
          {product.isOnSale === "Yes" && (
            <MaterialIcons name="stars" size={58} color={colors.paypal} />
          )}
        </Box>
        <Heading bold fontSize={15} mb={2} lineHeight={22}>
          {product.name}
        </Heading>
        <HStack space={2} alignItems="center" my={5}>
          {product.countInStock > 0 ? (
            <NumericInput
              value={value}
              totalWidth={140}
              totalHeight={30}
              iconSize={25}
              step={1}
              maxValue={product.countInStock}
              minValue={1}
              borderColor={colors.royalRed}
              rounded
              textColor={colors.black}
              iconStyle={{ color: colors.white }}
              rightButtonBackgroundColor={colors.mainRed}
              leftButtonBackgroundColor={colors.mainRed}
              onChange={setValue} // Make sure value updates correctly
            />
          ) : (
            <Heading bold color={colors.red} italic fontSize={19}>
              Out of stock
            </Heading>
          )}
          <Spacer />
          {product.isOnSale !== "Yes" ? (
            <Heading bold color={colors.black} fontSize={19}>
              GHC: {product.price}
            </Heading>
          ) : (
            <HStack>
              <Heading bold color={colors.black} fontSize={19} mr={1}>
                GHC:
              </Heading>
              <Heading
                bold
                color={colors.black}
                fontSize={19}
                textDecorationLine="line-through"
                textDecorationColor={colors.deepestRed}
                mr={6}
              >
                {product.price}
              </Heading>
              <Heading bold color={colors.black} fontSize={19}>
                {product.salesPrice}
              </Heading>
            </HStack>
          )}
        </HStack>
        <Text lineHeight={24} fontSize={12}>
          {product.description}
        </Text>
        {product.countInStock > 0 ? (
          <Buttone
            bg={colors.mainRed}
            color={colors.white}
            mt={10}
            onPress={addToCart}
          >
            ADD TO CART
          </Buttone>
        ) : (
          <Buttone
            bg={colors.deepestGray}
            color={colors.white}
            mt={10}
            onPress={addToCart}
            disabled={true}
          >
            OUT OF STOCK
          </Buttone>
        )}
      </ScrollView>
    </Box>
  );
}

export default SingleProductScreen;
