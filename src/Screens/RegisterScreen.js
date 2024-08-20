import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Box, Button, Heading, Input, Text, VStack } from "native-base";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db, auth, app } from "../../firebase";
import colors from "../Color";

function RegisterScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const register = async () => {
    // Validate inputs
    if (!email || !password || !username || !address || !phoneNumber) {
      setErrorMessage("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        username: username,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
      });

      // Sign in the user
      await signInWithEmailAndPassword(auth, email, password);

      setLoading(false);
      Alert.alert("Success", "User registered successfully");
      navigation.navigate("Bottom");
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView flex={1} bg={colors.white} alignItems="center">
      <KeyboardAvoidingView behavior="padding" marginTop={-80}>
        <ScrollView>
          <Box>
            <Text fontSize={70} fontWeight="bold" color={colors.mainRed}>
              PribeT
            </Text>
          </Box>
          <Box>
            <View alignItems="center">
              <Heading
                fontSize={17}
                fontWeight="bold"
                marginTop={100}
                color="#041E42"
              >
                Register your Account
              </Heading>
            </View>

            <VStack>
              {/* USERNAME */}
              <View style={{ marginTop: 10 }}>
                <View style={styles.inputContainer}>
                  <Input
                    style={styles.input}
                    InputLeftElement={
                      <FontAwesome
                        name="user"
                        size={24}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    }
                    onChangeText={setUsername}
                    placeholder="Enter your Name e.g John Doe"
                    type="text"
                    value={username}
                    pl={2}
                    color={colors.main}
                  />
                </View>
              </View>

              {/* ADDRESS */}
              <View style={{ marginTop: 10 }}>
                <View style={styles.inputContainer}>
                  <Input
                    style={styles.input}
                    InputLeftElement={
                      <MaterialIcons
                        name="location-pin"
                        size={24}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    }
                    onChangeText={setAddress}
                    placeholder="Enter your Delivery Address"
                    type="text"
                    value={address}
                    pl={2}
                    color={colors.main}
                  />
                </View>
              </View>

              {/* PHONE NUMBER */}
              <View style={{ marginTop: 10 }}>
                <View style={styles.inputContainer}>
                  <Input
                    style={styles.input}
                    InputLeftElement={
                      <FontAwesome
                        name="phone"
                        size={24}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    }
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your Phone Number"
                    type="text"
                    value={phoneNumber}
                    pl={2}
                    color={colors.main}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* EMAIL */}
              <View style={{ marginTop: 10 }}>
                <View style={styles.inputContainer}>
                  <Input
                    style={styles.input}
                    InputLeftElement={
                      <MaterialIcons
                        name="email"
                        size={24}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    }
                    onChangeText={setEmail}
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
                <View style={styles.inputContainer}>
                  <Input
                    style={styles.input}
                    InputLeftElement={
                      <Ionicons
                        name="eye"
                        size={24}
                        color="gray"
                        style={{ marginLeft: 8 }}
                      />
                    }
                    onChangeText={setPassword}
                    placeholder="Enter your Password"
                    type="password"
                    value={password}
                    pl={2}
                    color={colors.main}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Error message display */}
              {errorMessage !== "" && (
                <Text color={colors.red} mt={2} style={styles.errorText}>
                  {errorMessage}
                </Text>
              )}

              {/* Register button */}
              <View alignItems="center">
                <Button
                  _pressed={{ bg: colors.mainRed }}
                  my={30}
                  w="40%"
                  rounded={5}
                  bg={colors.mainRed}
                  onPress={register}
                  isLoading={loading}
                >
                  REGISTER
                </Button>
              </View>

              {/* Navigation to Login screen */}
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text color={colors.lightBlack} textAlign="center">
                  Already have an account? Log In
                </Text>
              </Pressable>
            </VStack>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
    marginHorizontal: 5,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    width: "90%",
    color: colors.red,
    marginBottom: 10,
  },
});

export default RegisterScreen;
