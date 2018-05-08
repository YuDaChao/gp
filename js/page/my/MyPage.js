import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import CustomerTag from './CustomerTag'
import SortTags from './SortTags'

import { MORE_MENU } from '../../common/MoreMenu'
import ViewUtils from '../../util/ViewUtils'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";

export default class MyPage extends Component {


  getSettingItem = (icon, text, tintStyle, expandableIcon, callback) => {
    return (
      ViewUtils.getSettingItem(icon, text, tintStyle, expandableIcon, callback)
    )
  };

  onClickItem = (key) => {
    let TargetComponent, params = {...this.props, menuType: key};
    switch (key) {
      case MORE_MENU.CUSTOMER_LANGUAGE:
        TargetComponent = CustomerTag;
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.CUSTOMER_TAG:
        TargetComponent = CustomerTag;
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.REMOVE_TAG:
        TargetComponent = CustomerTag;
        params.flag = FLAG_LANGUAGE.flag_key;
        params.isRemoveKey = true;
        break;
      case MORE_MENU.SORT_LANGUAGE:
        TargetComponent = SortTags;
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.SORT_TAG:
        TargetComponent = SortTags;
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.CUSTOMER_THEME:
        TargetComponent = SortTags;
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.ABOUT_AUTHOR:
        TargetComponent = SortTags;
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
    }
    if(TargetComponent) {
      this.props.navigator.push({
        component: TargetComponent,
        params
      })
    }
  };

  render() {
    return(
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          title="My"
        />
        <ScrollView>
          <TouchableOpacity
            onPress={() => {() => {this.onClickItem(MORE_MENU.ABOUT)}}}
          >
            <View style={[styles.item, {justifyContent: 'space-between'}]}>
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
                <Image
                  style={[styles.image, {tintColor: '#2196F3'}]}
                  source={require('../../../res/images/ic_trending.png')}
                />
                <Text style={styles.title}>GitHub Popular</Text>
              </View>
              <Image
                style={[styles.imagesArrow, {tintColor: '#2196F3'}]}
                source={require('../../../res/images/ic_tiaozhuan.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          <Text style={styles.header}>
            customer trending language
          </Text>
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_custom_language.png'),
            'Customer Language',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.CUSTOMER_LANGUAGE)}
          )}
          <View style={GlobalStyles.line} />
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_swap_vert.png'),
            'Sort Language',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.SORT_LANGUAGE)}
          )}
          <View style={GlobalStyles.line} />

          <Text style={styles.header}>
            customer popular tag
          </Text>
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_custom_language.png'),
            'Customer Tag',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.CUSTOMER_TAG)}
          )}
          <View style={GlobalStyles.line} />
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_swap_vert.png'),
            'Sort Tag',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.SORT_TAG)}
          )}
          <View style={GlobalStyles.line} />
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_remove.png'),
            'Remove Tag',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.REMOVE_TAG)}
          )}
          <View style={GlobalStyles.line} />

          <Text style={styles.header}>
            setting
          </Text>
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_custom_theme.png'),
            'Customer Theme',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.CUSTOMER_THEME)}
          )}
          <View style={GlobalStyles.line} />
          <View style={GlobalStyles.line} />
          {this.getSettingItem(
            require('./images/ic_insert_emoticon.png'),
            'About Author',
            '#2196F3',
            null,
            () => {this.onClickItem(MORE_MENU.ABOUT_AUTHOR)}
          )}

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  images: {
    width: 35,
    height: 35,
  },
  imagesArrow: {
    width: 22,
    height: 22,
  },
  title: {
    fontSize: 16,
    color: '#586069',
    marginLeft: 10
  },
  header: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  }
});
