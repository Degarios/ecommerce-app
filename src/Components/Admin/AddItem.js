import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Input,
  Modal,
  Text,
  TextArea,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { KeyboardAvoidingView, Alert } from "react-native";
import { TabBarIndicator } from "react-native-tab-view";
import colors from "../../Color";
import Buttone from "../Buttone";
import { Select, CheckIcon } from "native-base";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { async } from "@firebase/util";

const AddItemModal = ({ screen, opened }) => {
  const [showModal, setShowModal] = useState(opened || false);
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [readOnly, setReadOnly] = useState(true);

  const [name, setName] = useState("");
  const [image, setImage] = useState(
    "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg"
  );
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);
  const [salesPrice, setSalesPrice] = useState(0.0);
  const [isOnSale, setIsOnSale] = useState("No");
  const [countInStock, setCountInStock] = useState(0);
  const [tag, setTag] = useState(
    "Either: Beverages, Food, Groceries, or Health & Personal Care."
  );
  //const [numOfSales, setNoOfSales] = useState(0);

  const [item, setItem] = useState([]);

  // Function to choose image from gallery
  const chooseImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to upload image and get download URL
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, "Images/" + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload failed: ", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at ", downloadURL); // Optional: Log downloadURL to console
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  // Function to add item to Firestore
  const saveItem = async () => {
    try {
      const imageURL = await uploadImage(image);

      if (!imageURL) {
        throw new Error("Failed to upload image and retrieve URL.");
      }

      const newItem = {
        name,
        image: imageURL,
        description,
        price,
        salesPrice,
        isOnSale,
        countInStock,
        tag,
      };

      // Add item to Firestore data base collection "Items"
      await addDoc(collection(db, "Items"), newItem);

      // Update local state or perform any additional actions upon successful addition
      setItem([...item, newItem]);
      console.log(newItem); // Optional: Log newItem to console

      // Show success message
      Alert.alert("Success", "Item has been added successfully!");
    } catch (error) {
      console.error("Error adding item to Firestore: ", error);
      Alert.alert("Error", "Failed to add item. Please try again later.");
    }
  };

  if (screen === "AddItem") {
    return (
      <KeyboardAvoidingView>
        <Center>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false), navigation.navigate("Home");
            }}
            size="lg"
          >
            <KeyboardAvoidingView
              behavior="padding"
              flex={1}
              justifyContent="center"
              alignItems="center"
            >
              <Modal.Content width={400} bgColor={colors.lighterRed}>
                <Modal.CloseButton />
                <Modal.Header>Item</Modal.Header>
                <Modal.Body>
                  <VStack space={7}>
                    <HStack
                      alignItems="center"
                      justifyContent="space-between"
                      mt={3}
                    >
                      <Text fontWeight="medium">Name</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <TextArea
                        w={250}
                        h={100}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Product Name( With Short Description: Optional. )..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        onChangeText={(text) => setName(text)}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Description</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <TextArea
                        w={250}
                        h={200}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Detailed Description..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        onChangeText={(text) => setDescription(text)}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium" mb={16}>
                        Image
                      </Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <VStack>
                        <Image
                          source={{
                            uri: image,
                          }}
                          alt="Item image"
                          w={250}
                          h={250}
                          borderRadius={4}
                        />
                        <Button
                          w={110}
                          h={9}
                          backgroundColor={colors.mainRed}
                          mt={3}
                          mb={1}
                          rounded="sm"
                          shadow={3}
                          onPress={chooseImageFromGallery}
                        >
                          Select Image
                        </Button>
                        <Text>Either: jpg, jpeg, or png format.</Text>
                      </VStack>
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Price</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Input
                        w={250}
                        h={50}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Price..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        keyboardType="decimal-pad"
                        onChangeText={(num) =>
                          setPrice(parseFloat(num).toFixed(2))
                        }
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">On Sale</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Select
                        bg={colors.white}
                        borderWidth={0}
                        rounded={5}
                        w={250}
                        py={4}
                        placeholder={isOnSale !== "Yes" ? "No" : "Yes"}
                        _selectedItem={{
                          bg: colors.main,
                          endIcon: <CheckIcon size={3} />,
                        }}
                        //selectedValue={ratings}
                        //onValueChange={(e) => setRatings(e)}
                      >
                        <Select.Item
                          label=" Yes"
                          value="true"
                          onPress={() => {
                            setIsOnSale("Yes"), setReadOnly(false);
                          }}
                          dis
                        />
                      </Select>
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Sale's Price</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Input
                        w={250}
                        h={50}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Sales Price..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        keyboardType="decimal-pad"
                        readOnly={readOnly}
                        onChangeText={(num) =>
                          setSalesPrice(parseFloat(num).toFixed(2))
                        }
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Amount In Stock</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Input
                        w={250}
                        h={50}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Amount..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        keyboardType="number-pad"
                        onChangeText={(num) => setCountInStock(parseInt(num))}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium" mt={7}>
                        Tag
                      </Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <VStack>
                        <Text mt={1} mb={1}>
                          Choose a Tag
                        </Text>
                        <Select
                          bg={colors.white}
                          borderWidth={0}
                          rounded={5}
                          w={250}
                          py={4}
                          placeholder={tag}
                          _selectedItem={{
                            bg: colors.main,
                            endIcon: <CheckIcon size={3} />,
                          }}
                        >
                          <Select.Item
                            label=" Beverages"
                            value="true"
                            onPress={() => setTag("Beverages")}
                            dis
                          />
                          <Select.Item
                            label=" Food"
                            value="true"
                            onPress={() => setTag("Food")}
                            dis
                          />
                          <Select.Item
                            label=" Groceries"
                            value="true"
                            onPress={() => setTag("Groceries")}
                            dis
                          />
                          <Select.Item
                            label=" Health & Personal Care"
                            value="true"
                            onPress={() => setTag("Health & Personal Care")}
                            dis
                          />
                        </Select>
                      </VStack>
                    </HStack>
                  </VStack>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    flex={1}
                    bg={colors.mainRed}
                    h={45}
                    _text={{ color: colors.white }}
                    onPress={() => {
                      navigation.goBack();
                      saveItem();
                      setShowModal(false);
                    }}
                    _pressed={{ bg: colors.mainRed }}
                  >
                    ADD ITEM
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </KeyboardAvoidingView>
          </Modal>
        </Center>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <KeyboardAvoidingView>
        <Center>
          <Buttone
            onPress={() => setShowModal(true)}
            bg={colors.main}
            color={colors.white}
            mt={5}
          >
            ADD ITEM
          </Buttone>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            size="lg"
          >
            <KeyboardAvoidingView
              behavior="padding"
              flex={1}
              justifyContent="center"
              alignItems="center"
            >
              <Modal.Content width={400} bgColor={colors.lighterRed}>
                <Modal.CloseButton />
                <Modal.Header>Product</Modal.Header>
                <Modal.Body>
                  <VStack space={7}>
                    <HStack
                      alignItems="center"
                      justifyContent="space-between"
                      mt={3}
                    >
                      <Text fontWeight="medium">Name</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <TextArea
                        w={250}
                        h={100}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Product Name( With Short Description: Optional. )..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Description</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <TextArea
                        w={250}
                        h={200}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Detailed Description..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Image</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <VStack>
                        <Image
                          source={{
                            uri: "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg",
                          }}
                          alt="Item image"
                          w={250}
                          h={250}
                          borderRadius={4}
                        />
                        <Button
                          w={110}
                          h={9}
                          backgroundColor={colors.main}
                          mt={2}
                          mb={1}
                          rounded="sm"
                          shadow={3}
                        >
                          Select Picture
                        </Button>
                        <Text>Either: jpg, jpeg, or png format.</Text>
                      </VStack>
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Price</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Input
                        w={250}
                        h={50}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Price..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">On Sale</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Select
                        bg={colors.white}
                        borderWidth={0}
                        rounded={5}
                        w={250}
                        py={4}
                        placeholder={isOnSale !== "Yes" ? "No" : "Yes"}
                        _selectedItem={{
                          bg: colors.main,
                          endIcon: <CheckIcon size={3} />,
                        }}
                        //selectedValue={ratings}
                        //onValueChange={(e) => setRatings(e)}
                      >
                        <Select.Item
                          label=" Yes"
                          value="true"
                          onPress={() => {
                            setIsOnSale("Yes"), setReadOnly(false);
                          }}
                          dis
                        />
                      </Select>
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Sale's Price</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Input
                        w={250}
                        h={50}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Sales Price..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        keyboardType="decimal-pad"
                        readOnly={readOnly}
                        onChangeText={(num) =>
                          setSalesPrice(parseFloat(num).toFixed(2))
                        }
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium">Amount In Stock</Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <Input
                        w={250}
                        h={50}
                        bgColor={colors.white}
                        borderColor={colors.white}
                        placeholder="Enter Amount..."
                        _focus={{
                          bg: colors.white,
                          borderColor: colors.neonRed1,
                          borderWidth: 1,
                        }}
                        keyboardType="number-pad"
                        onChangeText={(num) => setCountInStock(parseInt(num))}
                      />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between">
                      <Text fontWeight="medium" mt={7}>
                        Tag
                      </Text>
                      {/* <Text color={i.color === 'main' ? colors.main : colors.black } bold> */}
                      <VStack>
                        <Text mt={1} mb={1}>
                          Choose a Tag
                        </Text>
                        <Select
                          bg={colors.white}
                          borderWidth={0}
                          rounded={5}
                          w={250}
                          py={4}
                          placeholder={tag}
                          _selectedItem={{
                            bg: colors.main,
                            endIcon: <CheckIcon size={3} />,
                          }}
                        >
                          <Select.Item
                            label=" Beverages"
                            value="true"
                            onPress={() => setTag("Beverages")}
                            dis
                          />
                          <Select.Item
                            label=" Food"
                            value="true"
                            onPress={() => setTag("Food")}
                            dis
                          />
                          <Select.Item
                            label=" Groceries"
                            value="true"
                            onPress={() => setTag("Groceries")}
                            dis
                          />
                          <Select.Item
                            label=" Health & Personal Care"
                            value="true"
                            onPress={() => setTag("Health & Personal Care")}
                            dis
                          />
                        </Select>
                      </VStack>
                    </HStack>
                  </VStack>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    flex={1}
                    bg={colors.mainRed}
                    h={45}
                    _text={{ color: colors.white }}
                    onPress={() => {
                      navigation.navigate("Order");
                      setShowModal(false);
                    }}
                    _pressed={{ bg: colors.mainRed }}
                  >
                    ADD PRODUCT
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </KeyboardAvoidingView>
          </Modal>
        </Center>
      </KeyboardAvoidingView>
    );
  }
};

export default AddItemModal;
