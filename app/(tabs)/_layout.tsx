import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Ionicons, AntDesign, Octicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { COLORS, FONT, SIZES } from "../../constants";
import { Pressable, useColorScheme } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Dimensions, View } from 'react-native';

// import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  solid?: boolean;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const { width, height } = Dimensions.get("window")

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 10, marginBottom: 5, marginTop: 0},
          tabBarIcon: ({ color }) => <AntDesign name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarLabel: 'Planner',
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 10, marginBottom: 5, marginTop: 0},
          tabBarIcon: ({ color }) => <Ionicons name="today-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="socials"
        options={{
          title: 'Socials',
          tabBarLabel: 'Socials',
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 10, marginBottom: 5, marginTop: 0},
          tabBarIcon: ({ color }) => <Octicons name="smiley" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 10, marginBottom: 5, marginTop: 0},
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={20} color={color} />,
        }}
      />
    </Tabs>
);
}
