//import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Box, CheckIcon, FormControl, Heading, Select, Text, TextArea, VStack } from 'native-base'
import colors from '../Color'
import Rating from './Rating'
import Message from './Notifications/Message'
import Buttone from './Buttone'

export default function Review() {
    const [ratings, setRatings] = useState('')

  return (
    <Box my={9}>
      <Heading bold fontSize={15} mb={2}>
        REVIEW
      </Heading>
      {/* IF THERE IS NO REVIEW */}
      {/* <Message 
            color={colors.main}
            bg={colors.deepGray}
            bold
            children={"NO REVIEW"}
        /> */}

      {/* REVIEW */}
      <Box p={3} bg={colors.lighterRed} mt={5} rounded={5}>
        <Heading fontSize={15} color={colors.black}>
            User Doe
        </Heading>
        <Rating value={4} />
        <Text my={2} fontSize={11}>July 19 2023</Text>
        <Message 
            color={colors.black}
            bg={colors.white}
            size={10}
            children={
                "NativeBase VS Code Extensions are specifically designed to quicken your development process using NativeBase 3.0."
            }
        />
      </Box>
      {/* WRITE REVIEW */}
      <Box mt={6}>
        <Heading fontSize={15} bold mb={4}>
            REVIEW THIS PRODUCT
        </Heading>
        <VStack space={6}>
            <FormControl>
                <FormControl.Label
                    _text={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    Rating
                </FormControl.Label>
                <Select
                    bg={colors.lighterRed}
                    borderWidth={0}
                    rounded={5}
                    py={4}
                    placeholder='Choose Rate'
                    _selectedItem={{
                        bg: colors.lighterRed,
                        endIcon: <CheckIcon size={3} />,
                    }}
                    selectedValue={ratings}
                    onValueChange={(e) => setRatings(e)}
                >
                    <Select.Item label='1 - Poor' value='1' />
                    <Select.Item label='2 - Fair' value='2' />
                    <Select.Item label='3 - Good' value='3' />
                </Select>
            </FormControl>
            <FormControl>
                <FormControl.Label
                    _text={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                    Comment
                </FormControl.Label>
                <TextArea
                    h={20}
                    w='full'
                    placeholder='This product is good .....'
                    borderWidth={0}
                    bg={colors.lighterRed}
                    py={2}
                    _focus={{
                        bg: colors.lighterRed,
                    }}
                />
            </FormControl>
            <Buttone bg={colors.mainRed} color={colors.white}>
                SUBMIT
            </Buttone>

            {/* IF NOT LOGIN */}
            {/* 
                <Message 
                    color={colors.white}
                    bg={colors.black}
                    children={"Please 'Login' to write a review"}
                /> 
            */}
        </VStack>
      </Box>
    </Box>
  )
}