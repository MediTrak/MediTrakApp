import { ScrollView, StatusBar, StyleSheet, View, Text, TouchableOpacity, Platform, Modal, ActivityIndicator, RefreshControl, Image, Share, Button } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, SIZES } from '../../../constants';
import Header from '../../../components/Header';
import PlanDrugCard from '../../../components/Planner-Drug-Cards';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState, useRef, SetStateAction } from 'react';
import { useGetMedicationQuery } from '../../services/mediTrakApi';
import BottomSheetComponent from '../../../components/BottomSheet';
import { HStack, VStack, useToast, IconButton, CloseIcon, Alert } from 'native-base';
// import { useAuth } from "../../context/auth";
import { useAuth } from '../../../context/AuthProvider';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CellContainer, FlashList } from "@shopify/flash-list";
import { useIsFocused } from '@react-navigation/native';

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
  status?: string;
};

interface ToastItem {
  title: string;
  variant: string;
  description: string;
  isClosable?: boolean;
}

interface ModalVisibilityState {
  [id: string]: boolean;
}

export default function Planner() {

  const router = useRouter();

  const isFocused = useIsFocused();

  const toast = useToast();

  const { onDeleteMedication, onGetMedications } = useAuth();

  const [spinner, setSpinner] = useState(false);

  const [filteredData, setFilteredData] = useState<any[]>([]);

  const { data: medication, isLoading, isFetching, error, refetch, isSuccess } = useGetMedicationQuery({});

  const medicationData = medication?.data || [];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onFocusedRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();

        const today = new Date();

        if (medicationData) {
          let filteredDates = medicationData?.map((item: { tillWhen: string | number | Date; }) => {
            const tillWhenDate = new Date(item.tillWhen);
            const status = tillWhenDate >= today ? 'active' : 'inactive';

            return { ...item, status };
          });

          // Sorting the array based on the 'status' property
          filteredDates = filteredDates.sort((a: { status: string; }, b: { status: string; }) => {
            // 'active' comes before 'inactive'
            if (a.status === 'active' && b.status === 'inactive') {
              return -1;
            } else if (a.status === 'inactive' && b.status === 'active') {
              return 1;
            } else {
              return 0; // Maintain the order if statuses are the same
            }
          });

          setFilteredData(filteredDates);
        }
      } catch (error) {
        console.error('Error fetching medication:', error);
        // Handle error if needed
      }
    }

    fetchData();

  }, [medication])

  useEffect(() => {
    isFocused && onFocusedRefresh()
  }, [isFocused]);

  const [bottomSheetOpen, setBottomSheetOpen] = useState<{ [id: string]: boolean }>({})

  // variables
  const snapPoints = useMemo(() => ['30%'], []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleToggleBottomSheet = (id: string) => {
    handlePresentModalPress()
    setBottomSheetOpen((prevIds) => ({
      ...prevIds,
      [id]: !prevIds[id], 
    }));
    // console.log('Share button pressed for bottom sheet:', id);
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

  const [modalVisible, setModalVisible] = useState<ModalVisibilityState>({});

  const handleModalOpen = (id: string) => {
    setModalVisible((prev) => {
      const updatedModals = { ...prev };

      // Check if the current modal is already open
      if (updatedModals[id]) {
        // If it's open, close it
        updatedModals[id] = false;
      } else {
        // If it's not open, close any other open modals
        Object.keys(updatedModals).forEach((modalId) => {
          if (modalId !== id) {
            updatedModals[modalId] = false;
          }
        });

        // Open the modal with the specified id
        updatedModals[id] = true;
      }

      console.log('Modal opened for:', id);
      return updatedModals;
    });
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
    setModalVisible((prev) => ({ ...prev, [id]: false }))
    setSpinner(false)
    // console.log('Delete button pressed for ID:', id);

    if (result && !result.error) {

      setRefreshing(true);
      await refetch();
      setRefreshing(false);

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
          // console.log('Shared with activity type of: ', result.activityType);
        } else {
          // console.log('Shared successfully');
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
      image: require('../../../assets/images/WhatsApp.png'),
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

  const onLoadListener = useCallback(({ elapsedTimeInMs }: any) => {
    console.log('List load time: ', elapsedTimeInMs)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false, title: "Planner" }} />
      <Header headerTitle='Planner' />
      <View style={{ flex: 1, width: '100%', backgroundColor: COLORS.white }}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : (
          <FlashList
            data={filteredData}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListHeaderComponent={() => (
              <Text style={{
                fontSize: 14, fontWeight: '600', color: "#2a2a2a",
                textAlign: "left", marginBottom: 20
              }}>
                All Medications
              </Text>
            )}
            renderItem={({ item, index }: { item: DrugData, index: number }) => (
              <PlanDrugCard
                // key={item._id}
                drug={item.name}
                noOfTablets={item.timesDaily}
                startDate={item.fromWhen.toString().split('T')[0]}
                endDate={item.tillWhen.toString().split('T')[0]}
                dosage={item.dosage.split('-')[0]}
                backgroundColor={item.timesDaily === 1 ? '#1C49B429' : (item.timesDaily === 2 ? '#F7876429' : '#2F8C1829')}
                textColor={item.timesDaily === 1 ? '#1C49B4' : (item.timesDaily === 2 ? '#F78764CC' : '#2F8C18')}
                onModalOpen={() => handleModalOpen(item._id)}
                onEditPress={() => handleEdit(item._id)}
                onSharePress={() => handleShare(item._id)}
                onDeletePress={() => handleDelete(item._id)}
                onModalClose={() => handleModalClose(item._id)}
                modalVisible={modalVisible}
                id={item._id}
                item={item}
                status={item.status}
                statusTextColor={item.status === 'active' ? '#2F8C18' : '#DC143C'}
                statusBackgroundColor={item.status === 'active' ? '#2F8C1829' : '#DC143C29'}
              // setModalVisible={setModalVisible}
              />
            )}
            estimatedItemSize={20}
            extraData={modalVisible}
            onLoad={onLoadListener}
          // disableAutoLayout={true}
          />
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {
        router.push("/medication-form");
      }}>
        <MaterialCommunityIcons name='plus' size={30} color={'white'} />
      </TouchableOpacity>

      {medicationData.map((data: DrugData) => (

        <BottomSheetComponent
          // initialIndex={bottomSheetOpen[data._id] ? 0 : -1}
          snapPoints={snapPoints}
          id={data._id}
          key={data._id}
          ref={bottomSheetModalRef}
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
                <VStack justifyContent={'center'} alignItems={'center'} key={index}>
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
    paddingBottom: 10,
    width: '100%',
    backgroundColor: COLORS.white
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
