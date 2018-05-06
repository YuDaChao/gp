import React, { Component } from 'react';
import {
  View,
  RefreshControl,
  ListView,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import NavigationBar from '../common/NavigationBar';
import DataRepository, { STORAGE } from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell';
import RepositoryDetail from './RepositoryDetail';

import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.state = {
      tags: []
    }
  }
  componentDidMount() {
    this.loadData()
  }
  loadData() {
    this.languageDao.fetch()
      .then(result => this.setState({tags: result}))
      .catch(error => console.log(error))
  }
  render() {
    const { tags } = this.state;
    return(
      <View style={styles.container}>
        <NavigationBar
          title="最热"
          style={{backgroundColor: '#6495ED'}}
        />
        {
          tags.length > 0 ?
            (
              <ScrollableTabView
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                renderTabBar={() => <ScrollableTabBar/>}
              >
                {
                  tags.map((tag, i) => (
                    tag.checked ? <PopularTab key={i} tabLabel={tag.name} {...this.props}/> : null
                  ))
                }
              </ScrollableTabView>
            ) : null
        }

      </View>
    )
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository(STORAGE.Popular);
    this.state = {
      data: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false
    }
  }
  componentDidMount() {
    this.onLoad()
  }
  onLoad() {
    this.setState({
      isLoading: true
    });
    const url = this.getUrl();
    const { dataSource } = this.state;
    this.dataRepository.fetchRepository(url)
      .then(data => {
        const items = data && data.items ? data.items : (data || []);
        this.setState({
          dataSource: dataSource.cloneWithRows(items),
          isLoading: false
        });
        if (data && data.update_date && !this.dataRepository.checkDate(data.update_date)) {
          DeviceEventEmitter.emit('showToast', '数据过时');
          return this.dataRepository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit('showToast', '显示缓存数据');
        }
      })
      .then(items => {
        if (!items) {
          return
        }
        this.setState({
          dataSource: dataSource.cloneWithRows(items),
          isLoading: false
        });
        DeviceEventEmitter.emit('showToast', '显示网络数据')
      })
      .catch(err => this.setState({data: JSON.stringify(err), isLoading: false}))

  }
  getUrl() {
    return URL + this.props.tabLabel + QUERY_STR
  }
  onSelect(item) {
    this.props.navigator.push({
      component: RepositoryDetail,
      params: {
        item,
        ...this.props
      }
    });
  }
  renderRow(data) {
    return(
      <RepositoryCell
        data={data}
        onSelect={() => this.onSelect(data) }
      />
    )
  }
  render() {
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.onLoad()}
              colors={['#2196F3']}
              tintColors={['#2196F3']}
              title="loading..."
            />
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 30
  }
});
