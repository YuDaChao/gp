import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import NavigationBar from '../../common/NavigationBar';
import SortableListView from 'react-native-sortable-listview';

import LanguageDao, { FLAG_LANGUAGE } from '../../expand/dao/LanguageDao';
import ArrayUtil from '../../util/ArrayUtil';
import ViewUtils from '../../util/ViewUtils';

export default class SortTags extends React.Component {
  constructor(props) {
    super(props);
    this.dataArray = []; // 数据库原始标签
    this.sortResultArray = []; // 排序后的数组
    this.originalCheckArray = []; // 上一次标签排序的顺序
    this.state = {
      checkedTags: [], // 用户已经订阅的标签
    }
  }

  componentDidMount() {
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.loadTags()
  }

  loadTags() {
    this.languageDao.fetch()
      .then(tags => this.getUserTags(tags))
      .catch(err => console.log(err))
  }

  onBack() {
    const { checkedTags } = this.state;
    if (!ArrayUtil.isEqual(this.originalCheckArray, checkedTags)) {
      this.props.navigator.pop();
      return
    }
    Alert.alert(
      '提示',
      '要保存修改吗?',
      [
        {text: 'Cancel', onPress: () => { this.props.navigator.pop()}},
        {text: 'Ok', onPress: () => { this.onSave(true)}},
      ]
    )

  }
  onSave(isChecked) {
    const { checkedTags } = this.state;
    if (!isChecked && !ArrayUtil.isEqual(this.originalCheckArray, checkedTags)) {
      this.props.navigator.pop();
      return
    }
    this.getSortReault();
    this.languageDao.save(this.sortResultArray);
    this.props.navigator.pop()
  }

  // 得到排序后的数组
  getSortReault() {
    this.sortResultArray = ArrayUtil.clone(this.dataArray);
    this.originalCheckArray.map((item, i) => {
      const index = this.dataArray.indexOf(item);
      this.sortResultArray.splice(index, 1, this.state.checkedTags[i])
    })
  }

  // 得到用户订阅的标签
  getUserTags(tags) {
    this.dataArray = tags;
    let checkedTags = [];
    this.dataArray.map(tag => {
      if (tag.checked) {
        checkedTags.push(tag)
      }
    });
    this.setState({
      checkedTags: checkedTags
    });
    this.originalCheckArray = ArrayUtil.clone(checkedTags)
  }

  render() {
    const RightButton = (
      <TouchableOpacity
        style={{ alignItems: 'center'}}
        onPress={() => this.onSave()}
      >
        <View style={{ marginRight: 10}}>
          <Text style={styles.save}>save</Text>
        </View>
      </TouchableOpacity>
    );
    const { checkedTags } = this.state;
    const keys = Object.keys(checkedTags);

    return(
      <View style={styles.container}>
        <NavigationBar
          title="我的"
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}
          rightButton={RightButton}
        />
        <SortableListView
          style={styles.container}
          data={checkedTags}
          order={keys}
          onRowMoved={e => {
            checkedTags.splice(e.to, 0, checkedTags.splice(e.from, 1)[0]);
            this.forceUpdate()
          }}
          renderRow={row => <SortCell data={row} />}
        />
      </View>
    )
  }
}

class SortCell extends React.Component {
  render() {
    return(
      <TouchableHighlight
       underlayColor="#eee"
       delayLongPress={500}
       style={styles.touchableHighlight}
       {...this.props.sortHandlers}
      >
        <View style={styles.item}>
          <Image
            style={styles.image}
            source={require('./images/ic_sort.png')}
          />
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  save: {
    fontSize: 20,
    color: 'white'
  },
  image: {
    tintColor: '#2196F3',
    height: 16,
    width: 16,
    marginRight: 10
  },
  touchableHighlight: {
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});
