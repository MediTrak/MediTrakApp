import React, { useMemo, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from "../../../constants";
import UserAnimation from "../../../assets/UserAnimation.json"
import { colouriseLottie } from '../../../utils/colouriseLotttie';

const SuccessAccountLoader = ({ color, ...props }: { color?: string }) => {
    const animation = useRef(null);
    const colorizedSource = useMemo(() => colouriseLottie(
        UserAnimation,
        {
            // Lock.Forma 1.Traçado 1
            "layers.0.shapes.0.it.1.c.k": "#183059",
            // Lock.Circle.Stroke 1
            "layers.0.shapes.1.it.2.c.k": "#183059",
            // Lock.Circle.Circle 2.Stroke 1
            "layers.0.shapes.1.it.3.it.2.c.k": "#183059",
            // Lock.Circle.Circle.Stroke 1
            "layers.0.shapes.1.it.4.it.2.c.k": "#183059",
        }
    ), []);

    return (
        <View>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: '80%',
                    backgroundColor: COLORS.white,
                }}
                source={colorizedSource}
                resizeMode='cover'
            />
        </View>
    );
}

export default SuccessAccountLoader