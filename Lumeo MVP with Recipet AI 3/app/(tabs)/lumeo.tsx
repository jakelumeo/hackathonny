import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';


export default function LumeoScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary.main, Colors.primary.dark]}
        style={styles.gradient}
      >
        <Ionicons name="rocket" size={80} color={Colors.text.white} style={styles.icon} />
        <Text style={styles.title}>Lumeo AI</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Get ready for AI-powered insights and smart spending recommendations.
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.white,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
  },
});
