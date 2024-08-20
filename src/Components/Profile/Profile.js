import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Input,
  ScrollView,
  VStack,
  Pressable,
  Text,
} from "native-base";
import { Alert } from "react-native";
import colors from "../../Color";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import Buttone from "../Buttone";

const Profile = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setEmail(user.email);
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("User data fetched:", data);
            setUsername(data.username || "");
            setAddress(data.address || "");
            setPhoneNumber(data.phoneNumber || "");
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, [user, db]); // Depend on user and db

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: username });
      await updateEmail(auth.currentUser, email);
      // Assuming you have a "Users" collection in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        username,
        address,
        phoneNumber,
      });
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await auth.currentUser.reauthenticateWithCredential(credential);
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Success", "Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert(
        "Error",
        "Failed to change password. Please check your current password."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login"); // Navigate to login screen or wherever appropriate
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box h="full" bg={colors.lighterRed} px={5}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space={10} mt={5} pb={10}>
          <FormControl>
            <FormControl.Label
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              USERNAME
            </FormControl.Label>
            <Input
              borderWidth={0.2}
              bg={colors.white}
              borderColor={colors.neonRed1}
              py={4}
              keyboardType="default"
              type="text"
              color={colors.blackRed}
              placeholder="Enter your Name e.g John Doe"
              fontSize={15}
              _focus={{
                bg: colors.white,
                borderColor: colors.neonRed1,
                borderWidth: 1,
              }}
              multiline={true}
              value={username}
              onChangeText={setUsername}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              ADDRESS
            </FormControl.Label>
            <Input
              borderWidth={0.2}
              bg={colors.white}
              borderColor={colors.neonRed1}
              py={4}
              keyboardType="default"
              type="text"
              color={colors.blackRed}
              placeholder="Enter your Delivery Address"
              fontSize={15}
              _focus={{
                bg: colors.white,
                borderColor: colors.neonRed1,
                borderWidth: 1,
              }}
              multiline={true}
              value={address}
              onChangeText={setAddress}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label
              _text={{
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              PHONE NUMBER
            </FormControl.Label>
            <Input
              borderWidth={0.2}
              bg={colors.white}
              borderColor={colors.neonRed1}
              py={4}
              keyboardType="phone-pad"
              type="text"
              color={colors.blackRed}
              placeholder="Enter your Phone Number"
              fontSize={15}
              _focus={{
                bg: colors.white,
                borderColor: colors.neonRed1,
                borderWidth: 1,
              }}
              multiline={true}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </FormControl>

          {/* Other fields and update button */}
          <Buttone
            bg={colors.mainRed}
            color={colors.white}
            onPress={handleUpdateProfile}
          >
            UPDATE PROFILE
          </Buttone>

          <Pressable onPress={handleSignOut}>
            <Text color={colors.mainRed} textAlign="center" fontSize={15}>
              Sign Out
            </Text>
          </Pressable>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default Profile;
