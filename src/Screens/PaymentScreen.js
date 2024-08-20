import {
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  Pressable,
} from "native-base";
import React, { useState } from "react";
import colors from "../Color";
import Buttone from "../Components/Buttone";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOrder } from "../context/OrderContext";

const paymentMethods = [
  {
    id: "Paypal",
    image: require("../../assets/paypal1.png"),
    alt: "paypal",
    icon: "Ionicons",
  },
  {
    id: "Visa Mastercard",
    image: require("../../assets/visa-mastercard.png"),
    alt: "visa-mastercard",
    icon: "FontAwesome",
  },
  {
    id: "Mobile Money",
    image: require("../../assets/mobilemoney.png"),
    alt: "mobile-money",
    icon: "FontAwesome",
  },
];

function PaymentScreen() {
  const navigation = useNavigation();
  const { selectedMethod, setSelectedMethod } = useOrder();
  const [isValid, setIsValid] = useState(false);

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setIsValid(true); // Enable Continue button when a method is selected
  };

  const handleContinue = () => {
    if (selectedMethod) {
      navigation.navigate("PlaceOrder", { selectedMethod });
    } else {
      // Handle case where no method is selected
      alert("Please select a payment method.");
    }
  };

  return (
    <Box flex={1} safeAreaTop bg={colors.neonRed1} py={5}>
      {/* HEADER */}
      <Center pb={15}>
        <Text color={colors.white} fontSize={14} bold>
          PAYMENT METHOD
        </Text>
      </Center>

      {/* SELECTION */}
      <Box h="full" bg={colors.lighterRed} px={5}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={6} mt={5}>
            {paymentMethods.map((i, index) => (
              <Pressable key={index} onPress={() => handleSelectMethod(i.id)}>
                <HStack
                  alignItems="center"
                  bg={colors.white}
                  px={3}
                  py={1}
                  justifyContent="space-between"
                  rounded={10}
                >
                  <Box>
                    <Image
                      source={i.image}
                      alt={i.alt}
                      resizeMode="contain"
                      w={60}
                      h={50}
                    />
                  </Box>
                  {selectedMethod === i.id ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={30}
                      color={colors.neonRed1}
                    />
                  ) : (
                    <FontAwesome
                      name="circle-thin"
                      size={30}
                      color={colors.neonRed1}
                    />
                  )}
                </HStack>
              </Pressable>
            ))}
            <Buttone
              bg={colors.mainRed}
              color={colors.white}
              mt={5}
              disabled={!isValid} // Disable button if no method is selected
              onPress={handleContinue}
            >
              CONTINUE
            </Buttone>
            <Text italic textAlign="center">
              Payment method is set to{" "}
              <Text bold>
                {selectedMethod
                  ? selectedMethod.charAt(0).toUpperCase() +
                    selectedMethod.slice(1)
                  : "None"}
              </Text>
            </Text>
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
}

export default PaymentScreen;
