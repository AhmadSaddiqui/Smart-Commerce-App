import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function BackButton() {
    const navigation = useNavigation()
  return (
    <View>
   <TouchableOpacity style={{margin:15}} onPress={()=>navigation.goBack()}>
    <Image resizeMode='contain' style={{height:30,width:30}} source={require('../../assets/images/Cart/back.png')}/>
   </TouchableOpacity>
    </View>
  )
}