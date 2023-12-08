import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { COLORS, FONT, SIZES } from "../../constants";

const { width, height } = Dimensions.get('window');

// export const CELL_SIZE = (width - 40)/6;
export const CELL_SIZE = 40;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = COLORS.white;
export const NOT_EMPTY_CELL_BG_COLOR = COLORS.primary;
export const ACTIVE_CELL_BG_COLOR = '#f7fafe';


const styles = StyleSheet.create({
  codeFiledRoot: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE + 5,
    width: CELL_SIZE,
    // lineHeight: CELL_SIZE - 5,
    fontSize: 30,
    textAlign: 'center',
    borderRadius: CELL_BORDER_RADIUS,
    color: COLORS.primary,
    backgroundColor: COLORS.white,

    // IOS
    shadowColor: COLORS.gray2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },

  // =======================

  root: {
    height: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 20
  },
});

export default styles;