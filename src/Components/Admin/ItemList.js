import React from 'react'
import { Box, Button, Center, HStack, Image, Pressable, Text, VStack } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import products from '../../data/Products'
import colors from "../../Color"
import { FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons';


const Swiper = () => (
    <SwipeListView
        rightOpenValue={-50}
        previewRowKey='0'
        previewOpenValue={-40}
        previewOpenDelay={3000}
        //data={products.slice(0,2)}
        data={products}
        renderItem={renderItems}
        renderHiddenItem={renderHiddenItems}
        showsVerticalScrollIndicator={false}
    />
)

const renderItems = (data, rowMap) => (
    <Pressable>
        <Box ml={6} mb={3}>
            <HStack 
                alignItems='center' 
                bg={colors.white} 
                shadow={1} 
                rounded={10} 
                overflow='hidden'
            >
                <Center w='25%' bg={colors.deepGray}>
                    <Image 
                        source={{ uri: data.item.image }}
                        alt={data.item.name}
                        w='full'
                        h={24}
                        //resizeMode='contain'
                    />
                </Center>
                <Box
                    position='absolute'
                    ml='20.5%'
                    mb='25%'
                >
                    {data.item.sale === true && (
                        <MaterialIcons name="stars" size={24} color={colors.paypal} />
                    )}               
                </Box>
                <VStack w='60%'px={2} space={2}>
                    <Text isTruncated color={colors.black} bold fontSize={10}>
                        { data.item.name }
                    </Text>
                    {data.item.sale != true ? (
                        <Text isTruncated color={colors.black}>
                            NGN: { data.item.price }
                        </Text>
                    ): (
                        <Text isTruncated color={colors.black}>
                            NGN: <Text textDecorationLine='line-through'>{ data.item.price }</Text> <Text>{ data.item.salesPrice}</Text>
                        </Text>
                    )}
                </VStack> 
                <Center>
                    { data.item.countInStock === 0 ? (
                        <Button
                            bg={colors.deepestGray}
                            _pressed={{ bg: colors.main }} 
                            _text={{ color: colors.white }}
                        >
                            X
                        </Button>
                    ): (
                        <Button
                            bg={colors.main}
                            _pressed={{ bg: colors.main }} 
                            _text={{ color: colors.white }}
                        >
                            { data.item.countInStock }
                        </Button>
                    )}
                </Center>
            </HStack>
        </Box>
    </Pressable>
)

// HIDDEN
const renderHiddenItems = () => (
    <Pressable 
        w={50} 
        roundedTopRight={10} 
        roundedBottomRight={10} 
        h='88%' 
        ml='auto' 
        justifyContent='center'
        bg={colors.red} 
    >
        <Center alignItems='center' space={2}>
            <FontAwesome name='trash' size={24} color={colors.white} />
        </Center>
    </Pressable> 
)


const ItemList = () => {
  return (
    <Box mr={6} flex={1} safeAreaTop >
        <Text 
                mt={5}
                mb={3}
                ml={2}
                fontSize={38}
                fontWeight='bold'
                color={colors.subRed1}
                textAlign="center"
            >
                Items
        </Text>
        <Swiper />
    </Box>
  )
}

export default ItemList