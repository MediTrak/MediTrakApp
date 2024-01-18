import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, StatusBar, BackHandler, Pressable } from "react-native";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import { Stack, useNavigation, useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from "../../constants";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert, Icon } from 'native-base';
import { checkPasswordStrength, validateEmail } from "../../utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
// import { useAuth } from "../context/auth";
import { useAuth } from "../../context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";

interface FormData {
  password: string;
  confirmNewPassword: string;
}

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

export default function ResetPassword() {
  // const { signUp } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [showTwo, setShowTwo] = useState(false);
  const handleClickTwo = () => setShowTwo(!showTwo);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  const { onReset } = useAuth();

  const [formData, setFormData] = useState<FormData>({ password: '', confirmNewPassword: '' });

  const { password, confirmNewPassword } = formData;

  const [spinner, setSpinner] = useState(false);

  const [errors, setErrors] = useState({
    password: '',
    confirmNewPassword: '',
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


  const validateInputs = () => {
    let validationPassed = true;
    const newErrors = { password: '', confirmNewPassword: '' };

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      validationPassed = false;
    } else if (checkPasswordStrength(password) === 'Weak') {
      newErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character';
      validationPassed = false;
    }

    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'Password is required';
      validationPassed = false;
    } else if (confirmNewPassword !== password) {
      newErrors.confirmNewPassword = 'Passwords do not match. Please double-check';
      validationPassed = false;
    }

    setErrors(newErrors);
    return validationPassed;
  };


  const handleSubmit = async () => {

    if (validateInputs()) {
      setSpinner(true)
      const resp = await onReset!(password, confirmNewPassword);
      setSpinner(false)
      if (resp && !resp.error) {
        setLoading(true);
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Password Successfully Changed!"} variant={"solid"} description={"Your Password has been changed."} duration={10000} status={"success"} isClosable={true} />;
          }
        })

        router.replace("/login");
      } else {
        console.log(resp?.error)
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Error Resetting Password!"} variant={"solid"} description={resp?.error} duration={10000} status={"error"} isClosable={true} />;
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
            <Text style={styles.title}>Reset Password</Text>
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
              />
              <Pressable onPress={handleClick}>
                < Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} color="#2A2A2ACC" />
              </Pressable>
            </View>
            <HStack justifyContent={'space-between'} style={{ height: 18 }}>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </HStack>
          </View>

          <View style={styles.innerContainers}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm New Password"
                secureTextEntry={showTwo ? false : true}
                nativeID="confirmNewPassword"
                onChange={(value) => handleChangeInput('confirmNewPassword', value)}
                style={styles.textInput}
                underlineColorAndroid="transparent"
              />
              <Pressable onPress={handleClickTwo}>
                < Icon as={<MaterialIcons name={showTwo ? "visibility" : "visibility-off"} />} size={5} color="#2A2A2ACC" />
              </Pressable>
            </View>
            <HStack justifyContent={'space-between'} style={{ height: 18 }}>
              {errors.confirmNewPassword && <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>}
            </HStack>
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <TouchableOpacity
              style={styles.signBtn}
              onPress={handleSubmit}
            >
              <Text style={styles.signBtnText}>Reset Password</Text>
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
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  innerContainers: {
    width: '100%',
    // borderWidth: 1,
    // borderColor: 'blue',
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
  signBtn: {
    padding: 15,
    marginBottom: 8,
    backgroundColor: COLORS.primary,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  signBtnText: {
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