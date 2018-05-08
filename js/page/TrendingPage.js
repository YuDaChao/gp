import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  RefreshControl,
  ListView,
  StyleSheet,
  TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import NavigationBar from '../common/NavigationBar';
import DataRepository, { STORAGE } from '../expand/dao/DataRepository'
import TrendingCell from '../common/TrendingCell';
import Popover from '../common/Popover'
import RepositoryDetail from './RepositoryDetail';

import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import FavoriteDao from '../expand/dao/FavoriteDao'

const favoriteDao = new FavoriteDao(STORAGE.trending);
const URL = 'https://github.com/trending';

const searchMenus = {
  'today': '?since=daily',
  'week': '?since=weekly',
  'month': '?since=monthly'
};

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
    this.state = {
      tags: [],
      isVisible: false,
      buttonTect: {},
      current: 'today'
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
  showPopover = () => {
    this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: {x: px, y: py, width: width, height: height}
      });
    });
  }

  closePopover = () => {
    this.setState({isVisible: false});
  }

  selectMenu = (menu) => {
    this.setState({
      current: menu,
      isVisible: false
    })
  }
  renderTitleView = () => (
    <View>
      <TouchableOpacity ref="button" onPress={this.showPopover}>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{ color: 'white', marginRight: 8, fontSize: 16, fontWeight: 'bold'}}>
            Trending {this.state.current}
          </Text>
          <Image
            style={{ width: 12, height: 12}}
            source={require('../../res/images/ic_spinner_triangle.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
  render() {
    const { tags } = this.state;
    return(
      <View style={styles.container}>
        <NavigationBar
          titleView={this.renderTitleView()}
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
                    tag.checked ? <TrendingTab key={i} tabLabel={tag.name} searchText={this.state.current} path={tag.path} {...this.props}/> : null
                  ))
                }
              </ScrollableTabView>
            ) : null
        }
        <Popover
          placement="bottom"
          isVisible={this.state.isVisible}
          fromRect={this.state.buttonRect}
          onClose={this.closePopover}>
          {Object.keys(searchMenus).map(menu => (
            <TouchableOpacity key={menu} onPress={() => this.selectMenu(menu) }>
              <Text
                style={{ paddingTop: 5, paddingBottom: 5 , paddingLeft: 15, paddingRight: 15}}
              >{menu}</Text>
            </TouchableOpacity>
          ))}
        </Popover>
      </View>
    )
  }
}

class TrendingTab extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository(STORAGE.trending);
    this.isFavoriteChanged = false;
    this.state = {
      data: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false
    }
  }
  componentDidMount() {
    const { path, searchText } = this.props;
    this.onLoad(path, searchText);
    this.listener = DeviceEventEmitter.addListener(STORAGE.trending, () => {
      this.isFavoriteChanged = true
    })
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.searchText !== this.props.searchText) {
      this.onLoad(nextProps.path, nextProps.searchText)
    }
    if(this.isFavoriteChanged) {
      this.loadFavoriteKey();
      this.isFavoriteChanged = false
    }
  }

  componentWillUnmount() {
    this.listener && this.listener.remove()
  }

  // 更新收藏状态
  flushFavoriteState = (favoriteItem) => {
    const { dataSource } = this.state;
    let modules = [];
    let items = this.items;
    items.forEach(item => {
      modules.push({
        data: item,
        isFavorite: favoriteItem[item.fullName]
      })
    });
    this.setState({
      dataSource: dataSource.cloneWithRows(modules),
      isLoading: false
    });
  }

  loadFavoriteKey = () => {
    favoriteDao.getFaoriteKeyObj()
      .then(result => {
        this.setState({ favoriteItem: result || {}});
        this.flushFavoriteState(result || {})
      })
      .catch(() => this.flushFavoriteState({}))
  }

  onLoad(path, searchText) {
    this.setState({
      isLoading: true
    });
    const url = this.getUrl(path, searchMenus[searchText]);
    this.dataRepository.fetchRepository(url)
      .then(data => {
        this.items = data && data.items ? data.items : (data || []);
        this.loadFavoriteKey();
        if (data && data.update_date && !this.dataRepository.checkDate(data.update_date)) {
          return this.dataRepository.fetchNetRepository(url)
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

  getUrl(path, searchText) {
    return `${URL}${path ? '/' : ''}${path}${searchText}`
  }

  onSelect(item) {
    this.props.navigator.push({
      component: RepositoryDetail,
      params: {
        item,
        flag: STORAGE.trending,
        ...this.props
      }
    });
  }

  handleFavoriteItem = (id, value) => {
    favoriteDao.updateFavoriteKeys(id, value, this.loadFavoriteKey);
  };

  renderRow = (module) => {
    return(
      <TrendingCell
        data={module.data}
        isFavorite={module.isFavorite}
        handleFavoriteItem={this.handleFavoriteItem}
        onSelect={() => this.onSelect(module) }
      />
    )
  };


  render() {
    const { path, searchText } = this.props;
    return(
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(module) => this.renderRow(module)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={() => this.onLoad(path, searchText)}
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
