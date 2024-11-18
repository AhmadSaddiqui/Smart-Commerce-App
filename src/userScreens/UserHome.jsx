import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, ToastAndroid, ActivityIndicator, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { Categories, CHunk, Ribs } from '../data/dummy';
import HomeHeader from '../components/HomeHeader';
import { ROUTES } from '../routes/RoutesConstants';
import GlobalButton from '../components/GlobalButton';
import { addItemToCart } from '../redux/CartSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../components/Loader';
import { KEY_PREFIX } from 'redux-persist';
import { isNewBackTitleImplementation } from 'react-native-screens';
import { BaseurlProducts } from '../Apis/apiConfig';


export default function UserProducts({ navigation }) {
  const flatListRef = useRef(null);
  const [lastloading, setlastloading] = useState(true);
  const dispatch = useDispatch();
  const [quantity, setquantity] = useState(1);
  const [products, setproducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favLoad, setFavLoad] = useState(false);
  const [loading, setloading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [categories, setcategories] = useState([])
  const [recent, setrecent] = useState([])
  const [column, setColumn] = useState(2);

  const scrollToLeft = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const scrollToRight = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  const fetchMostRecentProduct = async () => {
    const restaurantId = await AsyncStorage.getItem('restuarantId');
    const restaurantToken = await AsyncStorage.getItem('restuarantToken');
    const requestOptions = {
      method: "GET",
      headers: {
        "x-access-token": restaurantToken,  // Include the en in the Authorization header
        "Content-Type": "application/json"  // Assuming JSON format
      },
      redirect: "follow"
    };

    try {
      const response = await fetch(`${BaseurlProducts}most-recent-product/${restaurantId}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming the response is in JSON format
      setrecent(result)
    } catch (error) {
      console.error('Error fetching the most recent product:', error.message);
    }
  };


  const renderItem = ({ item }) => {
    // Check if the current item is selected
    const isSelected = item._id === selectedItemId;

    return (
      <TouchableOpacity
        style={[styles.item]} // Apply selected style conditionally
        onPress={() => navigation.navigate(ROUTES.UserProducts, { item: item })} // Update selected state on press
      >
        <Image source={require('../../assets/images/Home/beef.png')} style={[styles.image]} />
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

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

  const ShowCategory = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/category", requestOptions)
      const result = await response.json()


      const activeCategories = result?.categories.filter(category => category.status === 'Active')

      setcategories(activeCategories)
      if (activeCategories.length > 0) {
        setSelectedItemId(activeCategories[0]._id); // Set the first item as selected
      }
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect((
    useCallback(() => {
      ShowCategory()
    }, [])
  ))

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
          <Image style={styles.chunkImage} source={item.image?.url ? { uri: item.image?.url } : require('../../assets/images/Home/4.png')} />

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

  const renderProductItem1 = ({ item }) => {
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

  const renderSubcategoryChunk = ({ item }) => (
    <View style={styles.chunkContainer}>

      <FlatList
        data={item.products}
        renderItem={renderProductItem1}
        keyExtractor={(product) => product._id}
        numColumns={column}
        contentContainerStyle={styles.chunkListContainer}
      />
    </View>
  );

  const renderCategoryChunk = ({ item }) => (
    <View>
      <FlatList
        data={item?.subcategories?.slice(0, 2)}
        renderItem={renderSubcategoryChunk}
        keyExtractor={(subcat, index) => subcat.subcategory + index}
      />
    </View>
  );
  const fetchFavoriteProducts = async () => {
    const restaurantId = await AsyncStorage.getItem('restuarantId');
    try {
      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/restaurant/get-favorite-products/${restaurantId}`);
      const result = await response.json();
      setFavorites(result.favorites || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };

  const getProductsBySupplier = async () => {

    try {
      const restaurantId = await AsyncStorage.getItem('restuarantId');
      const restaurantToken = await AsyncStorage.getItem('restuarantToken');
      const requestOptions = {
        method: "GET",
        headers: {
          "x-access-token": restaurantToken,  // Include the en in the Authorization header
          "Content-Type": "application/json"  // Assuming JSON format
        },
        redirect: "follow"
      };
      const response = await fetch(`${BaseurlProducts}most-selling-product/${restaurantId}`, requestOptions);
      const result = await response.json(); // Assuming the API returns JSON
      console.log("most selling products", result, "products")
      const productsWithImages = result.products?.map(product => ({
        ...product,
        image: getRandomImage()
      }));

      setproducts(result);
      setloading(false)
      setlastloading(false)
    } catch (error) {
      console.error('Error fetching products:', error);
      setloading(false)
      setlastloading(false)
    }
  };

  useEffect(() => {
    getProductsBySupplier();
    fetchMostRecentProduct()
    fetchFavoriteProducts()
  }, [selectedItemId]);

  const addFavoriteProduct = async (productId) => {
    setFavLoad(true);
    const restaurantId = await AsyncStorage.getItem('restuarantId');
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        productId: productId,
        restaurantId: restaurantId
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/restaurant/add-favorite-product", requestOptions);
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
    const restaurantId = await AsyncStorage.getItem('restuarantId');
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        productId: productId,
        restaurantId: restaurantId
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/restaurant/delete-favorite-product", requestOptions);
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


  if (lastloading) {
    return (
      <Loader />
    )
  }


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themeStyle.BLACK} />
      <ScrollView>
        <HomeHeader onPress={true} />
        {/* <TouchableOpacity activeOpacity={2} onPress={()=>navigation.navigate(ROUTES.AllProducts,{search:true})} style={styles.searchBar}>
          <Image style={styles.searchIcon} source={require('../../assets/images/Home/search.png')} />
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={themeStyle.TEXT_GREY}
            placeholder='Search Here'
            editable={false}
          />
        </TouchableOpacity> */}

        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity onPress={scrollToLeft} style={styles.leftArrow}>
            <Image style={styles.arrowIcon} source={require('../../assets/images/Home/left.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={scrollToRight} style={styles.rightArrow}>
            <Image style={styles.arrowIcon} source={require('../../assets/images/Home/right.png')} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          horizontal
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
        />

        <View style={styles.chunkHeader}>
          <Text style={styles.categoriesTitle}>Latest Products</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate(ROUTES.AllProducts)} style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All</Text>
            <Image resizeMode='contain' style={styles.arrowIcon} source={require('../../assets/images/Home/arrow2.png')} />
          </TouchableOpacity> */}
        </View>

        {
          loading ? (
            <PacmanIndicator color={themeStyle.PRIMARY_COLOR} size={70} style={{ marginTop: 150 }} />
          ) :
            recent?.length == 0 ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                <Text style={{ fontSize: 20, color: "black", marginTop: "50%" }}>No Products Yet!</Text>
              </View>
            ) : (
              <FlatList
                data={recent.slice(0, 4)}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.chunkListContainer}
                numColumns={column}
              />
            )
        }


        <View style={styles.chunkHeader}>
          <Text style={styles.categoriesTitle}>Most Selling</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate(ROUTES.AllProducts)} style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All</Text>
            <Image resizeMode='contain' style={styles.arrowIcon} source={require('../../assets/images/Home/arrow2.png')} />
          </TouchableOpacity> */}
        </View>

        {
          loading ? (
            <PacmanIndicator color={themeStyle.PRIMARY_COLOR} size={70} style={{ marginTop: 150 }} />
          ) :
            products?.length == 0 ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                <Text style={{ fontSize: 20, color: "black", marginTop: "50%" }}>No Products Yet!</Text>
              </View>
            ) : (
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.chunkListContainer}
                numColumns={column}
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
    marginTop: '8%',
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
    marginTop: '10%',
  },
  categoriesTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
  },
  leftArrow: {
    marginLeft: 'auto',
    left: 108,
  },
  rightArrow: {
    marginLeft: 'auto',
    marginRight: '5%',
    left: 30
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
    marginTop: '5%',
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
    fontSize: 12,
    fontFamily: FONT.ManropeSemiBold,
    marginLeft: '2%',
    color: themeStyle.WHITE,
  },
  footerSpace: {
    height: 50,
  },
  selectedItem: {
    borderWidth: 1,
    borderColor: 'red', // Add border when selected
    borderRadius: 10
  },
});