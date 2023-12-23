import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { NewArticleCard, OldArticleCard } from '../ArticleCard';

const newData = [
    {
        id: '1',
        image: require('../../assets/images/articleImgNew.png'),
        imageTwo: require('../../assets/images/articleImg1.png'),
        category: 'Health',
        title: 'The mindset hack',
        author: 'Judith Elvira',
    },
    {
        id: '2',
        image: require('../../assets/images/articleImgNew.png'),
        imageTwo: require('../../assets/images/articleImg2.png'),
        category: 'Wellbeing',
        title: 'Body and soul',
        author: 'James Derin',
    },
    {
        id: '3',
        image: require('../../assets/images/articleImgNew.png'),
        imageTwo: require('../../assets/images/articleImg3.png'),
        category: 'Health',
        title: 'The mindset hack',
        author: 'Judith Elvira',
    },
    {
        id: '4',
        image: require('../../assets/images/articleImgNew.png'),
        imageTwo: require('../../assets/images/articleImg4.png'),
        category: 'Wellbeing',
        title: 'Body and soul',
        author: 'James Derin',
    },
];

const Articles = () => {
    const router = useRouter();

    const [selectedArticle, setSelectedArticle] = useState('');

    const handleCardPress = (item: any) => {
        // router.push(`/socials/articles/${item.id}`) // route to be implemented
        // setSelectedArticle(item.id);
        console.log('Card Pressed')
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={newData}
                renderItem={({ item }) => (
                    <NewArticleCard
                        key={item.id}
                        item={item}
                        img={item.image}
                        category={item.category}
                        title={item.title}
                        author={item.author}
                        handleCardPress={handleCardPress}
                        selectedArticle={selectedArticle}
                        textColor={item.category === 'Health' ? '#E6BA5C' : '#3EC5CF'}
                        backgroundColor={item.category === 'Health' ? '#E6BA5C14' : '#2B617D14'}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ columnGap: 12 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

                <FlatList
                    data={newData}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    columnWrapperStyle= {{ gap: 10}}
                    ListHeaderComponent={() => (
                        <Text style={{
                            fontSize: 14, fontWeight: '600', color: "#2a2a2a",
                            textAlign: "left", marginBottom: 10, marginTop: 20
                        }}>
                            Older
                        </Text>
                    )}
                    renderItem={({ item }) => (
                        <OldArticleCard
                            key={item.id}
                            item={item}
                            img={item.imageTwo}
                            category={item.category}
                            title={item.title}
                            author={item.author}
                            handleCardPress={handleCardPress}
                            selectedArticle={selectedArticle}
                            textColor={item.category === 'Health' ? '#E6BA5C' : '#3EC5CF'}
                            backgroundColor={item.category === 'Health' ? '#E6BA5C14' : '#2B617D14'}
                        />
                    )}
                    scrollEnabled={false}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
});

export default Articles;