import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ROUTES } from '../routes/RoutesConstants';
import themeStyle from '../styles/themeStyle';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {WaveIndicator,} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Address = ({ navigation }) => {
    const route = useRoute();
    const cart = route?.params?.cart;
    const total = route?.params?.total;
const [loading, setloading] = useState(true)
    const [addresses, setAddresses] = useState([]);
    const [total1, setTotal1] = useState(total && total);
    const fetchAddresses = async () => {
      const restuarantId = await AsyncStorage.getItem('restuarantId');
      
      try {
          const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/address/${restuarantId}`);
          const result = await response.json();
          setAddresses(result);
          setloading(false)
      } catch (error) {
          console.error(error);
          setloading(false)
      }
  };
    useFocusEffect((
      useCallback(()=>{
        fetchAddresses();

      },[])
    ))

  
    useEffect(()=>{
        console.log('total:', total1);
      },[]);
    
 
    const renderAddressItem = ({ item }) => {
      const deleteAddress = async () => {
              const requestOptions = {
                method: "DELETE",
                redirect: "follow"
              };
        
              try {
                const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/address/${item?._id}`, requestOptions);
                
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const result = await response.json();
                console.log(result);
                fetchAddresses()
              } catch (error) {
                console.error('Error:', error);
              }
            };
        
      return(
        <View style={styles.addressItem}>
        <Image resizeMode='contain' source={require('../../assets/images/checkout/home.png')} style={styles.addressIcon} />
        <View style={styles.addressDetails}>
            <Text style={styles.addressType}>Restuarant</Text>
            <Text style={styles.addressText}>
                {`${item.shippingAddress}, ${item.city}, ${item.province} ${item.postCode}`}
            </Text>
            <Text style={styles.specialNote}>{item.specialNote}</Text>
        </View>
        <View style={styles.actions}>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.EditAddress,{id:item?._id,item:item})}>
                <Image resizeMode='contain' source={require('../../assets/images/checkout/editicon.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>deleteAddress()}>
                <Image resizeMode='contain' source={require('../../assets/images/checkout/Deleteicon.png')} style={styles.actionIcon} />
            </TouchableOpacity>
        </View>
        {cart && (
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.UserPaymentDetails,{item:item, total: total1})} style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
        )}
    </View>
      )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image resizeMode='contain' source={require('../../assets/images/Cart/back.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Checkout</Text>
      {
        loading ? (
          <View style={{flex:1,alignItems:'center',justifyContent:"center"}}>
<WaveIndicator color={themeStyle.PRIMARY_COLOR} size={1000} style={{marginTop:620}}/>

          </View>
        ):(
          <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.addressList}
      />
        )
      }
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.UserCheckout)} style={styles.addButton}>
                <Text style={styles.addButtonText}>ADD NEW ADDRESS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
        paddingTop: 44,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 50,
        zIndex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'black',
    },
    addressList: {
        paddingBottom: 20,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        position: 'relative',
    },
    addressIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    addressDetails: {
        flex: 1,
    },
    addressType: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    addressText: {
        fontSize: 14,
        color: '#666',
    },
    specialNote: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 20,
    },
    actionIcon: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    selectButton: {
        backgroundColor: themeStyle.PRIMARY_COLOR,
        height: 20,
        width: '25%',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    selectButtonText: {
        fontSize: 10,
        color: themeStyle.WHITE,
    },
    addButton: {
        backgroundColor: themeStyle.PRIMARY_COLOR,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Address;
