import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import themeStyle, { FONT } from '../styles/themeStyle'
import GlobalInput from '../components/GlobalInput'
import PasswordInput from '../components/PasswordInput'
import GlobalButton from '../components/GlobalButton'
import { ROUTES } from '../routes/RoutesConstants'

export default function SupplierCreateNewPassword({navigation}) {
  const [tick, settick] = useState(true)
  const [modalVisible, setModalVisible] = useState(false);
  const toggletick = () => {
    settick(!tick)
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      <Header title={'Create New Password'} description={`Create new password to access your \n account.`} />
      <PasswordInput title={'Create Password'} hint={'Enter Password'} />
      <PasswordInput title={'Repeat Password'} hint={'Enter Password'} />
      <GlobalButton  onPress={() => setModalVisible(true)} title={'Reset'} marginTop={'8%'} />
      <View style={styles.separator}/>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
<View  style={{flex:1,alignItems:'center',justifyContent:"center",backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
<View style={{height:355,width:'80%',alignSelf:'center',backgroundColor:themeStyle.WHITE,alignItems:'center',borderRadius:10}}>
<Image style={{width:150,height:136,marginTop:'5%'}} source={require('../../assets/images/Payment/tickanimated.png')}/>
<Text style={{fontSize:24,fontFamily:FONT.ManropeSemiBold,color:themeStyle.BLACK,marginTop:'5%'}}>Password Changed!</Text>
<Text style={{fontSize:16,fontFamily:FONT.ManropeRegular,color:themeStyle.TEXT_GREY,marginTop:'5%',textAlign:'center'}}>Your password has been changed {"\n"} successfully.</Text>

<GlobalButton onPress={()=>{
  setModalVisible(false)
  navigation.navigate(ROUTES.SupplierSignin)
}} marginTop={'5%'} title={'Back to login'}/>
</View>
</View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '6%',
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickBox: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  tickImage: {
    height: 7,
    width: 10,
  },
  rememberText: {
    fontSize: 16,
    color: themeStyle.MEDIUM_BLACK,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  forgotText: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
    marginRight: '5%',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '40%',
  },
  signUpText: {
    fontSize: 16,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  signUpLink: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
    marginRight: '5%',
  },
  footerText: {
    fontSize: 12,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
    alignSelf: 'center',
    marginTop: '15%',
  },
  separator:{
    height:20
  }
})
