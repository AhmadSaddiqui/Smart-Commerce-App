// import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, StatusBar, Alert, TextInput } from 'react-native'
// import React, { useCallback, useEffect, useState } from 'react'
// import themeStyle, { FONT } from '../styles/themeStyle'
// import { useDispatch, useSelector } from 'react-redux';
// import { removeItemFromCart, updateItemQuantity } from '../redux/CartSlice';
// import GlobalButton from '../components/GlobalButton';
// import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
// import GlobalInput from '../components/GlobalInput';
// import CountryInput from '../components/CountryInput';
// import Dropdown from '../components/Dropdown';
// import { ROUTES } from '../routes/RoutesConstants';
// import NoteInput from '../components/NoteInput';
// import ImagePicker from 'react-native-image-crop-picker'; // Import image picker library
// import CustomSwitch from '../components/CustomSwitch';
// import WeightDropdown from '../components/WeightDropDown';
// import CategoryDropDown from './CategoryDropDown';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BaseurlProducts } from '../Apis/apiConfig';
// import Snackbar from 'react-native-snackbar';
// import { useFocusEffect } from '@react-navigation/native';

// export default function AddProduct({ navigation }) {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState('');

//   const [selectedsubCategory, setSelectedsubCategory] = useState('');

//   console.log(selectedCategory,'category')
//   console.log(selectedsubCategory,'sub category')

//   const [weight, setweight] = useState('')
//   const [name, setname] = useState('')
//   const [desc, setdesc] = useState('')
//   const [price, setprice] = useState('')
//   const [byweight, setbyweight] = useState('')
//   const [flatrate, setflatrate] = useState('')
//   const [byDistance, setbyDistance] = useState('')
//   const [suppliername, setsuppliername] = useState('')
//   const [loading, setloading] = useState(false)
//   const handleUpload = () => {
//     ImagePicker.openPicker({
//       mediaType: 'photo',
//     }).then(image => {
//       console.log(image);
//       setSelectedImage(image.path);
//     }).catch(error => {
//       console.log('Error selecting image:', error);
//     });
//   };
//   const [isSwitchOn, setIsSwitchOn] = useState(true);
//   const [isSwitchOn1, setIsSwitchOn1] = useState(true);
//   const [isSwitchOn2, setIsSwitchOn2] = useState(true);
// const [category, setcategory] = useState([])
// const [subcategory, setsubcategory] = useState([])


//   const ShowCategory=async()=>{
//     try {
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow"
//       };
      
//    const response= await  fetch("https://meat-app-backend-zysoftec.vercel.app/api/category", requestOptions)
//   const result = await response.json()
//   console.log(result,'show category')
//   const activeCategories = result?.categories?.filter(category => category.status === "Active");
//   setcategory(activeCategories);

//     } catch (error) {
      
//     }
//   }

//   useFocusEffect((
//     useCallback(()=>{
// ShowCategory()
//     },[])
//   ))

//   const fetchSubcategories = async () => {
//     const url = `https://meat-app-backend-zysoftec.vercel.app/api/category/subcategories/${selectedCategory?._id}`;
  
//     // Prepare request options
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow"
//     };
  
//     try {
//       // Make the fetch request
//       const response = await fetch(url, requestOptions);
      
//       // Check if the response is ok
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const result = await response.json();
//       setsubcategory(result?.subcategories)
//       console.log(result);
      
//     } catch (error) {
//       // Log any errors
//       console.error('Error:', error);
//     }
//   };
// useEffect(()=>{
//   fetchSubcategories();
// },[selectedCategory])
  
  


//   const handleToggle = newValue => {
//     setIsSwitchOn(newValue);
//   };


//   const handleToggle1 = newValue => {
//     setIsSwitchOn1(newValue);
//   };
//   const handleToggle2 = newValue => {
//     setIsSwitchOn2(newValue);
//   };

//   const deliveryOption = isSwitchOn ? 'Flat Rate' : isSwitchOn1 ? 'By weight' : isSwitchOn2 ? 'By distance' : 'none'

//   console.log(deliveryOption)
//   const submitProduct = async () => {


