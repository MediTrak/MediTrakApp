import React, { useState } from 'react';
import { Animated, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, useWindowDimensions, Dimensions, Text, ListRenderItem } from 'react-native';
import { Stack } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants';
import Header from '../../../components/Header';
// import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view'

const DATA = [0, 1, 2, 3, 4]
const identity = (v: unknown): string => v + ''


export default function Socials() {

  const renderItem: ListRenderItem<number> = React.useCallback(({ index }) => {
    return (
      <View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
    )
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Socials" }} />
      <Header headerTitle='Socials' />
      <Tabs.Container
        containerStyle={{ elevation: 0 }}
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
          <Tabs.FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={identity}
            showsVerticalScrollIndicator={false}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Webinars" label="Webinars">
          <Tabs.ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.box, styles.boxA]} />
            <View style={[styles.box, styles.boxB]} />
            <View style={[styles.box, styles.boxA]} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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


  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
});
