import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, PanResponder, Dimensions, Image } from 'react-native';

import CustomText from '../../../../components/CustomText';

import styles from './styles';

const { width } = Dimensions.get('window');

class CardInfo extends Component {
  state = {
    swipeValue: new Animated.Value(0),
    swipeYValue: new Animated.Value(0)
  };

  onHitThreshold = isLeft => {
    Animated.parallel([
      Animated.timing(this.state.swipeValue, {
        toValue: 500 * (isLeft ? -1 : 1),
        useNativeEventDriver: true
      }),
      Animated.timing(this.state.swipeYValue, { toValue: -500, useNativeEventDriver: true, duration: 300 })
    ]).start(this.props.onDeleteCard);
  };

  releaseCardAnimation = animatedValue =>
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeEventDriver: true,
      friction: 4
    });

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => this.props.isActive,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => this.props.isActive,
    onMoveShouldSetPanResponderCapture: () => this.props.isActive,

    onPanResponderGrant: () => this.props.isActive,
    onPanResponderMove: Animated.event([null, { dx: this.state.swipeValue, dy: this.state.swipeYValue }]),
    onPanResponderTerminationRequest: () => false,
    onPanResponderRelease: () => {
      if (this.state.swipeValue._value === 0 && this.state.swipeYValue._value === 0) {
        Animated.parallel([
          Animated.timing(this.props.initialValue, { toValue: 0, useNativeEventDriver: true }),
          Animated.timing(this.props.scaleValue, { toValue: 1.2, useNativeEventDriver: true })
        ]).start();
        return;
      }

      if (this.state.swipeValue._value < -width / 4 || this.state.swipeValue._value > width / 4) {
        this.onHitThreshold(this.state.swipeValue._value < -width / 4);
      } else {
        Animated.parallel([
          this.releaseCardAnimation(this.state.swipeValue),
          this.releaseCardAnimation(this.state.swipeYValue)
        ]).start();
      }
    },
    onPanResponderTerminate: () => {
      Animated.parallel([
        this.releaseCardAnimation(this.state.swipeValue),
        this.releaseCardAnimation(this.state.swipeYValue)
      ]).start();
    }
  });

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          width,
          alignItems: 'center',
          transform: [
            { scale: this.props.scaleValue },
            {
              rotateZ: this.state.swipeValue.interpolate({
                inputRange: [0, 1000],
                outputRange: ['0deg', '90deg']
              })
            },
            { translateX: this.state.swipeValue },
            { translateY: Animated.add(this.state.swipeYValue, this.props.initialValue) }
          ]
        }}
        {...this.panResponder.panHandlers}
      >
        <View style={styles.container}>
          <Image source={this.props.image} style={styles.image} resizeMode="cover" />
          <CustomText white bold xbig center>
            {this.props.title}
          </CustomText>
        </View>
      </Animated.View>
    );
  }
}

CardInfo.propTypes = {
  initialValue: PropTypes.shape({
    _value: PropTypes.number
  }),
  scaleValue: PropTypes.shape({
    _value: PropTypes.number
  }),
  title: PropTypes.string,
  isActive: PropTypes.bool,
  onDeleteCard: PropTypes.func,
  image: PropTypes.number
};

export default CardInfo;
