import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BaseurlSupplier } from '../Apis/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import themeStyle from '../styles/themeStyle';

const LiveBezierChart = () => {
  const [data, setData] = useState([0, 0, 0, 0, 0, 29, 34]);
  const [labels, setLabels] = useState([]);
  const [view, setView] = useState('Month'); // Default view is 'month'
  const [dropdownOptions, setDropdownOptions] = useState([]); // Dynamic dropdown options
  const [selectedOption, setSelectedOption] = useState("Oct"); // Selected option in dropdown
  const [monthDays, setMonthDays] = useState(30);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const fetchSales = async (period) => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    let url = `${BaseurlSupplier}restaurant-orders-by-supplierId/${supplierId}?type=${period}&selectedValue=${selectedOption}`
    // Add restaurantId only if selectedRestaurant has a value
    if (selectedRestaurant) {
      console.log('selectedRestaurant', selectedRestaurant);
      url += `&restaurantId=${selectedRestaurant}`;
    }
    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log("json", json);
      const data = json.data;
      let arr = [];

      if (period === 'Year') {
        for (let i = 0; i < 12; i++) {
          arr.push(data[i] ? data[i].totalOrders : 0);
        }
      } else if (period === 'Quarter') {
        let quarterlyData = [0, 0, 0, 0]; // For 4 quarters
        for (let i = 0; i < 12; i++) {
          const quarterIndex = Math.floor(i / 3);
          quarterlyData[quarterIndex] += data[i] ? data[i]?.totalOrders : 0;
        }
        arr = quarterlyData;
      } else if (period === 'Month') {
        setMonthDays(data.length);
        for (let i = 0; i < data.length; i++) {
          arr.push(data[i] ? data[i].totalOrders : 0);
        }
      }
      console.log('arr', arr);
      setData(arr);
    } catch (e) {
      console.log('error fetching...', e);
    }
  };

  // Get days of the selected month
  const getLast30Days = () => {
    const days = [];
    for (let i = 1; i <= monthDays; i++) {
      days.push(i.toString());
    }
    return days;
  };

  // Get months based on selected quarter
  const getMonthsForQuarter = (quarter) => {
    switch (quarter) {
      case 'Q1':
        return ['Jan', 'Feb', 'Mar'];
      case 'Q2':
        return ['Apr', 'May', 'Jun'];
      case 'Q3':
        return ['Jul', 'Aug', 'Sep'];
      case 'Q4':
        return ['Oct', 'Nov', 'Dec'];
      default:
        return [];
    }
  };

  // Get names for all 12 months
  const getLast12Months = () => {
    const months = [];
    const options = { month: 'short' };
    const date = new Date();

    for (let i = 0; i < 12; i++) {
      date.setMonth(i);
      months.push(date.toLocaleDateString('en-US', options));
    }

    return months;
  };

  // Handle switching views and updating dropdown
  const handleViewChange = (selectedView) => {
    setView(selectedView);
    setSelectedOption(''); // Reset dropdown selection

    if (selectedView === 'Month') {
      setLabels(getLast30Days());
      fetchSales('Month');
      setDropdownOptions(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
    } else if (selectedView === 'Quarter') {
      setDropdownOptions(['Q1', 'Q2', 'Q3', 'Q4']);
      // You can set default to the first quarter or handle it based on your logic
      const defaultQuarter = 'Q1';
      setLabels(getMonthsForQuarter(defaultQuarter));
      fetchSales('Quarter');
    } else if (selectedView === 'Year') {
      setLabels(getLast12Months());
      fetchSales('Year');
      const currentYear = new Date().getFullYear();
      setDropdownOptions([currentYear - 4, currentYear - 3, currentYear - 2, currentYear - 1, currentYear].map(String));
    }
  };
  const fetchRestaurants = async () => {
    const supplierId = await AsyncStorage.getItem('supplierId');
    const token = await AsyncStorage.getItem('supplierToken');
    const headers = {
      "x-access-token": token,
    }
    const response = await fetch(`${BaseurlSupplier}get-restaurants-by-supplier-id/${supplierId}`, { headers });
    const json = await response.json();
    setRestaurants(json);
    console.log("Restaurants", json);
  }
  // Effect to handle fetching sales data based on selected option or view
  useEffect(() => {
    if (view && selectedOption) {
      fetchSales(view);
    }
    fetchRestaurants(); // Fetch restaurants data for supplierId
  }, [view, selectedOption, selectedRestaurant]);

  useEffect(() => {
    handleViewChange('Month'); // Default to 'month' view
  }, []);

  return (
    <View>
      {/* Buttons to toggle views */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, view === 'Month' ? styles.selectedButton : styles.outlineButton]}
          onPress={() => handleViewChange('Month')}
        >
          <Text style={[styles.buttonText, view === 'Month' ? styles.selectedText : styles.unselectedText]}>
            Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, view === 'Quarter' ? styles.selectedButton : styles.outlineButton]}
          onPress={() => handleViewChange('Quarter')}
        >
          <Text style={[styles.buttonText, view === 'Quarter' ? styles.selectedText : styles.unselectedText]}>
            Quarter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, view === 'Year' ? styles.selectedButton : styles.outlineButton]}
          onPress={() => handleViewChange('Year')}
        >
          <Text style={[styles.buttonText, view === 'Year' ? styles.selectedText : styles.unselectedText]}>
            Year
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <View style={{ flex: 1, margin: 12, borderColor: themeStyle.PRIMARY_COLOR, borderWidth: 1 }}>
          <Picker
            selectedValue={selectedOption}
            style={{ height: 30, color: themeStyle.PRIMARY_COLOR }}
            onValueChange={(itemValue) => {
              setSelectedOption(itemValue);
              fetchSales(view);
              if (view === 'Quarter') {
                setLabels(getMonthsForQuarter(itemValue));
              }
            }}
            dropdownIconColor={themeStyle.PRIMARY_COLOR}
          >
            <Picker.Item label="Select" value="" />
            {dropdownOptions.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} />
            ))}
          </Picker>
        </View>

        <View style={{ flex: 1, margin: 12, borderColor: themeStyle.PRIMARY_COLOR, borderWidth: 1 }}>
          <Picker
            selectedValue={selectedRestaurant}
            style={{ height: 30, color: themeStyle.PRIMARY_COLOR }}
            onValueChange={(itemValue) => {
              setSelectedRestaurant(itemValue);
            }}
            dropdownIconColor={themeStyle.PRIMARY_COLOR}
          >
            <Picker.Item label="Restaurant" value="" />
            {restaurants.map((restaurant, index) => (
              <Picker.Item key={index} label={restaurant.name} value={restaurant._id} />
            ))}
          </Picker>
        </View>
      </View>
      <ScrollView horizontal={true}>
        <View>
          <View style={styles.container}>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: data,
                    color: (opacity = 1) => `rgba(230, 47, 57, ${opacity})`, // Line color red
                  },
                ],
              }}
              width={Dimensions.get('window').width * 2} // Adjust width for horizontal scroll
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(0, 0, 0, 0.1)`, // Line color
                labelColor: (opacity = 1) => `rgba(119, 119, 119, ${opacity})`, // Text color grey
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '0',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    marginTop: '5%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: ,
  },
  button: {
    padding: 14,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: themeStyle.PRIMARY_COLOR,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: themeStyle.PRIMARY_COLOR, // Outline color for unselected buttons
    backgroundColor: 'transparent',
    color: "#000",
  },
  buttonText: {
    fontSize: 16, // Font size for buttons
  },
  selectedText: {
    color: 'white', // Font color for selected button
  },
  unselectedText: {
    color: themeStyle.PRIMARY_COLOR, // Font color for unselected buttons
  },
});

export default LiveBezierChart;
