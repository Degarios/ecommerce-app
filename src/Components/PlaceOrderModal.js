// PlaceOrderModal.js
import { Button, Center, HStack, Modal, Text, VStack } from "native-base";
import { Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import CartContext from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import colors from "../Color";
import Buttone from "../Components/Buttone";
import { auth } from "../../firebase"; // Adjust the path based on your project structure

// Notification handler must be registered at the top level of your application
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const OrdersInfos = [
  {
    title: "Items",
    price: 0, // Placeholder for total items price
    color: "black",
  },
  {
    title: "Shipping",
    price: 0, // Placeholder for shipping price
    color: "black",
  },
  {
    title: "Total Amount",
    price: 0, // Placeholder for total amount
    color: "main",
  },
];

const PlaceOrderModal = () => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const { cart, dispatch } = useContext(CartContext);
  const { address, pickup, selectedMethod } = useOrder();
  const [totalItemsPrice, setTotalItemsPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(null); // State to hold current user ID

  useEffect(() => {
    const itemsPrice = cart.reduce(
      (total, item) =>
        total +
        (item.isOnSale === "Yes" ? item.salesPrice : item.price) *
          item.quantity,
      0
    );
    setTotalItemsPrice(itemsPrice);

    const calculatedShippingPrice = pickup ? 0 : itemsPrice * 0.09;
    setShippingPrice(calculatedShippingPrice);

    const totalAmount = itemsPrice + calculatedShippingPrice;
    setTotal(totalAmount);

    // Ensure user is authenticated and retrieve current user ID
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, [cart, pickup]);

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.manifest?.extra?.eas?.projectId,
        })
      ).data;
    } catch (error) {
      console.error("Error fetching Expo push token:", error);
      //alert("Error fetching Expo push token. Please try again later.");
      return;
    }

    return token;
  };

  const sendPushNotification = async (message) => {
    const token = await registerForPushNotificationsAsync();
    if (!token) {
      return;
    }

    const messagePayload = {
      to: token,
      sound: "default",
      title: "Order Placed",
      body: message,
      data: { message },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      // Handle case where user ID is not available
      Alert.alert("Authentication Error", "User ID not available");
      return;
    }

    const orderId = uuidv4();
    const orderDate = new Date().toISOString();

    // Prepare order data
    const order = {
      id: orderId,
      items: cart,
      totalItemsPrice,
      shippingPrice,
      total,
      paymentMethod: selectedMethod,
      date: orderDate,
      deliveryInfo: pickup ? "Pick Up" : address,
      userId: userId,
    };

    // Prepare cart data
    const cartData = {
      id: orderId, // Assuming cart ID is the same as order ID for simplicity
      userId: userId,
      items: cart,
      totalItemsPrice,
      shippingPrice,
      total,
      orderDate,
    };

    try {
      // Save order to 'Orders' collection
      await setDoc(doc(db, "Orders", orderId), order);

      // Save cart to 'Cart' collection
      await setDoc(doc(db, "Cart", orderId), cartData);

      // Dispatch actions to clear cart locally
      dispatch({ type: "ADD_ORDER", order });
      dispatch({ type: "CLEAR_CART" });

      const successMessage = `Order placed successfully.\nCart ID: ${orderId}\nDate: ${orderDate}\nDelivery Method: ${
        pickup ? "Pick Up" : "Delivery"
      }`;
      Alert.alert("Success", successMessage);

      const pushMessage = `Order placed successfully. Cart ID: ${orderId}.`;
      const deliveryMessage = pickup
        ? ""
        : " Items will be delivered between one to 12 hours depending on your distance from the Mart.";
      await sendPushNotification(pushMessage + deliveryMessage);

      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Ooops!", error.message);
    }

    setShowModal(false);
  };

  return (
    <Center>
      <Buttone
        onPress={() => setShowModal(true)}
        bg={colors.mainRed}
        color={colors.white}
        mt={5}
      >
        SHOW TOTAL
      </Buttone>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth={350}>
          <Modal.CloseButton />
          <Modal.Header>Order</Modal.Header>
          <Modal.Body>
            <VStack space={7}>
              {OrdersInfos.map((info, index) => (
                <HStack
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Text fontWeight="medium">{info.title}</Text>
                  <Text
                    color={info.color === "main" ? colors.main : colors.black}
                    bold
                  >
                    GHC:{" "}
                    {info.title === "Items"
                      ? totalItemsPrice.toFixed(2)
                      : info.title === "Shipping"
                      ? shippingPrice.toFixed(2)
                      : total.toFixed(2)}
                  </Text>
                </HStack>
              ))}
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Payment Method</Text>
                <Text color={colors.mainRed} bold>
                  {selectedMethod.charAt(0).toUpperCase() +
                    selectedMethod.slice(1)}
                </Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Delivery Info</Text>
                <Text color={colors.black} bold>
                  {pickup ? "Pick Up" : address.split(",")[0]}
                </Text>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex={1}
              bg={colors.mainRed}
              h={45}
              _text={{ color: colors.white }}
              onPress={handlePlaceOrder}
              _pressed={{ bg: colors.mainRed }}
            >
              PLACE ORDER
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default PlaceOrderModal;
