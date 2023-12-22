import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { WebinarCard } from "../WebinarCard";

const newData = [
    {
        id: '1',
        image: require('../../assets/images/webinar1.png'),
        title: 'Hack the future with Dr. Fiona',
        time: '3:00 pm (WAT)',
        webinarType: 'Online',
    },
    {
        id: '2',
        image: require('../../assets/images/webinar2.png'),
        title: 'Hack the future with Dr. Fiona',
        time: '3:00 pm (WAT)',
        webinarType: 'Online',
    },
    {
        id: '3',
        image: require('../../assets/images/webinar3.png'),
        title: 'Hack the future with Dr. Fiona',
        time: '3:00 pm (WAT)',
        webinarType: 'Online',
    },
    {
        id: '4',
        image: require('../../assets/images/webinar4.png'),
        title: 'Hack the future with Dr. Fiona',
        time: '3:00 pm (WAT)',
        webinarType: 'Online',
    },
    {
        id: '5',
        image: require('../../assets/images/webinar5.png'),
        title: 'Hack the future with Dr. Fiona',
        time: '3:00 pm (WAT)',
        webinarType: 'Online',
    },
    {
        id: '6',
        image: require('../../assets/images/webinar6.png'),
        title: 'Hack the future with Dr. Fiona',
        time: '3:00 pm (WAT)',
        webinarType: 'Online',
    },
];

const Webinars = () => {
    const router = useRouter();

    const [selectedWebinar, setSelectedWebinar] = useState('');

    const handleCardPress = (item: any) => {
        // router.push(`/socials/webinars/${item.id}`) // route to be implemented
        // setSelectedWebinar(item.id);
        console.log('Card Pressed')
    };

    return (
        <View style={styles.container}>

            <FlatList
                data={newData}
                renderItem={({ item }) => (
                    <WebinarCard
                        img={item.image}
                        title={item.title}
                        time={item.time}
                        handleCardPress={handleCardPress}
                        selectedWebinar={selectedWebinar}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ columnGap: 12 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <View style={{ flex: 1, width: '100%' }}>

            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
});

export default Webinars;