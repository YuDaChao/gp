import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import CustomerTag from './CustomerTag';

export default class MyPage extends Component {
  render() {
    return(
      <View>
        <NavigationBar
          title="我的"
        />
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: CustomerTag,
              params: {...this.props}
            })
          }}
        >自动移标签</Text>
      </View>
    )
  }
}