//     setloading(true)
//     const supplierId = await AsyncStorage.getItem('supplierId');
//     const formdata = new FormData();
//     formdata.append("supplierId",supplierId);
//     formdata.append("suppliername",suppliername);
//     formdata.append("category", selectedCategory?._id);
//     formdata.append("subcategory",selectedsubCategory?.id);
//     formdata.append("name", name);
//     formdata.append("price", price);
//     formdata.append("weight", weight);
//     formdata.append("description", desc);
//     formdata.append("flatRate",isSwitchOn ? flatrate : null );
//     formdata.append("byDistance", isSwitchOn1 ? byDistance : null);
//     formdata.append("byWeight",isSwitchOn2 ? byweight : null );


  
//     const requestOptions = {
//       method: "POST",
//       body: formdata,
//       redirect: "follow",
//     };
  
//     try {
//       const response = await fetch(`${BaseurlProducts}`, requestOptions);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       console.log(result);
//       Snackbar.show({
//         text: 'Product added successfully',
//         duration: Snackbar.LENGTH_LONG,
//         backgroundColor: 'rgba(212, 4, 28, 1)',
//         textColor: 'white',
//         marginBottom: 0,
//       });
//       setloading(false)
//       navigation.navigate('Products')
//     } catch (error) {
//       console.error(error);
//       setloading(false)
//       Snackbar.show({
//         text: 'Failed to submit the product',
//         duration: Snackbar.LENGTH_LONG,
//         backgroundColor: 'rgba(212, 4, 28, 1)',
//         textColor: 'white',
//         marginBottom: 0,
//       });
//     }
//   };
  

//   return  (
//     <>
//     <View style={styles.container}>
//       <ScrollView>
//       <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Add New Product</Text>
//         <Image style={{height:31,width:31,marginLeft:'auto',marginRight:'5%',borderRadius:30}} source={require('../../assets/images/Splash/dp.png')} />
//         </View>
      
//         <CategoryDropDown
//         options={category}
//           title={'Category'}
//           hint={'Select Category'}
//           marginTop={'5%'}
//           onSelectCategory={setSelectedCategory} // Pass callback function
//         />

// {
//   selectedCategory && (
//     <CategoryDropDown
//         options={subcategory}
//           title={'Sub Category'}
//           hint={'Select Sub Category'}
//           marginTop={'5%'}
//           onSelectCategory={setSelectedsubCategory} // Pass callback function
//         />
//   )
// }
//         <GlobalInput onChangeText={setname} title={'Product Name'} hint={'Name here'} marginTop={'5%'} />
//         <GlobalInput onChangeText={setsuppliername} title={'Supplier Name'} hint={'Name here'} marginTop={'5%'} />

//         <GlobalInput keyboardType={'numeric'} onChangeText={setprice}  title={'Price'} hint={'$1300.00'} marginTop={'5%'} />
//         <WeightDropdown onSelectWeight={setweight} title={'Weight'} hint={'Select Weight'} marginTop={'5%'} />
//         <NoteInput onChangeText={setdesc} title={'Discription'} hint={'Write discription here'} marginTop={'5%'}/>
       
//         <Text style={{ fontSize: 14, fontFamily: FONT.ManropeRegular, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '8%' }}>
//           Upload Bulk Order Spreadsheet
//         </Text>

//         <TouchableOpacity onPress={handleUpload}>
//           {selectedImage ? (
//             <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={{ uri: selectedImage }} />
//           ) : (
//             <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={require('../../assets/images/Payment/upload.png')} />
//           )}
//         </TouchableOpacity>



// <GlobalButton loading={loading} onPress={submitProduct} marginTop={'10%'} title={'Add  Product'}/>
 
//         <View style={styles.bottomSpacer} />
//       </ScrollView>
//     </View>
//     </>
//   );
// }




import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ToastAndroid } from 'react-native';
import themeStyle, { FONT } from '../styles/themeStyle';
import CategoryDropDown from './CategoryDropDown';
import GlobalInput from '../components/GlobalInput';
import WeightDropdown from '../components/WeightDropDown';
import NoteInput from '../components/NoteInput';
import GlobalButton from '../components/GlobalButton';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BaseurlProducts } from '../Apis/apiConfig';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import LinearGradient from 'react-native-linear-gradient';

