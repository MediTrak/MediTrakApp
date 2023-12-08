import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    Image,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';

import { router } from "expo-router";
import { COLORS } from "../../constants";
import {
    GestureDetector,
    Gesture,
    Directions
} from 'react-native-gesture-handler';

import Animated, {
    FadeIn,
    FadeOut,
    BounceInRight,
    SlideOutLeft,
    BounceOutLeft,
    SlideInRight,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        image: require('../../assets/images/onboarding1.png'),
        iconImg: require('../../assets/images/userIcon.png'),
        iconText: 'Patients',
        title: 'Track  your medication usage',
        subtitle: 'You can also add accountability partners to ensure that you complete your medications.',
    },
    {
        id: '2',
        image: require('../../assets/images/onboarding2.png'),
        iconImg: require('../../assets/images/hospitalIcon.png'),
        iconText: 'Hospitals',
        title: 'Download  usage reports easily',
        subtitle: 'Hospitals will now be able to monitor patients medication usage and use adherence report.',
    },
    {
        id: '3',
        image: require('../../assets/images/onboarding3.png'),
        iconImg: require('../../assets/images/partnerIcon.png'),
        iconText: 'Accountability',
        title: 'Add accountability partners',
        subtitle: 'This is to ensure that patients use their drugs diligently and still to their routine.',
    },
];

interface SlideProps {
    item: {
        id: string;
        image: number;
        title: string;
        subtitle: string;
        iconImg: number;
        iconText: string;
    };
}


const OnboardingScreen = () => {

    const [screenIndex, setScreenIndex] = useState(0);

    const data = slides[screenIndex];

    const onContinue = () => {
        const isLastScreen = screenIndex === slides.length - 1;
        if (isLastScreen) {
            endOnboarding();
        } else {
            setScreenIndex(screenIndex + 1);
        }
    };

    const onBack = () => {
        const isFirstScreen = screenIndex === 0;
        if (isFirstScreen) {
            endOnboarding();
        } else {
            setScreenIndex(screenIndex - 1);
        }
    };

    const endOnboarding = () => {
        setScreenIndex(0);
        // router.back();
    };

    const swipes = Gesture.Simultaneous(
        Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
        Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
    );


    const Slide: React.FC<SlideProps> = ({ item }) => {
        return (
            <GestureDetector gesture={swipes}>
                <View style={{ alignItems: 'center', width, padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }} key={screenIndex}>
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ flex: 1, width: '100%' }}>
                        <Image
                            source={item?.image}
                            style={styles.image}
                        />
                    </Animated.View>

                    <View style={styles.textContainer}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={item?.iconImg}
                                fadeDuration={0}
                                style={{ width: 14, height: 14, marginRight: 4 }}
                            />
                            <Text style={{ fontWeight: '600', color: '#F78764CC' }}>{item?.iconText}</Text>
                        </View>

                        <Animated.Text
                            entering={SlideInRight}
                            exiting={SlideOutLeft}
                            style={styles.title}
                        >
                            {item?.title}
                        </Animated.Text>

                        <Animated.Text
                            entering={SlideInRight.delay(50)}
                            exiting={SlideOutLeft}
                            style={styles.subtitle}
                        >
                            {item?.subtitle}
                        </Animated.Text>
                    </View>
                </View>
            </GestureDetector>
        );
    };

    const Footer: React.FC = () => {
        return (
            <View
                style={{
                    // height: height * 0.25,
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                }}>
                {/* Indicator container */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginVertical: 20,
                    }}>
                    {/* Render indicator */}
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                screenIndex === index && {
                                    backgroundColor: COLORS.primary,
                                    width: 25,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Render buttons */}
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.btn,
                                {
                                    backgroundColor: COLORS.secondary,
                                    width: '38%',
                                },
                            ]}
                            onPress={() => {
                                router.push("/login");
                            }}>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    color: '#2A2A2ACC',
                                }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        {screenIndex === slides.length - 1 ? (
                            <TouchableOpacity
                                style={[
                                    styles.btn,
                                    {
                                        backgroundColor: COLORS.primary,
                                        flex: 1
                                    }
                                ]}
                                onPress={() => {
                                    router.push("/create-account");
                                }}
                            >
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    color: '#FFFFFF'
                                }}>
                                    Get Started
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/create-account");
                                }}
                                style={[
                                    styles.btn,
                                    {
                                        backgroundColor: COLORS.primary,
                                        flex: 1
                                    }
                                ]}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 15,
                                        color: '#FFFFFF'
                                    }}>
                                    Create Account
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0 }}>
            <Slide item={data} />
            <Footer />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        borderRadius: 14,
        padding: 8,
        backgroundColor: '#F7876414',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 12,
        textAlign: 'center',
        color: '#2A2A2ACC'
    },
    textContainer: {
        width: '100%',
        marginTop: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    subtitle: {
        color: '#2A2A2ACC',
        fontSize: 14,
        textAlign: 'left',
        maxWidth: '98%',
        fontWeight: "600",
    },
    title: {
        color: COLORS.gray3,
        fontSize: 32,
        fontWeight: "600",
        textAlign: 'left',
        maxWidth: '85%'
    },
    image: {
        width: '100%',
        objectFit: 'fill',
        flex: 1
    },
    indicator: {
        height: 4,
        width: 6,
        backgroundColor: COLORS.gray,
        marginHorizontal: 3,
        borderRadius: 2,
    },
    btn: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OnboardingScreen;
