import React from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default class ViewUtils {
  /**
   * 返回一个返回按钮
   * @param callback
   * @returns {*}
   */
  static getLeftButton(callback) {
    return (
      <TouchableOpacity
        style={{padding: 8}}
        onPress={callback}
      >
        <Image
          style={{width: 26, height: 26, tintColor: 'white'}}
          source={require('../../res/images/ic_arrow_back_white_36pt.png')}
        />
      </TouchableOpacity>
    )
  }

  /**
   * 获取设置页的Item
   * @param icon 左侧图标
   * @param text 显示文本
   * @param tintStyle 图标颜色
   * @param expandableIcon 右侧图标
   * @param callback 点击回调函数
   */
  static getSettingItem(icon, text, tintStyle, expandableIcon, callback) {
    return (
      <TouchableOpacity
        onPress={callback}
      >
        <View style={[styles.item, {justifyContent: 'space-between'}]}>
          <View style={styles.item}>
            <Image
              style={[styles.image, {tintColor: tintStyle}]}
              source={icon}
            />
            <Text style={styles.title}>{text}</Text>
          </View>
          <Image
            style={[styles.imagesArrow, {tintColor: tintStyle}]}
            source={expandableIcon ? expandableIcon : require('../../res/images/ic_tiaozhuan.png')}
          />
        </View>
      </TouchableOpacity>
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
  }
});
