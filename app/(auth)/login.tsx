import { Text, View, TextInput, StyleSheet, TouchableOpacity, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StatusBar, BackHandler, Pressable } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { COLORS, FONT, SIZES } from "../../constants";
import { validateEmail } from "../../utils";
import { useToast, VStack, HStack, IconButton, CloseIcon, Alert, Icon } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/auth";
import { useDispatch } from 'react-redux'
import { setCredentials } from '../services/authSlice';
import { useLoginMutation } from "../services/mediTrakApi";
import type { LoginRequest } from '../services/mediTrakApi';
import { MaterialIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface FormData {
  email: string;
  password: string;
}

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const [params, setParams] = useState<FormData | null>(null);

  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });

  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation()

  const dispatch = useDispatch()

  const { onLogin, onForgot } = useAuth();

  const [spinner, setSpinner] = useState(false);

  const { email, password } = formData;

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // Alert.alert("Cannot go back from here. Sign in again")
      navigation.dispatch(e.data.action);
    });
  }, []);

  useEffect(() => {
    const handleBackPress = () => {
      BackHandler.exitApp();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []); // Empty dependency array means this effect runs once

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

  const validateEmailInput = () => {
    let validationPassed = true;
    const newErrors = { email: '', password: '' };

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

  const validateInputs = () => {
    let validationPassed = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      validationPassed = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
      validationPassed = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      validationPassed = false;
    }

    setErrors(newErrors);
    return validationPassed;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      const userParams: FormData = {
        email: formData.email,
        password: formData.password,
      };

      setParams(userParams)
      setSpinner(true)

      const resp = await onLogin!(email, password);
      const user = await login(formData).unwrap()

      dispatch(setCredentials(user))

      const userToken = resp.data["token"]

      setSpinner(false)
      if (resp && !resp.error) {
        router.push({ pathname: "/(tabs)/home", params: { resp: userToken } });
      } else {
        console.log(resp?.error)
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Incorrect Credentials!"} variant={"solid"} description={"Please enter correct password and email."} duration={10000} status={"error"} isClosable={true} />;
          }
        })
      }
    }
  }

  const handleSubmitForgotPassword = async () => {
    if (validateEmailInput()) {
      setSpinner(true)
      const resp = await onForgot!(email);
      setSpinner(false)
      if (resp && !resp.error) {
        router.push({ pathname: "/forgot-password", params: { email: email } });
      } else {
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
            <Text style={styles.title}>Log in</Text>
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
                inputMode="email"
                placeholderTextColor="#2A2A2A24"
              />
            </View>
            <HStack alignItems={'center'} style={{ height: 18 }}>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </HStack>
          </View>

          <View style={styles.innerContainers}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Password"
                secureTextEntry={show ? false : true}
                nativeID="password"
                onChange={(value) => handleChangeInput('password', value)}
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholderTextColor="#2A2A2A24"
              />
              <Pressable onPress={handleClick}>
                < Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} color="#2A2A2ACC" />
              </Pressable>
            </View>
            <HStack justifyContent={'space-between'}>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              <TouchableOpacity>
                <Text
                  style={{ color: '#2A2A2ACC', textAlign: 'right', fontWeight: '600', marginTop: 8 }}
                  onPress={handleSubmitForgotPassword}
                > Forgot Password?
                </Text>
              </TouchableOpacity>
            </HStack>

          </View>
          <View style={{ width: '100%', marginTop: 40 }}>
            <TouchableOpacity style={styles.loginBtn}
              onPress={handleSubmit}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.loginBtn, { backgroundColor: '#18305914' }]}
              onPress={() => {
                // router.push("/create-account");
                router.push("/add-evidence");
              }}
            >
              <Text style={[styles.loginBtnText, { color: COLORS.primary }]}>Create An Account</Text>
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
    color: COLORS.gray3,
    textAlign: "left"
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'left',
  }
});