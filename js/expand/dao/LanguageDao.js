import React from 'react';
import {
  AsyncStorage
} from 'react-native';

import tags from '../../../res/data/keys';
import langs from '../../../res/data/langs'

export const FLAG_LANGUAGE = {flag_language: 'flag_language', flag_key: 'flag_key'};

export default class LanguageDao {
  constructor(flag) {
    this.flag = flag
  }
  fetch(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if(error) {
          reject(error)
        } else {
          if (!result) {
            try {
              resolve(JSON.parse(result))
            } catch (err) {
              reject(err)
            }
          } else {
            const data = this.flag === FLAG_LANGUAGE.flag_key ? tags : langs;
            this.save(data);
            resolve(data)
          }
        }
      })
    })
  }
  save(data) {
    AsyncStorage.setItem(this.flag, JSON.stringify(data), (error) => {
    })
  }
}
