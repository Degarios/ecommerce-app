import { Box, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import colors from "../Color";
import HomeProducts from "../Components/HomeProducts";
import HomeSearch from "../Components/HomeSearch";
import HomeSales from "../Components/HomeSales";
import Categories from "../Components/Categories";
import Admin from "../Components/Admin/Admin.js";
import { auth } from "../../firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged

function HomeScreen() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user's email is "admin@pribet.com"
        setIsAdmin(user.email === "admin@pribet.com");
      } else {
        setIsAdmin(false);
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  return (
    <Box flex={1} bg={colors.whiteRed}>
      <HomeSearch />
      <ScrollView>
        <Categories />
        <HomeSales />
        <HomeProducts />
      </ScrollView>
      {isAdmin && <Admin />} {/* Conditionally render Admin component */}
    </Box>
  );
}

export default HomeScreen;
