'use strict';

module.exports = {
  splitInPairs: function (arr) {
    arr = arr || [];
    return arr.trim().split('\r\n').reduce(function (arr, next, idx) {
      if (idx % 2 === 0) {
        arr.push([next.trim()]);
        return arr;
      }

      arr[arr.length - 1].push(next.trim());
      return arr;
    }, []);
  }
};