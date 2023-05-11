import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppScreen from "./AppScreen";
import Login from "./Login";
import MeScreen from "./Me";
import CalendarScreen from "./Calendar";
import Category from "./Category";
import Food from "./Food";
import Admin from "./admin";
import Cafeteria from "./Cafeteria";
import CreateFood from "./createFood";
import CheckFood from "./checkFood";
import SearchScreen from "./SearchScreen";
import FeedbackScreen from "./feedback";
import About from "./about";
import CustomerLikedFood from "./customerLikedFood";
import CustomerFavouritedFood from "./customerFavouritedFood";
import GenerateReport from "./generateReport";
import ViewFeedback from "./viewFeedback";
import CustomerWishlistFood from "./customerWishlistFood";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
        <Stack.Screen name="Home" component={AppScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Me" component={MeScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Category" component={Category} options={{ headerShown: false}}/>
        <Stack.Screen name="Food" component={Food} options={{ headerShown: false}}/>
        <Stack.Screen name="Admin" component={Admin} options={{ headerShown: false}}/>
        <Stack.Screen name="Cafeteria" component={Cafeteria} options={{ headerShown: false}}/>
        <Stack.Screen name="CreateFood" component={CreateFood} options={{ headerShown: false}}/>
        <Stack.Screen name="CheckFood" component={CheckFood} options={{ headerShown: false}}/>
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="About" component={About} options={{ headerShown: false}}/>
        <Stack.Screen name="LikedFood" component={CustomerLikedFood} options={{ headerShown: false}}/>
        <Stack.Screen name="FavouritedFood" component={CustomerFavouritedFood} options={{ headerShown: false}}/>
        <Stack.Screen name="WishlistedFood" component={CustomerWishlistFood} options={{ headerShown: false}}/>
        <Stack.Screen name="GenerateReport" component={GenerateReport} options={{ headerShown: false}}/>
        <Stack.Screen name="ViewFeedbacks" component={ViewFeedback} options={{ headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
