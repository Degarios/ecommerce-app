// OrderItem.js
import React, { useContext } from "react";
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "native-base";
import colors from "../Color";
import { MaterialIcons } from "@expo/vector-icons";
import CartContext from "../context/CartContext";

const OrderItem = () => {
  const { cart } = useContext(CartContext);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={cart}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Pressable>
          <Box mb={3}>
            <HStack
              alignItems="center"
              bg={colors.white}
              shadow={1}
              rounded={10}
              overflow="hidden"
            >
              <Center w="25%" bg={colors.deepGray}>
                <Image
                  source={{ uri: item.image }}
                  alt={item.name}
                  w="full"
                  h={24}
                  // resizeMode='contain'
                />
              </Center>
              <Box position="absolute" ml="20.5%" mb="25%">
                {item.isOnSale === "Yes" && (
                  <MaterialIcons name="stars" size={24} color={colors.paypal} />
                )}
              </Box>
              <VStack w="60%" px={2}>
                <Text isTruncated color={colors.black} bold fontSize={12}>
                  {item.name}
                </Text>
                {item.isOnSale !== "Yes" ? (
                  <Text isTruncated color={colors.lightBlack} mt={2}>
                    GHC: {item.price}
                  </Text>
                ) : (
                  <Text isTruncated color={colors.lightBlack} mt={2}>
                    GHC:{" "}
                    <Text textDecorationLine="line-through">{item.price}</Text>{" "}
                    <Text>{item.salesPrice}</Text>
                  </Text>
                )}
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
      )}
    />
  );
};

export default OrderItem;
