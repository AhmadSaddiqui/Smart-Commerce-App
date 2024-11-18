import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { useDispatch, useSelector } from 'react-redux';
import { removeItemFromCart, updateItemQuantity } from '../redux/CartSlice';
import GlobalButton from '../components/GlobalButton';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import GlobalInput from '../components/GlobalInput';
import CountryInput from '../components/CountryInput';
import Dropdown from '../components/Dropdown';
import { ROUTES } from '../routes/RoutesConstants';
import NoteInput from '../components/NoteInput';
import ImagePicker from 'react-native-image-crop-picker'; // Import image picker library
import CustomSwitch from '../components/CustomSwitch';
import WeightDropdown from '../components/WeightDropDown';
import CategoryDropDown from './CategoryDropDown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseurlProducts } from '../Apis/apiConfig';
import Snackbar from 'react-native-snackbar';
import { useFocusEffect, useRoute } from '@react-navigation/native';

export default function EditProduct({ navigation }) {

  const route = useRoute()
  const id = route?.params?.id
  const home = route?.params?.home
  const item = route?.params?.item
console.log(item,'okok')

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(item?.category?.name);
  const [weight, setweight] = useState(item?.weight)
  const [name, setname] = useState(item?.name)
  const [desc, setdesc] = useState(item?.description)
  const [price, setprice] = useState(item?.price.toString())
  const [loading, setloading] = useState(false)
  const handleUpload = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(image => {
      console.log(image);
      setSelectedImage(image.path);
    }).catch(error => {
      console.log('Error selecting image:', error);
    });
  };
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [isSwitchOn1, setIsSwitchOn1] = useState(true);
  const [isSwitchOn2, setIsSwitchOn2] = useState(true);
  


  const handleToggle = newValue => {
    setIsSwitchOn(newValue);
  };


  const handleToggle1 = newValue => {
    setIsSwitchOn1(newValue);
  };
  const handleToggle2 = newValue => {
    setIsSwitchOn2(newValue);
  };

  const deliveryOption = isSwitchOn ? 'Flat Rate' : isSwitchOn1 ? 'By weight' : isSwitchOn2 ? 'By distance' : 'none'

  console.log(deliveryOption)
  
  const submitProduct = async () => {
    console.log('Product ID:', id);
    setloading(true);
  
    try {
      // Fetch supplierId from AsyncStorage
      const supplierId = await AsyncStorage.getItem('supplierId');
      
      // Log supplierId and id to ensure they are fetched correctly
      console.log('Supplier ID:', supplierId, 'Product ID:', id);
  
      // Ensure supplierId and id are present
      if (!supplierId || !id) {
        throw new Error('Supplier ID or product ID is missing');
      }
  
      // Prepare product data for the update request
      const productData = {
        supplierId: supplierId,
        category: selectedCategory?._id, // Ensure you're passing the correct field
        name: name,
        description: desc,
        weight: weight,
        price: price,
        deliveryOption: null,
      };
  
      // Log the product data for debugging purposes
      console.log('Product Data:', productData);
  
      // Set up the request options for the PUT request
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        redirect: 'follow',
      };
  
      // Log the request URL to ensure it is correct
      console.log(`Request URL: ${BaseurlProducts}${id}`);
  
      // Send the update request
      const response = await fetch(`${BaseurlProducts}${id}`, requestOptions);
  
      // Log the response status for debugging
      console.log('Response status:', response.status);
  
      // Parse the response even if there's an error
      const responseData = await response.json();
      console.log('Response data:', responseData);
  
      // Handle any non-200 HTTP responses
      if (!response.ok) {
        console.error('Error response from server:', responseData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Log the successful result
      console.log('Product updated successfully:', responseData);
  
      // Display success message using Snackbar
      Snackbar.show({
        text: 'Product updated successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
  
      // Set loading to false and navigate based on the screen
      setloading(false);
  
      if (home) {
        navigation.navigate(ROUTES.SupplierHome);
      } else {
        navigation.navigate('Products');
      }
  
    } catch (error) {
      // Log any errors and show failure message in Snackbar
      console.error('Error updating product:', error);
  
      setloading(false);
  
      Snackbar.show({
        text: 'Failed to update the product',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
    }
  };
  
  
  
  const [category, setcategory] = useState([])


  const ShowCategory=async()=>{
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
   const response= await  fetch("https://meat-app-backend-zysoftec.vercel.app/api/category", requestOptions)
  const result = await response.json()
  console.log(result)

  setcategory(result?.categories)
    } catch (error) {
      
    }
  }
useFocusEffect((
  useCallback(()=>{
ShowCategory()
  },[])
))


  return  (
    <>
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Product</Text>
        <Image style={{height:31,width:31,marginLeft:'auto',marginRight:'5%'}} source={require('../../assets/images/Home/dp.png')} />

        </View>
      
        <CategoryDropDown
        options={category}
      
          title={'Category'}
          hint={selectedCategory}
          marginTop={'5%'}
          onSelectCategory={setSelectedCategory}
        />


        <GlobalInput value={name} onChangeText={setname} title={'Product Name'} hint={'Name here'} marginTop={'5%'} />
        <GlobalInput value={price} keyboardType={'numeric'} onChangeText={setprice}  title={'Price'} hint={'$1300.00'} marginTop={'5%'} />
        <WeightDropdown  onSelectWeight={setweight} title={'Weight'} hint={weight} marginTop={'5%'} />
        <NoteInput value={desc} onChangeText={setdesc} title={'Discription'} hint={'Write discription here'} marginTop={'5%'}/>
       
        <Text style={{ fontSize: 14, fontFamily: FONT.ManropeRegular, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '8%' }}>
          Upload Product Image
        </Text>

        <TouchableOpacity onPress={handleUpload}>
          {selectedImage ? (
            <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={{ uri: selectedImage }} />
          ) : (
            <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={require('../../assets/images/Payment/upload.png')} />
          )}
        </TouchableOpacity>


{/* <Text style={{fontSize:14,color:themeStyle.BLACK,marginLeft:'8%',fontFamily:FONT.ManropeSemiBold,marginTop:'5%'}}>Delivery Option</Text>

<View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
<Text style={{fontSize:12,color:themeStyle.TEXT_GREY,marginLeft:'8%',fontFamily:FONT.ManropeRegular}}>Flat Rate:</Text>
<View style={{padding:5,backgroundColor:themeStyle.WHITE,elevation:10,alignItems:'center',justifyContent:"center",marginLeft:"3%",borderRadius:5}}>
<Text style={{fontSize:12,color:themeStyle.TEXT_GREY,marginLeft:'8%',fontFamily:FONT.ManropeRegular}}> $10</Text>
</View>
<View style={{marginLeft:'auto',marginRight:"8%"}}>
<CustomSwitch isOn={isSwitchOn} onToggle={handleToggle} />

</View>
</View>


<View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
<Text style={{fontSize:12,color:themeStyle.TEXT_GREY,marginLeft:'8%',fontFamily:FONT.ManropeRegular}}>By Weight:</Text>
<View style={{padding:5,backgroundColor:themeStyle.WHITE,elevation:10,alignItems:'center',justifyContent:"center",marginLeft:"3%",borderRadius:5}}>
<Text style={{fontSize:12,color:themeStyle.TEXT_GREY,marginLeft:'8%',fontFamily:FONT.ManropeRegular}}>  $0.60  5 cents / Kg</Text>
</View>
<View style={{marginLeft:'auto',marginRight:"8%"}}>
<CustomSwitch isOn={isSwitchOn1} onToggle={handleToggle1} />

</View>
</View>


<View style={{flexDirection:"row",alignItems:"center",marginTop:"5%"}}>
<Text style={{fontSize:12,color:themeStyle.TEXT_GREY,marginLeft:'8%',fontFamily:FONT.ManropeRegular}}>By Distance:</Text>
<View style={{padding:5,backgroundColor:themeStyle.WHITE,elevation:10,alignItems:'center',justifyContent:"center",marginLeft:"3%",borderRadius:5}}>
<Text style={{fontSize:12,color:themeStyle.TEXT_GREY,marginLeft:'8%',fontFamily:FONT.ManropeRegular}}> $0.30  10 Cents / km</Text>
</View>
<View style={{marginLeft:'auto',marginRight:"8%"}}>
<CustomSwitch isOn={isSwitchOn2} onToggle={handleToggle2} />

</View>
</View> */}

<GlobalButton loading={loading} onPress={submitProduct} marginTop={'10%'} title={'Update Product'}/>
 
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
