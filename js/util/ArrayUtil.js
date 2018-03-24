import React from 'react';

export default class ArrayUtil {

  static updateArray(arr, item) {
    console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj === item) {
        arr.splice(i, 1);
        return
      }
    }
    arr.push(item)
  }
}
