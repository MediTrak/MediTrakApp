import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    Text
} from 'react-native';
import { useRouter } from "expo-router";

interface ButtonProps {
    text: string;
    backgroundColor: string;
    onPress: () => void; // Add onPress prop
    width: any;
    textColor: string;
}

const Button: React.FC<ButtonProps> = ({ text, backgroundColor, onPress, width, textColor }: ButtonProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={[styles.btn, { width: width, backgroundColor: backgroundColor }]} // Set width directly in style
            onPress={onPress} // Pass onPress prop
        >
            <Text style={[styles.btnText, { color: textColor }]}>
                {text}
            </Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    btnText: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        color: 'red'
    }
});

export default Button;
