import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { db } from "./firebase";
import Food from "./Food";

const Category = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch categories from Firestore on component mount
  useEffect(() => {
    const unsubscribe = db.collection("category").onSnapshot((snapshot) => {
      const categoryData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setCategories(categoryData);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle category creation
  const handleCategoryCreate = () => {
    if (categoryName.trim() === "") {
      return;
    }

    db.collection("category")
      .add({ categoryName })
      .then(() => {
        setCategoryName("");
      })
      .catch((error) => {
        console.log("Error creating category:", error);
      });
  };

  // Function to handle category editing
  const handleCategoryEdit = (categoryId, newCategoryName) => {
    db.collection("category")
      .doc(categoryId)
      .update({ categoryName: newCategoryName })
      .then(() => {
        console.log("Category updated successfully");
        setEditingCategoryId(null);
        setEditingCategoryName("");
        setModalVisible(false);
      })
      .catch((error) => {
        console.log("Error updating category:", error);
      });
  };

  // Function to handle category deletion
  const handleCategoryDelete = (categoryId) => {
    db.collection("category")
      .doc(categoryId)
      .delete()
      .then(() => {
        console.log("Category deleted successfully");
      })
      .catch((error) => {
        console.log("Error deleting category:", error);
      });
  };

  // Function to open modal for editing category
  const handleOpenModal = (categoryId, categoryName) => {
    setEditingCategoryId(categoryId);
    setEditingCategoryName(categoryName);
    setModalVisible(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Food Categories</Text>
      <TextInput
        style={styles.input}
        value={categoryName}
        onChangeText={(text) => setCategoryName(text)}
        placeholder="Enter category name"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleCategoryCreate}>
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>
      <View style={styles.categoryList}>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{category.categoryName}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                handleOpenModal(category.id, category.categoryName)
              }
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleCategoryDelete(category.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Edit Category</Text>
            <TextInput
              style={styles.modalInput}
              value={editingCategoryName}
              onChangeText={(text) => setEditingCategoryName(text)}
              placeholder="Enter new category name"
            />
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={() =>
                handleCategoryEdit(editingCategoryId, editingCategoryName)
              }
            >
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => handleCloseModal()}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    flex: 1,
    marginRight: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  modalSaveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  modalSaveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalCancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#FFA500",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 8,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#005F88",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Category;
