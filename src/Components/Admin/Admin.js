import React from "react";
import { View, Text } from "react-native";
import FloatingActionButton from "react-native-floating-action-button-opensource";
import { useNavigation } from "@react-navigation/native";

const Admin = () => {
  const navigation = useNavigation();

  const subButtons = [
    {
      label: "stats-chart",
      title: "Dashboard",
      color: "red",
      onPress: () => navigation.navigate("Dashboard"),
    },
    {
      label: "eye",
      title: "View Items",
      color: "#3498db",
      onPress: () => navigation.navigate("ViewItems"),
    },
    {
      label: "create",
      title: "  Add Item",
      color: "#1abc9c",
      onPress: () => navigation.navigate("AddItem"),
    },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Use the FloatingActionButton component with dynamic buttons */}
      <FloatingActionButton subButtons={subButtons} />
    </View>
  );
};

export default Admin;
