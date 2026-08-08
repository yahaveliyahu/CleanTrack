import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import ActiveCallsScreen from './src/screens/ActiveCallsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { colors } from './src/utils/theme';
import { loadCalls, saveCalls } from './src/utils/storage';

const Tab = createBottomTabNavigator();

// Shared header component
function Header({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerBrand}>
        <View style={styles.headerLogo}>
          <Text style={styles.headerLogoText}>🧹</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalls().then(data => {
      setCalls(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateCalls = useCallback((updated) => {
    setCalls(updated);
    saveCalls(updated);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingText}>🧹</Text>
        <Text style={styles.loadingLabel}>CleanTrack</Text>
      </View>
    );
  }

  const openCount = calls.filter(c => c.status === 'open').length;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={colors.navy} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: colors.teal,
            tabBarInactiveTintColor: colors.gray400,
            tabBarLabelStyle: styles.tabLabel,
            tabBarItemStyle: styles.tabItem,
            headerStyle: { backgroundColor: colors.navy, shadowColor: 'transparent', elevation: 0 },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: '800', fontSize: 18 },
          }}
        >
          <Tab.Screen
            name="ActiveCalls"
            options={{
              title: 'Active Calls',
              tabBarLabel: 'Active Calls',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
              tabBarBadge: openCount > 0 ? openCount : undefined,
              tabBarBadgeStyle: styles.badge,
              header: () => (
                <Header title="CleanTrack" subtitle="Cleaning operations management" />
              ),
            }}
          >
            {() => <ActiveCallsScreen calls={calls} onUpdateCalls={handleUpdateCalls} />}
          </Tab.Screen>

          <Tab.Screen
            name="History"
            options={{
              title: 'History',
              tabBarLabel: 'History',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time-outline" size={size} color={color} />
              ),
              header: () => (
                <Header title="History" subtitle="All cleaning records" />
              ),
            }}
          >
            {() => <HistoryScreen calls={calls} onUpdateCalls={handleUpdateCalls} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1, backgroundColor: colors.navy,
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  loadingText: { fontSize: 48 },
  loadingLabel: { fontSize: 24, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },

  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 46 : 54,
    paddingBottom: 16,
  },
  headerBrand: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerLogo: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: colors.navyLight,
    alignItems: 'center', justifyContent: 'center',
  },
  headerLogoText: { fontSize: 18 },
  headerTitle: { fontSize: 19, fontWeight: '800', color: colors.white, letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 12, color: colors.gray400, marginTop: 1 },

  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.gray200,
    borderTopWidth: 1,
    height: Platform.OS === 'android' ? 64 : 88,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 8 : 28,
  },
  tabLabel: { fontSize: 11, fontWeight: '700' },
  tabItem: { paddingVertical: 2 },
  badge: { backgroundColor: colors.amber, fontSize: 10, fontWeight: '700' },
});
