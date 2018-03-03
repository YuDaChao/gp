import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import NavigationBar from './NavigationBar';
import request from './request'

export default class FetchTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ''
    }
  }

  getData(url) {
    request(url, {
      method: 'GET'
    })
      .then(result => this.setState({data: JSON.stringify(result)}))
      .catch(err => this.setState({data: JSON.stringify(err)}))
  }

  postData(url, body) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(resp => resp.json())
      .then(result => this.setState({data: JSON.stringify(result)}))
      .catch(err => this.setState({data: JSON.stringify(err)}))
  }

  render() {
    return(
      <View>
        <NavigationBar
          title="Fetch测试"
        />
        <Text
          onPress={() => this.getData('https://facebook.github.io/react-native/movies.json')}
        >点击获取数据</Text>
        <Text
          onPress={() => this.postData('http://rap.taobao.org/mockjsdata/11793/submit',{userName:"小明",password:"123456"})}
        >点击提交数据</Text>
        <Text>返回的结果：{this.state.data}</Text>
      </View>
    )
  }

}