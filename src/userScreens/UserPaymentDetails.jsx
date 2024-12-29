import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import { useDispatch, useSelector } from 'react-redux';
import GlobalButton from '../components/GlobalButton';
import { useRoute } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseurlOrder } from '../Apis/apiConfig';
import Snackbar from 'react-native-snackbar';
import GlobalInput from '../components/GlobalInput';

export default function UserPaymentDetails({ navigation }) {
  const route = useRoute();
  const item = route?.params?.item;
  let address = route?.params?.address;
  const total = route?.params?.total;
  let govtTax = route?.params?.govtTax;
  govtTax = Number(govtTax).toFixed(2);

  const cartItems = useSelector(state => state.cart.items);
  const [loading, setloading] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);
  const [cardDetails, setCardDetails] = useState('');
  const { confirmPayment } = useStripe();

  const placeOrder = async () => {
    if (!isCardValid || !cardDetails.complete) {
      Snackbar.show({
        text: 'Invalid card details. Please check and try again.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
        textColor: 'white',
        marginBottom: 0,
      });
      return;
    }
  
    setloading(true);
    try {
      const buyerId = await AsyncStorage.getItem('buyerId');
      const token = await AsyncStorage.getItem('buyerToken');
      const items = cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
      }));
      const payload = {
        buyerId: buyerId,
        items: items,
        shippingAddress: address,
        billingAddress: address,
        govtTax,
        description: '',
      };
  
      console.log(payload);
      
      // Create payment intent
      const response = await fetch(`${BaseurlOrder}create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(payload),
      });
  
      const { clientSecret, order } = await response.json();
      console.log('Payment intent:', order, clientSecret);
  
      if (!clientSecret) {
        console.error('Client secret is null or undefined');
        Snackbar.show({
          text: 'Error creating payment. Please try again later.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
          textColor: 'white',
          marginBottom: 0,
        });
        setloading(false);
        return;
      }
  
      // Confirm the payment with Stripe using the client secret
      const { paymentIntent, error: stripeError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card', // Specify the payment method type here
        billingDetails: {
          name: 'Customer Name', // Add more billing details if needed
        },
      });
      
      if (stripeError) {
        console.error('Error with Stripe:', stripeError.message);
        Snackbar.show({
          text: `Error with payment: ${stripeError.message}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
          textColor: 'white',
          marginBottom: 0,
        });
        setloading(false);
        return;
      }
  
      // If payment succeeds, place the order
      const orderResponse = await fetch(`${BaseurlOrder}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          ...order,
        }),
      });
  
      const result = await orderResponse.json();
      console.log('Order placed successfully:', result);
      if (result) {
        Snackbar.show({
          text: 'Order placed successfully!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(0, 128, 0, 1)', // Custom success color
          textColor: 'white',
          marginBottom: 0,
        });
        navigation.navigate('UserPaymentDetailsConfirm', { id: result._id, item: items });
      }
  
      setloading(false);
  
    } catch (error) {
      console.error('There was an error placing the order:', error);
      Snackbar.show({
        text: 'There was an error placing the order. Please try again later.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
        textColor: 'white',
        marginBottom: 0,
      });
      setloading(false);
    }
  };
  

  useEffect(() => {
    console.log('total:', total);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment Details</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: '5%', marginTop: "5%" }}>
            <Image style={{ height: 50, width: 98 }} source={require('../../assets/images/Payment/visa.png')} />
            <Image style={{ height: 50, width: 98 }} source={require('../../assets/images/Payment/mastercard.png')} />
            <Image style={{ height: 50, width: 98 }} source={require('../../assets/images/Payment/bluecard.png')} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: '5%', marginTop: "8%" }}>
            <Text style={{ fontSize: 16, color: themeStyle.BLACK, fontFamily: FONT.ManropeSemiBold }}>Payment Amount</Text>
          </View>
          <Text style={{ fontSize: 16, color: themeStyle.BLACK, fontFamily: FONT.ManropeSemiBold, marginLeft: '5%', marginTop: '1%' }}>$ {total?.toFixed(2)}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: '5%', marginTop: '5%' }}>
      <CardField
        postalCodeEnabled={false}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          placeholderColor: '#C4C4C4', // Set the placeholder color
          borderColor: '#000000', // Set the border color
          borderWidth: 1, // Set the border width
          borderRadius: 5, // Set border radius for rounded corners
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          console.log('Card Details:', cardDetails);
          setCardDetails(cardDetails);
          setIsCardValid(cardDetails.complete);
        }}
      />
    </View>
          <GlobalInput keyboardType='numeric' title={'Zip Code'} hint={'8899'} marginTop={'5%'} />

          <GlobalButton loading={loading} onPress={placeOrder} marginTop={'10%'} title={'Pay Now'} />

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
