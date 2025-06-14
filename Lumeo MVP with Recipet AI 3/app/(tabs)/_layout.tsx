import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.primary.main,
      tabBarInactiveTintColor: Colors.text.secondary,
      tabBarStyle: {
        backgroundColor: Colors.background.main,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
        height: Platform.OS === 'ios' ? 88 : 60,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        paddingTop: 8,
      },
      headerStyle: {
        backgroundColor: Colors.background.main,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
      },
      headerTitleStyle: {
        color: Colors.text.primary,
        fontWeight: '600',
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Spending',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Purchase',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lumeo"
        options={{
          title: 'Lumeo AI',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="rocket" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
