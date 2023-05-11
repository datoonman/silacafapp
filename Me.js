import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const handleLogout = (navigation) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};

function MeScreen({ userData, navigation }) {
  
  return (
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.userDataName}>{userData.name}</Text>
              <Text style={styles.subDetails}>
                {userData.preferred_username}
              </Text>
              <Text style={styles.subDetails}>
                Role: <Text style={styles.boldText}>{userData.role}</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonHeart]}
            onPress={() => navigation.navigate("LikedFood", { userData: userData })}>
            <AntDesign name="heart" size={20} color="white" />
            <Text style={styles.buttonText}>Liked Items</Text>
            <Text
              style={styles.buttonText}
            >{`(${userData.likeItems.length})`}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          style={[styles.button, styles.buttonStar]}
          onPress={() => navigation.navigate("FavouritedFood", { userData: userData })}
          >
            <FontAwesome name="star" size={20} color="white" />
            <Text style={styles.buttonText}>Favourite Items</Text>
            <Text
              style={styles.buttonText}
            >{`(${userData.favouriteItems.length})`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.buttonFavor]}
          onPress={() => navigation.navigate("WishlistedFood", { userData: userData })}
          >
<FontAwesome name="bookmark-o" size={20} color="white" />
            <Text style={styles.buttonText}>Wishlisted Food</Text>
            <Text
              style={styles.buttonText}
            >{`(${userData.favouriteItems.length})`}</Text>
          </TouchableOpacity>
          </View>
        {/* <View style={styles.card2}>
          <View style={styles.avatarContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.userDataName}>
                2 Favourite Items Available Now!
              </Text>
            </View>
          </View>
        </View> */}
        <View style={styles.blueSquare}>
          <View style={styles.circleContainer}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation.navigate("About")}
            >
              <FontAwesome name="user" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation.navigate("Feedback")}
            >
              <Ionicons name="chatbox" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleButtonLogout}
              onPress={() => handleLogout(navigation)}
            >
              <AntDesign name="logout" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  card: {
    backgroundColor: "#14345C",
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  card2: {
    backgroundColor: "#008B9C",
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#E7E7E7",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#14345C",
    fontWeight: "bold",
    fontSize: 24,
  },
  textContainer: {
    marginLeft: 15,
  },
  userDataName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  subDetails: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: width * 0.4,
    justifyContent: "center",
  },
  buttonHeart: {
    backgroundColor: "#FF6584",
  },
  buttonStar: {
    backgroundColor: "#F1C40F",
  },
  buttonFavor: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  blueSquare: {
    backgroundColor: "#14345C",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.08,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 0.5,
  },
  circleButton: {
    backgroundColor: "#F2C94C",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  circleButtonLogout: {
    backgroundColor: "#EB5757",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MeScreen;
