import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import GlobalButton from '../components/GlobalButton';
import { useRoute } from '@react-navigation/native';
import { addItemToCart } from '../redux/CartSlice';
import { useDispatch } from 'react-redux';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseurlBuyer, BaseurlSupplier } from '../Apis/apiConfig';

export default function UserSingleItem({ navigation }) {

  const route = useRoute()
  const [favorites, setFavorites] = useState([]);
  const [option, setOption] = useState({});
  const item = route.params?.item
  // console.log(item, 'item')
  const dispatch = useDispatch();
  console.log(item, 'item')

  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    if (quantity < 100) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const [favLoad, setFavLoad] = useState(false);

  const addToCart = () => {
    dispatch(addItemToCart({ ...item, quantity }));
    navigation.navigate('UserCart'); // adjust the navigation if necessary
  };


  const fetchFavoriteProducts = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const response = await fetch(`${BaseurlBuyer}/get-favorite-products/${buyerId}`);
      console.log(response, 'resfes')
      const result = await response.json();
      console.log(result, 'fetchfav')
      setFavorites(result.favorites || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };



  const addFavoriteProduct = async (productId) => {
    console.log(productId, 'productId')
    setFavLoad(true);
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        productId: productId,
        buyerId: buyerId
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BaseurlBuyer}/add-favorite-product`, requestOptions);
      const result = await response.json();
      setFavLoad(false);
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });

      // Update the favorites list
      setFavorites([...favorites, { _id: productId }]);
    } catch (error) {
      console.error('Error adding favorite product:', error);
    }
  };

  const removeFavoriteProduct = async (productId) => {
    setFavLoad(true);
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        productId: productId,
        buyerId: buyerId
      });
      console.log(raw, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,,,,,,,,,,,,,,,')
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BaseurlBuyer}/delete-favorite-product`, requestOptions);
      const result = await response.json();
      console.log(result, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,,')
      setFavLoad(false);
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });

      // Update the favorites list
      setFavorites(favorites.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('Error removing favorite product:', error);
    }
  };

  const fetchDeliveryOption = async () => {
    try {
      const response = await fetch(`${BaseurlSupplier}get-delivery-option/${item?.supplierId?._id || item?.supplierId}`);
      const json = await response.json();
      setOption(json.deliveryOption);
      console.log('option:', json.deliveryOption);
    } catch (e) {
      console.log('error delivery option:', e);
    }
  }


  useEffect(() => {
    fetchFavoriteProducts();
    fetchDeliveryOption();
  }, []);

  const isFavorite = (productId) => {
    return favorites.some((item) => item._id === productId);
  };
  const handleFavoritePress = (productId) => {
    if (isFavorite(productId)) {
      removeFavoriteProduct(productId);
    } else {
      addFavoriteProduct(productId);
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>

          <TouchableOpacity onPress={() => handleFavoritePress(item._id)} style={styles.heartButton}>
            <Image style={styles.heartIcon} source={isFavorite(item?._id) ? require('../../assets/images/Home/heart.png') : require('../../assets/images/Home/greyheart.png')} />
          </TouchableOpacity>


          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image style={styles.backIcon} source={require('../../assets/images/SingleItem/back.png')} />
          </TouchableOpacity>
          {
            item?.image?.url ? (
              <Image resizeMode='contain' style={styles.itemImage} source={{ uri: item?.image?.url }} />

            ) : item?.image ? (
              <Image resizeMode='contain' style={styles.itemImage} source={{ uri: item.image }} />

            ) :
              <Image resizeMode='contain' style={styles.itemImage} source={item.image} />

          }
        </View>

        <Text style={styles.itemTitle}>{item.name}</Text>
        <View style={styles.supplierRow}>
          <Text style={styles.supplierLabel}>Supplier:</Text>
          <Text style={styles.supplierName}>{item?.supplierId?.name}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>
            ${item?.price}
            <Text style={styles.pricePerKg}> /kg</Text>
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={decrementQuantity} style={styles.decrementButton}>
              <Image style={styles.minusIcon} source={require('../../assets/images/SingleItem/minus.png')} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}Kg</Text>
            <TouchableOpacity onPress={incrementQuantity} style={styles.incrementButton}>
              <Image style={styles.plusIcon} source={require('../../assets/images/SingleItem/plus.png')} />
            </TouchableOpacity>
          </View>
        </View>

        {option?.flatRate != 0 || option?.byWeight != 0 || option?.byDistance != 0 || undefined ? <Text style={styles.deliveryOptionsTitle}>Delivery Options:</Text> : <></>}
        {option?.flatRate != 0 || option?.byWeight != 0 || option?.byDistance != 0 || undefined ? <View style={styles.deliveryOptionsContainer}>
          {
            (
              <View style={styles.deliveryOption}>
                <Image style={styles.dotIcon} source={option?.flatRate !== 0 ? require('../../assets/images/SingleItem/reddot.png') : require('../../assets/images/SingleItem/whitedot.png')} />
                <Text style={styles.flatRateText}>Flat Rate: ${option?.flatRate}</Text>
              </View>
            )
          }
          {
            (
              <View style={styles.deliveryOption}>
                <Image style={styles.dotIcon} source={option?.byDistance !== 0 ? require('../../assets/images/SingleItem/reddot.png') : require('../../assets/images/SingleItem/whitedot.png')} />
                <Text style={styles.byDistanceText}>By Distance: ${option?.byDistance}</Text>
              </View>
            )
          }
          {
            (
              <View style={styles.deliveryOption}>
                <Image style={styles.dotIcon} source={option?.byWeight !== 0 ? require('../../assets/images/SingleItem/reddot.png') : require('../../assets/images/SingleItem/whitedot.png')} />
                <Text style={styles.byWeightText}>By Weight: ${option?.byWeight}</Text>
              </View>
            )
          }
        </View> : <></>}

        <Text style={styles.descriptionTitle}>Description:</Text>
        <Text style={styles.descriptionText}>{item?.description}</Text>

        {
          item?.features.length > 0 && (
            <>
              <Text style={styles.keyFeaturesTitle}>Key Features:</Text>
              {item.features.map((feature) => (
                <Text key={feature._id} style={styles.keyFeature}>
                  <Text style={styles.boldText}>{feature.title}:</Text> {feature.description}
                </Text>
              ))}
            </>
          )
        }

        <GlobalButton onPress={addToCart} marginTop={'5%'} title={'Order Now'} />

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.PRIMARY_LIGHT,
  },
  imageContainer: {
    height: 340,
    width: '90%',
    alignSelf: "center",
    backgroundColor: themeStyle.HOME_ITEM,
    borderRadius: 6,
    marginTop: '8%',
  },
  backButton: {
    marginLeft: '5%',
    marginTop: '5%',
    width: 50
  },
  backIcon: {
    height: 30,
    width: 30,
  },
  itemImage: {
    width: 234,
    height: 192,
    alignSelf: 'center',
    marginTop: '10%',
  },
  itemTitle: {
    fontSize: 24,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '5%',
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
  },
  supplierLabel: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  supplierName: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.BLACK,
    marginLeft: '1%',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: '5%',
  },
  itemPrice: {
    fontSize: 24,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.PRIMARY_COLOR,
    marginLeft: '5%',
  },
  pricePerKg: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  quantityContainer: {
    height: 28,
    width: 98,
    borderWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decrementButton: {
    width: 25,
    borderRightWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusIcon: {
    width: 12,
    height: 1,
  },
  quantityText: {
    fontSize: 10,
    color: themeStyle.BLACK,
    marginLeft: '15%',
  },
  incrementButton: {
    width: 23,
    borderLeftWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '15%',
  },
  plusIcon: {
    width: 9,
    height: 9,
  },
  deliveryOptionsTitle: {
    fontSize: 20,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '5%',
    marginTop: '5%',
  },
  deliveryOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginHorizontal: '5%',
    marginTop: '3%',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotIcon: {
    height: 8,
    width: 8,
  },
  flatRateText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  byDistanceText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  byWeightText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
  },
  descriptionTitle: {
    fontSize: 20,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '5%',
    marginTop: '5%',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
    marginTop: '2%',
    width: '90%',
  },
  keyFeaturesTitle: {
    fontSize: 20,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    marginLeft: '5%',
    marginTop: '5%',
  },
  keyFeature: {
    fontSize: 14,
    fontFamily: FONT.ManropeRegular,
    color: themeStyle.TEXT_GREY,
    marginLeft: '5%',
    marginTop: '2%',
    width: '90%',
  },
  boldText: {
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeSemiBold,
  },
  bottomSpace: {
    height: 100,
  },
  heartButton: {
    height: 30,
    width: 30,
    backgroundColor: themeStyle.WHITE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    right: 20,
    top: 20
  },
  heartIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});
