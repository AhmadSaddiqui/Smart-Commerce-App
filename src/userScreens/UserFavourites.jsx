import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart, updateItemQuantity } from '../redux/CartSlice';
import GlobalButton from '../components/GlobalButton';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { ROUTES } from '../routes/RoutesConstants';
import { CHunk } from '../data/dummy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Empty from '../components/Empty';
import { BaseurlBuyer } from '../Apis/apiConfig';

export default function UserFavourites({ navigation }) {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  console.log(selectedItems, 'selecteditems')

  const incrementQuantity = () => {
    if (quantity < 9) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateSubTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const truncateTitle = (name, charLimit) => {
    if (name.length > charLimit) {
      return name.slice(0, charLimit) + '...';
    }
    return name;
  };

  const toggleSelection = (item) => {
    setSelectedItems(prevSelectedItems => {
      const isSelected = prevSelectedItems.some(selectedItem => selectedItem._id === item._id);

      if (isSelected) {
        return prevSelectedItems.filter(selectedItem => selectedItem._id !== item._id);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem._id === item._id);

    console.log("Yeh item ha",item )


    return (
      <TouchableOpacity onPress={() => toggleSelection(item)}>
        <View style={[
          styles.cartItemContainer,
          isSelected ? { borderWidth: 2, borderColor: 'red' } : null
        ]}>
          <View style={styles.cartItemRow}>
            <View style={styles.imageContainer}>
              <Image resizeMode='contain' style={styles.cartItemImage}  source={{ uri: item?.image?.url.replace('localhost', '10.0.2.2') }} />
            </View>
            <View>
              <View>
                <Text style={styles.itemTitle} numberOfLines={1}>
          
                  {truncateTitle(item.name, 15)}
                </Text>
                
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrementQuantity} style={styles.decrementButton}>
                  <Image style={styles.minusIcon} source={require('../../assets/images/SingleItem/minus.png')} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}.</Text>
                <TouchableOpacity onPress={incrementQuantity} style={styles.incrementButton}>
                  <Image style={styles.plusIcon} source={require('../../assets/images/SingleItem/plus.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const subTotal = calculateSubTotal();
  const tax = 12;  // example static tax
  const total = subTotal + tax;
  const CHunkImages = [
    require('../../assets/images/Home/1.png'),
    require('../../assets/images/Home/9.png'),
    require('../../assets/images/Home/8.png'),
    require('../../assets/images/Home/7.png'),
    require('../../assets/images/Home/6.png'),
    require('../../assets/images/Home/5.png'),
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * CHunkImages.length);
    return CHunkImages[randomIndex];
  };

  const fetchFavoriteProducts = async () => {
    console.log('Fetching favorite products...');
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const response = await fetch(`${BaseurlBuyer}/get-favorite-products/${buyerId}`);
      console.log(response, 'Response');
      const result = await response.json();
      console.log(result, 'Fetch Favorites');
      const productsWithImages = result.favorites?.map(product => ({
        ...product,

      }));
      console.log
      setFavorites(productsWithImages);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteProducts();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        {
          favorites?.length == 0 ? (
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favourite</Text>
              </View>
              <Empty
                otherViews={
                  <Image resizeMode='contain' style={{ height: 220, width: 220 }} source={require('../../assets/images/Cart/EmptyFav.png')} />
                }
              />
            </View>
          ) : (
            <ScrollView>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favourite</Text>
              </View>

              <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />

              <GlobalButton onPress={() => {
                selectedItems.forEach(item => {
                  console.log("Item check",item)
                  const transformedItem = {
                    "_id": item._id,
                    "category": item?.category, // Manually setting the value
                    "description": "", // Manually setting the value
                    "image": item?.image?.url, // Manually setting the value
                    "name": item?.name, // Manually setting the value
                    "price": item?.price, // Manually setting the value
                    "status": item?.status, // Manually setting the value
                    "subcategory": "", // Manually setting the value
                    "supplierId": item.supplierId,
                    "weight": "", // Manually setting the value
                    "quantity": 1, // Keeping the original quantity
                  };

                  dispatch(addItemToCart(transformedItem));
                  navigation.navigate('UserCart');
                });

                // Optional: Navigate to the UserCart screen after adding items to the cart

              }} marginTop={'5%'} title={'Order Now'} />
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
    height: 110,
    width: '94%',
    backgroundColor: themeStyle.HOME_ITEM,
    alignSelf: 'center',
    marginTop: '5%',
    justifyContent: 'center',
    borderRadius: 10
  },
  cartItemRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    height: 77,
    width: 77,
    backgroundColor: themeStyle.WHITE,
    borderColor: themeStyle.bgcItem,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '5%',
    right: 10

  },
  cartItemImage: {
    width: 76,
    height: 78,
  },
  itemTitle: {
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    fontSize: 16,

  },
  itemQuantity: {
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.BLACK,
    fontSize: 10,
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
    elevation: 10
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
    marginLeft: '30%',
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

  quantityContainer: {
    height: 30,
    width: 100,
    // paddingVertical: 5,
    // paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // position: 'absolute',
    // left: '28%',
    // bottom: -6,
    overflow: 'hidden',
    marginTop: '5%',
    // marginLeft: "auto",
    // marginRight: '5%'
  },
  decrementButton: {

    width: '35%',
    backgroundColor: themeStyle.PRIMARY_COLOR,
    // borderBottomWidth: 1,
    // borderColor: themeStyle.TEXT_GREY,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: themeStyle.WHITE
  },
  quantityText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    fontWeight: '600',
    color: themeStyle.BLACK,
    // marginTop: '15%',
  },
  incrementButton: {
    // width: 23,
    // borderTopWidth: 1,
    // borderColor: themeStyle.TEXT_GREY,
    // height: 28,
    width: '35%',
    backgroundColor: themeStyle.PRIMARY_COLOR,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: '15%',
  },
  plusIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: themeStyle.WHITE
  },
});
