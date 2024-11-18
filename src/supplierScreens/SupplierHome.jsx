import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet, ScrollView, Modal } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import themeStyle, { FONT } from '../styles/themeStyle'
import { Categories, CHunk, Ribs } from '../data/dummy';
import HomeHeader from '../components/HomeHeader';
import { ROUTES } from '../routes/RoutesConstants';
import GlobalButton from '../components/GlobalButton';
import { addItemToCart } from '../redux/CartSlice';
import { useDispatch } from 'react-redux';
import LiveBezierChart from '../components/LiveBezierChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseurlProducts, BaseurlSupplier } from '../Apis/apiConfig';
import { useFocusEffect } from '@react-navigation/native';
import { WaveIndicator, } from 'react-native-indicators';
import HomeHeaderSupplier from '../components/HomeHeaderSupplier';
import ApexChart from './ApexChart';

export default function SupplierHome({ navigation }) {
  const [showOptions, setShowOptions] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [percentage, setPercentage] = useState({});

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false); // Hide options after selection
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seletedproduct, setseletedproduct] = useState(null)
  console.log(seletedproduct)
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

  const fetchDashboard = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,  // Adding the token in the header
    };

    const response = await fetch(`${BaseurlSupplier}/dashboard-data/${supplierId}`, {
      method: 'GET',
      headers: headers, // Pass headers here
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json(); // assuming the API returns JSON
    setDashboardData(result);
    setPercentage({
      salePercentage: result?.todayTotalPrice / result?.percentageTodayTotal * 100,
      totalOrderPercentage: result?.totalOrders / result?.percentageTodayTotal * 100,
      totalDeliverPercentage: result?.deliveredOrders / result?.totalOrders * 100,
      totalPendingPercentage: result?.pendingOrders / result?.totalOrders * 100,
    })
    console.log('response:', result, 'percent:', percentage);

  }

  const fetchProducts = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };
    const requestOptions = {
      method: "GET",
      headers: headers, // Pass headers here
      redirect: "follow",
    };

    try {
      const response = await fetch(`${BaseurlProducts}/supplier/${supplierId}`, requestOptions);
      console.log(response, 'resssssss')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json(); // assuming the API returns JSON
      // console.log(result)
      const productsWithImages = result.products?.map(product => ({
        ...product,
        image: getRandomImage()
      }));

      setProducts(productsWithImages);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const [loadingdelete, setLoadingdelete] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoadingdelete(true);
    setError(null);
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": token,
    };
    const requestOptions = {
      method: "DELETE",
      headers: headers, // Pass headers here
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/products/${seletedproduct}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result, 'delete');
      setShowOptions(false)
      fetchProducts()
      // Alert.alert("Success", "Product deleted successfully");
    } catch (error) {
      console.error(error);
      setError(error.message);
      // Alert.alert("Error", "Failed to delete the product");
    } finally {
      setLoadingdelete(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      fetchDashboard();
      // Optional cleanup function
      return () => {
        // Cleanup logic if needed
      };
    }, [])
  );

  const renderItemChunk = ({ item }) => (
    <TouchableOpacity activeOpacity={2} style={styles.chunkItem}>
      <View style={styles.chunkImageContainer}>
        <Image style={styles.chunkImage} source={item.image} />
      </View>
      <Text style={styles.chunkTitle}>{item.name}</Text>
      <Text style={styles.chunkPrice}>
        ${item.price}
        <Text style={styles.chunkPriceUnit}> /kg</Text>
      </Text>
      <View style={styles.chunkActions}>
        <TouchableOpacity onPress={() => {
          setseletedproduct(item?._id)
          setShowOptions(true)
        }} style={styles.heartButton}>
          <Image style={styles.heartIcon} source={require('../../assets/images/SupplierHome/delete.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.EditProduct, { id: item?._id, home: true, item: item })} style={styles.cartButton}>
          <Text style={styles.cartText}>Edit item</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ backgroundColor: themeStyle.WHITE, elevation: 5, height: 70 }}>
          <HomeHeaderSupplier onPress={() => navigation.navigate(ROUTES.SupplierEditProfile)} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginHorizontal: "5%", marginTop: "5%" }} >
          <View style={{ ...styles.container1, backgroundColor: themeStyle.PRIMARY_COLOR }}>
            <View>
              <View style={{ ...styles.imgBgStyle, backgroundColor: themeStyle.WHITE }}>
                <Image style={styles.handImage} source={require('../../assets/images/SupplierHome/growth.png')} />
              </View>
              <Text style={{ ...styles.totalSalesText, color: themeStyle.WHITE }}>Total Sales</Text>

            </View>
            <Text style={{ ...styles.amountText, color: themeStyle.WHITE }}>${dashboardData?.totalPrice?.toFixed(2) ?? '0.00'}</Text>
            <View style={styles.footer}>
              <Image style={{ ...styles.pathImage, tintColor: themeStyle.WHITE }} source={require('../../assets/images/SupplierHome/Path.png')} />
              <Text style={{ ...styles.percentageText, color: themeStyle.WHITE }}>{(percentage?.salePercentage != null && !isNaN(percentage.salePercentage))
                ? percentage?.salePercentage?.toFixed(2)
                : '0'}%</Text>
              <Text style={{ ...styles.upFromText, color: themeStyle.WHITE }}>Up from yesterday</Text>
            </View>
          </View>

          <View style={styles.container1}>
            <View >
              <View style={styles.imgBgStyle}>
                <Image style={styles.handImage} source={require('../../assets/images/SupplierHome/shopping-bag.png')} />
              </View>
              <Text style={styles.totalSalesText}>Total Orders</Text>
            </View>
            <Text style={styles.amountText}>${dashboardData?.totalOrders?.toFixed(2) ?? '0.00'}</Text>
            <View style={styles.footer}>
              <Image style={styles.pathImage} source={require('../../assets/images/SupplierHome/Path.png')} />
              <Text style={styles.percentageText}>{(percentage?.totalOrderPercentage != null && !isNaN(percentage.totalOrderPercentage))
                ? percentage?.totalOrderPercentage?.toFixed(2)
                : '0'}%</Text>
              <Text style={styles.upFromText}>Up from yesterday</Text>
            </View>
          </View>
        </View>


        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginHorizontal: "5%", marginTop: "5%" }} >
          <View style={styles.container1}>
            <View >
              <View style={styles.imgBgStyle}>
                <Image style={styles.handImage} source={require('../../assets/images/SupplierHome/shopping-bag.png')} />
              </View>
              <Text style={styles.totalSalesText}>Delivered Orders</Text>
            </View>
            <Text style={styles.amountText}>${dashboardData?.deliveredOrders?.toFixed(2) ?? '0.00'}</Text>
            <View style={styles.footer}>
              <Image style={styles.pathImage} source={require('../../assets/images/SupplierHome/Path.png')} />
              <Text style={styles.percentageText}>{(percentage?.totalDeliverPercentage != null && !isNaN(percentage.totalDeliverPercentage))
                ? percentage?.totalDeliverPercentage?.toFixed(2)
                : '0'}%</Text>
              <Text style={styles.upFromText}>Up from yesterday</Text>
            </View>
          </View>
          <View style={styles.container1}>
            <View>
              <View style={styles.imgBgStyle}>
                <Image style={styles.handImage} source={require('../../assets/images/SupplierHome/shopping-bag.png')} />
              </View>
              <Text style={styles.totalSalesText}>Pending Orders</Text>
            </View>
            <Text style={styles.amountText}>${dashboardData?.pendingOrders?.toFixed(2) ?? '0.00'}</Text>
            <View style={styles.footer}>
              <Image style={styles.pathImage} source={require('../../assets/images/SupplierHome/Path.png')} />
              <Text style={styles.percentageText}>{(percentage?.totalPendingPercentage != null && !isNaN(percentage.totalPendingPercentage))
                ? percentage?.totalPendingPercentage?.toFixed(2)
                : '0'}%</Text>
              <Text style={styles.upFromText}>Up from yesterday</Text>
            </View>
          </View>
        </View>
        <View style={styles.chunkHeader}>
          <Text style={styles.categoriesTitle}>Earnings</Text>
        </View>
        <LiveBezierChart />
        <View style={styles.chunkHeader}>
          <Text style={styles.categoriesTitle}>Revenue</Text>
        </View>
        <View style={{ marginLeft: 18, marginTop: 15 }}>
          <ApexChart />
        </View>
        <View style={styles.chunkHeader}>
          <Text style={styles.categoriesTitle}>Recently Listed Items</Text>
        </View>
        <FlatList
          data={products.slice(0, 4)}
          renderItem={renderItemChunk}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chunkListContainer}
          numColumns={2}
        />
        <View style={styles.footerSpace} />
      </ScrollView>
      <Modal
        visible={showOptions}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowOptions(false)}
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ height: 231, width: '90%', alignSelf: "center", backgroundColor: themeStyle.WHITE, borderRadius: 15 }}>
            <View style={{ flexDirection: "row", alignItems: 'center', marginTop: "5%" }}>
              <Image style={{ height: 24, width: 24, marginLeft: '5%' }} source={require('../../assets/images/SupplierHome/warning.png')} />
              <Text style={{ fontSize: 16, color: themeStyle.PRIMARY_COLOR, fontFamily: FONT.ManropeRegular, marginLeft: '5%' }}>Delete Product?</Text>
            </View>
            <Text style={{ fontSize: 16, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular, textAlign: 'center', marginTop: '10%' }}>Are you sure you want to delete this product?</Text>
            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginHorizontal: "5%", marginTop: "15%" }}>
              <TouchableOpacity onPress={() => setShowOptions(false)} style={{ height: 50, width: 138, backgroundColor: themeStyle.WHITE, borderWidth: 1, borderColor: themeStyle.TEXT_GREY, borderRadius: 5, alignItems: "center", justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, color: themeStyle.TEXT_GREY, fontFamily: FONT.ManropeRegular }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={{ height: 50, width: 138, backgroundColor: themeStyle.PRIMARY_COLOR, borderRadius: 5, alignItems: "center", justifyContent: 'center' }}>
                {
                  loadingdelete ? (
                    <WaveIndicator color={themeStyle.WHITE} />
                  ) : (
                    <Text style={{ fontSize: 15, color: themeStyle.WHITE, fontFamily: FONT.ManropeRegular }}>Delete</Text>
                  )
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  chunkTitle: {
    fontSize: 18,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
  },
  viewAll: {
    marginLeft: '55%',
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
    height: 218,
    width: 158,
    backgroundColor: themeStyle.bgcItem,
    borderColor: themeStyle.bgcItem,
    borderWidth: 2,
    marginHorizontal: 5,
    justifyContent: 'center',
    marginTop: '5%',
  },
  chunkImageContainer: {
    height: 107,
    width: 107,
    backgroundColor: themeStyle.WHITE,
    alignSelf: 'center',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chunkImage: {
    height: 56,
    width: 86,
  },
  chunkTitle: {
    fontSize: 14,
    fontFamily: FONT.ManropeSemiBold,
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
    height: 28,
    width: 28,
    borderColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  heartIcon: {
    width: 12,
    height: 15,
    top: 2
  },
  cartButton: {
    height: 28,
    width: 97,
    borderColor: themeStyle.TEXT_GREY,
    borderRadius: 5,
    marginLeft: '5%',
    alignItems: 'center',
    borderWidth: 1
  },
  cartIcon: {
    width: 10,
    height: 8.75,
  },
  cartText: {
    fontSize: 10,
    fontFamily: FONT.ManropeSemiBold,
    color: themeStyle.TEXT_GREY,
    top: 5
  },
  footerSpace: {
    height: 50,
  },
  container1: {
    // height: 105,
    width: '49%',
    backgroundColor: '#FBFBFB66',
    borderColor: '#FBFBFB66',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    marginHorizontal: '5%',
    justifyContent: 'space-between',
  },
  totalSalesText: {
    fontSize: 12,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeSemiBold,
    fontWeight: '500',
    marginTop: '2%',
  },
  handImage: {
    height: 22,
    width: 22,
  },
  imgBgStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: themeStyle.PRIMARY_COLOR,
    borderRadius: 20
  },
  amountText: {
    fontSize: 24,
    color: themeStyle.BLACK,
    fontFamily: FONT.ManropeBold,
    // marginLeft: '5%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: '5%',
  },
  pathImage: {
    height: 6,
    width: 11,
  },
  percentageText: {
    fontSize: 8,
    color: themeStyle.GREEN,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },
  upFromText: {
    fontSize: 8,
    color: themeStyle.TEXT_GREY,
    fontFamily: FONT.ManropeRegular,
    marginLeft: '5%',
  },

});
