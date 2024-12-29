import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { addItemToCart } from '../redux/CartSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {
  PacmanIndicator,
  WaveIndicator
} from 'react-native-indicators';
import Loader from '../components/Loader';
import { useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import { BaseurlBuyer } from '../Apis/apiConfig';


export default function AllProducts({ navigation }) {
  const route = useRoute()
  const search = route?.params?.search
  const [lastloading, setlastloading] = useState(true)
  const dispatch = useDispatch()
  const [quantity, setquantity] = useState(1)
  const [products, setproducts] = useState([])
  const [favorites, setFavorites] = useState([]);
  const [favLoad, setFavLoad] = useState(false);
  const [loading, setloading] = useState(true)
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);






  // const searchQuery = 'bon'; // Your search query

  // console.log('Initial Products Data:', JSON.stringify(products, null, 2));
  // console.log('Search Query:', searchQuery);

  const filteredProducts = products.map((category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      products: subcategory.products.filter((product) => {
        const isMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
        return isMatch;
      })
    }))
  }));

  const data = filteredProducts[0];

  console.log('filter:', data?.subcategories[0]?.products[0], filteredBySubcategories);


  const filteredBySubcategories = filteredProducts.filter(category =>
    category.subcategories.some(subcategory => subcategory.products.length > 0)
  );

  const hasFilteredProducts = filteredBySubcategories.length > 0;



  const renderProductItem = ({ item }) => {
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
  }

  const renderSubcategoryChunk = ({ item }) => {
    // console.log(item, 'item')
    return (
      <View style={{ marginHorizontal: 30, right: 28 }}>
        <View style={styles.chunkHeader}>
          <Text style={styles.categoriesTitle}>{item.subcategory}</Text>

        </View>
        <FlatList
          style={{ width: '90%' }}
          data={item.products}
          renderItem={renderProductItem}
          keyExtractor={(product) => product._id}
          numColumns={2}
          contentContainerStyle={styles.chunkListContainer}
        />
      </View>
    )
  }

  const renderCategoryChunk = ({ item }) => (
    <View style={{ width: '90%' }}>
      <FlatList
        data={item?.subcategories}
        renderItem={renderSubcategoryChunk}
        keyExtractor={(subcat, index) => subcat.subcategory + index}
      />
    </View>
  );
  const fetchFavoriteProducts = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const response = await fetch(`${BaseurlBuyer}/get-favorite-products/${buyerId}`);
      // console.log(response, 'resfes')
      const result = await response.json();
      console.log(result, 'fetchfav')
      setFavorites(result?.favorites || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };

  const getProductsBySupplier = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        buyerId: buyerId
      });

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/products/get-products-by-suppliers/${buyerId}`, requestOptions);
      const result = await response.json();
      setproducts(result);
      console.log('result:', result);
      setloading(false)
      setlastloading(false)
    } catch (error) {
      console.error('Error fetching products:', error);
      setloading(false)
      setlastloading(false)
    }
  };

  const filterSubCategory = () => {
    try {
      const subCat = products.filter((item) => item.subcategory === search);
      console.log('subcat:', subCat);
    } catch (e) {
      console.log('error filtering subCategory...', e);
    }
  }

  useEffect(() => {
    filterSubCategory();
  }, [search])

  useEffect(() => {
    getProductsBySupplier();
    fetchFavoriteProducts();

    if (search) {
      const focusTimeout = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 500);

      return () => clearTimeout(focusTimeout);
    }

  }, []);
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
      // console.log(raw, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,,,,,,,,,,,,,,,')
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch(`${BaseurlBuyer}/delete-favorite-product`, requestOptions);
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


  // if(lastloading){
  //   return(
  //     <Loader/>
  //   )
  // }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ flexDirection: 'row', marginTop: '5%', alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
            <Image resizeMode='contain' style={{ height: 20, width: 30 }} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Image style={styles.searchIcon} source={require('../../assets/images/Home/search.png')} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholderTextColor={themeStyle.TEXT_GREY}
              placeholder='Search Here'
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
        </View>
        {
          loading ? (
            <WaveIndicator color={themeStyle.PRIMARY_COLOR} size={1000} style={{ marginTop: 150 }} />

          ) : products?.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
              <Text style={{ fontSize: 20, color: "black", marginTop: "50%" }}>No Products Yet!</Text>
            </View>
          ) : !hasFilteredProducts ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", marginTop: '30%' }}>
              <Video
                source={require('../../assets/animations/cat.mp4')}
                resizeMode="cover"
                style={styles.video}
                repeat={true}
                paused={false}
              />
              <Text style={{ fontSize: 16, color: "black", marginTop: "0%", fontFamily: FONT.ManropeMedium, bottom: 25 }}>No search results for "{searchQuery}"</Text>

            </View>
          ) : (
            <FlatList
              style={{ width: '90%' }}
              data={filteredProducts}
              renderItem={renderCategoryChunk}
              keyExtractor={(item, index) => item.id + index}
              contentContainerStyle={styles.chunkListContainer}
              numColumns={2}
            />
          )
        }
        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    width: '80%',
    backgroundColor: themeStyle.LIGHT_GREY,
    marginRight: 15,
    borderRadius: 10,
    alignSelf: 'center',
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
    marginTop: '5%',
  },
  cartText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    marginLeft: '5%',
    color: themeStyle.WHITE,
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
  footerSpace: {
    height: 50,
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: 'red', // Add border when selected
    borderRadius: 10
  },
  video: {
    height: 200,
    width: 200,
    marginTop: "5%"
  },
});
