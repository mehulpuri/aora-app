import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch, isLoading } = useAppwrite(() => searchPosts(query)); //get data and rename it to posts from our custom hook
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refetch();
  }, [query]);

  console.log(query , posts);

  
  return (
    <SafeAreaView className="bg-primary  h-full  ">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard item={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="font-psemibold text-2xl text-white">{query}</Text>

            <View className="mt-6 mb-8 ">
              <SearchInput
                placeholder="Search for a video topic"
                initialQuery={query}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
