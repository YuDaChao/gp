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
import TrendingCell from '../common/TrendingCell';
import RepositoryDetail from './RepositoryDetail';

import FavoriteDao from '../expand/dao/FavoriteDao'
import ArrayUtil from '../util/ArrayUtil'

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={styles.container}>
        <NavigationBar
          title="Favorite"
          style={{backgroundColor: '#6495ED'}}
        />
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarInactiveTextColor="mintcream"
          tabBarActiveTextColor="white"
          tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
          renderTabBar={() => <ScrollableTabBar/>}
        >
          <FavoriteTab tabLabel="Popular" flag={STORAGE.Popular} {...this.props}/>
          <FavoriteTab tabLabel="Trending" flag={STORAGE.trending} {...this.props}/>
        </ScrollableTabView>

      </View>
    )
  }
}

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository(this.props.flag);
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.unFavoriteItems = [];
    this.state = {
      data: '',
      favoriteItem: {},
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false
    }
  }
  componentDidMount() {
    this.load()
  }

  load = () => {
    this.favoriteDao.getFavorites()
      .then(data => {
        if(data) {
          this.flushFavoriteState(data)
        }
      })
  };

  flushFavoriteState = (items) => {
    const { dataSource } = this.state;
    let modules = [];
    items.forEach(item => {
      modules.push({
        data: item,
        isFavorite: true
      })
    });
    this.setState({
      dataSource: dataSource.cloneWithRows(modules),
      isLoading: false
    });
  };

  onSelect(item) {
    this.props.navigator.push({
      component: RepositoryDetail,
      params: {
        item,
        ...this.props
      }
    });
  }

  handleFavoriteItem = (id, value) => {
    this.favoriteDao.updateFavoriteKeys(id, value, this.load);
    ArrayUtil.updateArray(this.unFavoriteItems, id);
    if(this.unFavoriteItems.length > 0) {
      DeviceEventEmitter.emit(this.props.flag)
    }
  }

  renderRow = (module) => {
    const { flag } = this.props;
    const Cell = flag === STORAGE.Popular ? RepositoryCell : TrendingCell;
    return(
      <Cell
        data={module.data}
        isFavorite={module.isFavorite}
        handleFavoriteItem={this.handleFavoriteItem}
        onSelect={() => this.onSelect(module) }
      />
    )
  }
  render() {
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(module) => this.renderRow(module)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.load()}
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
