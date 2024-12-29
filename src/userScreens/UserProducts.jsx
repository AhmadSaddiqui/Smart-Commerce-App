import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import themeStyle, { FONT } from '../styles/themeStyle';
import { ROUTES } from '../routes/RoutesConstants';
import { addItemToCart } from '../redux/CartSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import Loader from '../components/Loader';
import Empty from '../components/Empty';
import { useRoute } from '@react-navigation/native';
import { BaseurlBuyer, BaseurlProducts } from '../Apis/apiConfig';

export default function UserProducts({ navigation }) {
  const route = useRoute();
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const item = route?.params?.item;
  const flatListRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [lastloading, setLastLoading] = useState(true);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [favLoad, setFavLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [categories, setCategories] = useState([]);

  const scrollToLeft = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const scrollToRight = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedSubcategory?.subcategoryId === item.subcategoryId;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => {
          setSelectedItemId(item.subcategoryId);
          setSelectedSubcategory(item);
        }}
      >
        <Text style={styles.text}>{item.subcategory}</Text>
      </TouchableOpacity>
    );
  };

  const renderProductItem = ({ item }) => {
    console.log(item,"yeh reder ho rha");
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('UserSingleItem', { item: item })}
        style={styles.chunkItem}
      >
        <TouchableOpacity onPress={() => handleFavoritePress(item._id)} style={styles.heartButton}>
          <Image style={styles.heartIcon} source={isFavorite(item._id) ? require('../../assets/images/Home/heart.png') : require('../../assets/images/Home/greyheart.png')} />
        </TouchableOpacity>
        <View style={styles.chunkImageContainer}>
          <Image style={styles.chunkImage} source={{ uri: item?.image }} />
        </View>
        <Text style={styles.chunkTitle}>{item.name}</Text>
        <Text style={styles.chunkPrice}>
          ${item.price}
          <Text style={styles.chunkPriceUnit}> /kg</Text>
        </Text>
        <View style={styles.chunkActions}>
          <TouchableOpacity
            onPress={() => {
              dispatch(addItemToCart({ ...item, quantity }));
              navigation.navigate('UserCart');
            }}
            style={styles.cartButton}
          >
            <Image style={styles.cartIcon} source={require('../../assets/images/Home/whitecart.png')} />
            <Text style={styles.cartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  };

  const fetchFavoriteProducts = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const response = await fetch(`${BaseurlBuyer}/get-favorite-products/${buyerId}`);
      const result = await response.json();
      setFavorites(result.favorites || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };

  const getProductsBySupplier = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    const buyerToken = await AsyncStorage.getItem('buyerToken');
    const requestOptions = {
      method: "GET",
      headers: {
        "x-access-token": buyerToken,  // Include the en in the Authorization header
      },
      redirect: "follow"
    };
    try {
      const response = await fetch(`${BaseurlProducts}get-products-by-suppliers-and-category/${buyerId}/${item?._id}`, requestOptions);
      const result = await response.json();

      const allOption = {
        subcategoryId: 'all',
        subcategory: 'All',
        products: [],
      };

      result[0]?.subcategories.forEach(subcategory => {
        allOption.products.push(...subcategory.products);
      });

      setCategories([allOption, ...result[0]?.subcategories || []]);
      setAllProducts(allOption.products);
      setSelectedItemId('all');
      setSelectedSubcategory(allOption);
      setLoading(false);
      setLastLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      setLastLoading(false);
    }
  };

  useEffect(() => {
    getProductsBySupplier();
    fetchFavoriteProducts();
  }, []);

  const addFavoriteProduct = async (productId) => {
    setFavLoad(true);
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        productId: productId,
        buyerId: buyerId
      });

      const response = await fetch(`${BaseurlBuyer}/add-favorite-product`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });
      const result = await response.json();
      setFavLoad(false);
      console.log('Snackbar message:', result?.message); // Log the message to the console

      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });

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
      const response = await fetch(`${BaseurlBuyer}/delete-favorite-product`, {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      });
      const result = await response.json();
      setFavLoad(false);
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
        marginBottom: 0,
      });
      setFavorites(favorites.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('Error removing favorite product:', error);
    }
  };

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

  if (lastloading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {categories?.length === 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Products</Text>
          </View>
          <Empty title={'No Products !!!'} />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Products</Text>
          </View>

          <TouchableOpacity activeOpacity={2} onPress={() => navigation.navigate(ROUTES.AllProducts, { search: true })} style={styles.searchBar}>
            <Image style={styles.searchIcon} source={require('../../assets/images/Home/search.png')} />
            <TextInput
              style={styles.searchInput}
              placeholderTextColor={themeStyle.TEXT_GREY}
              placeholder='Search Here'
              editable={false}
            />
          </TouchableOpacity>
          <FlatList
            ref={flatListRef}
            data={categories}
            keyExtractor={(item) => item.subcategoryId}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingLeft: '2%' }}
            contentContainerStyle={{ marginTop: "5%" }}
          />
          <FlatList
            data={selectedSubcategory?.products || allProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderProductItem}
            numColumns={2}
            style={styles.productList}
            ListEmptyComponent={<Empty title={'No Products Found'} />}
          // contentContainerStyle={{alignSelf:"center"}}
          />
        </ScrollView>
      )}
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
    // marginTop: '5%',
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
    // backgroundColor:'pink'
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
    // backgroundColor:"red",
    width: "90%"
  },
  viewAll: {
    marginLeft: 'auto',
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
    marginTop: '0%',
  },
  chunkItem: {
    height: 220,
    width: '47%',
    backgroundColor: themeStyle.bgcItem,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    marginHorizontal: 5,
    justifyContent: 'center',
    marginTop: '5%',
    // elevation:0.3
  },
  chunkImageContainer: {
    height: 107,
    width: 107,
    backgroundColor: themeStyle.WHITE,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    alignSelf: 'center',
    borderRadius: 107 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chunkImage: {
    height: 60,
    width: 60,
    resizeMode: 'contain',
  },
  chunkTitle: {
    fontSize: 14,
    fontFamily: FONT.ManropeSemiBold,
    fontWeight: '600',
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
    height: 30,
    width: 30,
    backgroundColor: themeStyle.WHITE,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 5,
    top: 5
  },
  heartIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  cartButton: {
    height: 28,
    width: '94%',
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cartIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    // marginLeft: '15%',
  },
  cartText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    marginLeft: '5%',
    color: themeStyle.WHITE,
  },
  footerSpace: {
    height: 50,
  },
  selectedItem: {
    // borderWidth: 1,
    // borderColor: 'red', // Add border when selected
    // borderRadius:10

    // backgroundColor:themeStyle.PRIMARY_COLOR,
    borderBottomWidth: 2,
    borderColor: themeStyle.PRIMARY_COLOR
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
    marginLeft: '25%',
    fontFamily: FONT.ManropeSemiBold,
  },


});
