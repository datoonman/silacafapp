import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CalendarScreen from "./Calendar";
import MeScreen from "./Me";
import SearchScreen from "./SearchScreen";
import TodaysHitCard from "./Component/TodaysHit";
import SwiperCategory from "./Component/swiperCategory";

const Tab = createBottomTabNavigator();

function AppScreen({ route }) {
  const userData = route.params.userData;
  const navigation = useNavigation();
  const { params } = useRoute();
  const initialTab = params.initialTab || "Home"; // set the initial tab to Home

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName={initialTab}
        screenOptions={({ route }) => ({
          activeTintColor: "#007AFF",
          inactiveTintColor: "gray",
          style: {
            height: 60,
            paddingTop: 10,
            paddingBottom: 5,
            paddingHorizontal: 20,
            backgroundColor: "#fff",
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Calendar") {
              iconName = "calendar-outline";
            } else if (route.name === "Me") {
              iconName = "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Calendar"
          component={() => <CalendarScreen userData={userData} />}
          options={{
            tabBarLabel: "Calendar",
            headerTitle: "Calendar",
            headerTitleStyle: { alignSelf: "center" },
            headerTitleAlign: "center",
          }}
        />
        <Tab.Screen
          name="Home"
          children={() => <AppContent userData={userData} />}
          options={{
            headerTitle: "Cafeteria Companion",
            headerRight: () => (
              <Ionicons
                name="search-outline"
                size={28}
                color="#000"
                style={{ marginRight: 20 }}
                onPress={() =>
                  navigation.navigate("SearchScreen", {
                    userData: userData,
                  })
                }
              />
            ),
            tabBarLabel: "Home",
          }}
        />

        <Tab.Screen
          name="Me"
          component={() => (
            <MeScreen userData={userData} navigation={navigation} />
          )}
          options={{
            tabBarLabel: "Me",
            headerTitle: "Personal Information",
            headerTitleStyle: { alignSelf: "center" },
            headerTitleAlign: "center",
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

function AppContent({ userData }) {
  return (
    <View style={styles.contentContainer}>
      <TodaysHitCard />
      <SwiperCategory userData={userData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  searchIcon: {
    position: "absolute",
    top: 15,
    right: 20,
    // zIndex: 999, // add zIndex to make sure it's on top of the tabBar
  },
});

export default AppScreen;
