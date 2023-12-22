import React, { useState } from 'react';
import { Animated, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, useWindowDimensions, Dimensions, Text, ListRenderItem } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants';
import Header from '../../../components/Header';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Articles from '../../../components/Articles';

const HeaderComp = () => {
  return <Header headerTitle='Socials' />
}

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    activeColor={COLORS.white}
    inactiveColor={COLORS.lightWhite}
    style={{ backgroundColor: COLORS.primary }}
    indicatorContainerStyle={{
      width: 'auto',
      // marginHorizontal: 20,
      // gap: 20,
      // columnGap: 12,
      borderColor: 'red',
      borderWidth: 1
    }}
    indicatorStyle={{ backgroundColor: COLORS.lightWhite, height: 2, borderTopRightRadius: 4, borderTopLeftRadius: 4, width: 0.8 }}
    tabStyle={{
      width: 'auto',
      margin: 0,
      paddingRight: 20
    }}
    contentContainerStyle={{
      width: 'auto',
      paddingHorizontal: 20,
      gap: 12
    }}
    labelStyle={{
      fontSize: 12,
      fontWeight: '600'
    }}
    scrollEnabled={false}
  />
);

const ArticlesRoute = () => (
  <SafeAreaView style={[styles.container, { paddingHorizontal: 20 }]}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.scrollInnerContainer}>
        <Text style={{
          fontSize: 14, fontWeight: '600', color: "#2a2a2a",
          textAlign: "left"
        }}>
          New
        </Text>
        <Articles />
      </View>
    </ScrollView>
  </SafeAreaView>

);

const WebinarsRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  articles: ArticlesRoute,
  webinars: WebinarsRoute,
});

export default function Socials() {

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'articles', title: 'Articles' },
    { key: 'webinars', title: 'Webinars' },
  ]);

  const handleIndexChange = (currentIndex: React.SetStateAction<number>) => setIndex(currentIndex);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Socials" }} />
      {/* <Header headerTitle='Socials' /> */}
      {/* <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      /> */}
      <Tabs.Container
        allowHeaderOverscroll={true}
        revealHeaderOnScroll={true}
        snapThreshold={1}
        pagerProps={{
          scrollEnabled: false
        }}
        renderHeader={HeaderComp}
        renderTabBar={(props) => {
          return (
            <MaterialTabBar
              {...props}
              activeColor={COLORS.white}
              inactiveColor={COLORS.lightWhite}
              style={{ backgroundColor: COLORS.primary, elevation: 0 }}
              indicatorStyle={{ backgroundColor: COLORS.lightWhite, height: 2, padding: 0, borderTopRightRadius: 4, borderTopLeftRadius: 4 }}
              tabStyle={{
                width: 'auto',
                margin: 0,
                paddingRight: 20
              }}
              contentContainerStyle={{
                width: 'auto',
                paddingHorizontal: 20,
                gap: 12
              }}
              labelStyle={{
                fontSize: 12,
                fontWeight: '600'
              }}
              scrollEnabled
            />
          );
        }}
      >
        <Tabs.Tab name="Articles" label="Articles">
          <Tabs.ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20, backgroundColor: COLORS.white }}>

            <Text style={{
              fontSize: 14, fontWeight: '600', color: "#2a2a2a",
              textAlign: "left"
            }}>
              New
            </Text>
            <Articles />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Webinars" label="Webinars">
          <Tabs.ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20, backgroundColor: COLORS.white }}>

          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  scrollInnerContainer: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'red'
  },
});
