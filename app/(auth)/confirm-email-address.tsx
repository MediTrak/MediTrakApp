import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar, BackHandler } from "react-native";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { COLORS, FONT, SIZES } from "../../constants";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedCodeField from "../../components/CodeField";
import { useAuth } from "../context/auth";
interface FormData {
    token: string;
}

interface ToastItem {
    title: string;
    variant: string;
    description: string;
    isClosable?: boolean;
}

export default function ConfirmEmailAddress() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { email } = useLocalSearchParams();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();

    const [formData, setFormData] = useState<FormData>({ token: '' });

    const { onConfirm } = useAuth();

    const [spinner, setSpinner] = useState(false);

    const [errors, setErrors] = useState({
        token: '',
    });

    const { token } = formData;

    const navigation = useNavigation();

    // useEffect(() => {
    //     navigation.addListener('beforeRemove', (e) => {
    //         e.preventDefault();
    //         // Alert.alert("Cannot go back from here. Sign in again")
    //         navigation.dispatch(e.data.action);
    //     });
    // }, []);

    useEffect(() => {
        const handleBackPress = () => {
            navigation.goBack()
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []); // Empty dependency array means this effect runs once

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
        const newErrors = { token: '' }

        if (!token.trim()) {
            newErrors.token = 'Token is required';
            validationPassed = false;
        } else if (token.length !== 6) {
            console.log(token.length, 'length')
            newErrors.token = 'Token is not valid';
        }

        setErrors(newErrors);
        return validationPassed;
    };

    const handleSubmit = async () => {
        if (validateInputs()) {
            setSpinner(true)

            console.log(token, 'value in confirm email component')

            const resp = await onConfirm!(token);
            setSpinner(false)
            if (resp && !resp.error) {
                // router.push("/create-account-loader");

                router.push({ pathname: "/create-account-loader", params: resp });
            } else {
                console.log(resp?.error)
                toast.show({
                    placement: "top",
                    render: ({
                        id
                    }) => {
                        return <ToastAlert id={id} title={"Incorrect Credentials!"} variant={"solid"} description={resp?.msg} duration={10000} status={"error"} isClosable={true} />;
                    }
                })
            }
        }
    }

    const handleCodeFieldValueChange = (codeValue: string) => {
        // Do something with the updated value in the parent component
        setFormData({ ...formData, 'token': codeValue });
        setErrors(prevErrors => ({ ...prevErrors, 'token': '' }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0 }}>
                    <Spinner
                        visible={spinner}
                    />
                    <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 20 }}>
                        <Text style={styles.title}>Confirm Email Address</Text>
                    </View>

                    <View style={styles.innerContainers}>
                        <Text
                            style={{ color: '#2A2A2ACC', textAlign: 'left', fontWeight: '600', fontSize: 14, paddingHorizontal: 20, marginBottom: 20 }}
                        > A token has been sent to {email}.
                        </Text>
                        <AnimatedCodeField onValueChange={handleCodeFieldValueChange} />
                        {errors.token && <Text style={styles.errorText}>{errors.token}</Text>}
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                        <TouchableOpacity style={styles.loginBtn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.loginBtnText}>Confirm</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#2A2A2ACC', textAlign: 'center' }}>
                            Did not receive link?
                            <Text
                                style={{ color: '#2A2A2ACC', fontWeight: '600' }}
                            > Resend</Text>
                        </Text>
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainers: {
        width: '100%',
        // borderWidth: 1,
        // borderColor: 'blue'
    },
    label: {
        marginBottom: 4,
        color: COLORS.gray2,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "600",
    },
    textInput: {
        fontSize: 14,
        width: '100%',
        paddingHorizontal: 20,
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
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        // paddingVertical: 2,
        width: '100%'
    },
    title: {
        fontSize: 24,
        lineHeight: 36,
        fontWeight: "600",
        color: COLORS.gray2,
        textAlign: "left"
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'left',
        paddingHorizontal: 20
    }
});