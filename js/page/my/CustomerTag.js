import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';

import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../util/ViewUtils';
import ArrayUtil from '../../util/ArrayUtil';
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';

export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(this.props.flag);
    this.chengeValues = [];
    this.isRemoveKey = this.props.isRemoveKey;
    this.state = {
      tags: []
    }
  }
  componentDidMount() {
    this.loadData()
  }
  onSave() {
    const { tags } = this.state;
    if (this.chengeValues.length === 0) {
      this.props.navigator.pop();
      return
    }
    if (this.isRemoveKey) {
      this.chengeValues.map(tag => {
        ArrayUtil.remove(tags, tag)
      });
    }
    this.languageDao.save(tags);
    this.props.navigator.pop()
  }
  onBack() {
    if (this.chengeValues.length === 0) {
      this.props.navigator.pop();
      return
    }
    Alert.alert(
      '提示',
      '要保存修改吗?',
      [
        {text: 'Cancel', onPress: () => { this.props.navigator.pop()}},
        {text: 'Ok', onPress: () => { this.onSave()}},
      ]
    )
  }
  loadData() {
    this.languageDao.fetch()
      .then(result => this.setState({tags: result}))
      .catch(error => console.log(error))
  }
  onClick(data) {
    if (!this.isRemoveKey) {
      data.checked = !data.checked;
    }
    ArrayUtil.updateArray(this.chengeValues, data)

  }
  renderTags() {
    const { tags } = this.state;
    const len =  tags.length;
    const views = [];
    for (let i = 0, l = len - 2; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(tags[i])}
            {this.renderCheckBox(tags[i+1])}
          </View>
          <View style={styles.line}/>
        </View>
      )
    }
    views.push(
      <View key={len-1}>
        <View style={styles.item}>
          {
            len % 2 === 0 ?
              this.renderCheckBox(tags[len - 2]) :
              this.renderCheckBox(tags[len - 1])
          }
        </View>
      </View>
    )
    return views
  }

  renderCheckBox(data) {
    if (data) {
      const leftText = data.name;
      const isChecked = this.isRemoveKey ? false : data.checked;
      return (
        <CheckBox
          style={styles.checkBox}
          leftText={leftText}
          onClick={() => this.onClick(data)}
          isChecked={isChecked}
          checkedImage={<Image style={{tintColor: '#6495ED'}} source={require('./images/ic_check_box.png')}/>}
          unCheckedImage={<Image style={{tintColor: '#6495ED'}} source={require('./images/ic_check_box_outline_blank.png')} />}
        />
      )
    }
    return null
  }
  render() {
    let title = this.isRemoveKey ? '标签移除' : '自定义标签';
    title = this.props.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    const rightButton = this.isRemoveKey ? '移除' : '保存';
    const RightButton = (
      <TouchableOpacity
        onPress={() => this.onSave()}
      >
        <View style={{margin: 10}}>
          <Text style={styles.save}>{rightButton}</Text>
        </View>
      </TouchableOpacity>
    );

    return(
      <View style={styles.container}>
        <NavigationBar
          title={title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}
          rightButton={RightButton}
        />
        <ScrollView>
          {this.renderTags()}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  save: {
    fontSize: 20,
    color: 'white'
  },
  checkBox: {
    flex: 1,
    padding: 10
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    height: 0.3,
    backgroundColor: '#ccc'
  }
});
