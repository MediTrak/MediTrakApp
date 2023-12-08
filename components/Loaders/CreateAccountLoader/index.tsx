import React, { useMemo, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from "../../../constants";

const { width, height } = Dimensions.get('window');

const CreateAccountLoader = ({ color, ...props }: { color?: string }) => {
    const animation = useRef(null);
    return (
        <View>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: width,
                    height: 200,
                    backgroundColor: COLORS.white,
                }}
                // source={colorizedSource}
                source={require('../../../assets/Animation.json')}
            />
        </View>
    );
}

export default CreateAccountLoader