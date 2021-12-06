/*
 * Usage:
 *   import { isEmpty } from commonFunctions
 *   isEmpty(値)
 * 
 * trueになる値：null or undefined or "" or [] or {}
 * 
 */
export const isEmpty = (val) => {
  if (!val) {
    if (val !== 0 && val !== false) {
      return true;
    }
  } else if (typeof val == "object") {
    return Object.keys(val).length === 0;

  }
  return false;
}

export const equals = (target1, target2) => {
  if (target1 === target2) {
    return true;
  }

  const getType = (target) => {
    if (target === null || target === undefined) {
      return target;
    } else {
      return target.constructor;
    }
  };

  var tp1 = getType(target1)
    , tp2 = getType(target2);

  if (tp1 !== tp2) {
    return false;
  }

  switch (true) {
    case tp1 === Boolean:
    case tp1 === String:
      return target1 == target2;

    case tp1 === Number:
      return target1 == target2 || isNaN(target1) && isNaN(target2);

    case tp1 === RegExp:
      return target1.toString() === target2.toString();

    case tp1 === Date:
      var t1 = target1.getTime()
        , t2 = target2.getTime();
      return t1 === t2 || isNaN(t1) && isNaN(t2);

    case tp1 === Function:
      return false;

    case target1 instanceof Error:
      return target1.message === target2.message;

    default:
      var keys1 = Object.keys(target1)
        , keys2 = Object.keys(target2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      keys1.sort();
      keys2.sort();
      return keys1.every(function (key, i) {
        return key === keys2[i] && equals(target1[key], target2[key]);
      });
  }
};

export const queryString = {
  parse(str) {
    return [...new URLSearchParams(str).entries()]
      .reduce((obj, e) => {
        if (e[0] in obj) {
          if (Array.isArray(obj[e[0]])) {
            obj[e[0]].push(e[1])
          } else {
            obj[e[0]] = [obj[e[0]], e[1]]
          }
        } else {
          obj[e[0]] = e[1]
        }
        return {...obj}
      }, {})
  },
  stringify(params) {
    return Object.entries(params).map(e => {
      if (Array.isArray(e[1])) {
        return e[1].map(e1 => `${e[0]}=${e1}`).join('&')
      } else {
        return `${e[0]}=${e[1]}`
      }
    }).join('&')
  }
}

export const addComma = val => {
  return Number(val).toLocaleString()
}