import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSpending } from '../../context/SpendingContext';
import { Category, PaymentMethod } from '../../types';

const categories: Category[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other', 'Lumeo'];
const paymentMethods: PaymentMethod[] = [
  'Chase Checking Account',
  'Bank of America Checking Account',
  'Amex Gold',
  'Amex Sky Miles',
  'Capital One Savor',
  'Business Trading',
  'Discover',
  'Chase Sapphire Reserve',
  'Other'
];

export default function AddPurchaseScreen() {
  const { addPurchase } = useSpending();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [items, setItems] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Auto-open date picker if date is not set (should only happen on first load)
  useEffect(() => {
    if (!date) {
      setShowDatePicker(true);
    }
  }, []);

  const handleTakePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!paymentMethod || !category || !items || !price) {
      // TODO: Show error message
      return;
    }

    const newPurchase = {
      id: Date.now().toString(),
      date,
      paymentMethod,
      category,
      items: items.split(',').map(item => item.trim()),
      price: parseFloat(price),
      imageUri: imageUri || undefined,
    };
    
    addPurchase(newPurchase);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            {/* Camera Button */}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleTakePhoto}
            >
              <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cameraButtonGradient}
              >
                <Ionicons name="camera" size={24} color={Colors.text.white} />
                <Text style={styles.cameraButtonText}>Snap Purchase</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Preview Image */}
            {imageUri && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(null)}
                >
                  <Ionicons name="close-circle" size={24} color={Colors.error} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <Text style={styles.input}>{date}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date ? new Date(date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDate(selectedDate.toISOString().split('T')[0]);
                    }
                  }}
                  {...(Platform.OS === 'ios' ? { textColor: Colors.text.primary } : {})}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsScrollContainer}
              >
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.option,
                      paymentMethod === method && styles.selectedOption,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <Ionicons 
                      name={
                        method.includes('Chase') ? 'card' :
                        method.includes('Bank of America') ? 'card-outline' :
                        method.includes('Amex') ? 'card' :
                        method.includes('Capital One') ? 'card' :
                        method.includes('Discover') ? 'card' :
                        method.includes('Business') ? 'business' :
                        'card'
                      }
                      size={16} 
                      color={paymentMethod === method ? Colors.text.white : Colors.text.secondary} 
                      style={styles.optionIcon}
                    />
                    <Text style={[
                      styles.optionText,
                      paymentMethod === method && styles.selectedOptionText,
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsScrollContainer}
              >
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.option,
                      category === cat && styles.selectedOption,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Ionicons 
                      name={
                        cat === 'Food' ? 'restaurant' :
                        cat === 'Transportation' ? 'car' :
                        cat === 'Entertainment' ? 'game-controller' :
                        cat === 'Shopping' ? 'cart' :
                        cat === 'Bills' ? 'document-text' :
                        'apps'
                      } 
                      size={16} 
                      color={category === cat ? Colors.text.white : Colors.text.secondary} 
                      style={styles.optionIcon}
                    />
                    <Text style={[
                      styles.optionText,
                      category === cat && styles.selectedOptionText,
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Items (comma-separated)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="list" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={items}
                  onChangeText={setItems}
                  placeholder="e.g., Groceries, Snacks"
                  placeholderTextColor={Colors.text.light}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="cash" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.text.light}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <LinearGradient
                colors={[Colors.primary.main, Colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>Add Purchase</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 16, // Add extra padding at bottom for iOS
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.main,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  optionsScrollContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.main,
    marginRight: 8,
    minWidth: 120,
  },
  selectedOption: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  optionIcon: {
    marginRight: 4,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flexShrink: 1,
  },
  selectedOptionText: {
    color: Colors.text.white,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cameraButton: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  cameraButtonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.background.main,
    borderRadius: 12,
    padding: 4,
  },
}); 