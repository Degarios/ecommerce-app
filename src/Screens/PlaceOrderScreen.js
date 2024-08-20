import { Box, Heading, ScrollView } from "native-base";
import React, { useState, useEffect } from "react";
import colors from "../Color";
import OrderInfo from "../Components/OrderInfo";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import OrderItem from "../Components/OrderItem";
import PlaceOrderModal from "../Components/PlaceOrderModal";
import { useOrder } from "../context/OrderContext";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

function PlaceOrderScreen({ route }) {
  const { address, selectedMethod, useSavedAddress, pickup } = useOrder();
  const totalAmount = route.params;
  const [userData, setUserData] = useState({ username: "", email: "", address: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, "Users", auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              username: data.username || "User",
              email: auth.currentUser.email,
              address: data.address || "123 Default Street, Default City, Default Country",
            });
          } else {
            setUserData({
              username: "User",
              email: auth.currentUser.email,
              address: "123 Default Street, Default City, Default Country",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          username: "User",
          email: auth.currentUser ? auth.currentUser.email : "email@example.com",
          address: "123 Default Street, Default City, Default Country",
        });
      }
    };

    fetchUserData();
  }, []);

  const displayAddress = pickup
    ? "Pribet Shopping Mart, Sunyani, Ghana"
    : useSavedAddress
    ? userData.address
    : address;

  return (
    <Box bg={colors.whiteRed} flex={1} safeArea pt={6}>
      <Box>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <OrderInfo
            title="CUSTOMER"
            subTitle={userData.username}
            text={userData.email}
            icon={<FontAwesome name="user" size={30} color={colors.white} />}
          />
          <OrderInfo
            title="ORDER INFO"
            subTitle={pickup ? "Pick Up" : "Delivery: Ghana"}
            text={`Pay Method: ${
              selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)
            }`}
            icon={
              <FontAwesome5
                name="shipping-fast"
                size={30}
                color={colors.white}
              />
            }
          />
          <OrderInfo
            title={pickup ? "PICK UP FROM" : "DELIVER TO"}
            subTitle="Address:"
            text={displayAddress}
            icon={
              <Ionicons name="location-sharp" size={30} color={colors.white} />
            }
          />
        </ScrollView>
      </Box>
      <Box px={6} flex={1} pb={3}>
        <Heading bold fontSize={15} isTruncated my={4}>
          ITEMS
        </Heading>
        <OrderItem />
        <PlaceOrderModal totalAmount={totalAmount} />
      </Box>
    </Box>
  );
}

export default PlaceOrderScreen;
