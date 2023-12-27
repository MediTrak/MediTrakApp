import { HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform, Pressable } from 'react-native';
import { COLORS } from "../../constants";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type Props = {
    notification: string | undefined;
    desc?: string | undefined;
    time?: any;
    checked?: boolean;
    handleChecked?: () => void;
    id?: string;
};

const NotificationCard: React.FunctionComponent<Props> = ({ notification, desc, time, checked, handleChecked, id }) => {
    return (
        <HStack style={styles.container} justifyContent={'space-between'} alignItems={'center'} key={id}>
            <HStack space={2}>

                <BouncyCheckbox
                    size={20}
                    fillColor={COLORS.primary}
                    unfillColor="transparent"
                    iconStyle={{ borderRadius: 4, borderColor: "#2A2A2ACC" }}
                    innerIconStyle={{ borderRadius: 4 }}
                    onPress={handleChecked}
                    style={{ alignItems: 'flex-start' }}
                    disableText
                />
                <VStack>
                    <Text style={{ fontSize: 14, color: COLORS.gray3, textAlign: 'left', fontWeight: '500' }}>{notification}</Text>
                    <Text style={{ fontSize: 14, color: COLORS.gray2, fontWeight: '400' }}>{desc}</Text>
                </VStack>
            </HStack>
            <Text style={{ fontSize: 12, color: COLORS.gray2, fontWeight: '400' }}>
                {time}
            </Text>
        </HStack>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        // borderColor: '#2A2A2A12',
        // borderWidth: 1,
        // borderRadius: 8,
        marginBottom: 10
    },

})

export default NotificationCard