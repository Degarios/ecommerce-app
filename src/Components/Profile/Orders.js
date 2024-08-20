import { Box, Button, HStack, ScrollView, Text } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { Pressable } from "react-native";
import colors from "../../Color";
import { db, auth } from "../../../firebase"; // Import auth from your Firebase setup
import { collection, query, where, getDocs } from "firebase/firestore";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null); // State to hold current user ID

  useEffect(() => {
    // Function to fetch orders
    const fetchOrders = async () => {
      try {
        // Check if user is authenticated
        if (auth.currentUser) {
          const currentUserUid = auth.currentUser.uid;
          setUserId(currentUserUid); // Set the current user ID in state

          // Firestore query to fetch orders for current user
          const ordersRef = collection(db, "Cart");
          const q = query(ordersRef, where("userId", "==", currentUserUid));
          const querySnapshot = await getDocs(q);

          const fetchedOrders = [];
          querySnapshot.forEach((doc) => {
            fetchedOrders.push(doc.data());
          });

          setOrders(fetchedOrders); // Update orders state with fetched orders
        } else {
          console.log("User not authenticated.");
          // Handle case where user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders(); // Call fetchOrders when component mounts or userId changes
  }, []);

  return (
    <Box h="full" bg={colors.white} pt={5}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Pressable key={order.id}>
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
                  {new Date(order.orderDate).toLocaleDateString()}
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
                  GHC: {order.total.toFixed(2)}
                </Button>
              </HStack>
            </Pressable>
          ))
        ) : (
          <Text
            mt={5}
            mb={1}
            ml={2}
            fontSize={38}
            fontWeight="bold"
            color={colors.subRed1}
          >
            No orders available.
          </Text>
        )}
      </ScrollView>
    </Box>
  );
};

export default Orders;
