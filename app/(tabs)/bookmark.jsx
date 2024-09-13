import { Text, ScrollView, View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getSavedUserPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "./../../components/VideoCard";

const Bookmark = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    //recall posts - any new videos
    await refetch();
    setRefreshing(false);
  };
  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite(() => getSavedUserPosts(user.$id));

  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold ">
          Saved Videos
        </Text>
        <View className="mt-6 mb-8 ">
          <SearchInput placeholder="Search your saved videos" initialQuery="" />
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard userId={user.$id} item={item} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
