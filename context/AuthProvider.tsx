import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from "expo-router";
import { useDispatch } from 'react-redux';
import { setCredentials } from '../app/services/authSlice';
import { MMKV } from 'react-native-mmkv';


interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  __v?: number;
  confirmationTokenExpiry?: string;
  confirmed?: boolean;
  hospital?: {
    name: string;
  };
  password?: string;
  role?: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null; user: User | null | undefined };
  onRegister?: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
  onConfirm?: (confirmationToken: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onForgot?: (email: string) => Promise<any>;
  onReset?: (newPassword: string, confirmPassword: string) => Promise<any>;
  user?: User | null | undefined;
  setUser?: (user: User | null) => void;
  isLoggedIn?: boolean;
  initialized?: boolean;
  onAddMedication?: (name: string, timesDaily: number, timeToTake: string[], dosage: string, fromWhen: string, tillWhen: string, user: string) => Promise<any>;
  onGetMedications?: () => Promise<any>;
  onEditMedication?: (name: string, timesDaily: number, timeToTake: string[], dosage: string, fromWhen: string, tillWhen: string, id: string) => Promise<any>;
  onDeleteMedication?: (id: string) => Promise<any>;
  onConfirmForgot?: (resetToken: string) => Promise<any>;
  onAcceptMedication?: (id: string) => Promise<any>;
}

