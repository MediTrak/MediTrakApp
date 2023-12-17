import { StyleSheet, View, Platform, StatusBar, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Button } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from '../../../components/Header';
import AddMedication from '../../../components/Screens/AddMedication';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT, SIZES } from "../../../constants";
import { useAuth } from "../../context/auth";
import DailyGoalCard from '../../../components/DailyGoalCard';
import { avatarLetters } from '../../../utils';
import DrugCard from '../../../components/DrugCard';
import { useGetMedicationQuery } from '../../services/mediTrakApi';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NowCard from '../../../components/NowCard';
import { extractTimeFromDate } from '../../../utils';
import * as Notifications from 'expo-notifications';
import { useToast, VStack, HStack, IconButton, CloseIcon, Alert, Icon } from 'native-base';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { BackgroundFetchStatus } from 'expo-background-fetch';

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});


export default function Home() {
  const { resp } = useLocalSearchParams();

  const toast = useToast();

  const { user } = useAuth()

  const firstName = user?.firstName
  const lastName = user?.lastName
  const email = user?.email

  const avatar = firstName + ' ' + lastName

  const nameAvatar = avatarLetters(avatar)

  const router = useRouter();

  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { data: medication, isLoading, isFetching, error, refetch, isSuccess } = useGetMedicationQuery({});

  // console.log(medication, isSuccess, error, 'see medication')

  const medicationData = medication?.data || [];

  const [refreshing, setRefreshing] = useState(false);

  const ToastAlert: React.FC<ToastItem & { id: string, status?: string, duration: number }> = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    duration,
    ...rest
  }) => (
    <Alert
      maxWidth="95%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "info"}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text style={styles.alertTitleText}>
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" />}
              _icon={{
                color: variant === "solid" ? "lightText" : "darkText"
              }}
              onPress={() => toast.close(id)}
            />
          ) : null}
        </HStack>
        <Text style={styles.alertTitleText}>
          {description}
        </Text>
      </VStack>
    </Alert>
  );

  if (!isSuccess) {
    console.log(isSuccess,":", error)
    // router.push("/login");
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        await refetch();

        const today = new Date();

        if (medicationData) {

          let filteredDates = medicationData?.filter((item: { tillWhen: string | number | Date; }) => {
            const tillWhenDate = new Date(item.tillWhen);
            return tillWhenDate >= today;
          });

          setFilteredData(filteredDates);
        }

      } catch (error) {
        console.error('Error fetching medication:', error);
        // Handle error if needed
      }
    }
    fetchData();

  }, [medication])

  const time = new Date(Date.now());

  const currentTime = new Date(time.getTime() + 60 * 60 * 1000);

  // console.log(extractTimeFromDate(currentTime), 'see extracted time')

  // console.log(filteredData, 'see filtered Data')

  let hasFilteredData = filteredData?.length > 0;

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Take your Drug',
        body: 'Here is the notification body',
        data: { data: 'goes here', url: '/home' },
      },
      trigger: { seconds: 10 },
    });
  }

  const convertToTime = (timeArray: string[] | undefined): Date[] | undefined => {
    return timeArray?.map((item) => {
      const [hours, minutes] = item.split(':');
      const time = new Date();
      time.setHours(Number(hours) + 1);
      time.setMinutes(Number(minutes));
      time.setSeconds(0);
      return time;
    });
  };

  const filteredTimes = filteredData.map(entry => ({
    id: entry._id,
    timeToTake: convertToTime(entry.timeToTake)
  }));

  // console.log(filteredTimes, 'see filtered times')

  const getNextTimeToTake = (entry: any): { _id: string, nextTime: Date | null } => {

    const currentDay = currentTime.toISOString().split('T')[0];

    if (entry.timeToTake && entry.timeToTake.length > 0) {
      const convertedTimes = convertToTime(entry.timeToTake);

      // Filter out times that are in the past and on previous days
      const futureTimes = convertedTimes?.filter(time => {
        const timeDay = time.toISOString().split('T')[0];
        return time > currentTime && timeDay === currentDay;
      });

      // Sort the future times in ascending order
      futureTimes?.sort((a: any, b: any) => a - b);

      // Get the next time or null if there is none
      const nextTime = futureTimes?.[0] || null;

      return {
        _id: entry._id,
        nextTime
      };
    }

    // Return null if no timeToTake array is present
    return {
      _id: entry._id,
      nextTime: null
    };
  };

  const nextTimes = filteredData.map(getNextTimeToTake);

  const nextTimeArray = nextTimes.map(({ _id, nextTime }) => ({
    id: _id,
    nextTime: nextTime
  }));

  // console.log(nextTimeArray, 'Next Time Array');

  const formatTime = (date: Date | null | undefined): string => {
    if (!date) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'UTC' };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

    // return formattedTime.replace(/:00$/, '')

    return formattedTime.replace(/:(00)(?=\s|$)/, '');

  };

  // async function scheduleNotification(nextTimeArray: any) {
  //   for (const { id, nextTime } of nextTimeArray) {
  //     const notificationTime = new Date(nextTime);

  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: 'Take your Drug',
  //         body: 'Here is the notification body',
  //         data: { data: 'goes here', url: '/home' },
  //       },
  //       trigger: { date: notificationTime },
  //     });
  //   }
  // }

  // const nextArray = [
  //   { id: '1', nextTime: '2023-12-17T03:05:00.000Z' },
  //   { id: '2', nextTime: '2023-12-17T10:30:00.000Z' },
  // ]

  // scheduleNotification(nextArray)


  const nextArray = [
    { id: '1', nextTime: '2023-12-17T04:00:00.000Z' },
    { id: '2', nextTime: '2023-12-17T10:30:00.000Z' },
    // ... other entries
  ];

  // async function scheduleNotification(id: string, nextTime: string | number | Date) {
  //   const notificationTime = new Date(nextTime);

  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'Take your Drug',
  //       body: 'Here is the notification body',
  //       data: { data: 'goes here', url: '/home' },
  //     },
  //     trigger: { date: notificationTime },
  //   });
  // }

  // async function checkAndScheduleNotifications() {

  //   for (const { id, nextTime } of nextArray) {
  //     const notificationTime = new Date(nextTime);

  //     if (notificationTime > currentTime) {
  //       await scheduleNotification(id, notificationTime);
  //     }
  //   }
  // }

  // // Register the background task
  // Notifications.registerTaskAsync('checkAndScheduleNotifications');

  // // Schedule notifications when the app starts
  // checkAndScheduleNotifications();

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<BackgroundFetchStatus | null>(null);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  }


  const toggleFetchTask = async () => {
    await registerBackgroundFetchAsync();
    checkStatusAsync();
  };

  return (
    <SafeAreaView style={{
      flex: 1, justifyContent: "flex-start", alignItems: "center"
    }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Home" }} />
      <Header user={user?.firstName} handleNotificationPress={() => { router.push("/notifications") }} />

      {
        hasFilteredData && (
          <View style={{ backgroundColor: COLORS.primary, height: 40, width: '100%' }}>
            <DailyGoalCard avatar={nameAvatar} />
          </View>
        )
      }

      {isLoading || isFetching ? (
        <ActivityIndicator size='large' color={COLORS.primary} />
      ) : (

        hasFilteredData ? (
          <ScrollView showsVerticalScrollIndicator={false} style={[styles.drugCardsWrapper, { marginTop: 40 }]} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>

            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ width: '100%' }}>
              <Text style={styles.upcomingText}>Now</Text>
              <Text style={{ fontSize: 11, color: COLORS.gray3, fontWeight: '600' }}>
                {'2 mins ago'}
              </Text>
            </HStack>

            <NowCard drug='Paracetamol' drugTwo='Puritin' noOfTablets={3} buttonText='Show Evidence' handlePress={() =>
              router.push("/add-evidence")} />

            <Text style={styles.upcomingText}>Upcoming</Text>

            <Button
              title="Schedule test notifications"
              onPress={schedulePushNotification}
            />

            <Button
              title={'Register BackgroundFetch task'}
              onPress={toggleFetchTask}
            />

            {
              filteredData?.map((item: { _id: React.Key | null | undefined; name: string | undefined; timeToTake: string[] | undefined; timesDaily: number | undefined; }) => (
                <DrugCard
                  key={item._id}
                  drug={item.name}
                  time={formatTime(nextTimeArray.find(({ id }) => id === item._id)?.nextTime)}
                  noOfTablets={item.timesDaily}
                />
              ))
            }
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, width: "100%" }} contentContainerStyle={{ alignItems: 'center', flex: 1, justifyContent: 'center' }} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            <AddMedication />
          </ScrollView>
        )
      )}

      <TouchableOpacity style={styles.button} onPress={() => {
        router.push("/medication-form");
      }}>
        <MaterialCommunityIcons name='plus' size={30} color={'white'} />
      </TouchableOpacity>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  upcomingText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray3,
    marginBottom: 12
  },

  drugCardsWrapper: {
    // borderColor: 'red',
    // borderWidth: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20
  },

  button: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#2a2a2a14',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
    shadowRadius: 14.2,
    elevation: 14.2,
    shadowOpacity: 1,
    borderRadius: 100,
    height: 50,
    width: 50,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20
  },
  alertTitleText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  }
});
