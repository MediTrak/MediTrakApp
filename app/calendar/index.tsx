import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Platform, Image, Linking, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { Stack, useNavigation } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, CalendarUtils } from 'react-native-calendars';
import testIDs from '../../utils/testIDs';
import { useGetMedicationQuery } from '../services/mediTrakApi';
import { FlashList } from '@shopify/flash-list';
import DrugCard from '../../components/DrugCard';

const date = new Date(Date.now());

const INITIAL_DATE = date.toISOString().split('T')[0];

export default function CalendarScreen() {
    const navigation = useNavigation();

    const [filteredData, setFilteredData] = useState<any[]>([]);

    const { data: medication, isLoading, isFetching, error, refetch, isSuccess } = useGetMedicationQuery({});

    const medicationData = medication?.data || [];

    const [refreshing, setRefreshing] = useState(false);

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

    const currentTime = new Date(date.getTime() + 60 * 60 * 1000);

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

    const formatTime = (date: Date | null | undefined): string => {
        if (!date) {
            return '';
        }

        const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'UTC' };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedTime.replace(/:(00)(?=\s|$)/, '');

    };

    const [selected, setSelected] = useState(INITIAL_DATE);
    const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

    const getDate = (count: number) => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const onDayPress = useCallback((day: { dateString: React.SetStateAction<string>; }) => {
        setSelected(day.dateString);
    }, []);

    const marked = useMemo(() => {
        return {
            [getDate(-1)]: {
                dotColor: COLORS.primary,
                marked: true
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: COLORS.primary,
                selectedTextColor: COLORS.lightWhite
            }
        };
    }, [selected]);


    const renderCalendarWithSelectableDate = () => {
        return (
            <Fragment>
                <Calendar
                    testID={testIDs.calendars.FIRST}
                    enableSwipeMonths
                    current={INITIAL_DATE}
                    style={styles.calendar}
                    onDayPress={onDayPress}
                    markedDates={marked}
                    theme={{
                        calendarBackground: COLORS.white,
                        dayTextColor: COLORS.primary,
                        todayTextColor: COLORS.primary,
                        selectedDayTextColor: COLORS.lightWhite,
                        indicatorColor: COLORS.primary,
                        arrowColor: COLORS.primary,
                        stylesheet: {
                            calendar: {
                                header: {
                                    week: {
                                        marginTop: 30,
                                        marginHorizontal: 12,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }
                                }
                            }
                        }
                    }}
                />
            </Fragment>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: COLORS.white, paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, paddingBottom: 20 }}>
            {/* <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}
            <HStack style={styles.header} space={2} alignItems={'center'}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back-outline" size={24} color={COLORS.primary}
                        onPress={navigation.goBack} />
                </TouchableOpacity>
                <Text style={styles.title}>Calendar</Text>
            </HStack>

            <View style={{ paddingHorizontal: 20, flex: 1, width: '100%' }}>
                {renderCalendarWithSelectableDate()}
                {isLoading || isFetching ? (
                    <ActivityIndicator size='large' color={COLORS.primary} />
                ) : (
                    <>
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
                                    Daily Goal
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
                            estimatedItemSize={50}
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    header: {
        width: '100%',
        paddingHorizontal: 12,
        marginBottom: 20,
        marginTop: Platform.OS == "ios" ? 10 : 0
    },

    title: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: "600",
        color: COLORS.gray3,
        textAlign: "left"
    },

    calendar: {
        marginBottom: 10,
        backgroundColor: COLORS.white
    },
});