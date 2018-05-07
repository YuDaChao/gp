import React from 'react'
import {
  AsyncStorage
} from 'react-native'

const FAVORITE_PREFIX = 'favorite_';

export default class FavoriteDao {
  constructor(flag) {
    this.flag = flag;
    this.favoriteKey = `${FAVORITE_PREFIX}${flag}`
  }

  getFaoriteKeyObj() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if(!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        } else {
          reject
        }
      })
    })
  }

  /**
   * 更新用户收藏的项目
   * @param itemId 收藏项目的id
   */
  updateFavoriteKeys(itemId, callback) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if(!error) {
        let favoriteKeyObj = {};
        if (result) {
          favoriteKeyObj = JSON.parse(result);
          if(favoriteKeyObj[itemId]) {
            delete favoriteKeyObj[itemId]
          } else {
            favoriteKeyObj[itemId] = true
          }
        } else {
          favoriteKeyObj[itemId] = true
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeyObj), (error, result) => {
          callback && callback()
        })
      }
    })
  }

}
