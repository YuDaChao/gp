import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Girl from './Girl';

export default class Boy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      word: ''
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>我是一个男孩儿。</Text>
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: Girl,
              params: {
                word: '一朵玫瑰',
                onCallBack: word => {
                  this.setState({
                    word
                  })
                }
              }
            })
          }}
        >
          点击我，就送女孩儿一朵玫瑰
        </Text>
        <Text>{this.state.word}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'gray',
  }
});