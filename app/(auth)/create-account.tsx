import { Text, View, TextInput, StyleSheet, TouchableOpacity, Image, NativeSyntheticEvent, TextInputChangeEventData, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, StatusBar, BackHandler, Pressable } from "react-native";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import { Stack, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { COLORS, FONT, SIZES } from "../../constants";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert, Icon } from 'native-base';
import { checkPasswordStrength, validateEmail } from "../../utils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAuth } from "../context/auth";
import { MaterialIcons } from "@expo/vector-icons";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

export default function CreateAccount() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [showTwo, setShowTwo] = useState(false);
  const handleClickTwo = () => setShowTwo(!showTwo);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();

  // const [params, setParams] = useState<FormData | null>(null);

  const [formData, setFormData] = useState<FormData>({ firstName: '', lastName: '', email: '', password: '' });

  const { firstName, lastName, email, password } = formData;

  // const { data: user, error, status, isFetching, refetch } = useCreateUserQuery(params);

  const { onRegister } = useAuth();

  const [spinner, setSpinner] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    const newErrors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      validationPassed = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      validationPassed = false;
    }

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
    } else if (checkPasswordStrength(password) === 'Weak') {
      newErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character';
      validationPassed = false;
    }

    setErrors(newErrors);
    return validationPassed;
  };


  const handleSubmit = async () => {

    if (validateInputs()) {

      const userParams: FormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      // setParams(userParams)

      console.log(userParams, 'user -params')


      setSpinner(true)
      const result = await onRegister!(userParams.firstName, userParams.lastName, userParams.email, userParams.password)
      setSpinner(false)
      if (result && !result.error) {
        setLoading(true);
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Account Created!"} variant={"solid"} description={"Your Account has been created."} duration={10000} status={"success"} isClosable={true} />;
          }
        })

        router.push({ pathname: "/confirm-email-address", params: { email: email } });

      } else {
        toast.show({
          placement: "top",
          render: ({
            id
          }) => {
            return <ToastAlert id={id} title={"Error Creating Account!"} variant={"solid"} description={result?.msg} duration={10000} status={"error"} isClosable={true} />;
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
            <Text style={styles.title}>Create an account</Text>
          </View>
          <View style={styles.innerContainers}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter First Name"
                autoCapitalize="words"
                nativeID="firstName"
                onChange={(value) => handleChangeInput('firstName', value)}
                style={styles.textInput}
                underlineColorAndroid="transparent"
              />
            </View>
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ height: 18 }}>
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </HStack>
          </View>
          <View style={styles.innerContainers}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter Last Name"
                autoCapitalize="words"
                nativeID="lastName"
                onChange={(value) => handleChangeInput('lastName', value)}
                style={styles.textInput}
                underlineColorAndroid="transparent"
              />
            </View>
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ height: 18 }}>
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </HStack>
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
              />
            </View>
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ height: 18 }}>
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
              />
              <Pressable onPress={handleClick}>
                < Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} color="#2A2A2ACC" />
              </Pressable>
            </View>
            <HStack justifyContent={'space-between'} style={{ height: 18 }}>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </HStack>
            <Text style={{ color: '#2A2A2ACC' }}>
              By creating an account, you agree to the
              <Text
                style={{ color: '#2A2A2ACC', fontWeight: '600' }}
              > Terms of service</Text>
              and
              <Text
                style={{ color: '#2A2A2ACC', fontWeight: '600' }}
              > Privacy policy.</Text>
            </Text>
          </View>

          <View style={{ width: '100%', marginTop: 20 }}>
            <TouchableOpacity
              style={styles.signBtn}
              onPress={handleSubmit}
            >
              <Text style={styles.signBtnText}>Create An Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signBtn, { backgroundColor: '#18305914' }]}
              onPress={() => {
                router.push("/login");
              }}
            >
              <Text style={[styles.signBtnText, { color: '#2A2A2ACC' }]}>Log In</Text>
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
    backgroundColor: COLORS.white,
    paddingHorizontal: 20
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
    width: '100%',
    paddingHorizontal: 20,
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
