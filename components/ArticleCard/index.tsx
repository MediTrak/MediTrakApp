import { Center, HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity, ImageSourcePropType, ViewStyle, Dimensions } from 'react-native';
import { COLORS, SHADOWS } from "../../constants";
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

type ArticleCardProps = {
    img: ImageSourcePropType;
    category: string | undefined;
    title: string | undefined;
    author: string | undefined;
    item?: any | undefined;
    handleCardPress: (item: any) => void;
    selectedArticle?: string;
    backgroundColor?: string | undefined;
    textColor?: string | undefined;
};

type articleCardStyle = (selectedArticle: any, item: any) => ViewStyle;

export type Styles = {
    articleCard: articleCardStyle
}

const { width, height } = Dimensions.get("window")

const NewArticleCard: React.FunctionComponent<ArticleCardProps> = ({ img, category, title, author, item, handleCardPress, selectedArticle, backgroundColor, textColor }) => {
    return (
        // <TouchableOpacity>
        <HStack alignItems={'center'} style={styles.container(selectedArticle, item)}>
            <View style={styles.imageContainer}>
                <Image
                    source={img}
                    style={styles.image}
                />
            </View>

            <VStack style={styles.textContainer}>
                <View style={[styles.coloredText, { backgroundColor: backgroundColor }]}>
                    <Text style={{ fontSize: 10, color: textColor, textAlign: 'left', fontWeight: '600' }}>{category}</Text>
                </View>

                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.authorText}>{author}</Text>
                <TouchableOpacity
                    style={styles.readBtn}
                    onPress={() => handleCardPress(item)}>
                    <Text style={styles.readBtnText}>Read</Text>
                    <AntDesign name='right' size={18} color={'white'} />
                </TouchableOpacity>
            </VStack>
        </HStack>
        // </TouchableOpacity>
    )
}

const OldArticleCard: React.FunctionComponent<ArticleCardProps> = ({ img, category, title, author, item, handleCardPress, selectedArticle, backgroundColor, textColor }) => {
    return (
        <TouchableOpacity
            onPress={() => handleCardPress(item)}>
            <VStack style={styles.oldContainer(selectedArticle, item)}>
                <View style={styles.imageContainerOld}>
                    <Image
                        source={img}
                        style={styles.imageOld}
                    />
                </View>

                <View style={[styles.coloredText, { backgroundColor: backgroundColor }]}>
                    <Text style={{ fontSize: 10, color: textColor, textAlign: 'left', fontWeight: '600' }}>{category}</Text>
                </View>

                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.authorText}>{author}</Text>
            </VStack>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create<Styles | any>({
    container: (selectedArticle: string, item: { id: string; }) => ({
        width: 280,
        padding: 12,
        borderColor: '#2A2A2A12',
        borderWidth: 1,
        borderRadius: 8,
        gap: 8,
        backgroundColor: selectedArticle === item.id ? COLORS.primary : "#F9F9F98F",
        ...SHADOWS.medium,
        shadowColor: COLORS.white,
    }),

    imageContainer: {
        width: "40%",
        height: 125
    },

    image: {
        width: '100%',
        objectFit: 'fill',
        flex: 1
    },

    readBtn: {
        paddingVertical: 5,
        backgroundColor: COLORS.primary,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        flexDirection: 'row'
    },

    readBtnText: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: '600',
        marginRight: 10
    },

    textContainer: {
        // borderWidth: 2,
        // borderColor: 'red',
        flex: 1,
        height: 125,
        justifyContent: 'space-between'
    },

    titleText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "600",
        fontFamily: "OpenSans-SemiBold",
        color: COLORS.gray3,
        textAlign: "left",
    },

    authorText: {
        fontSize: 12,
        lineHeight: 18,
        fontFamily: "OpenSans-Regular",
        color: COLORS.gray2,
        textAlign: "left",
    },

    coloredText: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        alignSelf: 'flex-start'
    },

    oldContainer: (selectedArticle: string, item: { id: string; }) => ({
        width: width * 0.41,
        padding: 12,
        borderColor: '#2A2A2A12',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: selectedArticle === item.id ? COLORS.primary : "#F9F9F9",
        ...SHADOWS.medium,
        shadowColor: COLORS.white,
        marginBottom: 12,
        marginRight: 12,
        gap: 6
    }),

    imageContainerOld: {
        width: "100%",
        height: 90,
    },

    imageOld: {
        width: '100%',
        objectFit: 'fill',
        flex: 1
    }
})

export { NewArticleCard, OldArticleCard }