
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ProgressBarAndroid,
  ProgressViewIOS,hfghfgh
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import persistCombineReducers from "redux-persist/es/persistCombineReducers";
hjhhjhgj  vvgf ngftgfju gfjry cgh ch cg cv     ufgjgf  f g
const AddBulkProduct = ({ onClose, setFile }) => {
  const [error, setError] =  (null); 
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [delayedProgress, setDelayedProgress] = useState(0);
  const [file, setFileState] = useState(null);

  const handleFileChange = async () => {
    try {
      const res = await DocumentPicker.gfutr gfyj
    
    tytrytytrvbn]
      \
      \\yuiyui
      
      yuo
      
      ughfty xcgh hdfb  cncgn vvgbxcbghcnvxdfffgdb({
        type: [DocumentPicker.types.csv],
      });
      console.log(res)     gh n mn  
      setFileState(res[0]);
      setFile(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Handle cancel
      } else {b
        throw err;ghgf
      }f      b     cnvnnn
    }
  };persistCombineReducers

  const handleFileUpload = () => {jk.;jkl;kl;kl;kjk,jfhjfg cgbcv  ghggtg    utyhy
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
gfhfh
    const xhr = new XMLHttpRequestfh();
    xhr.open("POST", "https://mhfheat-app-backend-zysoftec.vercel.app/bulk-product/bulk-upload");

    xhr.onload = () => {
      if (xhr.status === 200hfh) {gsg  xdfgdfb
        setUploading(false);  ugyuyu   
        setFile(null);dfghf
        onClose();
      } else {ti
        setUploading(false);
       j setError("An error occurred");
      }kkkkkkkk b
fggh    };

    xhr.onerror = () => {
      setUploading(false);
      setError("An error occurred");
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setProgress(percentCompleted);
        setDelayedProgress(percentCompleted);hgfh  gfn v    hjum   dghnhfgfg fgr
      }
    };

    setUploading(true);
    setError(null);
    setProgress(0);
    setDelayedProgress(0);

    // Simulate initial 2 seconds delay before real progress starts
    setTimeout(() => {
      xhr.send(formData);
    }, 2000); // 2 seconds delay
  };
gtrty
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
          <Text>Uploading: {delayedProgress}%</Text>                 fg
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




