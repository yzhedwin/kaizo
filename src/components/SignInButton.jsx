import React from 'react';
import { Text, Pressable } from 'react-native';

export default function SignInButton(props) {
  const { onPress, title = 'Save' } = props;
  return (
    <Pressable style={props.buttonStyle} onPress={onPress}>
      <Text style={props.textStyle}>{title}</Text>
    </Pressable>
  );
}