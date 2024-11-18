import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native';
import { CardField, confirmPayment, useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({ route, navigation }) => {

    const item = {
        id: 1,
    }


    const stripe = useStripe();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [isCardValid, setIsCardValid] = useState(false);
    const [cardDetails, setCardDetails] = useState('');
    const [loading, setloading] = useState(false);

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('userToken');
        console.log(token, '----')
        try {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);

            const formdata = new FormData();
            formdata.append('product_id', item.id);
            formdata.append('protection_fee', '0');
            formdata.append('delivery_fee', '0');

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow',
            };

            const response = await fetch(
                'http://bigema8633.pythonanywhere.com/checkout/public/payment/processing',
                requestOptions
            );
            const result = await response.json();
            console.log(result?.client_secret, '--------------------client')
            return result?.client_secret;

        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };




    const handlePayPress = async () => {
        if (!firstName || !lastName || !email || !address || !cardDetails) {
            ToastAndroid.show('Enter All Details', ToastAndroid.LONG)
        } else if (!isCardValid) {
            ToastAndroid.show('Enter Valid Card Details', ToastAndroid.LONG)

        } else {
            // Fetch the intent client secret from the backend
            const clientSecret = await fetchData();

            // Confirm the payment with the card details
            const { paymentIntent, error } = await confirmPayment(clientSecret, {
                paymentMethodType: 'Card',
            });

            if (error) {
                console.log('Payment confirmation error', error);
                ToastAndroid.show(error.message, ToastAndroid.LONG)

            } else if (paymentIntent) {
                console.log('Success from promise', paymentIntent);
                if (paymentIntent?.status === 'Succeeded') {
                    navigation.navigate('PublishScreen')
                }
                ToastAndroid.show('Payment Success', ToastAndroid.LONG)
            }
        }


    };



    return (
        <View style={styles.container}>
            <ScrollView>

                <View style={{ height: 70 }}>
                    <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: '7%' ,color:"black"}}>Add Card Details</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholderTextColor={'black'}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    placeholderTextColor={'black'}
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    placeholderTextColor={'black'}
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    placeholderTextColor={'black'}
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <CardField
                    placeholderTextColor={'black'}
                    postalCodeEnabled={false}
                    placeholders={{
                        number: '4242 4242 4242 4242',
                        color:"black",
                        placeholderTextColor:"black",
                        backgroundColor:"red"
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 30,
                    }}
                    onCardChange={(cardDetails) => {
                        console.log('Card Details ======>>>>', cardDetails);
                        setCardDetails(cardDetails);
                        const isValidCard = cardDetails.complete && cardDetails.validExpiryDate === 'Valid' && cardDetails.validCVC === 'Valid';
                        setIsCardValid(isValidCard);
                    }}
                />

                <TouchableOpacity onPress={handlePayPress} style={{ height: 50, width: '80%', alignSelf: 'center', marginTop: '10%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: "red  " }}>
                    {loading ? <ActivityIndicator color={'white'} /> : <Text style={{ fontSize: 18, }}>Pay</Text>}
                </TouchableOpacity>
                <View style={{ height: 100 }} />
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        height: 50,
        // borderColor: COLOR.primary,
        borderWidth: 1,
        marginHorizontal: '5%',
        marginTop: '10%',
        borderRadius: 5,
        // color: COLOR.black,
        // fontFamily: FONT.Poppins_SemiBold,
    },  
});

export default PaymentScreen;