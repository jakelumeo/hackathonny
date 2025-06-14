import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Colors } from '../../constants/Colors';
import { useSpending } from '../../context/SpendingContext';
import { Category, PaymentMethod, Purchase } from '../../types';

export default function HomeScreen() {
  const { spending, deletePurchase, toggleLike, setSpending } = useSpending();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const categories = ['All', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other', 'Lumeo'];
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const paymentMethods = ['All', 'Chase Checking Account', 'Bank of America Checking Account', 'Amex Gold', 'Amex Sky Miles', 'Capital One Savor', 'Business Trading', 'Discover', 'Chase Sapphire Reserve', 'Other'];
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    price: '',
    category: '' as Category,
    items: '',
    paymentMethod: '' as PaymentMethod,
  });

  const filteredSpending = spending.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesPayment = paymentMethodFilter === 'All' || item.paymentMethod === paymentMethodFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.items.join(', ').toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.paymentMethod.toLowerCase().includes(searchLower);
    return matchesCategory && matchesPayment && matchesSearch;
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Purchase',
      'Are you sure you want to delete this purchase?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePurchase(id),
        },
      ],
    );
  };

  const handleCommentPress = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setCommentText(purchase.comment || '');
    setShowCommentModal(true);
  };

  const handleSaveComment = () => {
    if (selectedPurchase) {
      const updatedPurchase = {
        ...selectedPurchase,
        comment: commentText.trim()
      };
      // Use setSpending directly to update the purchase
      setSpending(prevSpending => 
        prevSpending.map(p => 
          p.id === selectedPurchase.id ? updatedPurchase : p
        )
      );
      setShowCommentModal(false);
      setSelectedPurchase(null);
      setCommentText('');
    }
  };

  const handleEditPress = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setEditForm({
      price: purchase.price.toString(),
      category: purchase.category,
      items: purchase.items.join(', '),
      paymentMethod: purchase.paymentMethod,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingPurchase) {
      const updatedPurchase = {
        ...editingPurchase,
        price: parseFloat(editForm.price),
        category: editForm.category,
        items: editForm.items.split(',').map(item => item.trim()),
        paymentMethod: editForm.paymentMethod,
      };
      
      setSpending(prevSpending => 
        prevSpending.map(p => 
          p.id === editingPurchase.id ? updatedPurchase : p
        )
      );
      
      setShowEditModal(false);
      setEditingPurchase(null);
    }
  };

  const renderRightActions = (purchase: Purchase) => {
    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={[styles.swipeButton, styles.editButton]}
          onPress={() => handleEditPress(purchase)}
        >
          <Ionicons name="pencil" size={24} color={Colors.text.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeButton, styles.deleteButton]}
          onPress={() => handleDelete(purchase.id)}
        >
          <Ionicons name="trash" size={24} color={Colors.text.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSpendingItem = ({ item }: { item: Purchase }) => (
    <Swipeable 
      renderRightActions={() => renderRightActions(item)}
      rightThreshold={40}
    >
      <TouchableOpacity style={styles.spendingItem}>
        <LinearGradient
          colors={[Colors.primary.main, Colors.primary.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.categoryIndicator}
        />
        <View style={styles.spendingContent}>
          <View style={styles.spendingHeader}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={16} color={Colors.text.secondary} />
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.paymentMethodContainer}>
              <Ionicons name="card" size={16} color={Colors.text.secondary} />
              <Text style={styles.paymentMethod}>{item.paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.categoryContainer}>
            <LinearGradient
              colors={[Colors.primary.light, Colors.primary.main]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.categoryBadge}
            >
              <Ionicons 
                name={
                  item.category === 'Food' ? 'restaurant' :
                  item.category === 'Transportation' ? 'car' :
                  item.category === 'Entertainment' ? 'game-controller' :
                  item.category === 'Shopping' ? 'cart' :
                  item.category === 'Bills' ? 'document-text' :
                  'apps'
                } 
                size={16} 
                color={Colors.text.white} 
              />
              <Text style={styles.category}>{item.category}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.items}>{item.items.join(', ')}</Text>

          {item.imageUri && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.imageUri }} 
                style={styles.purchaseImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.1)']}
                style={styles.imageOverlay}
              />
            </View>
          )}

          {item.comment && (
            <View style={styles.commentContainer}>
              <Ionicons name="chatbubble-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCommentPress(item)}
              >
                <Ionicons 
                  name="chatbubble-outline" 
                  size={24} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => toggleLike(item.id)}
              >
                <Ionicons 
                  name={item.liked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={item.liked ? Colors.error : Colors.text.secondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search purchases..."
            placeholderTextColor={Colors.text.light}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              categoryFilter === 'All' && styles.filterButtonActive
            ]}
            onPress={() => setCategoryFilter('All')}
          >
            <Text style={[
              styles.filterButtonText,
              categoryFilter === 'All' && styles.filterButtonTextActive
            ]}>All</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterButton,
                categoryFilter === cat && styles.filterButtonActive
              ]}
              onPress={() => setCategoryFilter(cat)}
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
                color={categoryFilter === cat ? Colors.text.white : Colors.text.secondary} 
                style={styles.filterButtonIcon}
              />
              <Text style={[
                styles.filterButtonText,
                categoryFilter === cat && styles.filterButtonTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 0 }}>
        {/* Payment Method Filter */}
        <View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Colors.border.light,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: Colors.background.main,
              flexDirection: 'row',
              alignItems: 'center',
              width: 180,
            }}
            onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
          >
            <Text style={{ fontWeight: '700', fontSize: 16, marginRight: 4 }}>
              {paymentMethodFilter}
            </Text>
            <Ionicons name="chevron-down" size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
          {showPaymentDropdown && (
            <View style={{
              position: 'absolute',
              top: 48,
              left: 0,
              backgroundColor: Colors.background.main,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: Colors.border.light,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
              zIndex: 1000,
            }}>
              {paymentMethods.map(method => (
                <TouchableOpacity
                  key={method}
                  style={{ padding: 16, minWidth: 150 }}
                  onPress={() => {
                    setPaymentMethodFilter(method);
                    setShowPaymentDropdown(false);
                  }}
                >
                  <Text style={{ fontWeight: paymentMethodFilter === method ? '700' : '400', fontSize: 16 }}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <FlatList
        data={filteredSpending}
        renderItem={renderSpendingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCommentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Comment</Text>
                <TouchableOpacity
                  onPress={() => setShowCommentModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.text.light}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveComment}
              >
                <LinearGradient
                  colors={[Colors.primary.main, Colors.primary.dark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Comment</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Purchase</Text>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.editForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Price</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="cash" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editForm.price}
                      onChangeText={(text) => setEditForm(prev => ({ ...prev, price: text }))}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      placeholderTextColor={Colors.text.light}
                    />
                  </View>
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
                          editForm.category === cat && styles.selectedOption,
                        ]}
                        onPress={() => setEditForm(prev => ({ ...prev, category: cat }))}
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
                          color={editForm.category === cat ? Colors.text.white : Colors.text.secondary} 
                          style={styles.optionIcon}
                        />
                        <Text style={[
                          styles.optionText,
                          editForm.category === cat && styles.selectedOptionText,
                        ]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Items</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="list" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editForm.items}
                      onChangeText={(text) => setEditForm(prev => ({ ...prev, items: text }))}
                      placeholder="e.g., Groceries, Snacks"
                      placeholderTextColor={Colors.text.light}
                    />
                  </View>
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
                          editForm.paymentMethod === method && styles.selectedOption,
                        ]}
                        onPress={() => setEditForm(prev => ({ ...prev, paymentMethod: method }))}
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
                          color={editForm.paymentMethod === method ? Colors.text.white : Colors.text.secondary} 
                          style={styles.optionIcon}
                        />
                        <Text style={[
                          styles.optionText,
                          editForm.paymentMethod === method && styles.selectedOptionText,
                        ]}>
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <LinearGradient
                  colors={[Colors.primary.main, Colors.primary.dark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  list: {
    padding: 16,
  },
  spendingItem: {
    backgroundColor: Colors.background.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.shadow.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  categoryIndicator: {
    width: 4,
  },
  spendingContent: {
    flex: 1,
    padding: 16,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentMethod: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  items: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    padding: 8,
    backgroundColor: Colors.background.light,
    borderRadius: 8,
  },
  commentText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.main,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: Colors.background.light,
    borderRadius: 12,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.primary.main,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.main,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.light,
  },
  commentInput: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 16,
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
  saveButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
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
    backgroundColor: Colors.background.light,
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
  header: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background.main,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  filterContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.main,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  filterButtonIcon: {
    marginRight: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  filterButtonTextActive: {
    color: Colors.text.white,
    fontWeight: '600',
  },
});
