import moment from 'moment';

function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        (areObjects && !deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
  
    return true;
}

function isObject(object) {
return object != null && typeof object === 'object';
};

function hexWithAlpha(color) {
  var newColor = color.replace('#', '#99');
  return newColor
};

function deadlineIn3Days(endTime) {
    //Get in 5 days unix
    const now = moment().unix() * 1000;
    const threeDays = moment().add('3', 'd').unix() * 1000;
    if (endTime >= now && endTime <= threeDays) {
      return true
    } else {
      return false
    }
}

export {deepEqual, hexWithAlpha, deadlineIn3Days}