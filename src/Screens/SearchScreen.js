import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  FormControl,
  Input,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import colors from "../Color";
import Categories from "../Components/Categories";
import HomeSearch from "../Components/HomeSearch";

function SearchScreen() {
  return <HomeSearch isFocused={true} screen="Search" />;
}

export default SearchScreen;
