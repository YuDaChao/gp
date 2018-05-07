import React, { Component } from 'react';
import {
  View,
  RefreshControl,
  ListView,
  StyleSheet
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import NavigationBar from '../common/NavigationBar';
import DataRepository, { STORAGE } from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell';
import RepositoryDetail from './RepositoryDetail';

import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import FavoriteDao from '../expand/dao/FavoriteDao'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(STORAGE.Popular);
export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.state = {
      tags: [],
    }
  }
  componentDidMount() {
    this.loadData();
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
      favoriteItem: {},
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false
    }
  }
  componentDidMount() {
    this.onLoad();
    this.loadFavoriteKey()
  }

  // 更新收藏状态
  flushFavoriteState = (favoriteItem) => {
    const { dataSource } = this.state;
    let modules = [];
    let items = this.items;
    items.forEach(item => {
      modules.push({
        data: item,
        isFavorite: favoriteItem[item.id]
      })
    });
    this.setState({
      dataSource: dataSource.cloneWithRows(modules),
      isLoading: false
    });
  }

  onLoad() {
    this.setState({
      isLoading: true
    });
    const url = this.getUrl();
    const { dataSource } = this.state;
    this.dataRepository.fetchRepository(url)
      .then(data => {
        this.items = data && data.items ? data.items : (data || []);
        this.loadFavoriteKey();
        if (data && data.update_date && !this.dataRepository.checkDate(data.update_date)) {
          return this.dataRepository.fetchNetRepository(url)
        } else {
        }
      })
      .then(items => {
        if (!items) {
          return
        }
        this.loadFavoriteKey();
      })
      .catch(err => this.setState({data: JSON.stringify(err), isLoading: false}))

  }

  loadFavoriteKey = () => {
    favoriteDao.getFaoriteKeyObj()
      .then(result => {
        this.setState({ favoriteItem: result || {}});
        this.flushFavoriteState(result || {})
      })
      .catch(() => this.flushFavoriteState({}))
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
  handleFavoriteItem = (id) => {
    favoriteDao.updateFavoriteKeys(id, this.loadFavoriteKey);
  }
  renderRow = (module) => {
    return(
      <RepositoryCell
        data={module.data}
        isFavorite={module.isFavorite}
        handleFavoriteItem={this.handleFavoriteItem}
        onSelect={() => this.onSelect(module.data) }
      />
    )
  }
  render() {
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(module) => this.renderRow(module)}
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
