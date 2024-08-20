import React from "react";
import { Box, Button, Text, HStack, ScrollView } from "native-base";
import colors from "../Color";
import { useNavigation } from "@react-navigation/native";

const CategoryList = [
  {
    title: "BEVERAGES",
    screen: "BeveragesCategory",
  },
  {
    title: "FOOD",
    screen: "FoodCategory",
  },
  {
    title: "GROCERIES",
    screen: "GroceriesCategory",
  },
  {
    title: "HEALTH & PERSONAL CARE",
    screen: "HealthAndPersonalCategory",
  },
];

function Categories() {
  const navigation = useNavigation();

  return (
    <Box>
      {/*<Text
            mt={5}
            mb={1}
            ml={2}
            fontSize={24}
            fontWeight='bold'
            color={colors.subRed1}
        >
            wardrobe
        </Text>*/}
      <ScrollView>
        <HStack ml={1}>
          {CategoryList.map((i, index) => (
            <Button
              w="22.5%"
              h="8"
              mt={5}
              mx={1}
              mb={2.5}
              rounded="full"
              bg={colors.white}
              shadow="4"
              _text={{
                color: colors.black,
                fontWeight: "extrabold",
                fontSize: "9",
              }}
              _pressed={{ bg: colors.white }}
              onPress={() =>
                navigation.navigate(i.screen, { paramKey: i.title })
              }
              key={index}
            >
              {i.title}
            </Button>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
}

export default Categories;
