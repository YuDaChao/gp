import React, { Component } from 'react';
import {
  View,
  RefreshControl,
  ListView,
  StyleSheet
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import NavigationBar from '../common/NavigationBar';
import DataRepository from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component {
  render() {
    return(
      <View style={styles.container}>
        <NavigationBar
          title="最热"
          style={{backgroundColor: '#6495ED'}}
        />
        <ScrollableTabView
          tabBarBackgroundColor="#2196F3"
          tabBarInactiveTextColor="mintcream"
          tabBarActiveTextColor="white"
          tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
          renderTabBar={() => <ScrollableTabBar/>}
        >
          <PopularTab tabLabel="Java">JAVA</PopularTab>
          <PopularTab tabLabel="iOS">IOS</PopularTab>
          <PopularTab tabLabel="Android">ANDROID</PopularTab>
          <PopularTab tabLabel="JavaScript">JS</PopularTab>
        </ScrollableTabView>
      </View>
    )
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository();
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
    this.dataRepository.fetchNetRepository(url)
      .then(data => this.setState({dataSource: dataSource.cloneWithRows(data.items), isLoading: false}))
      .catch(err => this.setState({data: JSON.stringify(err), isLoading: false}))

  }
  getUrl() {
    return URL + this.props.tabLabel + QUERY_STR
  }
  renderRow(data) {
    return(
      <RepositoryCell data={data} />
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