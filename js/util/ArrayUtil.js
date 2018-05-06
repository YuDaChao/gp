import React from 'react';

export default class ArrayUtil {

  static updateArray(arr, item) {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj === item) {
        arr.splice(i, 1);
        return
      }
    }
    arr.push(item)
  };

  static clone(form) {
    if (!form) {
      return []
    }
    let newArray = [];
    form.map(a => {
      newArray.push(a)
    });
    return newArray
  }

  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) { return false }
    if (arr1.length !== arr2.length) { return false }
    let flag = true;
    arr1.map((a, i) => {
      if (a.name !== arr2[i].name) {
        flag = false;
        return false
      }
    });
    return flag
  }

  static remove(arr, item) {
    if (!arr) { return }
    arr.map((a, i) => {
      if (a === item) {
        arr.splice(i, 1)
      }
    })
  }
}
