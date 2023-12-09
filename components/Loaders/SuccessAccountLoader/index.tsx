import React, { useMemo, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from "../../../constants";

const SuccessAccountLoader = ({ color, ...props }: { color?: string }) => {
    const animation = useRef(null);

    return (
        <View>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: '80%',
                    backgroundColor: COLORS.white,
                }}
                source={require('../../../assets/UserAnimation.json')}
                resizeMode='cover'
            />
        </View>
    );
}

export default SuccessAccountLoader