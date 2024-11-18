import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';

const CSVUploader = () => {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = async () => {
    try {
      // Pick a CSV file
      const res = await DocumentPicker.pick({
        type: ['text/csv', 'application/vnd.ms-excel'],
      });

      // Log the picked file
      console.log('Picked file:', res);

      // Ensure res.uri is defined and valid
      if (!res || !res[0].uri) {
        throw new Error('File URI is undefined.');
      }

      // For Android, handle content:// URIs
      const filePath = res[0].uri;

      // Check if filePath starts with 'content://'
      if (filePath.startsWith('content://')) {
        // Convert content URI to a local file path
        const fileContent = await RNFS.readFile(filePath, 'utf8');
        console.log('File content:', fileContent);

        // Parse the CSV content
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setCsvData(result.data);
            console.log('Parsed CSV data:', result);
          },
          error: (parseError) => {
            Alert.alert('Error', 'Failed to parse CSV file.');
            console.error('Parse Error:', parseError);
          },
        });
      } else {
        throw new Error('Unsupported file URI scheme.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        Alert.alert('Error', 'Failed to select or process file.');
        console.error('Error:', err);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Upload CSV" onPress={handleFileUpload} />
      {csvData.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue' }}>Data from CSV:</Text>
          {csvData.map((item, index) => (
            <Text key={index} style={{ color: 'red' }}>
              {JSON.stringify(item)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default CSVUploader;