export default function AddProduct({ navigation }) {
  const [selectedButton, setSelectedButton] = useState('product'); // State to track which button is selected
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedsubCategory, setSelectedsubCategory] = useState('');
  const [weight, setweight] = useState('');
  const [name, setname] = useState('');
  const [desc, setdesc] = useState('');
  const [price, setprice] = useState('');
  const [suppliername, setsuppliername] = useState('');
  const [loading, setloading] = useState(false);
  const [category, setcategory] = useState([]);
  const [subcategory, setsubcategory] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [features, setFeatures] = useState([
    { title: '', description: '' }
  ]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [delayedProgress, setDelayedProgress] = useState(0);
  const [file, setFile] = useState(null);
  console.log(file?.name)

  const handleFileChange = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow all files, but we'll validate later
      });
  
      const selectedFile = res[0];
  
      // Check if the file is a CSV by verifying the MIME type and extension
      const isCsv =
        (selectedFile.type === "text/csv" || selectedFile.type === "text/comma-separated-values") &&
        selectedFile.name.endsWith(".csv");
  
      if (!isCsv) {
        setError("Please select a valid CSV file.");
        return;
      }
  
      setFile(selectedFile);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the file selection.");
      } else {
        setError("An error occurred while selecting the file.");
        console.error("File selection error:", err);
      }
    }
  };
  
  const handleFileUpload = async () => {
    console.log("file upload function");
  
    if (!file) {
      setError("No file selected.");
      Snackbar.show({
        text: 'Please select a file to upload.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
      });
      return;
    }
  
    const formdata = new FormData();
    const newFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      uri: file.uri,
    };
    formdata.append("file", file);
  
    console.log('formdata:', formdata);
    console.log('file:', file);
  
    setUploading(true);
    setProgress(0);
  
    try {
      // Replace with your API endpoint
      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/bulk-product/bulk-upload", {
        method: 'POST',
        body: formdata,
      });
  
      const result = await response.json();
      console.log("Upload result:", result);
  
      if (result?.message) {
        ToastAndroid.show(result.message, ToastAndroid.LONG);
      }
  
      setUploading(false);
      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setError(`An error occurred during the upload: ${error.message}`);
  
      // Show error message with Snackbar
      Snackbar.show({
        text: `An error occurred: ${error.message}`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)', // Red color
        textColor: 'white',
      });
  
      setUploading(false);
    }
  };
  

  console.log(features,'features')
  const handleAddFeature = () => {
    setFeatures([...features, { title: '', description: '' }]);
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };


  const handleUpload = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
    }).then(image => {
      setSelectedImage(image.path);
    }).catch(error => {
      console.log('Error selecting image:', error);
    });
  };

  const ShowCategory = async () => {
    try {
      const response = await fetch("https://meat-app-backend-zysoftec.vercel.app/api/category");
      const result = await response.json();
      const activeCategories = result?.categories?.filter(category => category.status === "Active");
      setcategory(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      ShowCategory();
    }, [])
  );

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`https://meat-app-backend-zysoftec.vercel.app/api/category/subcategories/${selectedCategory?._id}`);
      const result = await response.json();
      setsubcategory(result?.subcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory) fetchSubcategories();
  }, [selectedCategory]);

  // const submitProduct = async () => {
  //   setloading(true);
  
  //   try {
  //     const supplierId = await AsyncStorage.getItem('supplierId');
  
  //     // Create FormData object
  //     const formData = new FormData();
  //     formData.append('supplierId', supplierId);
  //     formData.append('suppliername', suppliername);
  //     formData.append('category', selectedCategory?._id);
  //     formData.append('subcategory', selectedsubCategory?.id);
  //     formData.append('name', name);
  //     formData.append('price', price);
  //     formData.append('weight', weight);
  //     formData.append('description', desc);
  //     formData.append('flatRate', null);
  //     formData.append('byDistance', null);
  //     formData.append('byWeight', null);
  //     formData.append('features', JSON.stringify(features)); // Convert features array to a JSON string
  
  //     if (selectedImage) {
  //       // Append the image to FormData
  //       formData.append('image', {
  //         uri: selectedImage,
  //         type: 'image/jpeg', // Adjust the type if necessary
  //         name: 'productImage.jpg', // Use a default name or derive from the file
  //       });
  //     }
  
  //     console.log('FormData:', formData);
  
  //     // Send the FormData object
  //     const response = await fetch(`${BaseurlProducts}`, {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  
  //     const result = await response.json();
  //     Snackbar.show({
  //       text: 'Product added successfully',
  //       duration: Snackbar.LENGTH_LONG,
  //       backgroundColor: 'rgba(212, 4, 28, 1)',
  //       textColor: 'white',
  //     });
  //     setloading(false);
  //     navigation.navigate('Products');
  //   } catch (error) {
  //     console.error('Error submitting product:', error);
  //     setloading(false);
  //     Snackbar.show({
  //       text: 'Failed to submit the product',
  //       duration: Snackbar.LENGTH_LONG,
  //       backgroundColor: 'rgba(212, 4, 28, 1)',
  //       textColor: 'white',
  //     });
  //   }
  // };
  

  const submitProduct = async () => {
    setloading(true);
  
    try {
      const supplierId = await AsyncStorage.getItem('supplierId');
      console.log('supplierId:', supplierId);
      if (!supplierId) {
        console.error('No supplier ID found');
        setloading(false);
        return;
      }
  
      // Extract numeric value from weight, assuming the weight might have "g" or another unit
      const numericWeight = parseInt(weight.replace(/[^\d]/g, ""), 10);
      if (isNaN(numericWeight)) {
        console.error('Invalid weight format');
        Snackbar.show({
          text: 'Invalid weight format',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'rgba(212, 4, 28, 1)',
          textColor: 'white',
        });
        setloading(false);
        return;
      }
  
      const productData = {
        supplierId,
        // suppliername,
        category: selectedCategory?._id,
        subcategory: selectedsubCategory?.id,
        name,
        price,
        weight: numericWeight, // Use numeric weight here
        description: desc,
        flatRate: null,
        byDistance: null,
        byWeight: null,
        features,
      };
  
      console.log('Product Data:', productData);
      const token = await AsyncStorage.getItem('supplierToken');
      const response = await fetch(`${BaseurlProducts}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(productData),
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(errorData?.message || 'Unknown error occurred');
      }
  
      const result = await response.json();
      console.log('Product submission result:', result);
  
      Snackbar.show({
        text: 'Product added successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
      });
  
      setloading(false);
      navigation.navigate('Products');
    } catch (error) {
      console.error('Error submitting product:', error);
      setloading(false);
      Snackbar.show({
        text: 'Failed to submit the product',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'rgba(212, 4, 28, 1)',
        textColor: 'white',
      });
    }
  };
  
  
  // const submitProduct = async () => {
  //   setloading(true);
    
  //   try {
  //     const supplierId = await AsyncStorage.getItem('supplierId');
  //     const formdata = new FormData();
      
  //     formdata.append("supplierId", supplierId);
  //     formdata.append("suppliername", suppliername);
  //     formdata.append("category", selectedCategory?._id);
  //     formdata.append("subcategory", selectedsubCategory?.id);
  //     formdata.append("name", name);
  //     formdata.append("price", price);
  //     formdata.append("weight", weight);
  //     formdata.append("description", desc);
  //     formdata.append("flatRate", null);
  //     formdata.append("byDistance", null);
  //     formdata.append("byWeight", null);
  //     formdata.append("features", JSON.stringify(features));


  //     console.log(JSON.stringify(features),'formdaata')
  
  //     const response = await fetch(`${BaseurlProducts}`, {
  //       method: "POST",
  //       body: formdata,
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  
  //     const result = await response.json();
  //     Snackbar.show({
  //       text: 'Product added successfully',
  //       duration: Snackbar.LENGTH_LONG,
  //       backgroundColor: 'rgba(212, 4, 28, 1)',
  //       textColor: 'white',
  //     });
  //     setloading(false);
  //     navigation.navigate('Products');
  //   } catch (error) {
  //     console.error('Error submitting product:', error);
  //     setloading(false);
  //     Snackbar.show({
  //       text: 'Failed to submit the product',
  //       duration: Snackbar.LENGTH_LONG,
  //       backgroundColor: 'rgba(212, 4, 28, 1)',
  //       textColor: 'white',
  //     });
  //   }
  // };
  

  // const handleFileUpload = async () => {
  //   try {
  //     // Pick a CSV file
  //     const res = await DocumentPicker.pick({
  //       type: ['text/csv', 'application/vnd.ms-excel'],
  //     });

  //     // Log the picked file
  //     console.log('Picked file:', res);

  //     // Ensure res.uri is defined and valid
  //     if (!res || !res[0].uri) {
  //       throw new Error('File URI is undefined.');
  //     }

  //     // For Android, handle content:// URIs
  //     const filePath = res[0].uri;

  //     // Check if filePath starts with 'content://'
  //     if (filePath.startsWith('content://')) {
  //       // Convert content URI to a local file path
  //       const fileContent = await RNFS.readFile(filePath, 'utf8');
  //       console.log('File content:', fileContent);

  //       // Parse the CSV content
  //       Papa.parse(fileContent, {
  //         header: true,
  //         skipEmptyLines: true,
  //         complete: (result) => {
  //           setCsvData(result.data);
  //           console.log('Parsed CSV data:', result);
  //         },
  //         error: (parseError) => {
  //           Alert.alert('Error', 'Failed to parse CSV file.');
  //           console.error('Parse Error:', parseError);
  //         },
  //       });
  //     } else {
  //       throw new Error('Unsupported file URI scheme.');
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User canceled the picker');
  //     } else {
  //       Alert.alert('Error', 'Failed to select or process file.');
  //       console.error('Error:', err);
  //     }
  //   }
  // };



  return (
    // <LinearGradient colors={[themeStyle.backgroundFirst, themeStyle.backgroundSecond]} style={styles.container}>

    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image resizeMode='contain' style={styles.backIcon} source={require('../../assets/images/Cart/back.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Product</Text>
          <Image style={{height: 31, width: 31, marginLeft: 'auto', marginRight: '5%', borderRadius: 30}} source={require('../../assets/images/Splash/dp.png')} />
        </View>

        <View style={styles.header2}>
          <TouchableOpacity onPress={() => setSelectedButton('product')} style={[styles.button2, selectedButton === 'product' && styles.activeButton2]}>
            <Text style={[styles.buttonText2, selectedButton === 'product' && styles.activeText2]}>Add Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedButton('spreadsheet')} style={[styles.button2, selectedButton === 'spreadsheet' && styles.activeButton2]}>
            <Text style={[styles.buttonText2, selectedButton === 'spreadsheet' && styles.activeText2]}>Add Bulk Sheet</Text>
          </TouchableOpacity>
        </View>

        {selectedButton === 'product' && (
          <>
            <CategoryDropDown
              options={category}
              title={'Category'}
              hint={'Select Category'}
              marginTop={'5%'}
              onSelectCategory={setSelectedCategory}
            />

            {selectedCategory && (
              <CategoryDropDown
                options={subcategory}
                title={'Sub Category'}
                hint={'Select Sub Category'}
                marginTop={'5%'}
                onSelectCategory={setSelectedsubCategory}
              />
            )}

            <GlobalInput onChangeText={setname} title={'Product Name'} hint={'Name here'} marginTop={'5%'} />
            {/* <GlobalInput onChangeText={setsuppliername} title={'Supplier Name'} hint={'Name here'} marginTop={'5%'} /> */}
            <GlobalInput keyboardType={'numeric'} onChangeText={setprice} title={'Price'} hint={'$1300.00'} marginTop={'5%'} />
            <WeightDropdown onSelectWeight={setweight} title={'Weight'} hint={'Select Weight'} marginTop={'5%'} />
            <NoteInput onChangeText={setdesc} title={'Description'} hint={'Write description here'} marginTop={'5%'} />


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

            {/* Features Section */}
            <View style={styles.featuresContainer}>
              <Text  style={{ fontSize: 16, fontFamily: FONT.ManropeRegular, color: themeStyle.BLACK, marginTop: '5%' }}>Product Features</Text>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureInputContainer}>
                  <GlobalInput
                  width={'100%'}
                    onChangeText={(text) => handleFeatureChange(index, 'title', text)}
                    title={`Feature ${index + 1} Title`}
                    hint={'Feature title'}
                    marginTop={'2%'}
                    value={feature.title}
                  />
                  <GlobalInput
                  width={'100%'}
                    onChangeText={(text) => handleFeatureChange(index, 'description', text)}
                    title={`Feature ${index + 1} Description`}
                    hint={'Feature description'}
                    marginTop={'2%'}
                    value={feature.description}
                  />
               {
                features?.length > 1 &&(
                  <TouchableOpacity onPress={() => handleRemoveFeature(index)} style={styles.removeFeatureButton}>
                  <Text style={styles.removeButtonText}>Remove Feature</Text>
                </TouchableOpacity>
                )
               }
                </View>
              ))}
              <TouchableOpacity onPress={handleAddFeature} style={styles.addFeatureButton}>
                <Text style={{color:themeStyle.PRIMARY_COLOR}}>Add Another Feature</Text>
              </TouchableOpacity>
            </View>

            <GlobalButton loading={loading} onPress={submitProduct} marginTop={'10%'} title={'Add Product'} />
          </>
        )}

        {selectedButton === 'spreadsheet' && (
          <View style={styles.container}>
            <ScrollView>
              <Text style={{ fontSize: 14, fontFamily: FONT.ManropeRegular, color: themeStyle.BLACK, marginTop: '5%', marginLeft: '8%' }}>
                Upload Bulk Order Spreadsheet
              </Text>
              <TouchableOpacity onPress={handleFileChange}>
                {file ? (
                  <View style={{height:50,width:250,backgroundColor:'green',alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:'5%'}}>
                   <Text style={{fontSize:20,color:themeStyle.WHITE}}>{file?.name}</Text>
                  </View>
                ) : (
                  <Image resizeMode='contain' style={{ height: 144, width: '85%', alignSelf: 'center', marginTop: '1%' }} source={require('../../assets/images/Payment/upload.png')} />
                )}
              </TouchableOpacity>
              {/* {csvData.map((item, index) => (
                <Text key={index} style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                  {JSON.stringify(item)}
                </Text>
              ))} */}
            <GlobalButton loading={loading} onPress={handleFileUpload} marginTop={'10%'} title={'Add Products'} />

            </ScrollView>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
    // </LinearGradient>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.WHITE,
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
header2: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: themeStyle.WHITE,
  paddingVertical: 10,
  height:60,
  // borderWidth:1,
  marginHorizontal:'5%',
  borderColor:themeStyle.TEXT_GREY,
  borderRadius:8,
  marginTop:15
},
button2: {
  backgroundColor: themeStyle.LIGHT_GREY,
  borderWidth: 2,
  borderColor: themeStyle.LIGHT_GREY,
  borderRadius: 5,
  height:40,
  width:153,
  alignItems:'center',
  justifyContent:"center",
},
activeButton2: {
  backgroundColor: themeStyle.PRIMARY_COLOR,
  borderWidth: 2,
  borderColor: themeStyle.PRIMARY_COLOR,
},
buttonText2: {
  color: themeStyle.BLACK,
  fontFamily: FONT.ManropeSemiBold,
  fontSize: 16,
},
activeText2:{
  color:"white"
},
featuresContainer: {
  marginTop: '5%',
  paddingHorizontal: '5%',
},
featuresTitle: {
  fontSize: 16,
  fontWeight: 'bold',

},
featureItem: {
  marginBottom: 10,
},
removeFeatureButton: {
  marginTop: 5,
  backgroundColor: themeStyle.PRIMARY_COLOR,
  padding: 10,
  borderRadius: 5,
  left:15,
  width:'48%',
  alignItems:'center',
  justifyContent:"center"
},
removeButtonText: {
  color: themeStyle.WHITE,
  textAlign: 'center',
},
addFeatureButton: {
  marginTop: 10,
  // backgroundColor: themeStyl,
  padding: 10,
  borderRadius: 5,
  width:'48%',
  alignItems:'center',
  justifyContent:"center",
  borderWidth:1,
  borderColor:themeStyle.PRIMARY_COLOR

},
addButtonText: {
  color: '#fff',
  textAlign: 'center',
},featureInputContainer:{
  width:'100%',
  alignSelf:"center",
  right:15,
  marginTop:10
}
});


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: themeStyle.PRIMARY_LIGHT,
//   },
 
//   image: {
//     height: 144,
//     width: '85%',
//     alignSelf: 'center',
//     marginTop: '1%',
//   },
//   spreadsheetContainer: {
//     padding: 20,
//   },
//   spreadsheetText: {
//     fontSize: 16,
//     fontFamily: FONT.ManropeRegular,
//     color: themeStyle.BLACK,
//     marginBottom: 10,
//   },
//   bottomSpacer: {
//     height: 50,
//   },
// });
