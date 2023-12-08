import { HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform } from 'react-native';
import { COLORS } from "../../constants";
import { Avatar } from "native-base";

type Props = {
    avatar: string | undefined;
};

const DailyGoalCard: React.FunctionComponent<Props> = ({ avatar }) => {
    return (
        <View style={styles.container}>
            <VStack style={styles.goalCard}>
                <Text style={styles.goalsText}>Daily Goal</Text>
                <HStack justifyContent={'space-between'}>
                    <Avatar
                        size={24}
                        style={{ backgroundColor: COLORS.primary, borderRadius: 4, width: 24, height: 24 }}
                    >
                        {avatar}
                    </Avatar>

                    <Image
                        source={require('../../assets/images/alarm.png')}
                        fadeDuration={0}
                        style={{ width: 24, height: 24 }}
                    />
                </HStack>
            </VStack>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        // borderColor: 'red',
        // borderWidth: 1,
        position: 'absolute'
    },

    goalCard: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: "#fff",
        padding: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#2a2a2a14',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
        shadowRadius: 14.2,
        elevation: 14.2,
        shadowOpacity: 1
    },

    goalsText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "600",
        color: COLORS.gray3,
        marginBottom: 12
    }
});

export default DailyGoalCard