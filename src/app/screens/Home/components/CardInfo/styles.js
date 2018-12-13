import { StyleSheet } from 'react-native';

import { white } from '../../../../../constants/colors';

const CARD_SIZE = 325;
const BORDER_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    height: CARD_SIZE + 50,
    width: CARD_SIZE,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: white
  },
  image: {
    height: CARD_SIZE + 50,
    width: CARD_SIZE,
    position: 'absolute',
    overflow: 'hidden'
  }
});

export default styles;