const TOKEN_KEY = 'user-token';
const USER = "user-info";
export const API_URL = 'https://meditrak.onrender.com';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    user: User | null;
  }>({
    token: null,
    authenticated: false,
    user: null
  });

  // console.log(authState, 'see authState in context outside useEffect')

  useEffect(() => {
    const loadToken = async () => {
      try {
        const userToken = await SecureStore.getItemAsync(TOKEN_KEY)
        const userInfo = await SecureStore.getItemAsync(USER)

        // console.log(userInfo, 'user info secure store auth file')
        // console.log(userToken, 'token from secure store auth file')

        if (userToken && userInfo) {
          const storedUserInfo = JSON.parse(userInfo);
          setAuthState({
            token: userToken,
            authenticated: true,
            user: {
              firstName: storedUserInfo?.firstName,
              lastName: storedUserInfo?.lastName,
              email: storedUserInfo?.email,
              confirmed: storedUserInfo?.confirmed,
              id: storedUserInfo?.id
            }
          })

          const userLogin: UserResponse = {
            user: {
              ...storedUserInfo,
            },
            token: userToken
          }

          dispatch(setCredentials(userLogin))

        } else {
          setAuthState({
            token: null,
            authenticated: false,
            user: null
          })
        }

      } catch (error) {
        console.error("Error fetching token or user info:", error);
      }
    }
    loadToken();
  }, [])


  function useProtectedRoute(user: any) {
    const segments = useSegments();
    // const router = useRouter();

    useEffect(() => {
      const inAuthGroup = segments[0] === "(auth)";

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace("/onboardingScreen");
      } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace("/home");
      }
    }, [user, segments]);
  }

  useProtectedRoute(authState.user);

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {

      const result = await axios.post(`${API_URL}/api/create_account`, { firstName, lastName, email, password });

      return { data: result.data, error: false };
    } catch (e) {
      return { error: true, msg: (e as any) };
    }
  };

  const confirmRegistration = async (confirmationToken: string) => {
    try {

      const result = await axios.post(`${API_URL}/api/confirm_account`, { confirmationToken });

      // console.log(result.data, 'result after registration')

      // console.log(result?.data.token, 'token from  register result')

      setAuthState({
        token: result?.data.token,
        authenticated: true,
        user: {
          firstName: result?.data.user.firstName,
          lastName: result?.data.user.lastName,
          email: result?.data.user.email,
          confirmed: result?.data.user.confirmed,
          id: result?.data.user._id
        }
      })

      const token = result?.data.token

      const userObject: User = {
        firstName: result?.data.user.firstName,
        lastName: result?.data.user.lastName,
        email: result?.data.user.email,
        confirmed: result?.data.user.confirmed,
        id: result?.data.user._id
      };

      const userLogin: UserResponse = {
        user: {
          ...userObject,
        },
        token: token
      }

      dispatch(setCredentials(userLogin))

      const userObjectString = JSON.stringify(userObject);

      axios.defaults.headers.common['Authorization'] = `Bearer ${result?.data.token}`

      await SecureStore.setItemAsync(TOKEN_KEY, token)

      await SecureStore.setItemAsync(USER, userObjectString);

      return { data: result.data, error: false }

    } catch (e) {
      return { error: true, msg: (e as any) }
    }
  }

  const login = async (email: string, password: string) => {
    try {

      const result = await axios.post(`${API_URL}/api/login`, { email, password });

      setAuthState({
        token: result?.data.token,
        authenticated: true,
        user: {
          firstName: result?.data.user.firstName,
          lastName: result?.data.user.lastName,
          email: result?.data.user.email,
          id: result?.data.user._id
        }
      })

      const token = result?.data.token

      const userObject: User = {
        firstName: result?.data.user.firstName,
        lastName: result?.data.user.lastName,
        email: result?.data.user.email,
        confirmed: result?.data.user.confirmed,
        id: result?.data.user._id
      };

      const userLogin: UserResponse = {
        user: {
          ...userObject,
        },
        token: token
      }

      dispatch(setCredentials(userLogin))

      const userObjectString = JSON.stringify(userObject);

      axios.defaults.headers.common['Authorization'] = `Bearer ${result?.data.token}`

      await SecureStore.setItemAsync(TOKEN_KEY, token)

      await SecureStore.setItemAsync(USER, userObjectString);

      return { data: result.data, error: false }

    } catch (error) {
      return { error: true, msg: (error as any) }
    }
  }

  const logout = async (): Promise<{ user?: null; error?: any }> => {

    try {

      // await axios.post(`${API_URL}/api/logout`);

      await SecureStore.deleteItemAsync(TOKEN_KEY);

      await SecureStore.deleteItemAsync(USER);

      axios.defaults.headers.common['Authorization'] = '';

      setAuthState({
        token: null,
        authenticated: false,
        user: null
      });

      return { user: null, error: null };
    } catch (e) {
      return { user: null, error: e }
    }

  };

  const forgotPassword = async (email: string) => {
    try {

      const result = await axios.post(`${API_URL}/api/forgot_password`, { email });

      return { data: result.data, error: false };
    } catch (e) {
      console.error(e, 'error requesting forgot password token');
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }
  };

  const resetPassword = async (newPassword: string, confirmPassword: string) => {
    try {

      const result = await axios.post(`${API_URL}/api/reset_password`, { newPassword, confirmPassword });

      return { data: result.data, error: false };
    } catch (e) {
      console.error(e, 'error resetting password');
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }
  };

  const addMedication = async (name: string, timesDaily: number, timeToTake: string[], dosage: string, fromWhen: string, tillWhen: string, user: string) => {

    const userToken = await SecureStore.getItemAsync(TOKEN_KEY);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    };

    try {

      const result = await axios.post(`${API_URL}/api/medication/add`, { name, timesDaily, timeToTake, dosage, fromWhen, tillWhen, user }, config);

      return { data: result.data, error: false };
    } catch (e) {
      console.error(e, 'error creating medication');
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }

  };

  const confirmForgotPassword = async (resetToken: string) => {
    try {

      const result = await axios.post(`${API_URL}/api/confirm_forgot_password`, { resetToken })

      return { data: result.data, error: false }

    } catch (e) {
      return { error: true, msg: (e as any) }
    }
  }

  const editMedication = async (name: string, timesDaily: number, timeToTake: string[], dosage: string, fromWhen: string, tillWhen: string, id: string) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      }
    };

    try {

      const result = await axios.put(`${API_URL}/api/medication/${id}/edit`, { name, timesDaily, timeToTake, dosage, fromWhen, tillWhen }, config);

      return { data: result.data, error: false };
    } catch (e) {
      console.error(e, 'error edit medication');
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }

  };

  const deleteMedication = async (id: string) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      }
    };

    try {

      const result = await axios.delete(`${API_URL}/api/medication/${id}/delete`, config);

      return { data: result.data, error: false };
    } catch (e) {
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }

  };

  const acceptMedication = async (id: string) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      }
    };

    try {

      const result = await axios.get(`${API_URL}/api/medication/${id}/accept-reminder`, config);

      return { data: result.data, error: false };
    } catch (e) {
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }

  };

  const getMedications = async () => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      }
    };

    try {

      const result = await axios.get(`${API_URL}/api/medication`, config);

      return { data: result.data, error: false };
    } catch (e) {
      return { error: true, msg: (e as any) || 'Unknown error occurred' };
    }

  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onConfirm: confirmRegistration,
    onForgot: forgotPassword,
    onReset: resetPassword,
    authState,
    user: authState.user,
    onAddMedication: addMedication,
    onGetMedication: getMedications,
    onEditMedication: editMedication,
    onDeleteMedication: deleteMedication,
    onConfirmForgot: confirmForgotPassword,
    onAcceptMedication: acceptMedication,
    setAuthState
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}