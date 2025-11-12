// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import React from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { useAuth } from './context/AuthContext';

// // Auth Stack
// import { Login } from './app/screens/auth/Login';
// import { Signup } from './app/screens/auth/Signup';

// // App Stack
// import { CreatePost } from './app/screens/app/CreatePost';
// import { Feed } from './app/screens/app/Feed';
// import { Profile } from './app/screens/app/Profile';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// const AuthStack = createNativeStackNavigator();

// const AuthNavigator = () => {
//   return (
//     <AuthStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <AuthStack.Screen name="Login" component={Login} />
//       <AuthStack.Screen name="Signup" component={Signup} />
//     </AuthStack.Navigator>
//   );
// };

// const AppTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: '#000',
//         tabBarInactiveTintColor: '#ccc',
//       }}
//     >
//       <Tab.Screen
//         name="Feed"
//         component={Feed}
//         options={{
//           tabBarLabel: 'Feed',
//           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
//         }}
//       />
//       <Tab.Screen
//         name="Create"
//         component={CreatePost}
//         options={{
//           tabBarLabel: 'Create',
//           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✏️</Text>,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           tabBarLabel: 'Profile',
//           tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// import { Text } from 'react-native';

// export const Navigation: React.FC = () => {
//   const { session, loading } = useAuth();

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {session ? <AppTabNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// };