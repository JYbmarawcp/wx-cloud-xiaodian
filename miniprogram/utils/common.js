/**
 * 防抖
 * @param {function} event
 * @param {number} time
 * @param {boolean} flag
 */
export const debounce = function (event, time = 300, flag = false) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    if (flag && !timer) {
      event.apply(this, args);
    }
    timer = setTimeout(() => {
      event.apply(this, args);
    }, time);
  };
};