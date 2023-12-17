import { useRootNavigation, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { COLORS } from "../constants";
import { useAuth } from "./context/auth";
import { storeLaunchData, getLaunchData } from "../utils";

const HAS_LAUNCHED = 'hasLaunched';

const Index = () => {

  const segments = useSegments();

  const router = useRouter();

  const navigationState = useRootNavigationState();

  const { user, authState } = useAuth();

  const rootNavigation = useRootNavigation();

  const [isNavigationReady, setNavigationReady] = React.useState(false);

  const [isFirstLaunch, setIsFirstLaunch] = React.useState(false);

  console.log(user, authState?.authenticated , 'see index file')

  // console.log(segments[0], 'see segments')

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

