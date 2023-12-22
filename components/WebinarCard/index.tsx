import { Center, HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity, ImageSourcePropType, ViewStyle, Dimensions } from 'react-native';
import { COLORS, SHADOWS } from "../../constants";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

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

const RegisteredWebinarCard: React.FunctionComponent<WebinarCardProps> = ({ img, title, time, item, handleCardPress, selectedWebinar, webinarType, date, daysLeft, backgroundColor}) => {
    return (
        <View style={{width: 180, backgroundColor: backgroundColor}}>
            <HStack justifyContent={'space-between'} style={styles.header}>
                <Text style={styles.titleText}>{date}</Text>
                <Text style={styles.titleText}>{daysLeft}</Text>
            </HStack>
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
                        <Text style={styles.timeText}>{time}</Text>
                    </HStack>

                    <HStack>
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
                    <Text style={styles.timeText}>{time}</Text>
                </HStack>

                <HStack>
                    <Text style={styles.timeText}>{webinarType}</Text>
                </HStack>

            </VStack>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.41,
        borderColor: 'red',
        borderWidth: 1,
        marginBottom: 12,
        marginRight: 12,
        gap: 8
    },

    imageContainer: {
        width: "100%",
        height: 120,
    },

    image: {
        width: '100%',
        objectFit: 'fill',
        flex: 1
    },

    titleText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "600",
        fontFamily: "OpenSans-SemiBold",
        color: COLORS.gray3,
        textAlign: "left",
    },

    timeText: {
        fontSize: 10,
        lineHeight: 15,
        fontFamily: "OpenSans-Regular",
        color: COLORS.gray2,
    },

    header: {

    }
});

export { RegisteredWebinarCard, WebinarCard }