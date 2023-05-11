import React, { useState } from "react";
import { View, Button, Image } from "react-native";
import PublicClientApplication from "react-native-msal";
import { MSALConfiguration } from "react-native-msal";
import { useNavigation } from "@react-navigation/native";
import { db } from "./firebase";

const msalConfig: MSALConfiguration = {
  auth: {
    clientId: "",
    authority: "",
    redirectUri: "http://localhost:19006/",
  },
};
const msalClient = new PublicClientApplication(msalConfig);
const logo = require("./assets/pictures/Logo.png");

export default function Login() {
  const [accessToken, setAccessToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const result = await msalClient.acquireToken({
        scopes: ["User.Read"],
      });

      const userData = result["account"]["claims"];
      setAccessToken(result.accessToken);

      const name = userData.name || "";
      const preferred_username = userData.preferred_username || "";
      const role = userData.role || "customer";

      const usersRef = db.collection("users");
      const querySnapshot = await usersRef
        .where("preferred_username", "==", preferred_username)
        .get();

      if (querySnapshot.empty) {
        const userRef = usersRef.doc(result.account.uid);
        await userRef.set({ name, preferred_username, role });
        setLoggedIn(true);
        navigation.navigate("Home", {
          userData: { name, preferred_username, role },
        });
      } else {
        console.log("User already exists in Firestore");
        console.log("Welcome ", {name})
        setLoggedIn(true);
        const userRole = querySnapshot.docs[0].data().role;
        if (userRole === "admin") {
          navigation.navigate("Admin");
        } else if (userRole === "cafeteria") {
          navigation.navigate("Cafeteria");
        } else if (userRole === "customer") {
          navigation.navigate("Home", {
            userData: querySnapshot.docs[0].data(),
          });
        }
      }
    } catch (error) {
      console.log("Login failed: ", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#18345e",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -100,
      }}
    >
      <Image source={logo} style={{ width: 200, height: 200 }} />
      <Button
        title="Login with Microsoft 365"
        onPress={handleLogin}
        color="#0074D9"
      />
      {loggedIn && <p>You are logged in!</p>}
    </View>
  );
}