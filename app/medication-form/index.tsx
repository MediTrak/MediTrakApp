import { Text, View, TextInput, StyleSheet, TouchableOpacity, NativeSyntheticEvent, TextInputChangeEventData, Platform, TouchableWithoutFeedback, Keyboard, StatusBar, BackHandler } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { COLORS, FONT, SIZES } from "../../constants";
import { extractTimeFromDate } from "../../utils";
import { useToast, VStack, HStack, IconButton, CloseIcon, Alert, Select, CheckIcon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import React from "react";
import { useAuth } from "../context/auth";
import { useGetMedicationQuery } from '../services/mediTrakApi';

interface FormData {
    medicationName: string;
    dailyUsageNoOfTimes: string;
    usageTime: any;
    tabletsPerUsage: number;
    startDate: Date;
    endDate: Date;
    usageTimes?: string[];
}

interface ToastItem {
    title: string;
    variant: string;
    description: string;
    isClosable?: boolean;
}

export default function MedicationForm() {
    const router = useRouter();

    const { id } = useLocalSearchParams();

    const isEdit = id ? true : false;

    const { data: medication, isFetching, error, refetch, isSuccess } = useGetMedicationQuery({});

    const medicationData = medication?.data || [];

    const filteredMedicationData: any = medicationData.filter((entry: { _id: string | string[]; }) => entry._id === id)

    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();

    const today = new Date();

    const drugId = filteredMedicationData[0]?._id || ''

    const startMedicationDate = new Date(filteredMedicationData[0]?.fromWhen || today)

    const endMedicationDate = new Date(filteredMedicationData[0]?.tillWhen || today)

    const { onAddMedication, onEditMedication } = useAuth();

    const tabletsPerUsageString = filteredMedicationData[0]?.dosage

    const tabletsPerUsageNo = parseInt(tabletsPerUsageString?.split('-')[0], 10);

    const [formData, setFormData] = useState<FormData>({
        medicationName: filteredMedicationData[0]?.name || '',
        dailyUsageNoOfTimes: filteredMedicationData[0]?.timesDaily || '',
        usageTime: today,
        tabletsPerUsage: tabletsPerUsageNo || 0,
        startDate: startMedicationDate || today,
        endDate: endMedicationDate || today
    });

    const [spinner, setSpinner] = useState(false);

    const { medicationName, dailyUsageNoOfTimes, usageTime, tabletsPerUsage, startDate, endDate } = formData;

    const [errors, setErrors] = useState({
        medicationName: '',
        dailyUsageNoOfTimes: '',
        usageTime: '',
        tabletsPerUsage: '',
        startDate: '',
        endDate: '',
        usageTimes: ''
    });

    const [selectedValue, setSelectedValue] = useState<string>(`${dailyUsageNoOfTimes}`);

    const [showPickerStartDate, setShowPickerStartDate] = useState(false);

    const [showPickerEndDate, setShowPickerEndDate] = useState(false);

    const [showUsageTime, setShowUsageTime] = useState<{ [index: number]: boolean }>({});

    const dailyUsageNumberValue: number = parseInt(dailyUsageNoOfTimes, 10) as number;

    const convertToDates = (timeArray: any[]) => {
        return timeArray?.map((time) => {
            const [hours, minutes] = time?.split(':');
            const date = new Date();
            date.setHours(Number(hours) + 1);
            date.setMinutes(Number(minutes));
            date.setSeconds(0);
            return date;
        });
    };

    const dateArray = convertToDates(filteredMedicationData[0]?.timeToTake || []);

    const [usageTimes, setUsageTimes] = useState<Date[]>(dateArray || []);

    const [time, setTime] = useState(new Date(Date.now()));

    const onChangeStartDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShowPickerStartDate(false);
        setFormData({ ...formData, 'startDate': currentDate });
        setErrors(prevErrors => ({ ...prevErrors, 'startDate': '' }));
    };

    const onChangeEndDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShowPickerEndDate(false);
        setFormData({ ...formData, 'endDate': currentDate })
        setErrors(prevErrors => ({ ...prevErrors, 'endDate': '' }));;
    };

    const onChangeUsageTime = (event: any, selectedTime: any, index: number) => {
        const currentTime = new Date(selectedTime.getTime() + 60 * 60 * 1000);
        setShowUsageTime((prev) => ({ ...prev, [index]: false }));

        if (event.type == "set") { //ok button
            // Check if the index already exists in the array
            if (index < usageTimes.length) {
                // If it exists, replace the value at that index
                const updatedUsageTimes = [...usageTimes];
                updatedUsageTimes[index] = currentTime;
                setUsageTimes(updatedUsageTimes);
            } else {
                // If it doesn't exist, add the new value to the end of the array
                setUsageTimes([...usageTimes, currentTime]);
            }
            setTime(selectedTime);
        } else { //cancel Button
            return null
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [index]: '',
        }));
    };

    useEffect(() => {
        const handleBackPress = () => {
            navigation.goBack();  // Replace this with your actual navigation method
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [navigation]);

    const showDatepickerStart = () => {
        setShowPickerStartDate(true);
    };

    const showDatepickerEnd = () => {
        setShowPickerEndDate(true);
    };

    const showUsage = (index: number) => {
        setShowUsageTime((prev) => ({ ...prev, [index]: true }));
    };

    const handleValueChange = (value: string) => {
        if (value === selectedValue) {
            // If the same value is clicked again, unselect it
            setSelectedValue('');
            setFormData({ ...formData, 'dailyUsageNoOfTimes': '' });
            setErrors(prevErrors => ({ ...prevErrors, 'hospital': 'Hospital is required' }));
        } else {
            // If a different value is selected, update the state
            setSelectedValue(value);
            setFormData({ ...formData, 'dailyUsageNoOfTimes': value });
            setErrors(prevErrors => ({ ...prevErrors, 'hospital': '' }));
            setUsageTimes([]);
        }
    };

    const handleChangeInput = (name: string, e: NativeSyntheticEvent<TextInputChangeEventData>, index?: number) => {
        const value = e.nativeEvent.text;
        setFormData({ ...formData, [name]: value });
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

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

    const startDateFormatted = startDate.toISOString()?.split('T')[0];

    const endDateFormatted = endDate.toISOString()?.split('T')[0];

    const isCheckOutValid = () => endDateFormatted > startDateFormatted;

    const validateInputs = () => {
        let validationPassed = true;
        const newErrors = { medicationName: '', dailyUsageNoOfTimes: '', usageTime: '', tabletsPerUsage: '', startDate: '', endDate: '', usageTimes: '', selectedValue: '' };

        if (!medicationName.trim()) {
            newErrors.medicationName = 'Medication Name is required';
            validationPassed = false;
        }

        if (!selectedValue.trim()) {
            newErrors.dailyUsageNoOfTimes = 'Daily Usage Number of Times is required';
            validationPassed = false;
        }

        if (usageTimes.length != parseFloat(dailyUsageNoOfTimes)) {
            newErrors.usageTime = 'Time is required';
            validationPassed = false;
        }

        if (tabletsPerUsage == 0) {
            newErrors.tabletsPerUsage = 'Tablets per time required';
            validationPassed = false;
        }

        if (startDate == null) {
            newErrors.startDate = 'Start Date is required';
            validationPassed = false;
        }

        if (endDate == null) {
            newErrors.endDate = 'End date is required';
            validationPassed = false;
        } else if (!isCheckOutValid()) {
            newErrors.endDate = 'End date cannot be before or same as start date';
            validationPassed = false;
        }

        setErrors(newErrors);
        return validationPassed;
    };

    const handleSubmit = async () => {
        if (validateInputs()) {

            setSpinner(true)

            const tabletsValue = formData.tabletsPerUsage;
            const dailyUsageNo = parseFloat(formData.dailyUsageNoOfTimes);
            const tabletsPerUsageFormatted = Array.from({ length: dailyUsageNo }, () => tabletsValue).join('-');
            const extractedTimes = usageTimes.map((date) => extractTimeFromDate(date));

            const medicationParams = {
                medicationName: formData.medicationName,
                dailyUsageNoOfTimes: dailyUsageNo,
                tabletsPerUsage: tabletsPerUsageFormatted,
                startDate: formData.startDate.toISOString().split('T')[0],
                endDate: formData.endDate.toISOString().split('T')[0],
                usageTime: extractedTimes,
                user: '',
                id: drugId
            };

            if (isEdit) {
                const result = await onEditMedication!(medicationParams.medicationName, medicationParams.dailyUsageNoOfTimes, medicationParams.usageTime, medicationParams.tabletsPerUsage, medicationParams.startDate, medicationParams.endDate, medicationParams.id)

                setSpinner(false)

                if (result && !result.error) {
                    setLoading(true);
                    toast.show({
                        placement: "top",
                        render: ({
                            id
                        }) => {
                            return <ToastAlert id={id} title={"Medication Updated!"} variant={"solid"} description={"Your Medication has been updated."} duration={10000} status={"success"} isClosable={true} />;
                        }
                    })

                    const goBackWithDelay = () => {
                        setTimeout(() => {
                            navigation.goBack();
                        }, 2000); // 2000 milliseconds or 2 seconds
                    };

                    goBackWithDelay();

                } else {
                    toast.show({
                        placement: "top",
                        render: ({
                            id
                        }) => {
                            return <ToastAlert id={id} title={"Error Updating Medication!"} variant={"solid"} description={result?.msg} duration={10000} status={"error"} isClosable={true} />;
                        }
                    })
                }

                return;
            }

            const result = await onAddMedication!(medicationParams.medicationName, medicationParams.dailyUsageNoOfTimes, medicationParams.usageTime, medicationParams.tabletsPerUsage, medicationParams.startDate, medicationParams.endDate, medicationParams.user)

            setSpinner(false)

            if (result && !result.error) {
                setLoading(true);
                toast.show({
                    placement: "top",
                    render: ({
                        id
                    }) => {
                        return <ToastAlert id={id} title={"Medication Created!"} variant={"solid"} description={"Your Medication has been created."} duration={10000} status={"success"} isClosable={true} />;
                    }
                })

                const goBackWithDelay = () => {
                    setTimeout(() => {
                        navigation.goBack();
                    }, 1000); // 2000 milliseconds or 2 seconds
                };

                goBackWithDelay();

            } else {
                toast.show({
                    placement: "top",
                    render: ({
                        id
                    }) => {
                        return <ToastAlert id={id} title={"Error Creating Medication!"} variant={"solid"} description={result?.msg} duration={10000} status={"error"} isClosable={true} />;
                    }
                })
            }
        }
    }

    const DropdownUsageNoOfTimes = () => {
        return (
            <View style={[styles.textInput, { marginBottom: 10 }]}>
                <Select
                    minWidth="200"
                    style={{ height: 39 }}
                    color={'black'}
                    borderColor={'#2A2A2A24'}
                    borderRadius={'8'}
                    accessibilityLabel="How many Times Daily"
                    placeholder="Daily Usage Number Of Times"
                    placeholderTextColor={"#2A2A2A24"}
                    onValueChange={handleValueChange}
                    selectedValue={selectedValue}
                    _selectedItem={{
                        bg: COLORS.primary,
                        endIcon: <CheckIcon size={5} />
                    }}
                    mt="1"
                    mb="1"
                    fontSize="14"
                    // defaultValue={selectedValue}
                >
                    <Select.Item label="Once" value="1" />
                    <Select.Item label="Twice" value="2" />
                    <Select.Item label="Thrice" value="3" />
                    <Select.Item label="Four Times" value="4" />
                    <Select.Item label="Five" value="5" />
                </Select>
                {errors.dailyUsageNoOfTimes && <Text style={styles.errorText}>{errors.dailyUsageNoOfTimes}</Text>}
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}
            enableOnAndroid={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            // extraScrollHeight={50} 
            // extraHeight={130}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0 }}>
                    <Spinner
                        visible={spinner}
                    />
                    <HStack style={styles.header} space={2} alignItems={'center'}>
                        <TouchableOpacity>
                            <Ionicons name="chevron-back-outline" size={24} color={COLORS.primary}
                                onPress={navigation.goBack} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Add Medication</Text>
                    </HStack>
                    <View style={styles.innerContainers}>
                        <Text style={styles.label}>Name of Medication</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter Medication"
                                autoCapitalize="none"
                                nativeID="medicationName"
                                onChange={(value) => handleChangeInput('medicationName', value)}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#2A2A2A24"
                                value={medicationName}
                            />
                        </View>
                        <HStack justifyContent={'space-between'} alignItems={'center'} style={{ height: 18 }}>
                            {errors.medicationName && <Text style={styles.errorText}>{errors.medicationName}</Text>}
                        </HStack>
                    </View>

                    <VStack style={[styles.innerContainers]}>
                        <Text style={[styles.label, { fontWeight: '600' }]}>How many times daily</Text>
                        <DropdownUsageNoOfTimes />
                    </VStack>

                    <View style={styles.innerContainers}>
                        <View style={styles.timeContainer}>

                            {
                                dailyUsageNumberValue >= 1 && (<Text style={[styles.label, { fontWeight: '600' }]}>Usage Times</Text>)
                            }

                            {Array.from({ length: dailyUsageNumberValue }, (_, index) => (
                                <React.Fragment key={index}>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="9:00pm"
                                            nativeID={`usageTime_${index}`}
                                            onChange={(value) => handleChangeInput(`usageTime_${index}`, value, index)}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor="#2A2A2A24"
                                            value={extractTimeFromDate(usageTimes[index])}
                                            editable={false}
                                        />
                                        <TouchableOpacity onPress={() => showUsage(index)}>
                                            <AntDesign name="clockcircleo" size={16} color={'#2A2A2A'} />
                                        </TouchableOpacity>
                                    </View>
                                    <HStack justifyContent={'space-between'} alignItems={'center'} style={{ height: 18 }}>
                                        {errors.usageTime && <Text style={styles.errorText}>{errors.usageTime}</Text>}
                                    </HStack>

                                    {showUsageTime[index] && (
                                        <DateTimePicker
                                            key={index}
                                            value={time}
                                            mode='time'
                                            is24Hour={true}
                                            onChange={(event, date) => onChangeUsageTime(event, date, index)}
                                            display="clock"
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>

                    <View style={styles.innerContainers}>
                        <Text style={styles.label}>How many tablet per usage</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter tablets per usage"
                                autoCapitalize="none"
                                nativeID="tabletsPerUsage"
                                onChange={(value) => handleChangeInput('tabletsPerUsage', value)}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#2A2A2A24"
                                inputMode="numeric"
                                keyboardType="numeric"
                                value={tabletsPerUsage.toString()}
                            />
                        </View>
                        <HStack justifyContent={'space-between'} alignItems={'center'} style={{ height: 18 }}>
                            {errors.tabletsPerUsage && <Text style={styles.errorText}>{errors.tabletsPerUsage}</Text>}
                        </HStack>
                    </View>

                    <HStack style={[styles.innerContainers]} alignItems={'center'} justifyContent={'space-between'}>

                        <View style={styles.dateContainer}>
                            <Text style={[styles.label, { fontWeight: '600' }]}>Start Date</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="DD/MM/YYYY"
                                    nativeID="startDate"
                                    onChange={(value) => handleChangeInput('startDate', value)}
                                    style={styles.textInput}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#2A2A2A24"
                                    value={startDate?.toISOString().split('T')[0]}
                                    editable={false}
                                />
                                <TouchableOpacity onPress={showDatepickerStart}>
                                    <Ionicons name="today-outline" size={16} color={'#2A2A2A'} />
                                </TouchableOpacity>
                            </View>
                            <HStack justifyContent={'space-between'} alignItems={'flex-start'} style={{ height: 36 }}>
                                {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
                            </HStack>

                            {showPickerStartDate && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={startDate}
                                    mode='date'
                                    is24Hour={true}
                                    onChange={onChangeStartDate}
                                    minimumDate={startDate}
                                />
                            )}
                        </View>

                        <View style={styles.dateContainer}>
                            <Text style={[styles.label, { fontWeight: '600' }]}>End Date</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="DD/MM/YYYY"
                                    nativeID="endDate"
                                    onChange={(value) => handleChangeInput('endDate', value)}
                                    style={styles.textInput}
                                    underlineColorAndroid="transparent"
                                    placeholderTextColor="#2A2A2A24"
                                    value={endDate?.toISOString().split('T')[0]}
                                    editable={false}
                                />
                                <TouchableOpacity onPress={showDatepickerEnd}>
                                    <Ionicons name="today-outline" size={16} color={'#2A2A2A'} />
                                </TouchableOpacity>
                            </View>
                            <HStack justifyContent={'space-between'} alignItems={'flex-start'} style={{ height: 36 }}>
                                {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
                            </HStack>
                            
                            {showPickerEndDate && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={endDate}
                                    mode="date"
                                    is24Hour={true}
                                    onChange={onChangeEndDate}
                                    minimumDate={startDate}
                                />
                            )}
                        </View>
                    </HStack>

                    <View style={{ width: '100%', marginTop: 20 }}>
                        <TouchableOpacity style={styles.loginBtn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.loginBtnText}>{id ? 'Update' : 'Add'}</Text>
                        </TouchableOpacity>
                    </View>

                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: '100%',
        justifyContent: 'flex-start',
        backgroundColor: COLORS.white,
        paddingHorizontal: 20
    },
    innerContainers: {
        width: '100%',
        // borderWidth: 1,
        // borderColor: 'blue'
    },
    label: {
        marginBottom: 6,
        color: COLORS.gray2,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "600",
    },
    textInput: {
        fontSize: 14,
        flex: 1,
        color: 'black'
    },
    loginBtn: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: COLORS.primary,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    loginBtnText: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.white,
        fontWeight: '600'
    },
    alertTitleText: {
        fontSize: SIZES.medium,
        color: COLORS.white,
        fontFamily: FONT.bold,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "#2A2A2A24",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        width: '100%',
        paddingVertical: 8,
        height: 40
    },
    title: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: "600",
        color: COLORS.gray3,
        textAlign: "left"
    },
    header: {
        width: '100%',
        marginBottom: 20,
        marginTop: Platform.OS == "ios" ? 10 : 0
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'left',
    },
    dateContainer: {
        width: '48%'
    },
    timeContainer: {
        width: '100%',
        // borderWidth: 1,
        // borderColor: 'red',
    }
});