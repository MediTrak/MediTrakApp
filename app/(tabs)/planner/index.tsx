import { ScrollView, StatusBar, StyleSheet, View, Text, TouchableOpacity, Platform, Modal, ActivityIndicator, RefreshControl, Image, Share } from 'react-native';
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, SIZES } from '../../../constants';
import Header from '../../../components/Header';
import PlanDrugCard from '../../../components/Planner-Drug-Cards';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetMedicationQuery } from '../../services/mediTrakApi';
import BottomSheetComponent from '../../../components/BottomSheet';
import { HStack, VStack, useToast, IconButton, CloseIcon, Alert } from 'native-base';
import { useAuth } from "../../context/auth";

interface DrugData {
  _id: string;
  name: string;
  timesDaily: number;
  backgroundColor?: string;
  textColor?: string;
  fromWhen: string;
  tillWhen: string;
  timeToTake?: [];
  dosage: string;
};

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

export default function Planner() {

  const router = useRouter();

  const toast = useToast();

  const { onDeleteMedication } = useAuth();

  const [spinner, setSpinner] = useState(false);

  const { data: medication, isLoading, isFetching, error, refetch, isSuccess } = useGetMedicationQuery({});

  const medicationData = medication?.data || [];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        // await refetch();
      } catch (error) {
        console.error('Error fetching medication:', error);
        // Handle error if needed
      }
    }
    fetchData();

  }, [medication])


  const [bottomSheetOpen, setBottomSheetOpen] = useState<{ [id: string]: boolean }>({})

  // variables
  const snapPoints = useMemo(() => ['30%'], []);

  const handleToggleBottomSheet = (id: string) => {
    setBottomSheetOpen((prevIds) => ({
      ...prevIds,
      [id]: !prevIds[id], // Toggle the value for the given id
    }));
    console.log('Share button pressed for bottom sheet:', id);
  };


  const ToastAlert: React.FC<ToastItem & { id: string, status?: string, duration: number }> = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    duration,
    ...rest
  }) => (
    <Alert
      maxWidth="95%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "info"}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text style={styles.alertTitleText}>
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" />}
              _icon={{
                color: variant === "solid" ? "lightText" : "darkText"
              }}
              onPress={() => toast.close(id)}
            />
          ) : null}
        </HStack>
        <Text style={styles.alertTitleText}>
          {description}
        </Text>
      </VStack>
    </Alert>
  );


  const [modalVisible, setModalVisible] = useState<{ [id: string]: boolean }>({});

  const handleModalOpen = (id: string) => {
    setModalVisible((prev) => ({ ...prev, [id]: true }));
    // console.log('Modal opened for:', id);
  };

  const handleModalClose = (id: string) => {
    setModalVisible((prev) => ({ ...prev, [id]: false }));
    // console.log('Closing Modal for:', id);
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: "/medication-form", params: { id: id } });
    setModalVisible((prev) => ({ ...prev, [id]: false }));
    // console.log('Edit button pressed for ID:', id);
  };

  const handleShare = (id: string) => {
    handleToggleBottomSheet(id);
    setModalVisible((prev) => ({ ...prev, [id]: false }))
    // console.log('Share button pressed for ID:', id);
  };

  const handleDelete = async (id: string) => {
    setSpinner(true)
    const result = await onDeleteMedication!(id);
    handleModalClose(id);
    setSpinner(false)
    // console.log('Delete button pressed for ID:', id);

    if (result && !result.error) {
      toast.show({
        placement: "top",
        render: ({
          id
        }) => {
          return <ToastAlert id={id} title={"Medication Deleted!"} variant={"solid"} description={"Your Medication has been deleted."} duration={10000} status={"success"} isClosable={true} />;
        }
      })


    } else {
      toast.show({
        placement: "top",
        render: ({
          id
        }) => {
          return <ToastAlert id={id} title={"Error Deleting Medication!"} variant={"solid"} description={result?.msg} duration={10000} status={"error"} isClosable={true} />;
        }
      })
    }

    return;
};

