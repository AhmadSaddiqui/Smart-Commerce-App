import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import GlobalInput from '../components/GlobalInput';
import Dropdown from '../components/Dropdown';
import GlobalButton from '../components/GlobalButton';
import { ROUTES } from '../routes/RoutesConstants';
import themeStyle, { FONT } from '../styles/themeStyle';
import Snackbar from 'react-native-snackbar';
import { useRoute } from '@react-navigation/native';

export default function EditAddress({ navigation }) {
  const route = useRoute()
  const id = route?.params?.id
  const item = route?.params?.item
  console.log(item)

  const [firstName, setFirstName] = useState(item?.firstName);
  const [lastName, setLastName] = useState(item?.lastName);
  const [email, setEmail] = useState(item?.emailAddress);
  const [phoneNumber, setPhoneNumber] = useState(item?.phone);
  const [billingAddress, setBillingAddress] = useState(item?.billingAddress);
  const [shippingAddress, setShippingAddress] = useState(item?.contactPerson);
  const [contactPerson, setContactPerson] = useState(item?.contactPerson);
  const [province, setProvince] = useState(item?.province);
  const [postCode, setPostCode] = useState(item?.postCode);
  const [city, setCity] = useState(item?.city);
  const [specialNote, setSpecialNote] = useState(item?.specialNote);
  const [loading, setloading] = useState(false)


  const validateFields = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !billingAddress ||
      !shippingAddress ||
      !contactPerson ||
      !province ||
      !postCode ||
      !city
    ) {
      Snackbar.show({
        text: 'Please fill in all fields.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateFields()) {
      // Create the request payload
      setloading(true)
      const requestPayload = {
        firstName,
        lastName,
        city,
        contactPerson,
        phone: phoneNumber,
        province,
        shippingAddress,
        billingAddress,
        postCode,
        specialNote,
        emailAddress: email
      };

      // Configure headers and request options
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(requestPayload),
        redirect: "follow"
      };

      // Make the API request
      fetch(`https://meat-app-backend-zysoftec.vercel.app/api/address/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          Snackbar.show({
            text: 'Address updated successfully.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: themeStyle.PRIMARY_COLOR,
            textColor: 'white',
            marginBottom: 0,
          });
          navigation.goBack();
          setloading(false)
        })
        .catch(error => {
          console.error(error);
          setloading(false)
          Snackbar.show({
            text: 'Failed to update address. Please try again.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'rgba(212, 4, 28, 1)',
            textColor: 'white',
            marginBottom: 0,
          });
        });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Address</Text>
          </View>

          <GlobalInput
            title={'First Name'}
            hint={'James'}
            value={firstName}
            onChangeText={setFirstName}
            marginTop={'10%'}
          />
          <GlobalInput
            title={'Last Name'}
            hint={'Williams'}
            value={lastName}
            onChangeText={setLastName}
            marginTop={'5%'}
          />
          <GlobalInput
            title={'Email Address'}
            hint={'James78@email.com'}
            value={email}
            onChangeText={setEmail}
            marginTop={'5%'}
          />
          <GlobalInput
            keyboardType='numeric'
            title={'Phone Number'}
            hint={'+03474856 66'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            marginTop={'5%'}
          />
          <GlobalInput
            title={'Billing Address'}
            hint={'Strett12, Apartment 455, Canada'}
            value={billingAddress}
            onChangeText={setBillingAddress}
            marginTop={'5%'}
          />
          <GlobalInput
            title={'Shipping Address'}
            hint={'Strett12, Apartment 455, Canada'}
            value={shippingAddress}
            onChangeText={setShippingAddress}
            marginTop={'5%'}
          />
          <GlobalInput
            title={'Contact Person'}
            hint={'John Doe'}
            value={contactPerson}
            onChangeText={setContactPerson}
            marginTop={'5%'}
          />
         <Dropdown
        title="Country"
        hint="Select Country"
        marginTop={20}
        width="94%"
        selectedOption={province}
        onValueChange={setProvince}
      />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <GlobalInput
              keyboardType='numeric'
              width={'45%'}
              title={'Post Code'}
              hint={'6567'}
              value={postCode}
              onChangeText={setPostCode}
              marginTop={'5%'}
            />
            <GlobalInput
              width={'42%'}
              title={'City'}
              hint={'New York'}
              value={city}
              onChangeText={setCity}
              marginTop={'5%'}
              right={25}
            />
          </View>

          <GlobalInput
            hint={'Special Note'}
            value={specialNote}
            onChangeText={setSpecialNote}
            marginTop={'0%'}
          />

          <GlobalButton loading={loading} onPress={handleContinue} marginTop={'10%'} title={'Update'} />

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
    right:10

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
    marginLeft: '22%',
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
    color:  themeStyle.BLACK,
    fontFamily:FONT.ManropeSemiBold,  
},

NoCartText: {
    textAlign: 'center',
    color:  themeStyle.TEXT_GREY,
    fontFamily:FONT.ManropeRegular,
    marginTop:"3%",
    fontSize:20
},
});