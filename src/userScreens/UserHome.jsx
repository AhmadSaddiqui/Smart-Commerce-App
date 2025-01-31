import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import themeStyle, {FONT} from '../styles/themeStyle';
import {Categories, CHunk, Ribs} from '../data/dummy';
import HomeHeader from '../components/HomeHeader';
import {ROUTES} from '../routes/RoutesConstants';
import {Buffer} from 'buffer';
import GlobalButton from '../components/GlobalButton';
import {addItemToCart} from '../redux/CartSlice';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {PacmanIndicator} from 'react-native-indicators';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../components/Loader';
import {
  BaseurlBuyer,
  BaseurlCategory,
  BaseurlProducts,
} from '../Apis/apiConfig';
import axios from 'axios'; // Import axios for API calls

export default function UserProducts({navigation}) {
  const flatListRef = useRef(null);
  const [lastloading, setlastloading] = useState(true);
  const dispatch = useDispatch();
  const [quantity, setquantity] = useState(1);
  const [products, setproducts] = useState([]);
  const [searchproducts, setsearchproducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favLoad, setFavLoad] = useState(false);
  const [loading, setloading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [categories, setcategories] = useState([]);
  const [recent, setrecent] = useState([]);
  const [column, setColumn] = useState(2);
  const [selectedImage, setSelectedImage] = useState(null); // State to hold selected image

  // New State Variables for Image-Based Search
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Image Picker Options
  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 0.8,
    includeBase64: false,
    saveToPhotos: true,
  };

  const scrollToLeft = () => {
    flatListRef.current.scrollToOffset({offset: 0, animated: true});
  };

  const scrollToRight = () => {
    flatListRef.current.scrollToEnd({animated: true});
  };

  const fetchMostRecentProduct = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    const buyerToken = await AsyncStorage.getItem('buyerToken');
    const requestOptions = {
      method: 'GET',
      headers: {
        'x-access-token': buyerToken, // Include the token in the header
        'Content-Type': 'application/json', // Assuming JSON format
      },
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `${BaseurlProducts}most-recent-product/${buyerId}`,
        requestOptions,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Assuming the response is in JSON format
      setrecent(result);
    } catch (error) {
      console.error('Error fetching the most recent product:', error.message);
    }
  };

  const renderItem = ({item}) => {
    // Check if the current item is selected
    const isSelected = item._id === selectedItemId;

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]} // Apply selected style conditionally
        onPress={() => {
          setSelectedItemId(item._id); // Update selected state on press
          navigation.navigate(ROUTES.UserProducts, {item: item});
        }}>
        {/* Use the updated image URL for the emulator */}
        <Image
          source={{uri: item.image?.url.replace('localhost', '10.0.2.2')}}
          style={styles.image}
        />
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
        method: 'GET',
        redirect: 'follow',
      };

      // Log the request URL for debugging
      console.log('Requesting categories from:', `${BaseurlCategory}`);

      const response = await fetch(`${BaseurlCategory}`, requestOptions);

      // Check if the response is successful
      if (!response.ok) {
        console.log('Failed to fetch categories. Status:', response.status);
        return;
      }

      const result = await response.json();

      // Log the result to see the data returned from the server
      console.log('Response from server:', result);

      if (result?.categories) {
        const activeCategories = result.categories.filter(
          category => category.status === 'Active',
        );

        // Log the active categories to see if filtering works
        console.log('Active Categories:', activeCategories);

        setcategories(activeCategories);
        if (activeCategories.length > 0) {
          setSelectedItemId(activeCategories[0]._id); // Set the first item as selected
        }
      } else {
        console.log('No categories found in the response');
      }
    } catch (error) {
      // Log any errors that happen during the fetch
      console.log('Error fetching categories:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      ShowCategory();
    }, []),
  );

  const renderProductItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('UserSingleItem', {item: item})}
        style={styles.chunkItem}>
        <TouchableOpacity
          onPress={() => handleFavoritePress(item._id)}
          style={styles.heartButton}>
          <Image
            style={styles.heartIcon}
            source={
              isFavorite(item._id)
                ? require('../../assets/images/Home/heart.png')
                : require('../../assets/images/Home/greyheart.png')
            }
          />
        </TouchableOpacity>
        <View style={styles.chunkImageContainer}>
          {/* Update the image source with the modified URL */}
          <Image
            style={styles.chunkImage}
            source={{
              uri: item.image?.url
                ? item.image.url.replace('localhost', '10.0.2.2')
                : require('../../assets/images/Home/4.png'),
            }}
          />
        </View>
        <Text style={styles.chunkTitle}>{item.name}</Text>
        <Text style={styles.chunkPrice}>
        {item?.price && item.price.toFixed(2)} $
          <Text style={styles.chunkPriceUnit}>.</Text>
        </Text>
        <View style={styles.chunkActions}>
          <TouchableOpacity
            onPress={() => {
              dispatch(addItemToCart({...item, quantity}));
              navigation.navigate('UserCart');
            }}
            style={styles.cartButton}>
            <Image
              style={styles.cartIcon}
              source={require('../../assets/images/Home/whitecart.png')}
            />
            <Text style={styles.cartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductItem1 = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('UserSingleItem', {item: item})}
        style={styles.chunkItem}>
        <TouchableOpacity
          onPress={() => handleFavoritePress(item._id)}
          style={styles.heartButton}>
          <Image
            style={styles.heartIcon}
            source={
              isFavorite(item._id)
                ? require('../../assets/images/Home/heart.png')
                : require('../../assets/images/Home/greyheart.png')
            }
          />
        </TouchableOpacity>
        <View style={styles.chunkImageContainer}>
          <Image style={styles.chunkImage} source={{uri: item?.image}} />
        </View>
        <Text style={styles.chunkTitle}>{item.name}</Text>
        <Text style={styles.chunkPrice}>
          {item?.price && item.price.toFixed(2)}
          <Text style={styles.chunkPriceUnit}>.</Text>
        </Text>
        <View style={styles.chunkActions}>
          <TouchableOpacity
            onPress={() => {
              dispatch(addItemToCart({...item, quantity}));
              navigation.navigate('UserCart');
            }}
            style={styles.cartButton}>
            <Image
              style={styles.cartIcon}
              source={require('../../assets/images/Home/whitecart.png')}
            />
            <Text style={styles.cartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubcategoryChunk = ({item}) => (
    <View style={styles.chunkContainer}>
      <FlatList
        data={item.products}
        renderItem={renderProductItem1}
        keyExtractor={product => product._id}
        numColumns={column}
        contentContainerStyle={styles.chunkListContainer}
      />
    </View>
  );

  const renderCategoryChunk = ({item}) => (
    <View>
      <FlatList
        data={item?.subcategories?.slice(0, 2)}
        renderItem={renderSubcategoryChunk}
        keyExtractor={(subcat, index) => subcat.subcategory + index}
      />
    </View>
  );

  const fetchFavoriteProducts = async () => {
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const response = await fetch(
        `${BaseurlBuyer}/get-favorite-products/${buyerId}`,
      );
      const result = await response.json();
      setFavorites(result.favorites || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };

  const getProductsBySupplier = async () => {
    try {
      const buyerId = await AsyncStorage.getItem('buyerId');
      const buyerToken = await AsyncStorage.getItem('buyerToken');
      const requestOptions = {
        method: 'GET',
        headers: {
          'x-access-token': buyerToken, // Include the token in the header
          'Content-Type': 'application/json', // Assuming JSON format
        },
        redirect: 'follow',
      };
      const response = await fetch(
        `${BaseurlProducts}most-selling-product/${buyerId}`,
        requestOptions,
      );
      const result = await response.json(); // Assuming the API returns JSON
      console.log('most selling products', result, 'products');
      const productsWithImages = result.products?.map(product => ({
        ...product,
        image: getRandomImage(),
      }));

      setproducts(result);
      setloading(false);
      setlastloading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setloading(false);
      setlastloading(false);
    }
  };

  useEffect(() => {
    getProductsBySupplier();
    fetchMostRecentProduct();
    fetchFavoriteProducts();
  }, [selectedItemId]);

  const addFavoriteProduct = async productId => {
    setFavLoad(true);
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        productId: productId,
        buyerId: buyerId,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        `${BaseurlBuyer}/add-favorite-product`,
        requestOptions,
      );
      const result = await response.json();
      setFavLoad(false);
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#5a46cf',
        textColor: 'white',
        marginBottom: 0,
      });

      // Update the favorites list
      setFavorites([...favorites, {_id: productId}]);
    } catch (error) {
      console.error('Error adding favorite product:', error);
      setFavLoad(false);
    }
  };

  const removeFavoriteProduct = async productId => {
    setFavLoad(true);
    const buyerId = await AsyncStorage.getItem('buyerId');
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        productId: productId,
        buyerId: buyerId,
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch(
        `${BaseurlBuyer}/delete-favorite-product`,
        requestOptions,
      );
      const result = await response.json();

      setFavLoad(false);
      Snackbar.show({
        text: result?.message,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#5a46cf',
        textColor: 'white',
        marginBottom: 0,
      });

      // Update the favorites list
      setFavorites(favorites.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing favorite product:', error);
      setFavLoad(false);
    }
  };

  const isFavorite = productId => {
    return favorites.some(item => item._id === productId);
  };

  const handleFavoritePress = productId => {
    if (isFavorite(productId)) {
      removeFavoriteProduct(productId);
    } else {
      addFavoriteProduct(productId);
    }
  };

  // ------------------ Image-Based Search Functions ------------------

  /**
   * Converts an image URI to a base64 string.
   * @param {string} uri - The URI of the image.
   * @returns {Promise<string>} - A promise that resolves to the base64 string of the image.
   */
  const uriToBase64 = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
          reader.abort();
          reject(new Error('Problem parsing input file.'));
        };
        reader.onload = () => {
          const dataUrl = reader.result;
          const base64 = dataUrl.split(',')[1]; // Remove the data URL prefix
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting URI to base64:', error);
      throw error;
    }
  };

  /**
   * Generates tags from the base64 image using the Imagga API.
   * @param {string} base64Image - The base64 string of the image.
   * @returns {Promise<string[]>} - A promise that resolves to an array of tags.
   */
  const generateTagsFromImagga = async base64Image => {
    const imaggaApiKey = 'acc_b25dea069e26672';
    const imaggaApiSecret = '3b2d7321b815afd2d48da1543e1e583b';
    const apiUrl = 'https://api.imagga.com/v2/tags';

    const authHeader =
      'Basic ' +
      Buffer.from(`${imaggaApiKey}:${imaggaApiSecret}`).toString('base64');

    const formData = new FormData();
    formData.append('image_base64', base64Image);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'multipart/form-data',
        },
      });

      const tags = response.data.result.tags.map(tag => tag.tag.en);

      console.log('Yehb tags ha ', tags);
      return tags;
    } catch (error) {
      console.error('Failed to read image using Imagga API:', error);
      throw new Error('Failed to process image');
    }
  };

  /**
   * Handles the generation of tags from the selected image.
   * @param {string} imageUri - The URI of the selected image.
   */
  const handleGenerateTags = async imageUri => {
    if (!imageUri) return;

    try {
      setImageLoading(true);
      setImageError(null);

      const base64Image = await uriToBase64(imageUri);
      const tags = await generateTagsFromImagga(base64Image);

      console.log('Generated Tags:', tags);

      if (tags.length === 0) {
        throw new Error('No tags generated from image');
      }

      await handleSearchByTags(tags);
    } catch (error) {
      console.error('Error generating tags from image:', error);
      setImageError(error.message);
      Snackbar.show({
        text: `Error yeh ha : ${error.message}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
        textColor: 'white',
      });
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * Handles searching for products based on the generated tags.
   * @param {string[]} tags - An array of tags extracted from the image.
   */
  const handleSearchByTags = async tags => {
    try {
      const buyerToken = await AsyncStorage.getItem('buyerToken');
      const requestOptions = {
        method: 'POST',
        headers: {
          'x-access-token': buyerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags}),
        redirect: 'follow',
      };

      const response = await fetch(
        `${BaseurlProducts}/search-by-tags`,
        requestOptions,
      );

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(
          errorResult.message || 'Error searching products by tags',
        );
      }

      const searchResults = await response.json();
      console.log('Search Results:', JSON.stringify(searchResults, null, 2));

      if (searchResults.length === 0) {
        Snackbar.show({
          text: 'No products found for the selected image.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff9800',
          textColor: 'white',
        });
      }

      setsearchproducts(searchResults.slice(0,4));
    } catch (error) {
      console.error('Error searching products by tags:', error);
      setImageError(error.message);
      Snackbar.show({
        text: `Error: ${error.message}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
        textColor: 'white',
      });
    }
  };

  // ------------------ Image Picker Functions ------------------

  const openCamera = () => {
    launchCamera(imagePickerOptions, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
        Snackbar.show({
          text: `Camera Error: ${response.errorMessage}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
          textColor: 'white',
        });
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedImage(asset.uri);
        console.log('Camera Image URI:', asset.uri);
        Snackbar.show({
          text: 'Image selected from camera',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: themeStyle.PRIMARY_COLOR,
          textColor: 'white',
        });
        // Perform image-based search
        await handleGenerateTags(asset.uri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
        Snackbar.show({
          text: `Image Picker Error: ${response.errorMessage}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
          textColor: 'white',
        });
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setSelectedImage(asset.uri);
        console.log('Gallery Image URI:', asset.uri);
        Snackbar.show({
          text: 'Image selected from gallery',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: themeStyle.PRIMARY_COLOR,
          textColor: 'white',
        });
        // Perform image-based search
        await handleGenerateTags(asset.uri);
      }
    });
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  // ------------------ Render Logic ------------------

  if (lastloading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={themeStyle.BLACK} />
      <ScrollView>
        <HomeHeader onPress={true} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            // Add other TextInput props as needed
            onChangeText={text => {
              // Handle search input change
              // You can implement search functionality here
              console.log('Search query:', text);
            }}
          />
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.cameraButton}>
            <Image
              style={styles.cameraIcon}
              source={require('../../assets/images/Home/Uimage.png')} // Ensure you have a camera icon
            />
          </TouchableOpacity>
        </View>

        {/* Optionally display the selected image */}
        {selectedImage && (
          <Image source={{uri: selectedImage}} style={styles.selectedImage} />
        )}

        {/* Show loading indicator for image-based search */}
        {imageLoading && (
          <View style={styles.imageLoadingContainer}>
            <PacmanIndicator color={themeStyle.PRIMARY_COLOR} size={50} />
            <Text style={styles.loadingText}>Searching for products...</Text>
          </View>
        )}

        {/* Categories Header */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity onPress={scrollToLeft} style={styles.leftArrow}>
            <Image
              style={styles.arrowIcon}
              source={require('../../assets/images/Home/left.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={scrollToRight} style={styles.rightArrow}>
            <Image
              style={styles.arrowIcon}
              source={require('../../assets/images/Home/right.png')}
            />
          </TouchableOpacity>
        </View>

        {/* Categories FlatList */}
        <FlatList
          ref={flatListRef}
          horizontal
          data={categories}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
        />
        {searchproducts && searchproducts.length > 0 ? (
          <>
            <View style={styles.chunkHeader}>
              <Text style={styles.categoriesTitle}>Most Similar Products</Text>
            </View>

            {/* Similar Products FlatList */}
            {loading ? (
              <PacmanIndicator
                color={themeStyle.PRIMARY_COLOR}
                size={70}
                style={{marginTop: 150}}
              />
            ) : searchproducts?.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 20, color: 'black', marginTop: '50%'}}>
                  No Products Yet!
                </Text>
              </View>
            ) : (
              <FlatList
                data={searchproducts.slice(0, 4)}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.chunkListContainer}
                numColumns={column}
              />
            )}
          </>
        ) : (
          <>
            {/* Latest Products Header */}
            <View style={styles.chunkHeader}>
              <Text style={styles.categoriesTitle}>Latest Products</Text>
            </View>

            {/* Latest Products FlatList */}
            {loading ? (
              <PacmanIndicator
                color={themeStyle.PRIMARY_COLOR}
                size={70}
                style={{marginTop: 150}}
              />
            ) : recent?.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 20, color: 'black', marginTop: '50%'}}>
                  No Products Yet!
                </Text>
              </View>
            ) : (
              <FlatList
                data={recent.slice(0, 4)}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.chunkListContainer}
                numColumns={column}
              />
            )}

            {/* Most Selling Products Header */}
            <View style={styles.chunkHeader}>
              <Text style={styles.categoriesTitle}>Most Selling</Text>
              {/* Uncomment if you want a "View All" button */}
              {/* 
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.AllProducts)} style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All</Text>
            <Image resizeMode='contain' style={styles.arrowIcon} source={require('../../assets/images/Home/arrow2.png')} />
          </TouchableOpacity> 
          */}
            </View>

            {/* Most Selling Products FlatList */}
            {loading ? (
              <PacmanIndicator
                color={themeStyle.PRIMARY_COLOR}
                size={70}
                style={{marginTop: 150}}
              />
            ) : products?.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 20, color: 'black', marginTop: '50%'}}>
                  No Products Yet!
                </Text>
              </View>
            ) : (
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item, index) => item.id + index}
                contentContainerStyle={styles.chunkListContainer}
                numColumns={column}
              />
            )}
          </>
        )}

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
    marginRight: 10, // Adjust spacing as needed
  },
  rightArrow: {
    marginLeft: 10, // Adjust spacing as needed
  },
  arrowIcon: {
    height: 19,
    width: 19,
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
    borderRadius: 50,
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
    width: '90%',
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
    borderRadius: 10, // Added border radius for better UI
  },
  chunkImageContainer: {
    height: 107,
    width: 107,
    backgroundColor: themeStyle.WHITE,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    alignSelf: 'center',
    borderRadius: 53.5, // Half of 107 to make it circular
    alignItems: 'center',
    justifyContent: 'center',
  },
  chunkImage: {
    height: 100,
    width: 100,
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
    top: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3, // For Android shadow
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
    borderWidth: 2,
    borderColor: themeStyle.PRIMARY_COLOR, // Highlight color when selected
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1', // Search bar background color
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginHorizontal: '5%', // Adjust to 0 for full width
    marginTop: '5%', // Space below the header
    width: '90%', // Set to '100%' for full width
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3, // For Android shadow
  },
  cameraButton: {
    padding: 8,
    marginLeft: 8,
  },
  cameraIcon: {
    height: 35,
    width: 45,
    resizeMode: 'contain',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
  imageLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: themeStyle.PRIMARY_COLOR,
    fontFamily: FONT.ManropeRegular,
  },
});