const shareReport = async () => {
  try {
    const result = await Share.share({
      title: "Download Adherence Report",
      message: "Download Adherence Report to monitor your usage",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type of: ', result.activityType);
      } else {
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      // Handle dismissal
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

const socials = [
  {
    id: '1',
    image: require('../../../assets/images/whatsApp.png'),
    title: 'WhatsApp',
  },
  {
    id: '2',
    image: require('../../../assets/images/instagram.png'),
    title: 'Instagram',
  },
  {
    id: '3',
    image: require('../../../assets/images/twitter.png'),
    title: 'Twitter',
  },
  {
    id: '4',
    image: require('../../../assets/images/facebook.png'),
    title: 'Facebook',
  },
];

return (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
    <Stack.Screen options={{ headerShown: false, title: "Planner" }} />
    <Header headerTitle='Planner' />
    <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={{
        fontSize: 14, fontWeight: '600', color: "#2a2a2a",
        textAlign: "left", marginBottom: 20
      }}>
        All Medications
      </Text>

      {medicationData.map((data: DrugData) => (
        <PlanDrugCard
          key={data._id}
          drug={data.name}
          noOfTablets={data.timesDaily}
          startDate={data.fromWhen.toString().split('T')[0]}
          endDate={data.tillWhen.toString().split('T')[0]}
          dosage={data.dosage.split('-')[0]}
          backgroundColor={data.timesDaily === 1 ? '#1C49B429' : (data.timesDaily === 2 ? '#F7876429' : '#2F8C1829')}
          textColor={data.timesDaily === 1 ? '#1C49B4' : (data.timesDaily === 2 ? '#F78764CC' : '#2F8C18')}
          onModalOpen={() => handleModalOpen(data._id)}
          onEditPress={() => handleEdit(data._id)}
          onSharePress={() => handleShare(data._id)}
          onDeletePress={() => handleDelete(data._id)}
          onModalClose={() => handleModalClose(data._id)}
          // modalVisible={modalVisible}
          modalVisible={modalVisible[data._id] || false}
        />
      ))}
    </ScrollView>

    <TouchableOpacity style={styles.button} onPress={() => {
      router.push("/medication-form");
    }}>
      <MaterialCommunityIcons name='plus' size={30} color={'white'} />
    </TouchableOpacity>

    {medicationData.map((data: DrugData) => (

      <BottomSheetComponent
        initialIndex={bottomSheetOpen[data._id] ? 0 : -1}
        snapPoints={snapPoints}
        id={data._id}
        key={data._id}
      >
        <View style={styles.contentContainer}>
          <HStack justifyContent={'space-between'} style={{ width: '100%' }}>
            <Text style={styles.shareReport}>Share Report</Text>
            {/* <TouchableOpacity>
              <MaterialCommunityIcons name='close' size={24}/>
            </TouchableOpacity> */}
          </HStack>
          <TouchableOpacity onPress={shareReport} style={{ width: '100%' }} >
            <HStack justifyContent={'space-between'} style={styles.downloadBtn}>
              <HStack>
                <Image
                  source={require('../../../assets/images/adobe.png')}
                  fadeDuration={0}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text style={styles.medReport}>Medication Usage Report</Text>
              </HStack>
              <TouchableOpacity onPress={shareReport}>
                <MaterialCommunityIcons name='download' size={24} />
              </TouchableOpacity>
            </HStack>
          </TouchableOpacity>
          <HStack style={{ width: '100%', gap: 10 }}>
            {socials.map((item, index) => (
              <VStack justifyContent={'center'} alignItems={'center'}>
                <TouchableOpacity key={index} style={{ padding: 8, backgroundColor: '#FBFBFB', borderRadius: 50 }}>
                  <Image
                    source={item.image}
                    fadeDuration={0}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>

                <Text style={styles.socialText}>{item.title}</Text>
              </VStack>))}
          </HStack>
        </View>
      </BottomSheetComponent>

    ))}
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 10
  },

  button: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#2a2a2a14',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
    shadowRadius: 14.2,
    elevation: 14.2,
    shadowOpacity: 1,
    borderRadius: 100,
    height: 50,
    width: 50,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right: 20
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  },
  shareReport: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#2a2a2a",
    textAlign: "left",
  },
  medReport: {
    fontSize: 14,
    lineHeight: 21,
    color: '#2A2A2AA3'
  },
  socialText: {
    fontSize: 12,
    letterSpacing: 0.1,
    lineHeight: 15,
    color: COLORS.gray3,
    fontWeight: '600'
  },
  downloadBtn: {
    backgroundColor: '#F4F4F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 16,
    width: '100%',
    borderRadius: 8,
  },
  alertTitleText: {
    fontSize: SIZES.medium,
    color: COLORS.white,
    fontFamily: FONT.bold,
  }
});
