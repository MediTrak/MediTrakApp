import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
// import { Input, Icon, CheckBox } from '@rneui/themed';
import { COLORS, FONT, SIZES } from "../../constants";
import { useToast, VStack, HStack, IconButton, CloseIcon, Alert, Select, CheckIcon, Checkbox } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from "react-native-safe-area-context";
import { hospitalNames } from "../../utils";

interface FormData {
    hospital: string;
}

interface ToastItem {
    title: string;
    variant: string;
    description: string;
    isClosable?: boolean;
}

export default function Hospital() {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const [showDoneButton, setShowDoneButton] = useState(false);

    const handleClick = () => setShow(!show);
    const toast = useToast();
    const [check, setCheck] = useState(false)

    const [formData, setFormData] = useState<FormData>({ hospital: '' });

    const [spinner, setSpinner] = useState(false);

    const { hospital } = formData;

    const [errors, setErrors] = useState({
        hospital: ''
    });

    const navigation = useNavigation();

    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleValueChange = (value: string) => {
        if (value === selectedValue) {
            // If the same value is clicked again, unselect it
            setSelectedValue('');
            setFormData({ ...formData, 'hospital': '' });
            setErrors(prevErrors => ({ ...prevErrors, 'hospital': 'Hospital is required' }));
        } else {
            // If a different value is selected, update the state
            setSelectedValue(value);
            setFormData({ ...formData, 'hospital': value });
            setErrors(prevErrors => ({ ...prevErrors, 'hospital': '' }));
        }
    };

    const handleChangeInput = (name: string, e: NativeSyntheticEvent<TextInputChangeEventData>) => {
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

    const validateInputs = () => {
        let validationPassed = true;
        const newErrors = { hospital: '' }

        if (!hospital.trim()) {
            newErrors.hospital = 'Hospital is required';
            validationPassed = false;
        }

        setErrors(newErrors);
        return validationPassed;
    };

    const handleSubmit = async () => {
        if (validateInputs()) {
            //   setSpinner(true)
            //   const resp = await appSignIn(formData.hospital);
            //   setSpinner(false)
            //   if (resp?.user) {
            //     router.replace("/");
            //   } else {
            //     console.log(resp?.error)
            //     toast.show({
            //       placement: "top",
            //       render: ({
            //         id
            //       }) => {
            //         return <ToastAlert id={id} title={"Incorrect Credentials!"} variant={"solid"} description={"Please enter correct Token."} duration={10000} status={"error"} isClosable={true} />;
            //       }
            //     })
            //   }
        }
    }

    const HospitalDropdown = () => {
        return (
            <View style={[styles.textInput, { marginBottom: 10 }]}>
                <Select
                    minWidth="200"
                    height="10"
                    accessibilityLabel="Choose Hospital"
                    placeholder="Choose Hospital"
                    onValueChange={handleValueChange}
                    borderRadius={8}
                    // onValueChange={itemValue => setSelectedValue(itemValue)}
                    selectedValue={selectedValue}
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />
                    }}
                    mt="1"
                    mb="1"
                >
                    {hospitalNames.map((hospital, index) => (
                        <Select.Item key={index} label={hospital.label} value={hospital.value} />
                    ))}
                </Select>
                {errors.hospital && <Text style={styles.errorText}>{errors.hospital}</Text>}
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0 }}>
                    <Spinner
                        visible={spinner}
                    />
                    <View style={{ width: '100%', paddingVertical: 20 }}>
                        <Text style={styles.title}>What is the name of your hospital?</Text>
                    </View>

                    <View style={styles.innerContainers}>
                        <Text
                            style={{ color: '#2A2A2ACC', textAlign: 'left', fontWeight: '600', fontSize: 14, marginBottom: 20 }}
                        >We need this to send reports to your hospital for easy monitoring.
                        </Text>

                        {
                            check && (
                                <VStack>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter Hospital Name"
                                            nativeID="hospital"
                                            onChange={(value) => handleChangeInput('hospital', value)}
                                            style={styles.textInput}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor="#2A2A2A24"
                                        />
                                    </View>
                                    <HStack alignItems={'center'} style={{ height: 18 }}>
                                        {errors.hospital && <Text style={styles.errorText}>{errors.hospital}</Text>}
                                    </HStack>
                                </VStack>


                            )
                        }

                        {
                            !check && (
                                <View style={{ marginBottom: 40 }}>
                                    <HospitalDropdown />
                                </View>
                            )
                        }

                        {/* <CheckBox
                            title="Cannot find hospital, enter manually for verification."
                            checked={check}
                            onPress={() => setCheck(!check)}
                            containerStyle={{
                                // borderWidth: 1,
                                // borderColor: 'red',
                                backgroundColor: 'transparent',
                                paddingVertical: 0
                            }}
                            checkedColor={COLORS.primary}
                        /> */}

                        <HStack>
                            <Checkbox
                                shadow={2}
                                accessibilityLabel="Cannot find hospital, enter manually for verification."
                                value={""}
                                bgColor={"white"}
                                borderColor={"#2A2A2ACC"}
                                // colorScheme={"#183059"}
                                _checked={{ backgroundColor: "#183059", borderColor: "transparent" }}
                                _pressed={{ borderColor: "transparent" }}
                                onChange={() => setCheck(!check)}>
                                Cannot find hospital, enter manually for verification.
                            </Checkbox>
                        </HStack>

                    </View>

                    <View style={{ width: '100%', marginTop: 10 }}>
                        <TouchableOpacity style={styles.loginBtn}
                            // onPress={handleSubmit}
                            onPress={() => {
                                router.push("/notification-sent");
                            }}
                        >
                            <Text style={styles.loginBtnText}>Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.loginBtn, { backgroundColor: COLORS.white }]}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <Text style={[styles.loginBtnText, { color: COLORS.primary }]}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
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
        fontSize: 24,
        lineHeight: 36,
        fontWeight: "600",
        color: COLORS.gray2,
        textAlign: "left",
        width: '70%'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'left'
    }
});