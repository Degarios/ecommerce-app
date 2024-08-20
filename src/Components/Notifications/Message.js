//import { View, Text } from 'react-native'
import React from 'react'
import { Center } from 'native-base'
import { Text } from 'native-base'

export default function Message({bg, color, children, size, bold}) {
  return (
    <Center bg={bg} p={4} rounded={5}>
        <Text color={color} fontSize={size} bold={bold}>
            { children }
        </Text>
    </Center>
  )
}