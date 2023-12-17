import { HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform } from 'react-native';
import { COLORS } from "../../constants";

type Props = {
    drug: string | undefined;
    drugTwo?: string | undefined;
    time?: any;
    noOfTablets: number | undefined;
    noOfTabletTwo?: number | undefined;
};

const DrugCard: React.FunctionComponent<Props> = ({ drug, drugTwo, time, noOfTablets, noOfTabletTwo }) => {
    return (
        <VStack style={styles.container}>
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ width: '100%' }}>
                <VStack>
                    <Text style={{ fontSize: 14, color: COLORS.gray3, textAlign: 'left', fontWeight: '500' }}>{drug}</Text>
                    <Text style={{ fontSize: 14, color: COLORS.gray2, fontWeight: '400' }}>({noOfTablets} tablet)</Text>
                </VStack>
                <Text style={{ fontSize: 11, color: COLORS.gray3, fontWeight: '600' }}>
                    {time}
                </Text>
            </HStack>
            {/* <View style={{ width: '100%', marginTop: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.gray3, textAlign: 'left', fontWeight: '500' }}>{drugTwo} <Text style={{ fontSize: 14, color: COLORS.gray2, fontWeight: '400' }}>({noOfTablets} tablet)</Text></Text>
            </View> */}

        </VStack>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        borderColor: '#2A2A2A12',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
    },

})

export default DrugCard