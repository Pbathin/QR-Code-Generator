import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {MaterialIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'QR Code',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="qrcode" size={24} color={color} />
          ),
        }}
      />
       <Tabs.Screen name= 'explore'
      options={{
        tabBarLabel: 'Explore',
        tabBarIcon: ({color, focused})=><MaterialIcons name="qr-code-scanner"
        size={24}  color={color}/>
      }}
      />
    </Tabs>
  );
}
