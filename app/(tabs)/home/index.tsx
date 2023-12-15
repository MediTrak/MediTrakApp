import { StyleSheet, View, Platform, StatusBar, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from '../../../components/Header';
import AddMedication from '../../../components/Screens/AddMedication';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../constants";
import { useAuth } from "../../context/auth";
import DailyGoalCard from '../../../components/DailyGoalCard';
import { avatarLetters } from '../../../utils';
import DrugCard from '../../../components/DrugCard';
import { useGetMedicationQuery } from '../../services/mediTrakApi';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NowCard from '../../../components/NowCard';
import { HStack } from 'native-base';
import { extractTimeFromDate } from '../../../utils';

export default function Home() {
  const { resp } = useLocalSearchParams();

  const { user, authState, onGetMedications } = useAuth()

  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.firstName
  const lastName = user?.lastName
  const email = user?.email

  const avatar = firstName + ' ' + lastName

  const nameAvatar = avatarLetters(avatar)

  const router = useRouter();

  const { data: medication, isLoading, isFetching, error, refetch, isSuccess } = useGetMedicationQuery({});

  const medicationData = medication?.data || [];

  const [filteredData, setFilteredData] = useState<any[]>([]);

  const time = new Date(Date.now());
  const currentTime = new Date(time.getTime() + 60 * 60 * 1000);

  console.log(extractTimeFromDate(currentTime), 'see extracted time')

  useEffect(() => {
    const today = new Date();

    const filteredDates = medicationData.filter((item: { tillWhen: string | number | Date; }) => {
      const tillWhenDate = new Date(item.tillWhen);
      return tillWhenDate >= today;
    });

    setFilteredData(filteredDates);
  }, [medicationData]);

  // console.log(medicationData, 'medication')

  console.log(filteredData[1], 'see filtered Data')

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('Error fetching medications:', error);
        // Handle error if needed
      }
    }
    fetchData();

  }, [medication])

  return (
    <SafeAreaView style={{
      flex: 1, justifyContent: "flex-start", alignItems: "center"
    }}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Home" }} />
      <Header user={user?.firstName} />
      {/* */}

      {
        filteredData?.length > 0 && (
          <View style={{ backgroundColor: COLORS.primary, height: 40, width: '100%' }}>
            <DailyGoalCard avatar={nameAvatar} />
          </View>
        )
      }


      {isLoading || isFetching ? (
        <ActivityIndicator size='large' color={COLORS.primary} />
      ) : (

        filteredData?.length > 0 ? (
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

            {
              filteredData?.map((item: { _id: React.Key | null | undefined; name: string | undefined; timeToTake: string[] | undefined; timesDaily: number | undefined; }) => (
                <DrugCard
                  key={item._id}
                  drug={item.name}
                  time={item.timeToTake?.[0]}
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
  }
});
