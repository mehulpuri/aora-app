import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton"
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    pass: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = async() => {
    if (!form.email || !form.pass) {
      Alert.alert("Error", "Please Fill all the fields ");
    }
    setIsSubmitting(true);
    try {
      await signIn(form.email,form.pass)
      const res = await getCurrentUser();
      setUser(res)
      setIsLoggedIn(true)
      //set result to global state using context
      router.replace('/home') 
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false)
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white mt-10 font-semibold">
            Log In To Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles ="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.pass}
            handleChangeText={(e) => setForm({ ...form, pass: e })}
            otherStyles ="mt-7"
          />
        <CustomButton
          title="Sign In"
          handlePress = {submit}
          containerStyles = "mt-10"
          isLoading={isSubmitting}
        />
        <View className="justify-center pt-5 items-center flex-row gap-2 ">
          <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text> 
          <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign Up</Link>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
