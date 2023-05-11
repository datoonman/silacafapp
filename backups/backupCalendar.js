// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";
// import { db } from "./firebase";

// function CalendarScreen(props) {
//   const [currentWeekStart, setCurrentWeekStart] = useState(
//     startOfWeek(new Date())
//   );
//   const { userData } = props;
//   const [docExists, setDocExists] = useState(false);
//   const [weekdayButtons, setWeekdayButtons] = useState([]);
//   const [disabledDates, setDisabledDates] = useState([]);


//   const goToPreviousWeek = () => {
//     setCurrentWeekStart(subDays(currentWeekStart, 7));
//   };

//   const goToNextWeek = () => {
//     setCurrentWeekStart(addDays(currentWeekStart, 7));
//   };

//   const getButtonStyle = (docId) => {
//     if (docExists[docId]) {
//       return styles.weekdayButtonExists;
//     } else {
//       return styles.weekdayButton;
//     }
//   };
  

//   useEffect(() => {
//     const weekdays = [];
//     let day = currentWeekStart;
//     for (let i = 0; i < 7; i++) {
//       weekdays.push(day);
//       day = addDays(day, 1);
//     }
    
//     // Delete past dates
//     const deletePastDates = async () => {
//       const disabledDates = [];
//       for (let i = 0; i < 7; i++) {
//         const date = subDays(weekdays[i], 1);
//         if (date < new Date()) {
//           const selectedDate = format(date, "yyyy-MM-dd");
//           const docId = `${userData.name.replace(" ", "-")}-${selectedDate}`;
//           const docRef = db.collection("scheduleDate").doc(docId);
//           await docRef.delete();
//           console.log(`Document with ID ${docId} deleted from Firestore`);
//           disabledDates.push(date);
//         }
//       }
//       setDisabledDates(disabledDates);
//     };
    
//     deletePastDates();
    
//     // Filter out disabled dates
//     const filteredWeekdayButtons = weekdays.filter(date => !disabledDates.includes(date));
//     setWeekdayButtons(filteredWeekdayButtons);
//   }, [currentWeekStart, userData]);
  
    
  

//   useEffect(() => {
// const checkDocExists = (docId) => {
//   const docRef = db.collection("scheduleDate").doc(docId);
//   docRef
//     .get()
//     .then((doc) => {
//       if (doc.exists) {
//         console.log(`Document with ID ${docId} already exists`);
//         setDocExists((prevDocExists) => ({
//           ...prevDocExists,
//           [docId]: true
//         }));
//       } else {
//         console.log(`Document with ID ${docId} does not exist`);
//       }
//     })
//     .catch((error) => {
//       console.error("Error checking document: ", error);
//     });
// };
 

//     weekdayButtons.forEach((date) => {
//       const selectedDate = format(date, "yyyy-MM-dd");
//       const docId = `${userData.name.replace(" ", "-")}-${selectedDate}`;
//       checkDocExists(docId);
//     });
//   }, [weekdayButtons, userData]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.contentContainer}>
//         <Text style={styles.heading}>Let Cafeteria Know When You're Visiting!</Text>
//         <Text style={styles.date}>
//           Today's Date is {format(new Date(), "MMMM do, yyyy")}{" "}
//         </Text>
//         <View style={styles.weekdayButtonsContainer}>
//           {weekdayButtons.map((date) => {
//             const selectedDate = format(date, "yyyy-MM-dd");
//             const docId = `${userData.name.replace(" ", "-")}-${selectedDate}`;
//             const disabled = date < new Date();

//             return (
//               <TouchableOpacity
//                 style={getButtonStyle(docId)}
//                 onPress={() => {
//                   if (disabled) {
//                     return;
//                   }
                
//                   const docId = `${userData.name.replace(" ", "-")}-${selectedDate}`;
//                   const docRef = db.collection("scheduleDate").doc(docId);
                
//                   if (docExists[docId]) {
//                     docRef
//                       .delete()
//                       .then(() => {
//                         console.log(`Document with ID ${docId} deleted from Firestore`);
//                         setDocExists({ ...docExists, [docId]: false });
//                       })
//                       .catch((error) => {
//                         console.error("Error deleting document: ", error);
//                       });
//                   } else {
//                     docRef
//                       .set({
//                         selectedDate,
//                         name: userData.name,
//                       })
//                       .then(() => {
//                         console.log(
//                           `Selected date ${selectedDate} and name ${userData.name} stored in Firestore with ID ${docId}`
//                         );
//                         setDocExists({ ...docExists, [docId]: true });
//                       })
//                       .catch((error) => {
//                         console.error("Error storing document: ", error);
//                       });
//                   }
//                 }}
                
//                 disabled={disabled}
//                 key={selectedDate}
//               >
//                 <Text style={styles.weekdayText}>{format(date, "E")}</Text>
//                 <Text style={styles.weekdayDate}>{format(date, "do")}</Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//         <View style={styles.weekdayButtonsContainer}>
//           <TouchableOpacity
//             style={styles.arrowButton}
//             onPress={goToPreviousWeek}
//           >
//             <Text style={styles.arrowButtonText}>{"<"}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.arrowButton} onPress={goToNextWeek}>
//             <Text style={styles.arrowButtonText}>{">"}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const { width } = Dimensions.get("window");
// const buttonWidth = (width - 32 - 12 * 6) / 7;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   contentContainer: {
//     flex: 1,
//     alignItems: "center",
//     marginTop: 50,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   date: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   weekdayButtonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: width - 32,
//     marginBottom: 20,
//   },
//   weekdayButton: {
//     backgroundColor: "#e8e8e8",
//     width: buttonWidth,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 4,
//     alignItems: "center",
//   },
//   weekdayButtonExists: {
//     flex: 1,
//     paddingVertical: 12,
//     marginHorizontal: 6,
//     borderRadius: 8,
//     backgroundColor: '#005F88',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   weekdayButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   weekdayDate: {
//     fontSize: 18,
//   },
//   arrowButton: {
//     backgroundColor: '#ccc',
//     padding: 10,
//     borderRadius: 8,
//     marginHorizontal: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   arrowButtonText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default CalendarScreen;
