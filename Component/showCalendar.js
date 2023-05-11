import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';

const ShowCalendar = ({ navigation }) => {
  const [selectedDates, setSelectedDates] = useState({});

  const handleDayPress = (day) => {
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[day.dateString]) {
      // The date is already selected, so deselect it
      delete newSelectedDates[day.dateString];
    } else {
      // The date is not selected, so add it
      newSelectedDates[day.dateString] = { selected: true };
    }
    setSelectedDates(newSelectedDates);
  };
  

  const handleSaveDates = () => {
    const selectedDateArray = Object.keys(selectedDates);
    const scheduleDates = selectedDateArray.map((date) => {
      return {
        date,
        // Add any additional properties you want to save for each date
      };
    });

    // Save the scheduleDates array to Firestore
    db.collection('food').add({ scheduleDates });
  };

  return (
    <View>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={selectedDates}
      />
    </View>
  );
};

export default ShowCalendar;
