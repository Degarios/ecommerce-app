import React from 'react'
//import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { Center, Pressable } from 'native-base'
import CartScreen from '../Screens/CartScreen'
import ProfileScreen from '../Screens/ProfileScreen'
import { FontAwesome5, Entypo, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../Color'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import StackNav from './StackNav'
import { SafeAreaProvider } from 'react-native-safe-area-context'


//const Tab = createMaterialBottomTabNavigator()
const Tab = createBottomTabNavigator()
const CustomTab = ({ children, onPress }) => (
    <Pressable
        onPress={onPress}
        h={70}
        w={70}
        rounded='full'
        bg={colors.neonRed1}
        top={-30}
        shadow={2}
    >
        { children }
    </Pressable>
)

const BottomNav = () => {
  return (
    <Tab.Navigator
        backBehavior='Main' 
        initialRouteName='Main' 
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {...styles.tab},
            headerShown: false,
            tabBarHideOnKeyboard: true
        }}
    >
        <Tab.Screen 
            name='Home'
            component={StackNav}
            options={{  
                tabBarIcon: ({focused}) => (
                    <Center>
                        {focused? (
                             <Entypo name='home' size={24} color={colors.mainRed} />
                        ) : (
                            <AntDesign name='home' size={24} color={colors.black} />
                        )}
                    </Center>
                ) 
            }}
        />
        {/* CART */}
        <Tab.Screen 
            name='Cart'
            component={CartScreen}
            tab
            options={{
                tabBarButton: (props) => <CustomTab {...props} />,
                tabBarIcon: ({ focused }) => (
                    <Center>
                        {focused? (
                            <FontAwesome5 name='shopping-basket' size={24} color={colors.white} />
                        ) : (
                            <MaterialCommunityIcons  name='shopping-outline' size={24} color={colors.white} />
                        )}
                    </Center>
                ) 
            }}
        /> 
        {/* PROFILE */}
        <Tab.Screen 
            name='Profile'
            component={ProfileScreen}
            options={{
                tabBarIcon: ({focused}) => (
                    <Center>
                        {focused? (
                             <FontAwesome name='user' size={24} color={colors.mainRed} />
                        ) : (
                            <AntDesign  name='user' size={24} color={colors.black} />
                        )}
                    </Center>
                ) 
            }}
        />
    </Tab.Navigator>    
  )
}

const styles = StyleSheet.create({
    tab: {
        elevation: 0,
        backgroundColor: colors.white,
        height: 50,
    }
})

export default BottomNav