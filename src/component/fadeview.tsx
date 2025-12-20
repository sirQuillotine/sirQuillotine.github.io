// Source - https://stackoverflow.com/a
// Posted by AmerllicA
// Retrieved 2025-12-20, License - CC BY-SA 4.0

import React from 'react';
import type {FC, ReactNode} from 'react';
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';


interface FadeViewProps {
  id: string | number; // <== pass a unique id here
  children?: ReactNode;
}

const FadeView: FC<FadeViewProps> = ({ id, children }) => {
  const opacity = useSharedValue(1);

  const wrapperAnimantedStype = useAnimatedStyle(() => {
    opacity: opacity.value,
  });

  return (
    <Animated.View
      key={id}
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[wrapperAnimantedStype]}
    >
     {children}
    </Animated.View>
