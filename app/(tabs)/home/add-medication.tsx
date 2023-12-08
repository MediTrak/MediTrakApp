import React from 'react';
import { Platform, StatusBar, Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../../constants";
import { useRouter } from "expo-router";

const AddMedication = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, backgroundColor: COLORS.white, width: '100%', paddingHorizontal: 20 }}>
      <View>
        <Image
          source={require('../../../assets/images/EllipseMed.png')}
          style={{ width: 164, height: 164, marginBottom: 20 }}
        />
      </View>
      <Text style={styles.subText}>
        You have not added any medication.
      </Text>

      <TouchableOpacity style={styles.loaderBtn}
        onPress={() => {
          router.push("/medication-form");
        }}
      >
        <Text style={[styles.loaderBtnText]}>Add Medication</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.gray2,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20
  },
  subText: {
    color: COLORS.gray2,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    textAlign: 'center',
    width: '100%',
    marginBottom: 20
  },

  loaderBtn: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: COLORS.primary,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  loaderBtnText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.white,
    fontWeight: '600'
  },
})

export default AddMedication;