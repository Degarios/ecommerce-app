import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Center,
  Checkbox,
  FormControl,
  Input,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useState, useEffect } from "react";
import colors from "../Color";
import Buttone from "../Components/Buttone";
import { useOrder } from "../context/OrderContext";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

function ShippingScreen() {
  const navigation = useNavigation();
  const { address, setAddress, setPickup, setUseSavedAddress } = useOrder();
  const [errorMessage, setErrorMessage] = useState("");
  const [pickup, setPickupState] = useState(false);
  const [useSavedAddress, setUseSavedAddressState] = useState(false);
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, "Users", auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUserAddress(userData.address || "123 Default Street, Default City, Default Country");
          } else {
            setCurrentUserAddress("123 Default Street, Default City, Default Country");
          }
        } else {
          setCurrentUserAddress("123 Default Street, Default City, Default Country");
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
        setCurrentUserAddress("123 Default Street, Default City, Default Country");
      }
    };

    fetchUserAddress();
  }, []);

  const handlePickupChange = () => {
    const newPickupState = !pickup;
    setPickupState(newPickupState);
    setPickup(newPickupState);
    if (newPickupState) {
      setUseSavedAddressState(false);
      setUseSavedAddress(false);
      setAddress("");
    }
  };

  const handleUseSavedAddressChange = () => {
    const newUseSavedAddressState = !useSavedAddress;
    setUseSavedAddressState(newUseSavedAddressState);
    setUseSavedAddress(newUseSavedAddressState);
    if (newUseSavedAddressState) {
      setPickupState(false);
      setPickup(false);
      setAddress(currentUserAddress);
    } else {
      setAddress("");
    }
  };

  const handleContinue = () => {
    if (address.trim() === "" && !pickup) {
      setErrorMessage("Please enter an address, use the saved address, or choose pickup.");
    } else {
      setErrorMessage("");
      navigation.navigate("Checkout");
    }
  };

  return (
    <Box flex={1} safeAreaTop bg={colors.neonRed1} py={5}>
      <Center pb={15}>
        <Text color={colors.white} fontSize={14} bold>
          DELIVERY ADDRESS
        </Text>
      </Center>
      <Box h="full" bg={colors.white} px={5} pt={35}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space={6} mt={5}>
            <FormControl isInvalid={errorMessage !== ""}>
              <FormControl.Label
                _text={{
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                ENTER ADDRESS
              </FormControl.Label>
              <Input
                borderWidth={0.2}
                borderColor={colors.neonRed1}
                bg={colors.lighterRed}
                py={4}
                type="text"
                value={address}
                onChangeText={(text) => setAddress(text)}
                color={colors.blackRed}
                _focus={{
                  bg: colors.lighterRed,
                  borderWidth: 1,
                  borderColor: colors.neonRed1,
                }}
                readOnly={pickup || useSavedAddress}
                placeholder={pickup ? " " : "Enter an address..."}
              />
              {errorMessage !== "" && (
                <FormControl.ErrorMessage>
                  {errorMessage}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <Checkbox
              isChecked={pickup}
              onChange={handlePickupChange}
              value="pickup"
              colorScheme="red"
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Pick Up
            </Checkbox>
            <Checkbox
              isChecked={useSavedAddress}
              onChange={handleUseSavedAddressChange}
              value="useSavedAddress"
              colorScheme="red"
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Use Saved Address
            </Checkbox>
            <Buttone
              bg={colors.mainRed}
              color={colors.white}
              mt={5}
              onPress={handleContinue}
            >
              CONTINUE
            </Buttone>
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
}

export default ShippingScreen;
