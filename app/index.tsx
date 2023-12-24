import { useRootNavigation, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { COLORS } from "../constants";
import { useAuth } from "./context/auth";
import { storeLaunchData, getLaunchData } from "../utils";
import * as SecureStore from 'expo-secure-store';

const HAS_LAUNCHED = 'hasLaunched';
const TOKEN_KEY = 'user-token';
const USER = "user-info";

const Index = () => {

  const segments = useSegments();

  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { user, authState } = useAuth();

  const rootNavigation = useRootNavigation();

  const [isNavigationReady, setNavigationReady] = React.useState(false);

  const [isFirstLaunch, setIsFirstLaunch] = React.useState(false);

  // console.log(user, authState?.authenticated , 'see index file')

  // console.log(segments[0], 'see segments')

  // React.useEffect(() => {
  //   const loadToken = async () => {
  //     try {
  //       const userToken = await SecureStore.getItemAsync(TOKEN_KEY)
  //       const userInfo = await SecureStore.getItemAsync(USER)

  //       // console.log(userInfo, 'user info secure store index file')
  //       // console.log(userToken, 'token from secure store index file')

  //     } catch (error) {
  //       console.error("Error fetching token or user info:", error);
  //       // Handle the error, perhaps setAuthState to indicate an error state
  //     }
  //   }
  //   loadToken();
  // }, [])

  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await getLaunchData(HAS_LAUNCHED);
        if (hasLaunched) {
          setIsFirstLaunch(true);
        }

        else {
          await storeLaunchData(HAS_LAUNCHED, 'true');
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkFirstLaunch(); //invoke the function
  }, []);

  // console.log('isFirstLaunch', isFirstLaunch)

  React.useEffect(() => {
    const unsubscribe = rootNavigation?.addListener("state", (event) => {
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  React.useEffect(() => {

    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!authState?.authenticated && isNavigationReady) {

      if (!isFirstLaunch) {
        router.replace("/login");
      } else {
        router.replace("/onboardingScreen");
      }
      // Redirect to the login page.
      // router.replace("/onboardingScreen");
    } else if (authState?.authenticated && isNavigationReady) {
      // go to tabs root.
      router.push("/(tabs)/home");
    }
  }, [segments, isNavigationReady, user]);

  return <View>{isNavigationReady ? <ActivityIndicator size='large' color={COLORS.primary} /> : <></>}</View>;
};

export default Index;

