import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { Box, Button, Heading, Input, Text, VStack } from "native-base";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path to your firebase initialization file
import colors from "../Color"; 

function LoginScreen() {
  const [email, setEmail] = useState(""); // To get user email
  const [password, setPassword] = useState(""); // To get user password
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages
  const navigation = useNavigation();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log("Successfully logged in:", user.email);
        // Navigate to your desired screen upon successful login
        navigation.navigate("Bottom");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/user-not-found") {
          setErrorMessage("No user found with this email.");
        } else if (errorCode === "auth/wrong-password") {
          setErrorMessage("The password is incorrect.");
        } else {
          setErrorMessage("Failed to login. Please try again.");
        }
      });
  };

  return (
    <SafeAreaView flex={1} bg={colors.white} alignItems="center">
      <Box>
        <Text fontSize={70} fontWeight="bold" color={colors.mainRed}>
          PribeT
        </Text>
      </Box>

      <KeyboardAvoidingView marginTop={-80}>
        <Box>
          <View alignItems="center">
            <Heading
              fontSize={17}
              fontWeight="bold"
              marginTop={200}
              color="#041E42"
            >
              Login into your Account
            </Heading>
          </View>

          <VStack>
            {/* EMAIL */}
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#D0D0D0",
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 30,
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                <Input
                  style={{
                    color: "gray",
                    marginVertical: 10,
                    width: 300,
                    fontSize: email ? 16 : 16,
                  }}
                  InputLeftElement={
                    <MaterialIcons
                      name="email"
                      size={24}
                      color="gray"
                      style={{ marginLeft: 8 }}
                    />
                  }
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Enter your Email"
                  type="text"
                  value={email}
                  pl={2}
                  color={colors.main}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#D0D0D0",
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 30,
                  marginLeft: 5,
                  marginRight: 5,
                }}
              >
                <Input
                  style={{
                    color: "gray",
                    marginVertical: 10,
                    width: 300,
                    fontSize: email ? 16 : 16,
                  }}
                  InputLeftElement={
                    <Ionicons
                      name="eye"
                      size={24}
                      color="gray"
                      style={{ marginLeft: 8 }}
                    />
                  }
                  placeholder="Enter your Password"
                  w="70%"
                  type="password"
                  value={password}
                  pl={2}
                  color={colors.main}
                  autoCapitalize="none"
                  onChangeText={(text) => setPassword(text)}
                />
              </View>
            </View>

            {/* Error message display */}
            {errorMessage !== "" && (
              <Text
                color={colors.red}
                mt={2}
                mb={2}
                style={{ textAlign: "center", width: "90%" }}
              >
                {errorMessage}
              </Text>
            )}

            {/* Login button */}
            <View alignItems="center">
              <Button
                _pressed={{
                  bg: colors.mainRed,
                }}
                my={30}
                mt={10}
                w="40%"
                rounded={5}
                bg={colors.mainRed}
                onPress={handleLogin}
              >
                LOGIN
              </Button>
            </View>

            {/* Navigation to Register screen */}
            <Pressable mt={15} onPress={() => navigation.navigate("Register")}>
              <Text color={colors.lightBlack} textAlign="center">
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
