import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart, updateItemQuantity } from '../redux/CartSlice';
import GlobalButton from '../components/GlobalButton';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import GlobalInput from '../components/GlobalInput';
import CountryInput from '../components/CountryInput';
import Dropdown from '../components/Dropdown';
import { useRoute } from '@react-navigation/native';
import { BaseurlOrder, BaseurlSupplier } from '../Apis/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserPaymentDetailsConfirm({ navigation }) {
  const route = useRoute()
  const [data, setData] = useState(null);
  const id = route?.params?.id
  const item = route?.params?.item;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [option, setOption] = useState([]);




  useEffect(() => {
    console.log('ID =>', id);

    console.log('item:', item);
    const fetchData = async () => {
      const buyerToken = await AsyncStorage.getItem('buyerToken');
      const requestOptions = {
        method: "GET",
        headers: {
          "x-access-token": buyerToken,  // Include the en in the Authorization header
          "Content-Type": "application/json"  // Assuming JSON format
        },
        redirect: "follow"
      };

      console.log('response:',id);
      try {
        const response = await fetch(`${BaseurlOrder}getorderById/${id}`, requestOptions);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('result:', result)
        for (let i = 0; i < result.items.length; i++) {
          const response2 = await fetch(`${BaseurlSupplier}${result.items[i].supplierId}`);
          const json = await response2.json();
          // console.log('json:', json?.selectedDeliveryOption);
          setOption(prev => [...prev, " ", json?.selectedDeliveryOption]);
        }
        setData(result);
      } catch (error) {
        console.log('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <View style={styles.container}>
        {
          loading ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
              </View>

              <Image style={{ height: 112, width: 112, alignSelf: 'center', marginTop: '10%' }} source={require('../../assets/images/Payment/tick.png')} />

              <Text style={{ fontSize: 24, fontFamily: FONT.ManropeSemiBold, color: themeStyle.BLACK, alignSelf: "center", marginTop: '5%' }}>Order Accepted</Text>
              <Text style={{ fontSize: 24, fontFamily: FONT.ManropeSemiBold, color: themeStyle.BLACK, alignSelf: "center", marginTop: '5%' }}>{data?.buyerId?.name}</Text>
              <Text style={{ fontSize: 16, fontFamily: FONT.ManropeSemiBold, color: themeStyle.TEXT_GREY, alignSelf: "center", marginTop: '2%', textAlign: "center" }}>Your order {"\n"} has been accepted   and is now being processed by the supplier.</Text>
              <Text style={{ fontSize: 20, fontFamily: FONT.ManropeSemiBold, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '5%' }}>Order Details:</Text>

              <View style={{ height: 256, width: '90%', alignSelf: "center", backgroundColor: themeStyle.WHITE, borderRadius: 10, marginTop: "2%" }}>
              {option && <Text style={{ fontSize: 20, fontFamily: FONT.ManropeSemiBold, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '5%' }}>Order ID:</Text>}
              {option && <Text style={{ fontSize: 16, fontFamily: FONT.ManropeSemiBold, color: themeStyle.TEXT_GREY, marginTop: '2%', marginLeft: '5%' }}>{data._id}</Text>}
                <Text style={{ fontSize: 20, fontFamily: FONT.ManropeSemiBold, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '5%' }}>Delivery Address:</Text>
                <Text style={{ fontSize: 16, fontFamily: FONT.ManropeSemiBold, color: themeStyle.TEXT_GREY, marginTop: '2%', marginLeft: '5%' }}>{data?.shippingAddress}</Text>


                <Text style={{ fontSize: 20, fontFamily: FONT.ManropeSemiBold, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '5%' }}>Estimated Delivery Time:</Text>
                <Text style={{ fontSize: 16, fontFamily: FONT.ManropeSemiBold, color: themeStyle.TEXT_GREY, marginTop: '2%', marginLeft: '5%' }}>2 to 3 Working Days</Text>
              </View>

              <Text style={{ fontSize: 16, fontFamily: FONT.ManropeSemiBold, color: themeStyle.TEXT_GREY, marginTop: '2%', marginLeft: '5%' }}>You will receive further updates on the status   of your order shortly. Thank you for choosing our service.</Text>


              <GlobalButton onPress={() => navigation.navigate('UserMyOrders')} marginTop={'10%'} title={'Go to Order Histroy'} />

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )
        }
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  rightActionsContainer: {
    marginTop: '5%',
  },
  deleteButton: {
    marginTop: '30%',
  },
  icon: {
    height: 37,
    width: 37,
  },
  cartItemContainer: {
    height: 106,
    width: '95%',
    backgroundColor: themeStyle.HOME_ITEM,
    alignSelf: 'center',
    marginTop: '5%',
    justifyContent: 'center',
  },
  cartItemRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    height: 77,
    width: 77,
    backgroundColor: themeStyle.WHITE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5%',
    right: 10

  },
  cartItemImage: {
    width: 46,
    height: 38,
  },
  itemTitle: {
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    fontSize: 16,

  },
  itemQuantity: {
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    left: '12%',
  },
  decrementButton: {
    height: 20,
    width: 20,
    backgroundColor: themeStyle.TEXT_GREY,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    left: 5,
  },
  decrementIcon: {
    width: 5,
    height: 1,
  },
  itemQuantityText: {
    fontSize: 14,
    color: themeStyle.TEXT_GREY,
    marginLeft: '10%',
  },
  incrementButton: {
    height: 20,
    width: 20,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '10%',
    right: 5,
  },
  incrementIcon: {
    width: 6,
    height: 6,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginLeft: 'auto',
    right: 10,
    bottom: 25,
  },
  timeAgoContainer: {
    height: 17,
    width: 47,
    borderWidth: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeAgoText: {
    fontSize: 6,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  itemPrice: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeSemiBold,
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
    marginLeft: '20%',
    fontFamily: FONT.ManropeSemiBold,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  productsTitle: {
    fontSize: 20,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },
  productsCount: {
    fontSize: 14,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billSummaryTitle: {
    fontSize: 20,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
    marginLeft: '5%',
  },
  billSummaryContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: themeStyle.HOME_ITEM,
  },
  billItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    marginTop: '5%',
  },
  billItemText: {
    fontSize: 16,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
  },
  billItemPrice: {
    fontSize: 16,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },
  dashedSeparator: {
    height: 1,
    borderColor: themeStyle.TEXT_GREY,
    borderStyle: 'dashed',
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
  },
  subTotalPrice: {
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeSemiBold,
  },
  bottomSpacer: {
    height: 100,
  },

  MainNoCart: {
    // paddingTop: '30%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },

  noCartImage: {
    height: 218,
    width: 218
  },

  NoCartHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },

  NoCartText: {
    textAlign: 'center',
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
    marginTop: "3%",
    fontSize: 20
  },
});
