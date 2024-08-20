import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen";
import SingleProductScreen from "../Screens/SingleProductScreen";
import ShippingScreen from "../Screens/ShippingScreen";
import PaymentScreen from "../Screens/PaymentScreen";
import PlaceOrderScreen from "../Screens/PlaceOrderScreen";
import ProductsCategory from "../Components/ProductsCategory";
import SalesCategory from "../Components/SalesCategory";
import BeveragesCategory from "../Components/BeveragesCategory";
import FoodCategory from "../Components/FoodCategory";
import GroceriesCategory from "../Components/GroceriesCategory";
import HealthAndPersonalCategory from "../Components/HealthAndPersonalCategory";
import ItemList from "../Components/Admin/ItemList";
import SearchScreen from "../Screens/SearchScreen";
import AddItemScreen from "../Components/Admin/AddItemScreen";
import DashboardScreen from "../Components/Admin/DashboardScreen";
import ViewItemsScreen from "../Components/Admin/ViewItemsScreen";
import OrderScreen from "../Screens/OrderScreen";
import BottomNav from "./BottomNav";

const Stack = createNativeStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Single" component={SingleProductScreen} />
      <Stack.Screen name="Shipping" component={ShippingScreen} />
      <Stack.Screen name="Checkout" component={PaymentScreen} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
      <Stack.Screen name="ProductsCategory" component={ProductsCategory} />
      <Stack.Screen name="SalesCategory" component={SalesCategory} />
      <Stack.Screen name="BeveragesCategory" component={BeveragesCategory} />
      <Stack.Screen name="FoodCategory" component={FoodCategory} />
      <Stack.Screen name="GroceriesCategory" component={GroceriesCategory} />
      <Stack.Screen
        name="HealthAndPersonalCategory"
        component={HealthAndPersonalCategory}
      />
      <Stack.Screen name="ItemList" component={ItemList} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ gestureEnabled: false }}
        initialParams={{
          search: "Search",
        }}
      />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ViewItems" component={ViewItemsScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen
        name="Bottom"
        component={BottomNav}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNav;
