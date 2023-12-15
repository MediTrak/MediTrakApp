import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { Avatar } from "native-base";
import { StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';

type AvatarComponentProps = {
    avatar: string | undefined;
    handlePress?: () => void;
};

const AvatarBtn: React.FunctionComponent<AvatarComponentProps> = ({ avatar, handlePress }) => {
    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <Avatar
                size={160}
                style={{ backgroundColor: COLORS.primary, borderRadius: 100, width: 164, height: 164, marginTop: 20 }}
            >
                <Text style={{fontSize: 90, color: COLORS.white }}>{avatar}</Text>
                <TouchableOpacity>
                    <MaterialIcons name='edit' size={20} color={ COLORS.white } style={styles.editIcon}/>
                </TouchableOpacity>
            </Avatar>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    editIcon: {
        position: 'absolute',
        right: -70,
        bottom: -23,
        borderRadius: 50,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
})

export default AvatarBtn