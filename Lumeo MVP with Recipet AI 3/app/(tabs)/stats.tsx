import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSpending } from '../../context/SpendingContext';

export default function StatsScreen() {
  const { spending } = useSpending();
  const [range, setRange] = useState<'1D' | '1W' | '1M' | '1Y' | 'MAX'>('1M');
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef(null);
  const [dropdownTop, setDropdownTop] = useState(0);

  // Helper to get date N days/weeks/months/years ago
  const getDateAgo = (type: 'D' | 'W' | 'M' | 'Y', n: number) => {
    const d = new Date();
    if (type === 'D') d.setDate(d.getDate() - n + 1);
    if (type === 'W') d.setDate(d.getDate() - n * 7 + 1);
    if (type === 'M') d.setMonth(d.getMonth() - n);
    if (type === 'Y') d.setFullYear(d.getFullYear() - n);
    return d;
  };

  // Filter spending by selected range
  let filteredSpending = spending;
  if (range === '1D') {
    const start = getDateAgo('D', 1);
    filteredSpending = spending.filter(p => new Date(p.date) >= start);
  } else if (range === '1W') {
    const start = getDateAgo('W', 1);
    filteredSpending = spending.filter(p => new Date(p.date) >= start);
  } else if (range === '1M') {
    const start = getDateAgo('M', 1);
    filteredSpending = spending.filter(p => new Date(p.date) >= start);
  } else if (range === '1Y') {
    const start = getDateAgo('Y', 1);
    filteredSpending = spending.filter(p => new Date(p.date) >= start);
  } // MAX shows all

  const totalSpending = filteredSpending.reduce((sum, purchase) => sum + purchase.price, 0);

  const spendingByCategory = filteredSpending.reduce((acc, purchase) => {
    acc[purchase.category] = (acc[purchase.category] || 0) + purchase.price;
    return acc;
  }, {} as Record<string, number>);

  const spendingByPaymentMethod = filteredSpending.reduce((acc, purchase) => {
    acc[purchase.paymentMethod] = (acc[purchase.paymentMethod] || 0) + purchase.price;
    return acc;
  }, {} as Record<string, number>);

  const renderStatCard = (title: string, value: number, icon: string) => (
    <View style={styles.card}>
      <LinearGradient
        colors={[Colors.background.main, Colors.background.light]}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Ionicons name={icon as any} size={24} color={Colors.primary.main} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Text style={styles.cardValue}>${value.toFixed(2)}</Text>
      </LinearGradient>
    </View>
  );

  const renderCategoryItem = (category: string, amount: number) => (
    <View key={category} style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <Ionicons 
          name={
            category === 'Food' ? 'restaurant' :
            category === 'Transportation' ? 'car' :
            category === 'Entertainment' ? 'game-controller' :
            category === 'Shopping' ? 'cart' :
            category === 'Bills' ? 'document-text' :
            'apps'
          } 
          size={20} 
          color={Colors.primary.main} 
        />
        <Text style={styles.categoryName}>{category}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
        <Text style={styles.percentage}>
          {((amount / totalSpending) * 100).toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  const renderPaymentMethodItem = (method: string, amount: number) => (
    <View key={method} style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
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
          size={20} 
          color={Colors.primary.main} 
        />
        <Text style={styles.paymentName}>{method}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.paymentAmount}>${amount.toFixed(2)}</Text>
        <Text style={styles.percentage}>
          {((amount / totalSpending) * 100).toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 24 }}>
        <View>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>Track your spending patterns</Text>
        </View>
        <View ref={buttonRef}>
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
            }}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={{ fontWeight: '700', fontSize: 18, marginRight: 4 }}>
              {range}
            </Text>
            <Ionicons name="chevron-down" size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Modal visible={showDropdown} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
              <View style={{ flex: 1 }}>
                <View style={{
                  position: 'absolute',
                  top: 48,
                  right: 0,
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
                  {['1D', '1W', '1M', '1Y', 'MAX'].map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={{ padding: 16, minWidth: 120 }}
                      onPress={() => {
                        setRange(opt as any);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={{ fontWeight: range === opt ? '700' : '400', fontSize: 16 }}>
                        {opt === '1D' ? '1 Day' : opt === '1W' ? '1 Week' : opt === '1M' ? '1 Month' : opt === '1Y' ? '1 Year' : 'Max'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>

      {renderStatCard('Total Spending', totalSpending, 'wallet')}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.sectionContent}>
          {Object.entries(spendingByCategory).map(([category, amount]) =>
            renderCategoryItem(category, amount)
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Payment Method</Text>
        <View style={styles.sectionContent}>
          {Object.entries(spendingByPaymentMethod).map(([method, amount]) =>
            renderPaymentMethodItem(method, amount)
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  card: {
    margin: 16,
    borderRadius: 16,
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
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary.main,
  },
  section: {
    margin: 16,
    marginTop: 8,
    backgroundColor: Colors.background.main,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow.main,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentName: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  percentage: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
}); 