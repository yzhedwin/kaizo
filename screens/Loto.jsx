import React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  Share,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";
import "react-native-get-random-values";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const SERVER_PORT = Constants.manifest.extra.developmentPort;
const BASE_URL = Constants.manifest.extra.developmentHost;
/*
Todo: process text from image and check agaisnt result
*/
export default class Loto extends React.Component {
  state = {
    image: null,
    gsImage: null,
    uploading: false,
    googleResponse: null,
  };

  componentDidMount() {}

  render() {
    let { image } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <FocusAwareStatusBar barStyle="dark-content" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.getStartedContainer}>
            {image ? null : (
              <Text style={styles.getStartedText}>Result Checker</Text>
            )}
          </View>

          <View style={styles.helpContainer}>
            <Button
              onPress={this.pickImage}
              title="Pick an image from camera roll"
            />

            <Button onPress={this.takePhoto} title="Take a photo" />

            {this.maybeRenderImage()}
            {this.maybeRenderUploadingOverlay()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  organize = (array) => {
    return array.map(function (item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  maybeRenderImage = () => {
    let { image, googleResponse } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 20,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => this.submitToGoogle()}
          title="Analyze!"
        />

        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={this.copyToClipboard}
          onLongPress={this.share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        />

        <Text>Raw JSON:</Text>

        {googleResponse && (
          <Text
            onPress={this.copyToClipboard}
            onLongPress={this.share}
            style={{ paddingVertical: 10, paddingHorizontal: 10 }}
          >
            {JSON.stringify(googleResponse.responses)}
          </Text>
        )}
      </View>
    );
  };

  keyExtractor = (item, index) => item.id;

  renderItem = (item) => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  share = () => {
    Share.share({
      message: JSON.stringify(this.state.googleResponse.responses),
      title: "Check it out",
      url: this.state.image,
    });
  };

  copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied to clipboard");
  };

  takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      alert("Camera Access Denied\n" + "Enable Permissions in Settings");
    } else {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this.handleImagePicked(pickerResult);
    }
  };

  pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert("Camera Roll Access Denied\n" + "Enable Permissions in Settings");
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    } else {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      this.handleImagePicked(pickerResult);
    }
  };

  handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        await this.uploadImage(pickerResult.uri);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };
  //do on server
  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { gsImage } = this.state;
      let request = {
        requests: [
          {
            features: [{ type: "TEXT_DETECTION", maxResults: 5 }],
            image: {
              source: {
                imageUri: gsImage,
              },
            },
          },
        ],
      };
      const response = await fetch(`${BASE_URL}:${SERVER_PORT}/api/gvision/imagetext`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request }),
      }).catch((e) => {
        console.log(e);
      });
      let responseJson = await response.json();
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  async uploadImage(uri) {
    let name = this.props.user.displayName;
    try {
      const response = await FileSystem.uploadAsync(
        `${BASE_URL}:${SERVER_PORT}/api/gstorage/upload`,
        uri,
        {
          fieldName: "file",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          parameters: { user: name },
        }
      );
      const { publicUrl, gsUrl } = JSON.parse(response.body);
      this.setState({ image: publicUrl, gsImage: gsUrl });
    } catch (error) {
      console.log(error);
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },

  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },

  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },

  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
});
/* Alternate solution
async uploadImageAsync(uri) {
  let name = this.props.user.displayName;
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const storageRef = ref(getStorage(Firebase), uuidv4());
  const url = "gs://" + storageRef.bucket + "/" + storageRef.fullPath;
  const uploadTask = uploadBytesResumable(storageRef, blob);
  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      console.log(error);
    },
    async () => {
      blob.close();
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      //console.log(downloadUrl);
      this.setState({ image: downloadUrl, gsImage: url });
      return downloadUrl;
    }
  );
}
*/
