import { Text, View, StyleSheet, Image, TouchableOpacity, BackHandler } from "react-native";
import { COLORS } from "../../constants";
import { HStack } from 'native-base';
import { Ionicons, AntDesign, Octicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";

interface ScreenHeaderProps {
    user?: string | undefined;
    notificationCount?: number;
    headerTitle?: string;
}


const Header: React.FC<ScreenHeaderProps> = ({ user, notificationCount, headerTitle }) => {

    const router = useRouter();
    // const navigation = useNavigation();

    // // Effect
    // useEffect(() => {
    //     navigation.addListener('beforeRemove', (e) => {
    //         e.preventDefault();
    //         // Alert.alert("Cannot go back from here. Sign in again")
    //         navigation.dispatch(e.data.action);
    //     });
    // }, []);

    // useEffect(() => {
    //     const handleBackPress = () => {
    //         BackHandler.exitApp();
    //         return true;
    //     };

    //     BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    //     return () => {
    //         BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    //     };
    // }, []); // Empty dependency array means this effect runs once

    return (
        <HStack style={styles.header} alignItems="center" justifyContent="space-between">

            {
                user && (
                    <HStack space={1} alignItems="center">
                        <Text style={styles.headerText}>Hello <Text style={{ color: '#FFFFFFC9' }}>{user} </Text></Text>
                        <Image
                            source={require('../../assets/images/Emoji.png')}
                            fadeDuration={0}
                            style={{ width: 20, height: 19 }}
                        />
                    </HStack>
                )
            }


            {
                !user && (
                    <HStack space={1} alignItems="center">
                        <Text style={styles.headerText}>{headerTitle}</Text>
                    </HStack>
                )
            }

            <HStack space={5} alignItems="center">
                <TouchableOpacity>
                    <AntDesign name="search1" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="today-outline" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </HStack>
        </HStack>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 8
    },

    headerText: {
        fontSize: 24,
        lineHeight: 36,
        fontWeight: "600",
        color: COLORS.white,
        textAlign: "left"
    }
})


export default Header;