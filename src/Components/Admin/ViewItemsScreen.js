import {
  Box,
  Center,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
  ScrollView,
  Button,
} from "native-base";
import { Alert } from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../Color";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "../../../firebase"; // Assuming Firebase is initialized here
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Import Firestore functions

const ViewItemsScreen = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Items"));
        const fetchedItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Items: ", fetchedItems); // Log fetched items
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteItem(itemId),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "Items", itemId));
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item. Please try again later.");
    }
  };

  const renderItems = (data, rowMap) => (
    <Pressable>
      <Box ml={3} mb={3} mr={2}>
        <HStack
          alignItems="center"
          bg={colors.white}
          shadow={1}
          rounded={10}
          overflow="hidden"
        >
          <Center w="25%" bg={colors.deepGray}>
            <Image
              source={{ uri: data.item.image }}
              alt={data.item.name}
              w="full"
              h={24}
              //resizeMode='contain'
            />
          </Center>
          <Box position="absolute" ml="20.5%" mb="25%">
            {data.item.isOnSale === "Yes" && (
              <MaterialIcons name="stars" size={24} color={colors.paypal} />
            )}
          </Box>
          <VStack w="60%" px={2} space={2}>
            <Text isTruncated color={colors.black} bold fontSize={10}>
              {data.item.name}
            </Text>
            {data.item.isOnSale !== "Yes" ? (
              <Text isTruncated color={colors.black}>
                GHC: {data.item.price}
              </Text>
            ) : (
              <Text isTruncated color={colors.black}>
                GHC:{" "}
                <Text textDecorationLine="line-through">{data.item.price}</Text>{" "}
                <Text>{data.item.salesPrice}</Text>
              </Text>
            )}
          </VStack>
          <Center>
            {data.item.countInStock === 0 ? (
              <Button
                bg={colors.deepestGray}
                _pressed={{ bg: colors.main }}
                _text={{ color: colors.white }}
              >
                X
              </Button>
            ) : (
              <Button
                bg={colors.main}
                _pressed={{ bg: colors.main }}
                _text={{ color: colors.white }}
              >
                {data.item.countInStock}
              </Button>
            )}
          </Center>
        </HStack>
      </Box>
    </Pressable>
  );

  const renderHiddenItems = (data, rowMap) => (
    <Pressable
      onPress={() => handleDeleteItem(data.item.id)}
      w={50}
      roundedTopRight={10}
      roundedBottomRight={10}
      h="88%"
      ml="auto"
      mr={2}
      justifyContent="center"
      bg={colors.red}
    >
      <Center alignItems="center" space={2}>
        <FontAwesome name="trash" size={24} color={colors.white} />
      </Center>
    </Pressable>
  );

  return (
    <Box flex={1} safeAreaTop bg={colors.gray}>
      <Center w="full" py={5}>
        <Text color={colors.black} fontSize={26} bold>
          Items
        </Text>
      </Center>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box>
          <SwipeListView
            rightOpenValue={-50}
            previewRowKey="0"
            previewOpenValue={-40}
            previewOpenDelay={3000}
            data={items}
            renderItem={renderItems}
            renderHiddenItem={renderHiddenItems}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ViewItemsScreen;
