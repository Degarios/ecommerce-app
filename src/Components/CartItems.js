// CartItems.js
import React from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import colors from "../Color";

const Swiper = ({ cartItems, handleRemoveItem }) => (
  <SwipeListView
    rightOpenValue={-50}
    previewRowKey="0"
    previewOpenValue={-40}
    previewOpenDelay={3000}
    data={cartItems}
    renderItem={({ item }) => renderItems(item)}
    renderHiddenItem={({ item }) => renderHiddenItems(item, handleRemoveItem)}
    showsVerticalScrollIndicator={false}
  />
);

const renderItems = (item) => (
  <Pressable>
    <Box ml={6} mb={3}>
      <HStack
        alignItems="center"
        bg={colors.white}
        shadow={1}
        rounded={10}
        overflow="hidden"
      >
        <Center w="25%" bg={colors.deepGray}>
          <Image source={{ uri: item.image }} alt={item.name} w="full" h={24} />
        </Center>
        <Box position="absolute" ml="20.5%" mb="25%">
          {item.isOnSale === "Yes" && (
            <MaterialIcons name="stars" size={24} color={colors.paypal} />
          )}
        </Box>
        <VStack w="60%" px={2} space={2}>
          <Text isTruncated color={colors.black} bold fontSize={10}>
            {item.name}
          </Text>
          <Text isTruncated color={colors.black}>
            GHC:{" "}
            {item.isOnSale === "Yes" ? (
              <>
                <Text textDecorationLine="line-through">{item.price}</Text>{" "}
                <Text>{item.salesPrice}</Text>
              </>
            ) : (
              item.price // Display regular price if not on sale
            )}
          </Text>
        </VStack>
        <Center>
          <Button
            bg={colors.main}
            _pressed={{ bg: colors.main }}
            _text={{ color: colors.white }}
          >
            {item.quantity}
          </Button>
        </Center>
      </HStack>
    </Box>
  </Pressable>
);

const renderHiddenItems = (item, handleRemoveItem) => (
  <Pressable
    w={50}
    roundedTopRight={10}
    roundedBottomRight={10}
    h="88%"
    ml="auto"
    justifyContent="center"
    bg={colors.red}
    onPress={() => {
      handleRemoveItem(item.id); // Use 'id' instead of '_id' for Firebase
    }}
  >
    <Center alignItems="center" space={2}>
      <FontAwesome name="trash" size={24} color={colors.white} />
    </Center>
  </Pressable>
);

const CartItems = () => {
  const { cart, dispatch } = useCart();

  const handleRemoveItem = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", id });
  };

  return (
    <Box mr={6}>
      <Swiper cartItems={cart} handleRemoveItem={handleRemoveItem} />
    </Box>
  );
};

export default CartItems;
