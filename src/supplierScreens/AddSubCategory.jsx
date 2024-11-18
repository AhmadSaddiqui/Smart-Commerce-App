import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import GlobalButton from '../components/GlobalButton';
import GlobalInput from '../components/GlobalInput';
import ImagePicker from 'react-native-image-crop-picker';
import CategoryDropDown from './CategoryDropDown';
import { useFocusEffect } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddSubCategory({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState('');
  const [subcategories, setSubcategories] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingadd, setloadingadd] = useState(false)
  console.log(selectedCategory, 'selected')

  const [category, setcategory] = useState([])

  const ShowCategory = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/category", requestOptions)
      const result = await response.json()
      console.log(result)
      setcategory(result?.categories)
    } catch (error) {

    }
  }
  useFocusEffect((
    useCallback(() => {
      ShowCategory()
    }, [])
  ))

  const addSubcategory = async () => {
    if (!name) {
      Snackbar.show({
        text: 'Please add subcategory name',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return; // Ensure to exit early
    } else if (!selectedCategory?._id) {
      Snackbar.show({
        text: 'Please Select category',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      return; // Ensure to exit early
    }
  
    setloadingadd(true); // Set loading state to true
  
    const url = `http://10.0.2.2:5000/api/category/add-subcategory-one-by-one/${selectedCategory?._id}`;
    const token = await AsyncStorage.getItem('supplierToken');
    const supplierId = await AsyncStorage.getItem('supplierId');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };
    const body = JSON.stringify({
      "name": name,
      "supplierId": supplierId,
    });
  
    // Prepare request options
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(url, requestOptions);
  
      if (!response.ok) {
        const errorData = await response.json(); // Get error message from response if available
        throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(0, 128, 0, 1)', // Consider using green for success messages
        textColor: 'white',
        marginBottom: 0,
      });
  
      console.log(result);
      // Resetting fields only on successful request
      setName('');
      setSelectedCategory('');
  
    } catch (error) {
      console.error('Error:', error);
      Snackbar.show({
        text: `Error: ${error.message}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    } finally {
      setloadingadd(false); // Ensure to reset loading state
    }
  };
  







  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Sub Category</Text>
          <Image style={{ height: 31, width: 31, marginLeft: 'auto', marginRight: '5%', borderRadius: 30 }} source={require('../../assets/images/Splash/dp.png')} />

        </View>

        <CategoryDropDown
          options={category}
          title={'Category'}
          hint={'Select Category'}
          marginTop={'5%'}
          onSelectCategory={setSelectedCategory}
        />

        <GlobalInput onChangeText={setName} value={name} title={'Sub Category Name'} hint={'Name here'} marginTop={'5%'} />



        <GlobalButton onPress={addSubcategory} loading={loadingadd} marginTop={'10%'} title={'Save Sub Category'} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
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
    marginLeft: '15%',
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
