import { Center, Heading } from "native-base";
import React, { useState, useEffect } from "react";
import colors from "../Color";
import Tabs from "../Components/Profile/Tabs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function ProfileScreen() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, "Users", user.uid); // Assuming you store users by UID
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUserName(userData.username);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Center bg={colors.neonRed1} pt={100} pb={6}>
        <Heading bold fontSize={40} isTruncated my={2} color={colors.white}>
          {userName || "Loading..."}
        </Heading>
      </Center>
      {/* TABS */}
      <Tabs />
    </>
  );
}

export default ProfileScreen;
