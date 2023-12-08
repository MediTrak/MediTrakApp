import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { Avatar } from "native-base";
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

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
                {avatar}
            </Avatar>
        </TouchableWithoutFeedback>

    )
}

export default AvatarBtn