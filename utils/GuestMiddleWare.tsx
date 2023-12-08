import { router, Slot, useRootNavigation, useSegments } from 'expo-router';
import type { ReactNode } from 'react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { useAuth } from "../app/context/auth";

interface GuestRoutesProps {
  children?: ReactNode;
}

const GuestMiddleware: React.FC<GuestRoutesProps> = () => {
  const rootNavigation = useRootNavigation();
  const [isNavigationReady, setNavigationReady] = useState(false);

  const { user } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = rootNavigation?.addListener('state', () => {
      // console.log("INFO: rootNavigation?.addListener('state')", event);
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  useEffect(() => {
    if (user && isNavigationReady) {
      router.replace('/onboardingScreen'); // redirect to sign-in route
    }
  }, [user, segments, isNavigationReady]);

  return <Slot />;
};

export { GuestMiddleware };