import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseurlBuyer, BaseurlRestuarant } from "../Apis/apiConfig";

const UserOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const navigation = useNavigation();
  const route = useRoute()
  const email = route.params?.email
  console.log(email);
  // Handle input change for OTP fields
  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Automatically focus the next input (This logic will differ in React Native)
      if (index < 5) {
        // Focus next TextInput if it exists
        const nextInput = `input${index + 1}`;
        nextInput && this[nextInput]?.focus();
      }
    } else if (value === "") {
      let newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");

    console.log("Submitted OTP:", otpCode,email);
    fetch(`${BaseurlBuyer}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        otp: otpCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigation.navigate("Home");
        } else {
          console.error("OTP verification failed");
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
      });
  };

  const resendOtp = async () => {
    let email = await AsyncStorage.getItem("meatmeEmail");

    fetch(`${BaseurlBuyer}/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("OTP resent successfully");
        } else {
          console.error("Error resending OTP");
        }
      })
      .catch((error) => {
        console.error("Error resending OTP:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>OTP Verification</Text>
      <Text style={styles.subheading}>Enter the OTP sent to your email</Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((data, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            value={data}
            onChangeText={(value) => handleChange(value, index)}
            ref={(input) => (this[`input${index}`] = input)} // Reference for auto-focus
          />
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Timer */}
      <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>

      {/* Resend OTP */}
      <TouchableOpacity
        onPress={resendOtp}
        disabled={timeLeft > 0}
        style={[
          styles.resendText,
          timeLeft > 0 ? styles.disabledResendText : styles.activeResendText,
        ]}
      >
        <Text>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  subheading: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#FFF",
    color: "#000"
  },
  submitButton: {
    backgroundColor: "#D4041C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  timerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 20,
  },
  resendText: {
    marginTop: 15,
    textAlign: "center",
  },
  activeResendText: {
    color: "#D4041C",
  },
  disabledResendText: {
    color: "#AAA",
  },
});

export default UserOtp;
