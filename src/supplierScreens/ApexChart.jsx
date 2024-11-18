import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { API_BASE_URL } from "../Apis/apiConfig";

// Get screen width for responsive charts
const screenWidth = Dimensions.get("window").width;

const ApexChart = () => {
  const [supplierId, setSupplierId] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [], // X-axis categories (dates or names)
    datasets: [
      {
        data: [], // Revenue data
        color: (opacity = 1) => `rgba(230, 47, 57, ${opacity})`, // Custom color
      },
      {
        data: [], // Commission Fees data
        color: (opacity = 1) => `rgba(0, 208, 73, ${opacity})`, // Custom color
      },
      {
        data: [], // Delivery Fees data
        color: (opacity = 1) => `rgba(134, 38, 217, ${opacity})`, // Custom color
      },
    ],
  });

  const fetchSupplierId = async () => {
    try {
      const id = await AsyncStorage.getItem("supplierId"); // Fetch supplierId from AsyncStorage
      if (id) {
        setSupplierId(id);
      } else {
        console.error("Supplier ID not found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error fetching supplier ID:", error);
    }
  };

  const fetchChartData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/apex-chart-data`, {
        params: { supplierId: id }, // Use supplierId for API call
      });

      const { series, categories } = response.data;

      setChartData({
        labels: categories, // X-axis categories (dates or names)
        datasets: [
          {
            data: series[0]?.data || [], // Revenue data
            color: (opacity = 1) => `rgba(230, 47, 57, ${opacity})`, // Color for Revenue
          },
          {
            data: series[1]?.data || [], // Commission Fees data
            color: (opacity = 1) => `rgba(0, 208, 73, ${opacity})`, // Color for Commission Fees
          },
          {
            data: series[2]?.data || [], // Delivery Fees data
            color: (opacity = 1) => `rgba(134, 38, 217, ${opacity})`, // Color for Delivery Fees
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      await fetchSupplierId(); // Fetch supplierId from AsyncStorage

      if (supplierId) {
        fetchChartData(supplierId); // Fetch chart data using supplierId
      }
    };

    getData();
  }, [supplierId]);

  return (
    <ScrollView horizontal={true}>
      <View>
        <BarChart
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          width={screenWidth - 40} // Set chart width dynamically
          height={350} // Chart height
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#efefef",
            decimalPlaces: 2, // Set the number of decimal places for Y-axis values
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          verticalLabelRotation={30} // Rotate X-axis labels
          fromZero={true} // Start Y-axis from 0
        />
      </View>
    </ScrollView>
  );
};

export default ApexChart;
