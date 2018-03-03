import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  RefreshControl,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import Toast, { DURATION } from 'react-native-easy-toast';

import NavigationBar from './NavigationBar'

const data = {
  "result": [
    {
      "email": "f.lee@taylor.edu",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "g.jackson@hall.net",
      "fullName": "张三张三张三张三张三"
    },
    {
      "email": "l.hall@rodriguez.com",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "q.lopez@davis.io",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "c.gonzalez@perez.net",
      "fullName": "张三张三张三"
    },
    {
      "email": "a.johnson@williams.net",
      "fullName": "张三张三"
    },
    {
      "email": "i.anderson@lopez.edu",
      "fullName": "张三张三"
    },
    {
      "email": "r.lee@davis.org",
      "fullName": "张三张三"
    },
    {
      "email": "o.young@lee.edu",
      "fullName": "张三张三张三张三张三"
    },
    {
      "email": "j.wilson@williams.org",
      "fullName": "张三张三张三张三张三"
    },
    {
      "email": "z.walker@jackson.io",
      "fullName": "张三张三"
    },
    {
      "email": "j.martinez@brown.gov",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "y.martin@lewis.io",
      "fullName": "张三张三张三张三"
    },
    {
      "email": "w.taylor@gonzalez.org",
      "fullName": "张三张三"
    },
    {
      "email": "j.thomas@garcia.org",
      "fullName": "张三张三张三张三"
    }
  ],
  "statusCode": 0
}

export default class ListViewText extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(data.result),
      isLoading: true
    }
  };

  componentDidMount() {
    this.onReload()
  }

  renderRow(rowData) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.toast.show(`你点击了: ${rowData.fullName}`, DURATION.LENGTH_LONG)
          }}
        >
          <Text style={styles.item}>{rowData.fullName}</Text>
          <Text style={styles.item}>{rowData.email}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={rowID} style={styles.line} />
    )
  }

  onReload() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      })
    }, 2000)
  }

  renderFooter() {
    return (
      <View>
        <Image
          style={{width: 400, height: 100}}
          source={{uri: 'https://images.gr-assets.com/hostedimages/1406479536ra/10555627.gif'}}/>
      </View>
    )
  }

  render() {
    return(
      <View>
        <NavigationBar
          title="ListView"
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
          renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.onReload()}
            />
          }
          renderFooter={() => this.renderFooter()}
        />
        <Toast ref={toast => {this.toast = toast}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    fontSize: 18
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    marginTop: 5,
    marginBottom: 5
  }
});