import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';


export default class Girl extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>我是一个女孩儿。</Text>
        <Text>我收到男孩儿送的：{this.props.word}</Text>
        <Text
          onPress={() => {
            this.props.onCallBack('一盒巧克力');
            this.props.navigator.pop()
          }}
        >点击我，我回赠男孩儿一盒巧克力</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red'
  }
});