import {
  AsyncStorage
} from 'react-native';

import GitHubTrending from 'GitHubTrending'

const STORAGE = {
  Popular: 'popular',
  trending: 'trending'
}

export default class DataRepository {

  constructor(flag) {
    this.flag = flag;
    if (flag === STORAGE.trending) {
      this.trending = new GitHubTrending()
    }
  }

  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      this.fetchLocalRepository(url)
        .then(result => {
          if (result) {
            resolve(result)
          } else {
            this.fetchNetRepository(url)
              .then(result => {
                resolve(result)
              })
              .catch(e => {
                reject(e)
              })
          }
        })
        .catch(() => {
          this.fetchNetRepository(url)
            .then(result => {
              resolve(result)
            })
            .catch(e => {
              reject(e)
            })
        })
    })
  }

  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if(!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
          }
        }
      })
    })
  }

  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {

      if(this.flag === STORAGE.trending) {
        this.trending.fetchTrending(url)
          .then(result => {
            if(!result) {
              reject('response is null')
            } else {
              resolve(result);
              this.saveRepository(url, result)
            }
          })
      } else {
        fetch(url)
          .then(resp => resp.json())
          .then(result => {
            if (!result) {
              reject('response is null')
            } else {
              resolve(result.items);
              this.saveRepository(url, result.items);
            }
          })
          .catch(err => reject(err))
      }
    })
  }

  saveRepository(url, data, callback) {
    if (!url || !data ) {
      return
    }
    const wrapData = {items: data, update_date: new Date().getTime()};
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callback)
  }

  checkDate(longTime) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(longTime);
    if (currentDate.getMonth() !== targetDate.getMonth()) { return false }
    if (currentDate.getDay() !== targetDate.getDay()) { return false }
    if (currentDate.getHours() - targetDate.getHours() > 4) { return false }
    return true
  }
}

export { STORAGE }
