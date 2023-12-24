import { Text, StyleSheet } from "react-native";
import { useToast, VStack, HStack, Center, IconButton, CloseIcon, Alert, Icon } from 'native-base';
import { COLORS, FONT, SIZES } from '../../constants';

interface ToastItem {
    title: string;
    variant: string;
    description: string;
    isClosable?: boolean;
}

const ToastAlert: React.FC<ToastItem & { id: string; status?: string; duration: number }> = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    duration,
    ...rest
  }) => {
    
    const toast = useToast();
  
    return (
      <Alert
        maxWidth="95%"
        alignSelf="center"
        flexDirection="row"
        status={status ? status : 'info'}
        variant={variant}
        {...rest}
      >
        <VStack space={1} flexShrink={1} w="100%">
          <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
              <Text style={styles.alertTitleText}>{title}</Text>
            </HStack>
            {isClosable ? (
              <IconButton
                variant="unstyled"
                icon={<CloseIcon size="3" />}
                _icon={{
                  color: variant === 'solid' ? 'lightText' : 'darkText',
                }}
                onPress={() => toast.close(id)}
              />
            ) : null}
          </HStack>
          <Text style={styles.alertTitleText}>{description}</Text>
        </VStack>
      </Alert>
    );
  };

const styles = StyleSheet.create({
    alertTitleText: {
        fontSize: SIZES.medium,
        color: COLORS.white,
        fontFamily: FONT.bold,
    },
})

export default ToastAlert;