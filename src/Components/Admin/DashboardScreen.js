import { Box, Center, HStack, Text, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import OrdersList from "./OrdersList";
import Analytics from "./Analytics";
import colors from "../../Color";
import {
  Ionicons,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { db } from "../../../firebase"; // Assuming you have Firebase initialized here
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

function DashboardScreen() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalOrderedItems, setTotalOrderedItems] = useState(0);

  useEffect(() => {
    // Function to fetch total number of users
    const fetchTotalUsers = async () => {
      try {
        const usersRef = collection(db, "Users");
        const usersSnapshot = await getDocs(usersRef);
        setTotalUsers(usersSnapshot.size); // Set total number of users
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    // Function to fetch total number of orders
    const fetchTotalOrders = async () => {
      try {
        const ordersRef = collection(db, "Orders");
        const ordersSnapshot = await getDocs(ordersRef);
        setTotalOrders(ordersSnapshot.size); // Set total number of orders
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    // Function to calculate total ordered items
    const calculateTotalOrderedItems = async () => {
      try {
        const ordersRef = collection(db, "Orders");
        const ordersSnapshot = await getDocs(ordersRef);
        let totalItems = 0;
        ordersSnapshot.forEach((doc) => {
          totalItems += doc.data().items.length; // Assuming 'items' field holds the ordered items array
        });
        setTotalOrderedItems(totalItems); // Set total number of ordered items
      } catch (error) {
        console.error("Error calculating total ordered items:", error);
      }
    };

    fetchTotalUsers();
    fetchTotalOrders();
    calculateTotalOrderedItems();
  }, []);

  return (
    <Box flex={1} bg={colors.white}>
      <Box
        w="full"
        px={6}
        bg={colors.neonRed1}
        py={4}
        alignItems="center"
        safeAreaTop
        space={3}
      >
        <Text fontSize={40} fontWeight="bold" color="white">
          ADMIN
        </Text>
      </Box>
      <ScrollView showsVerticalScrollIndicator="false">
        <Box mt={8}>
          <Center>
            <Ionicons name="stats-chart" size={60} color={colors.subRed1} />
            <Text fontSize={30} fontWeight="bold" color={colors.subRed1}>
              Dashboard
            </Text>
          </Center>
        </Box>

        <HStack mt="5%" mx={4} justifyContent="space-between">
          <Box mr={2}>
            <Text fontSize={18} mb={1}>
              Number of Users
            </Text>
            <Center>
              <FontAwesome name="users" size={18} color={colors.paypal} />
              <Text mt={1} color={colors.subRed1} fontWeight="bold">
                {totalUsers}
              </Text>
            </Center>
          </Box>
          <Box mx={2}>
            <Text fontSize={18} mb={1}>
              Number of Orders
            </Text>
            <Center>
              <FontAwesome5
                name="shopping-basket"
                size={18}
                color={colors.paypal}
              />
              <Text color={colors.subRed1} mt={1} fontWeight="bold">
                {totalOrders}
              </Text>
            </Center>
          </Box>
          <Box ml={2}>
            <Text fontSize={18} mb={1}>
              Ordered Items
            </Text>
            <Center>
              <MaterialCommunityIcons
                name="cart-variant"
                size={18}
                color={colors.paypal}
              />
              <Text mt={1} color={colors.subRed1} fontWeight="bold">
                {totalOrderedItems}
              </Text>
            </Center>
          </Box>
        </HStack>
        <OrdersList />
        <Analytics />
      </ScrollView>
    </Box>
  );
}

export default DashboardScreen;
