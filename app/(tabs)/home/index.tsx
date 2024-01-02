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
import { FlashList } from '@shopify/flash-list';
import notifee, { AndroidImportance, AndroidNotificationSetting, TimestampTrigger, TriggerType } from '@notifee/react-native';

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
    console.log(isSuccess, ":", error)
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

  console.log(filteredData, 'see filtered Data')

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

  const getNextTimeToTake = (entry: any): { _id: string, nextTime: Date | null | undefined } => {

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

      // Get the next time or if there is none revert to first time in array
      const nextTime = futureTimes?.[0] || convertedTimes?.[0];

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

  const formatTime = (date: Date | null | undefined): string => {
    if (!date) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'UTC' };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

    // return formattedTime.replace(/:00$/, '')

    return formattedTime.replace(/:(00)(?=\s|$)/, '');

  };

  console.log(nextTimeArray, 'next time array')
  //  ^?

  // scheduleNotification(nextArray)

  async function onDisplayNotification() {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  useEffect(() => {

    const getAlarmPermission = async () => {
      const settings = await notifee.getNotificationSettings();
      if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
        //Create timestamp trigger
      } else {
        // Show some user information to educate them on what exact alarm permission is,
        // and why it is necessary for your app functionality, then send them to system preferences:
        await notifee.openAlarmPermissionSettings();
      }
    }

    getAlarmPermission();

  }, [])


  async function onCreateTriggerNotification() {
    const date = new Date(Date.now());
    date.setHours(3);
    date.setMinutes(59);

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
      // alarmManager: true
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Meeting with Jane',
        body: 'Today at 03:59am',
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      },
      trigger,
    );
  }



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

      {isLoading ? (
        <ActivityIndicator size='large' color={COLORS.primary} />
      ) : (

        hasFilteredData ? (
          <View style={[styles.drugCardsWrapper, { marginTop: 40 }]}>

            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ width: '100%' }}>
              <Text style={styles.upcomingText}>Now</Text>
              <Text style={{ fontSize: 11, color: COLORS.gray3, fontWeight: '600' }}>
                {'2 mins ago'}
              </Text>
            </HStack>

            <NowCard
              drug='Paracetamol'
              drugTwo='Puritin'
              noOfTablets={3}
              buttonText='Show Evidence'
              handlePress={() => router.push("/add-evidence")}
            />

            <Button
              title="Schedule test notifications"
              onPress={schedulePushNotification}
            />

            <Button title="Display Notification" onPress={() => onDisplayNotification()} />

            <Button title="Create Trigger Notifications" onPress={() => onCreateTriggerNotification()} />

            <FlashList
              data={filteredData}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 20 }}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListHeaderComponent={() => (
                <Text style={{
                  fontSize: 14, fontWeight: '600', color: "#2a2a2a",
                  textAlign: "left", marginBottom: 20
                }}>
                  Upcoming
                </Text>
              )}
              renderItem={({ item }: { item: any }) => (
                <DrugCard
                  key={item._id}
                  drug={item.name}
                  time={formatTime(nextTimeArray.find(({ id }) => id === item._id)?.nextTime)}
                  noOfTablets={item.timesDaily}
                />
              )}
              estimatedItemSize={20}
            />
          </View>
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
    flex: 1,
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
