import { Center, HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity, ImageSourcePropType, ViewStyle, Dimensions } from 'react-native';
import { COLORS, SHADOWS } from "../../constants";
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

type WebinarCardProps = {
    img: ImageSourcePropType;
    title: string | undefined;
    time: string | undefined;
    item?: any | undefined;
    handleCardPress: (item: any) => void;
    selectedWebinar?: string;
    webinarType?: string | undefined;
    date?: any;
    daysLeft?: string | undefined;
    backgroundColor?: string | undefined;
};


const { width, height } = Dimensions.get("window")

const RegisteredWebinarCard: React.FunctionComponent<WebinarCardProps> = ({ img, title, time, item, handleCardPress, selectedWebinar, webinarType, date, daysLeft, backgroundColor }) => {
    return (
        <View style={{ width: width * 0.55 }}>
            <HStack justifyContent={'space-between'} style={[styles.header, { backgroundColor: backgroundColor }]}>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.dateText}>{daysLeft}</Text>
            </HStack>
            <TouchableOpacity
                onPress={() => handleCardPress(item)}>
                <VStack style={styles.registeredContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={img}
                            style={styles.image}
                        />
                    </View>

                    <Text style={styles.titleText}>{title}</Text>

                    <HStack alignItems={'center'}>
                        <AntDesign name="clockcircleo" size={14} color={COLORS.gray2} />
                        <Text style={styles.timeText}>{time}</Text>
                    </HStack>

                    <HStack alignItems={'center'}>
                        <Feather name="map-pin" size={14} color={COLORS.gray2} />
                        <Text style={styles.timeText}>{webinarType}</Text>
                    </HStack>

                </VStack>
            </TouchableOpacity>
        </View>

    )
}

const WebinarCard: React.FunctionComponent<WebinarCardProps> = ({ img, title, time, item, handleCardPress, selectedWebinar, webinarType }) => {
    return (
        <TouchableOpacity
            onPress={() => handleCardPress(item)}>
            <VStack style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={img}
                        style={styles.image}
                    />
                </View>

                <Text style={styles.titleText}>{title}</Text>

                <HStack>
                    <AntDesign name="clockcircleo" size={14} color={COLORS.gray2} />
                    <Text style={styles.timeText}>{time}</Text>
                </HStack>

                <HStack>
                    <Feather name="map-pin" size={14} color={COLORS.gray2} />
                    <Text style={styles.timeText}>{webinarType}</Text>
                </HStack>

            </VStack>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.43,
        marginBottom: 12,
        gap: 8
    },

    registeredContainer: {
        gap: 8
    },

    imageContainer: {
        width: "100%",
        height: 120,
    },

    image: {
        width: '100%',
        objectFit: 'fill',
        flex: 1,
        borderRadius: 4
    },

    titleText: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: "OpenSans-SemiBold",
        color: COLORS.gray3,
        textAlign: "left",
    },

    timeText: {
        fontSize: 10,
        fontFamily: "OpenSans-Regular",
        color: COLORS.gray2,
        marginLeft: 4
    },

    header: {
        marginBottom: 4,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4
    },

    dateText: {
        fontSize: 10,
        fontWeight: "600",
        fontFamily: "OpenSans-SemiBold",
        color: COLORS.gray3,
    }
});

export { RegisteredWebinarCard, WebinarCard }