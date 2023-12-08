import { StatusBar, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack, useRouter } from "expo-router";
import Header from '../../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from "../../../constants";
import AvatarBtn from '../../../components/Avatar/avatar';
import { useAuth } from '../../context/auth';
import { avatarLetters } from '../../../utils';
import { Feather, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function Settings() {

  const { onLogout, user } = useAuth();

  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const email = user?.email;

  const avatar = firstName + ' ' + lastName

  const letterAvatar = avatarLetters(avatar)

  const router = useRouter();

  useEffect(() => { },[user])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Settings" }} />
      <Header headerTitle='Settings' />
      <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>

        <View style={styles.avatarContainer}>
          <AvatarBtn avatar={letterAvatar} />
          <Text style={styles.nameText}>{lastName} {firstName}</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.cardsWrapper}>

          <View style={styles.card}>
            <TouchableOpacity style={styles.pressable}>
              <Image
                source={require('../../../assets/images/profile.png')}
                fadeDuration={0}
                style={{ width: 20, height: 20, marginRight: 16 }}
              />
              <Text style={styles.titleText}>My Profile</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.pressable}>
              <Image
                source={require('../../../assets/images/accountSettings.png')}
                fadeDuration={0}
                style={{ width: 20, height: 20, marginRight: 16 }}
              />
              <Text style={styles.titleText}>Account Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.pressable}>
              <Image
                source={require('../../../assets/images/share.png')}
                fadeDuration={0}
                style={{ width: 20, height: 20, marginRight: 16 }}
              />
              <Text style={styles.titleText}>Share</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.pressable}>
              <Feather name='help-circle' size={20} style={{ marginRight: 16 }} />
              <Text style={styles.titleText}>Help</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.pressable}>
              <SimpleLineIcons name='lock' size={20} style={{ marginRight: 16 }} />
              <Text style={styles.titleText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.pressable}>
              <MaterialCommunityIcons name='account-sync-outline' size={20} style={{ marginRight: 16 }} />
              <Text style={styles.titleText}>Add Account</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.pressable} onPress={async () => {
              const resp = await onLogout?.();
              if (resp && !resp.error) {
                router.push("/login");
              } else {
              }
            }}>
              <Image
                source={require('../../../assets/images/logout.png')}
                fadeDuration={0}
                style={{ width: 20, height: 20, marginRight: 16 }}
              />
              <Text style={styles.titleText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  nameText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    color: COLORS.gray3,
    marginTop: 5,
  },

  emailText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    color: COLORS.gray2
  },

  cardsWrapper: {
    // borderColor: 'red',
    // borderWidth: 1,
    flex: 1,
    width: '100%',
    // justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
    gap: 20
  },

  titleText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.gray3,
    fontWeight: '600'
  },

  divider: {
    width: '100%',
    borderColor: '#2A2A2A12',
    borderWidth: 1,
    marginVertical: 10
  },

  card: {
    borderColor: '#2A2A2A12',
    borderWidth: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    padding: 10
  },

  pressable: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
