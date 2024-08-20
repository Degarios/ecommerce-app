// CartScreen.js
import { useNavigation } from "@react-navigation/native";
import { Box, Button, Center, HStack, ScrollView, Text } from "native-base";
import React, { useEffect, useState } from "react";
import colors from "../Color";
import Buttone from "../Components/Buttone";
import CartEmpty from "../Components/CartEmpty";
import CartItems from "../Components/CartItems";
import { useCart } from "../context/CartContext"; // Assuming you have a CartContext

function CartScreen() {
  const navigation = useNavigation();
  const { cart } = useCart(); // Get the cart state from the context
  const [totalAmount, setTotalAmount] = useState(0); // State to manage total amount

  // Calculate total amount whenever cart changes
  useEffect(() => {
    const calculateTotal = () => {
      let total = cart.reduce((accumulator, item) => {
        const itemPrice = item.isOnSale === "Yes" ? parseFloat(item.salesPrice) : parseFloat(item.price);
        return accumulator + itemPrice * item.quantity;
      }, 0);
      setTotalAmount(total);
    };

    calculateTotal();
  }, [cart]);

  return (
    <Box flex={1} safeAreaTop bg={colors.whiteRed}>
      {/* HEADER */}
      <Center w="full" py={5}>
        <Text color={colors.black} fontSize={20} bold>
          Cart
        </Text>
      </Center>

      {cart.length === 0 ? (
        <CartEmpty />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* CART ITEMS */}
          <CartItems />

          {/* TOTAL */}
          <Center mt={5}>
            <HStack
              rounded={50}
              justifyContent="space-between"
              bg={colors.white}
              shadow={2}
              w="90%"
              pl={5}
              h={45}
              alignItems="center"
            >
              <Text>Total</Text>
              <Button
                px={10}
                h={45}
                rounded={50}
                bg={colors.mainRed}
                _text={{
                  color: colors.white,
                  fontWeight: "semibold",
                }}
                _pressed={{ bg: colors.mainRed }}
                onPress={() => navigation.navigate("Shipping", { totalAmount })}
              >
                GHC: {totalAmount.toFixed(2)}
              </Button>
            </HStack>
          </Center>

          {/* CHECKOUT */}
          <Center px={5} pb={8}>
            <Buttone
              bg={colors.mainRed}
              color={colors.white}
              mt={10}
              onPress={() => navigation.navigate("Shipping", { totalAmount })}
            >
              CHECKOUT
            </Buttone>
          </Center>
        </ScrollView>
      )}
    </Box>
  );
}

export default CartScreen;
