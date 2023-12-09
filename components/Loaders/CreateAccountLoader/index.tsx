import React, { useMemo, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from "../../../constants";
import Animation from '../../../assets/Animation.json'
import { colouriseLottie } from '../../../utils/colouriseLotttie';

const CreateAccountLoader = ({ color, ...props }: { color?: string }) => {
    const animation = useRef(null);
    const colorizedSource = useMemo(() => colouriseLottie(
        Animation,
        {
            // Shape Layer 4.Ellipse 1.Stroke 1
            "layers.0.shapes.0.it.1.c.k": "#183059",
            // Shape Layer 4.Ellipse 1.Fill 1
            "layers.0.shapes.0.it.2.c.k": "#ffffff",
            // Shape Layer 3.Ellipse 1.Stroke 1
            "layers.1.shapes.0.it.1.c.k": "#183059",
            // Shape Layer 3.Ellipse 1.Fill 1
            "layers.1.shapes.0.it.2.c.k": "#ffffff",
            // Shape Layer 2.Ellipse 1.Stroke 1
            "layers.2.shapes.0.it.1.c.k": "#183059",
            // Shape Layer 2.Ellipse 1.Fill 1
            "layers.2.shapes.0.it.2.c.k": "#ffffff",
            // Shape Layer 1.Ellipse 1.Stroke 1
            "layers.3.shapes.0.it.1.c.k": "#183059",
            // Shape Layer 1.Ellipse 1.Fill 1
            "layers.3.shapes.0.it.2.c.k": "#ffffff",
        }
    ), []);

    return (
        <View>
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: '100%',
                    backgroundColor: COLORS.white,
                }}
                source={colorizedSource}
                resizeMode='cover'
            />
        </View>
    );
}

export default CreateAccountLoader