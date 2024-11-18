import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Snackbar from "react-native-snackbar"; // Import Snackbar
import { useNavigation, useRoute } from "@react-navigation/native";
import {  BaseurlSupplier } from "../Apis/apiConfig";
import Header from "../components/Header";
import { ROUTES } from "../routes/RoutesConstants";

const SupplierConfirmOtp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const navigation = useNavigation();
    const route = useRoute();
    const email = route.params?.email;

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

        console.log("Submitted OTP:", otpCode);
        fetch(`${BaseurlSupplier}verify-otp`, {
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
                    Snackbar.show({
                        text: 'OTP verified successfully! Please wait for admin to approve your account.',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'green',
                        textColor: 'white',
                    });
                    navigation.navigate(ROUTES.SupplierSignin);
                } else {
                    Snackbar.show({
                        text: 'OTP verification failed. Please try again.',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
                        textColor: 'white',
                        marginBottom: 0,
                    });
                }
            })
            .catch((error) => {
                Snackbar.show({
                    text: 'Error verifying OTP.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
                    textColor: 'white',
                    marginBottom: 0,
                });
                console.error("Error verifying OTP:", error);
            });
    };

    const resendOtp = async () => {
          fetch(`${BaseurlSupplier}resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    Snackbar.show({
                        text: 'OTP resent successfully!',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'green',
                        textColor: 'white',
                    });
                } else {
                    Snackbar.show({
                        text: 'Error resending OTP.',
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
                        textColor: 'white',
                        marginBottom: 0,
                    });
                }
            })
            .catch((error) => {
                Snackbar.show({
                    text: 'Error resending OTP.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: 'rgba(212, 4, 28, 1)', // Custom error color
                    textColor: 'white',
                    marginBottom: 0,
                });
                console.error("Error resending OTP:", error);
            });
    };

    return (
        <View style={styles.container}>
            <Header title={'OTP Verification'} description={`Enter the code from this SMS we sent \n to ${email}`} />
            
            {/* Timer */}
            <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>
            
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

            {/* Resend OTP */}
            <TouchableOpacity
                onPress={resendOtp}
                disabled={timeLeft > 0}
                style={[
                    styles.resendText,
                    timeLeft > 0 ? styles.disabledResendText : styles.activeResendText,
                ]}
            >
                <Text>Don't receive the OTP? Resend OTP</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F5F5",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        marginTop: '5%',
    },
    otpInput: {
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 5,
        width: 50,
        height: 50,
        textAlign: "center",
            color: "#000",
        fontSize: 18,
        backgroundColor: "#FFF",
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
        marginBottom: 15,
        textAlign: "center",
    },
    activeResendText: {
        color: "#D4041C",
    },
    disabledResendText: {
        color: "#AAA",
    },
});

export default SupplierConfirmOtp;
