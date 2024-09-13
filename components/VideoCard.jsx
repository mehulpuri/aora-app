import { View, Text, Image, TouchableOpacity, Modal, Alert } from "react-native";
import React, { useState } from "react";
import { images, icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { saveVideoForUser } from "../lib/appwrite";

const VideoCard = ({
  item: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
  userId,
}) => {
  const [play, setPlay] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false); // To handle save state
  
  const handleSaveVideo = async () => {
    try {
      setSaving(true);
      await saveVideoForUser(userId, $id);
      setMenuVisible(false);
      Alert.alert("Success", "Video saved!");
    } catch (err) {
      Alert.alert("Error", "Could not save video.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start relative">
        <View className="justify-center items-center flex-row flex-1 relative">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular "
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View style={{ position: "relative" }}>
          {/* Menu Button */}
          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Dropdown Menu (positioned absolutely near the button) */}
          {menuVisible && (
            <View
              style={{
                position: "absolute",
                top: 25, // Adjust this to appear below the button
                right: 0,
                backgroundColor: "black",
                padding: 10,
                borderRadius: 8,
                zIndex:10,
                width:100
              }}
            >
              <TouchableOpacity
                onPress={handleSaveVideo}
                disabled={saving} // Disable button when saving
                className="py-2 px-4 rounded-lg bg-secondary"
              >
                <Text className="text-white">
                  {saving ? "Saving..." : "Save Video"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMenuVisible(false)}
                className="py-2 px-4 mt-2 rounded-lg bg-gray-100"
              >
                <Text className="text-black-100">Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          useNativeControls
          shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
