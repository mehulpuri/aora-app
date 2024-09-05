import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";

const SearchInput = ({
  initialQuery,
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const pathName = usePathname()
  const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className="border-2 border-black-100 w-full h-16 px-4 space-x-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular  "
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}

      />
      <TouchableOpacity onPress={() => {
        if(!query){
          return Alert.alert('Missing query', 'Please input something to search across database')
        }
        if(pathName.startsWith('/search')){
          router.setParams({query})
        }else{
          router.push(`/search/${query}`)
        }
      }}>
        <Image  source={icons.search} className="w-5 h-5" resizeMode="contain"/>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
