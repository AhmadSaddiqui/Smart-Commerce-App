import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { ROUTES } from '../routes/RoutesConstants';
import GlobalButton from '../components/GlobalButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SupplierSetting({ navigation }) {

  const handleLogout = async () => {
    await AsyncStorage.removeItem('supplierId');
    navigation.replace(ROUTES.Onboarding);
  };

  return (
    <View style={styles.container}>
      <ScrollView>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>


        <View style={{ height: 686, width: '94%', alignSelf: "center", backgroundColor: themeStyle.WHITE, marginTop: '2%' }}>
          <Text style={{ fontSize: 18, color: themeStyle.BLACK, fontFamily: FONT.ManropeSemiBold, marginLeft: '5%', marginTop: '5%' }}>Notifications</Text>

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SupplierEditProfile)} style={{ flexDirection: "row", alignItems: 'center', marginLeft: '10%', marginTop: '5%' }}>
            <Image style={{ height: 25, width: 19 }} source={require('../../assets/icons/setting/cart.png')} />
            <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeSemiBold, marginLeft: '3%' }}> Update Profile</Text>

          </TouchableOpacity>

          {/* <TouchableOpacity  onPress={()=>navigation.navigate(ROUTES.Promotions)} style={{flexDirection:"row",alignItems:'center',marginLeft:'10%',marginTop:'5%'}}>
<Image style={{height:27,width:25}} source={require('../../assets/icons/setting/promote.png')}/>
<Text style={{fontSize:18,color:themeStyle.TEXT_GREY,fontFamily:FONT.ManropeSemiBold,marginLeft:'3%'}}>Promotions</Text>
</TouchableOpacity> */}

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.Promotions)} style={{ flexDirection: "row", alignItems: 'center', marginLeft: '10%', marginTop: '5%' }}>
            <Image style={{ height: 27, width: 25 }} source={require('../../assets/icons/setting/promote.png')} />
            <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeSemiBold, marginLeft: '3%' }}>Delivery Options</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.ProductAlerts)} style={{ flexDirection: "row", alignItems: 'center', marginLeft: '10%', marginTop: '5%' }}>
            <Image style={{ height: 24, width: 21 }} source={require('../../assets/icons/setting/notify.png')} />
            <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeSemiBold, marginLeft: '3%' }}> Product Alert</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 18, color: themeStyle.BLACK, fontFamily: FONT.ManropeSemiBold, marginLeft: '5%', marginTop: '5%' }}>Security</Text>

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.SupplierChangePassword)} style={{ flexDirection: "row", alignItems: 'center', marginLeft: '10%', marginTop: '5%' }}>
            <Image style={{ height: 25, width: 19 }} source={require('../../assets/icons/setting/lock.png')} />
            <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeSemiBold, marginLeft: '5%' }}>Change Password</Text>
            <Image resizeMode='contain' style={{ height: 25, width: 19, marginLeft: 'auto', marginRight: '10%' }} source={require('../../assets/icons/setting/Down_Arrow_3_.png')} />

          </TouchableOpacity>

          <Text style={{ fontSize: 18, color: themeStyle.BLACK, fontFamily: FONT.ManropeSemiBold, marginLeft: '5%', marginTop: '5%' }}>Language Preference</Text>

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.ChooseLanguage)} style={{ flexDirection: "row", alignItems: 'center', marginLeft: '10%', marginTop: '5%' }}>
            <Image style={{ height: 23, width: 27 }} source={require('../../assets/icons/setting/lang.png')} />
            <Text style={{ fontSize: 18, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeSemiBold, marginLeft: '3%' }}>Choose Language</Text>
            <Image resizeMode='contain' style={{ height: 25, width: 19, marginLeft: 'auto', marginRight: '10%' }} source={require('../../assets/icons/setting/Down_Arrow_3_.png')} />

          </TouchableOpacity>

          <GlobalButton marginTop={26} onPress={handleLogout} title={'Log Out'} />
        </View>

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  addressContainer: {
    flexDirection: 'row',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locIcon: {
    width: 12,
    height: 16,
  },
  addressText: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  downIcon: {
    width: 10,
    height: 8,
    marginLeft: '5%',
  },
  address: {
    fontSize: 16,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '10%',
  },
  dpIcon: {
    height: 31,
    width: 31,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 51,
    width: '85%',
    backgroundColor: themeStyle.LIGHT_GREY,
    marginRight: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '8%',
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginLeft: 10,
  },
  searchInput: {
    paddingLeft: 20,
    color: themeStyle.BLACK,
    width: '85%',
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  categoriesTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
  },
  leftArrow: {
    marginLeft: 'auto',
    left: 75,
  },
  rightArrow: {
    marginLeft: 'auto',
    marginRight: '5%',
  },
  arrowIcon: {
    height: 19,
    width: 19,
    marginLeft: '5%'
  },
  flatListContainer: {
    paddingHorizontal: 10,
    marginTop: '5%',
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 57,
    height: 57,
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  chunkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  chunkTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
  },
  viewAll: {
    marginLeft: '55%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeRegular,
  },
  chunkListContainer: {
    paddingHorizontal: 10,
    marginTop: '5%',
  },
  chunkItem: {
    height: 218,
    width: 158,
    backgroundColor: themeStyle.bgcItem,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    marginHorizontal: 5,
    justifyContent: 'center',
    marginTop: '5%',
  },
  chunkImageContainer: {
    height: 107,
    width: 107,
    backgroundColor: themeStyle.WHITE,
    alignSelf: 'center',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chunkImage: {
    height: 56,
    width: 86,
  },
  chunkTitle: {
    fontSize: 14,
    fontFamily: FONT.ManropeSemiBold,
    marginTop: '5%',
    marginLeft: '5%',
    color: themeStyle.BLACK,
  },
  chunkPrice: {
    fontSize: 12,
    fontFamily: FONT.ManropeBold,
    marginTop: '0%',
    marginLeft: '5%',
    color: themeStyle.PRIMARY_COLOR,
  },
  chunkPriceUnit: {
    fontSize: 8,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  chunkActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: '5%',
  },
  heartButton: {
    height: 28,
    width: 28,
    borderColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  heartIcon: {
    width: 12,
    height: 15,
    top: 2
  },
  cartButton: {
    height: 28,
    width: 97,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 5,
    marginLeft: '5%',
    alignItems: 'center',
    borderWidth: 1
  },
  cartIcon: {
    width: 10,
    height: 8.75,
  },
  cartText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
    top: 5
  },
  footerSpace: {
    height: 80,
  },
  container1: {
    height: 105,
    width: 160,
    backgroundColor: themeStyle.PINK,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
  },
  totalSalesText: {
    fontSize: 12,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeSemiBold,
  },
  handImage: {
    height: 32,
    width: 32,
  },
  amountText: {
    fontSize: 24,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
    marginLeft: '5%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: '5%',
  },
  pathImage: {
    height: 6,
    width: 11,
  },
  percentageText: {
    fontSize: 8,
    color: themeStyle.GREEN,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  upFromText: {
    fontSize: 8,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  header: {
    height: 70,
    backgroundColor: themeStyle.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5
  },
  backButton: {
    marginLeft: '8%',
  },
  backIcon: {
    width: 24,
    height: 28,
  },
  headerTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    marginLeft: '25%',
    fontFamily: FONT.ManropeSemiBold,
  },
});
