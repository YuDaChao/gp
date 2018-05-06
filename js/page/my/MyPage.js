import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao'
import CustomerTag from './CustomerTag';
import SorTags from './SortTags';

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
              params: {
                ...this.props,
                flag: FLAG_LANGUAGE.flag_key
              }
            })
          }}
        >自定义标签</Text>
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: CustomerTag,
              params: {
                ...this.props,
                flag: FLAG_LANGUAGE.flag_language
              }
            })
          }}
        >自定义语言</Text>
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: SorTags,
              params: {
                ...this.props,
                flag: FLAG_LANGUAGE.flag_key
              }
            })
          }}
        >
          标签排序
        </Text>
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: SorTags,
              params: {
                ...this.props,
                flag: FLAG_LANGUAGE.flag_language
              }
            })
          }}
        >
          语言排序
        </Text>
        <Text
          onPress={() => {
            this.props.navigator.push({
              component: CustomerTag,
              params: {...this.props, isRemoveKey: true}
            })
          }}
        >
          标签移除
        </Text>
      </View>
    )
  }
}
