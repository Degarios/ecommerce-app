import React from "react";
import { Box, Center, Text } from "native-base";
import colors from "../Color";
import { FontAwesome } from "@expo/vector-icons";
import Buttone from "./Buttone";
import { useNavigation } from "@react-navigation/native";

const CartEmpty = () => {
  const navigation = useNavigation();

  return (
    <Box flex={1} px={4}>
      <Center h="90%">
        <Center w={200} h={200} bg={colors.white} rounded="full">
          <FontAwesome
            name="shopping-basket"
            size={64}
            color={colors.mainRed}
          />
        </Center>
        <Text color={colors.mainRed} bold mt={5}>
          CART IS EMPTY
        </Text>
      </Center>

      <Buttone
        bg={colors.mainRed}
        color={colors.white}
        onPress={() => navigation.navigate("Home")}
      >
        START SHOPPING
      </Buttone>
    </Box>
  );
};

export default CartEmpty;
