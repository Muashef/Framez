// import React, { useEffect } from 'react';
// import {
//     ActivityIndicator,
//     FlatList,
//     SafeAreaView,
//     StyleSheet,
//     Text,
//     View,
// } from 'react-native';
// import { PostCard } from '../../../components/PostCard';
// import { usePosts } from '../../../context/PostsContext';

// export const Feed: React.FC = () => {
//   const { posts, loading, fetchPosts } = usePosts();

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   if (loading && posts.length === 0) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Framez</Text>
//       </View>

//       <FlatList
//         data={posts}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => <PostCard post={item} />}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   listContent: {
//     paddingTop: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#999',
//     textAlign: 'center',
//   },
// });