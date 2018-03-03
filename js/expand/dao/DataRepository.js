export default class DataRepository {
  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(resp => resp.json())
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
  }
}