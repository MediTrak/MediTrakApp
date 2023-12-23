import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { WebinarCard, RegisteredWebinarCard } from "../WebinarCard";

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
                renderItem={({ item, index }) => (
                    <RegisteredWebinarCard
                        img={item.image}
                        title={item.title}
                        time={item.time}
                        handleCardPress={handleCardPress}
                        selectedWebinar={selectedWebinar}
                        webinarType={item.webinarType}
                        date={"22nd Dec"}
                        daysLeft={"2 days left"}
                        backgroundColor={index % 2 === 1 ? "#DB520229" : "#6C656429"}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ columnGap: 12 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <FlatList
                data={newData}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                columnWrapperStyle={{ gap: 10 }}
                ListHeaderComponent={() => (
                    <Text style={{
                        fontSize: 14, fontWeight: '600', color: "#2a2a2a",
                        textAlign: "left", marginBottom: 10, marginTop: 20
                    }}>
                        Older
                    </Text>
                )}
                renderItem={({ item }) => (
                    <WebinarCard
                        img={item.image}
                        title={item.title}
                        time={item.time}
                        handleCardPress={handleCardPress}
                        selectedWebinar={selectedWebinar}
                        webinarType={item.webinarType}
                    />
                )}
                scrollEnabled={false}
            />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
});

export default Webinars;