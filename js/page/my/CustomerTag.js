import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import CheckBox from 'react-native-check-box';

import NavigationBar from '../../common/NavigationBar';
import ViewUtils from '../../util/ViewUtils';
import ArrayUtil from '../../util/ArrayUtil';
import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';

export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.chengeValues = [];
    this.state = {
      tags: []
    }
  }
  componentDidMount() {
    this.loadData()
  }
  onSave() {
    if (this.chengeValues.length === 0) {
      this.props.navigator.pop();
      return
    }
    this.languageDao.save(this.state.tags);
    this.props.navigator.pop()
  }
  loadData() {
    this.languageDao.fetch()
      .then(result => this.setState({tags: result}))
      .catch(error => console.log(error))
  }
  onClick(data) {
    data.checked = !data.checked;
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
    return (
      data && <CheckBox
        style={styles.checkBox}
        leftText={data.name}
        onClick={() => this.onClick(data)}
        isChecked={data.checked}
        checkedImage={<Image style={{tintColor: '#6495ED'}} source={require('./images/ic_check_box.png')}/>}
        unCheckedImage={<Image style={{tintColor: '#6495ED'}} source={require('./images/ic_check_box_outline_blank.png')} />}
      />
    )
  }
  render() {
    const RightButton = (
      <TouchableOpacity
        onPress={() => this.onSave()}
      >
        <View style={{margin: 10}}>
          <Text style={styles.save}>save</Text>
        </View>
      </TouchableOpacity>
    )
    return(
      <View style={styles.container}>
        <NavigationBar
          title="自定义标签"
          leftButton={ViewUtils.getLeftButton(() => this.onSave())}
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
    fontSize: 18,
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
