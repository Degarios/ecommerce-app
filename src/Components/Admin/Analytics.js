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
  Button,
  VStack,
} from "native-base";
import colors from "../../Color";

function Analytics() {
  return (
    <Box flex={1} mt={8}>
      <Text
        mt={5}
        mb={1}
        ml={2}
        fontSize={28}
        fontWeight="bold"
        color={colors.lightBlack}
      >
        Google Analytics
      </Text>
      <Text mt={1} ml={2} fontSize={13} color={colors.red}>
        Sorry, Google Analytics is unavailable at this moment
      </Text>
    </Box>
  );
}

export default Analytics;
