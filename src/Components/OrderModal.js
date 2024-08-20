import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Center,
  HStack,
  Image,
  Modal,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import colors from "../Color";
import Buttone from "./Buttone";

const OrderModal = ({ setUpModal }) => {
  const [showModal, setShowModal] = useState(setUpModal);
  const navigation = useNavigation();

  return (
    <Center>
      <Modal
        isOpen={showModal}
        onClose={() => {
          navigation.navigate("PlaceOrder");
          setShowModal(false);
        }}
        size="lg"
      >
        <Modal.Content maxWidth={350}>
          <Modal.CloseButton />
          <Modal.Header>Order</Modal.Header>
          <Modal.Body>
            <VStack space={7}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Payment Method</Text>
                <Text color={colors.mainRed} bold>
                  Mobile Money
                </Text>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              w="full"
              mt={2}
              bg={colors.mainRed}
              h={45}
              _text={{ color: colors.white }}
              onPress={() => {
                navigation.navigate("Home");
                setShowModal(false);
              }}
              _pressed={{ bg: colors.mainRed }}
            >
              PAY NOW
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default OrderModal;
