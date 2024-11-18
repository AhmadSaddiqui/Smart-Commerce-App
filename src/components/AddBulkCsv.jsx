import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,
  ToastAndroid,
} from "react-native";
import DocumentPicker from "react-native-document-picker";

const AddBulkProduct = () => {
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [delayedProgress, setDelayedProgress] = useState(0);
  const [file, setFile] = useState(null);

  const handleFileChange = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
      });
      setFile(res[0]);
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Handle cancel
      } else {
        setError("An error occurred while selecting the file.");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", file);

    setUploading(true);
    setProgress(0);

    try {
      const response = await fetch("http://192.168.14.191:5000/api/bulk-product/bulk-upload", {
        method: "POST",
        body: formdata,
        redirect: "follow",
      });

      const fir = await response.json()
if(fir?.message){
  ToastAndroid.show(fir.message,ToastAndroid.LONG)
}
      console.log(fir,'---------')

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");

      let receivedLength = 0;
      let chunks = [];
      let done = false;

      while (!done) {
        const { done: readerDone, value } = await reader.read();
        done = readerDone;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          setProgress((receivedLength / contentLength) * 100);
          setDelayedProgress((receivedLength / contentLength) * 100); // Simulating delayed progress
        }
      }

      const result = new TextDecoder("utf-8").decode(new Uint8Array(chunks.flat()));
      console.log(result);
      setUploading(false);
      setProgress(100);
      setDelayedProgress(100);
    } catch (error) {
      console.error(error);
      setError("An error occurred during the upload.");
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {error && (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "#E62F39",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={handleFileChange}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {file ? file.name : "Select CSV File"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#E62F39",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        onPress={handleFileUpload}
        disabled={uploading}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {uploading ? "Uploading..." : "Upload CSV"}
        </Text>
      </TouchableOpacity>
      {uploading && (
        <View>
          <Text>Uploading: {delayedProgress}%</Text>
          {Platform.OS === "android" ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress / 100}
            />
          ) : (
            <ProgressViewIOS progress={progress / 100} />
          )}
        </View>
      )}
    </View>
  );
};

export default AddBulkProduct;
