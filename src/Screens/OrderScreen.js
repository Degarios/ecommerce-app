import { Box, Heading, ScrollView, Text, View } from "native-base";
import React, { useEffect, useState } from "react";
import colors from "../Color";
import OrderInfo from "../Components/OrderInfo";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import OrderItem from "../Components/OrderItem";
import OrderModal from "../Components/OrderModal";

function OrderScreen() {
  return (
    <Box bg={colors.whiteRed} flex={1} safeArea pt={6}>
      <Box>
        <OrderModal setUpModal={true} />
      </Box>
    </Box>
  );
}

export default OrderScreen;
