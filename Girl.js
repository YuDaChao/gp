import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import NavigationBar from './NavigationBar'


export default class Girl extends Component {
  constructor(props) {
    super(props);
  }

  renderButton(image) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigator.pop()
        }}
      >
        <Image
          style={{width: 22, height: 22, margin: 8}}
          tintColor='yellow'
          source={image}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <NavigationBar
          title="Girl"
          style={{backgroundColor: '#F08080'}}
          leftButton={this.renderButton(require('./res/images/ic_arrow_back_white_36pt.png'))}
          rightButton={this.renderButton(require('./res/images/ic_star.png'))}
        />
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
    backgroundColor: 'red'
  }
});