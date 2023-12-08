import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar, BackHandler } from "react-native";
import { Stack, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { COLORS, FONT, SIZES } from "../../constants";
import { validateEmail } from "../../utils";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface FormData {
    email: string;
}

interface ToastItem {
    title: string;
    variant: string;
    description: string;
    isClosable?: boolean;
}

interface Invites {
    email: string;
}

export default function AccountabilityPartners() {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const [check, setCheck] = useState(false)

    const [formData, setFormData] = useState<FormData>({ email: '' });

    const [spinner, setSpinner] = useState(false);

    const [invites, setInvites] = useState<string[]>([]);

    const { email } = formData;

    const [errors, setErrors] = useState({
        email: ''
    });

    const navigation = useNavigation();

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
            width="95%"
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
        const newErrors = { email: '' }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            validationPassed = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email format';
            validationPassed = false;
        }

        setErrors(newErrors);
        return validationPassed;
    };

    const handleSubmit = async () => {
        // if (validateInputs()) {
        //   setSpinner(true)
        //   const resp = await appSignIn(formData.email, formData.password);
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
        // }
    }

    const handleSendInvites = () => {
        if (validateInputs()) {
            const newInvite = formData.email;

            // Check if the invite already exists
            if (!invites.includes(newInvite)) {
                // Check if the maximum number of invites has been reached
                if (invites.length < 3) {
                    setInvites((prevInvites) => [...prevInvites, newInvite]);
                    setFormData({ ...formData, 'email': '' });
                } else {
                    toast.show({
                        placement: "top",
                        render: ({
                            id
                        }) => {
                            return <ToastAlert id={id} title={"Maximum Invitations Reached!"} variant={"solid"} description={"You can only send a maximum of 3 invitations."} duration={5000} status={"error"} isClosable={true} />;
                        }
                    });
                }
            } else {
                toast.show({
                    placement: "top",
                    render: ({
                        id
                    }) => {
                        return <ToastAlert id={id} title={"Invalid Invitation!"} variant={"solid"} description={"Invite already exists."} duration={5000} status={"error"} isClosable={true} />;
                    }
                });
            }
        }
    };


    const handleRemoveInvite = (indexToRemove: number) => {
        setInvites((prevInvites) => {
            const updatedInvites = [...prevInvites];
            updatedInvites.splice(indexToRemove, 1);
            return updatedInvites;
        });
    };

    useEffect(() => {
    }, [invites, formData.email]);

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
                    <View style={{ width: '100%', paddingVertical: 20 }}>
                        <Text style={styles.title}>Add an accountability partner(s)</Text>
                    </View>

                    <View style={styles.innerContainers}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Enter Email"
                                autoCapitalize="none"
                                nativeID="email"
                                onChange={(value) => handleChangeInput('email', value)}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                                value={formData.email}
                                inputMode="email"
                            />
                        </View>
                        <HStack alignItems={'center'} style={{ height: 18 }}>
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </HStack>
                        {/* <Input
                            placeholder="Enter Email"
                            autoCapitalize="none"
                            nativeID="email"
                            keyboardType="email-address"
                            onChange={(value) => handleChangeInput('email', value)}
                            containerStyle={styles.textInput}
                            inputContainerStyle={styles.inputContainer}
                            errorMessage={errors.email}
                            label="Email Address"
                            labelStyle={styles.label}
                            value={formData.email}
                        /> */}
                        <TouchableOpacity
                            style={{
                                marginRight: 10, position: 'absolute', bottom: 30, right: 0
                            }}

                            onPress={handleSendInvites}
                        >
                            <Text
                                style={{ color: COLORS.primary, fontWeight: '600', textDecorationLine: 'underline' }}
                            >Send Invite</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={[styles.innerContainers, { paddingHorizontal: 20 }]}>
                        {
                            (invites?.length > 0) && (
                                <VStack space={3} style={styles.inviteListContainer}>
                                    {invites?.map((item, index) =>
                                        <HStack key={index} alignItems="center" justifyContent="space-between">
                                            <Text>{item}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleRemoveInvite(index)}>
                                                <MaterialIcons
                                                    name="cancel"
                                                    size={20}
                                                    color={COLORS.primary}
                                                />
                                            </TouchableOpacity>
                                        </HStack>
                                    )}
                                </VStack>
                            )
                        }
                    </View>

                    <View style={{ width: '100%', marginTop: 10 }}>
                        {/* <Text style={{ color: '#2A2A2ACC', textAlign: 'center' }}>
                            Do not have an accountability partner?
                            <Text
                                style={{ color: '#2A2A2ACC', fontWeight: '600' }}
                            // onPress={() => {
                            //     router.push("");
                            // }}
                            > Find one</Text>
                        </Text> */}
                        <TouchableOpacity style={styles.loginBtn}
                            // onPress={handleSubmit}
                            onPress={() => {
                                router.push("/hospital");
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
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1
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
        color: COLORS.gray3,
        textAlign: "left",
        width: '85%'
    },
    inviteListContainer: {
        backgroundColor: COLORS.tertiary,
        borderRadius: 8,
        padding: 10,
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'left',
    }
});