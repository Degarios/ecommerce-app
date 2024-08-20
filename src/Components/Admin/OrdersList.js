import React, { useEffect, useState } from "react";
import {
  Box,
  Pressable,
  ScrollView,
  Text,
  HStack,
  Button,
  VStack,
} from "native-base";
import colors from "../../Color";
import { db } from "../../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      try {
        // Fetch orders
        const ordersRef = collection(db, "Orders");
        const ordersSnapshot = await getDocs(ordersRef);
        const fetchedOrders = [];

        for (const docSnapshot of ordersSnapshot.docs) {
          const orderData = docSnapshot.data();
          const userId = orderData.userId;

          console.log(`Fetching user data for userId: ${userId}`);

          // Fetch user details using userId
          const userDocRef = doc(db, "Users", userId);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log(`Fetched user data: ${JSON.stringify(userData)}`);
            orderData.username = userData.username || "Unknown User";
            orderData.email = userData.email || "Unknown Email";
          } else {
            console.log(`No user found for userId: ${userId}`);
          }

          fetchedOrders.push({
            id: docSnapshot.id,
            ...orderData,
          });
        }

        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders and user data:", error);
      }
    };

    fetchOrdersAndUsers();
  }, []);

  const formatDate = (date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <Box h="50%" bg={colors.white} pt={5} mt={4}>
      <Text
        mt={5}
        mb={1}
        ml={2}
        fontSize={28}
        fontWeight="bold"
        color={colors.lightBlack}
      >
        List of Orders
      </Text>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} mt={4}>
        <ScrollView showsVerticalScrollIndicator={true}>
          {orders.map((order) => (
            <Pressable key={order.id}>
              <VStack>
                <HStack
                  space={4}
                  justifyContent="space-between"
                  alignItems="center"
                  bg={colors.lighterRed}
                  py={5}
                  px={2}
                >
                  <Text fontSize={12} color={colors.blue} isTruncated>
                    {order.id}
                  </Text>
                  <Text fontSize={11} italic color={colors.black} isTruncated>
                    {formatDate(order.date)}
                  </Text>
                  <Text fontSize={11} italic color={colors.black} isTruncated>
                    {order.username}
                  </Text>
                  <Text fontSize={11} italic color={colors.black} isTruncated>
                    {order.email}
                  </Text>
                  <Button
                    px={7}
                    py={1.5}
                    rounded={50}
                    bg={colors.main}
                    _text={{
                      color: colors.white,
                    }}
                    _pressed={{
                      bg: colors.main,
                    }}
                  >
                    GHC: {order.total ? order.total.toFixed(2) : "N/A"}
                  </Button>
                </HStack>
              </VStack>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
    </Box>
  );
}

export default OrdersList;
