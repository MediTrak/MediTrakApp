import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants';
import Header from '../../../components/Header';


export default function Socials() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Socials" }} />
      <Header headerTitle='Socials' />
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});
