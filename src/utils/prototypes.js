// 插值搜索（ 该方法在已排序的数组性能好，非已排序的请用 findIndex ）
Array.prototype.insertionSearch = function(item) {
  let _this = this, low = 0, high = this.length - 1, mid, element, attribute;
  let arrayItem = function (index) {
    return attribute ? _this[index][attribute] : _this[index];
  };

  if (typeof item === 'object') {
    for (let key in item) {
      attribute = key;
      item = item[key];
      break;
    }
  }

  while (low <= high) {
    mid = Math.floor(low + (item - arrayItem(low)) / (arrayItem(high) - arrayItem(low)) * (high - low));

    element = arrayItem(mid);

    if (element < item) {
      low = mid + 1;
    } else if (element > item) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
};

// 日期格式化
Date.prototype.format = function(format) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'D+': this.getDate(), // 日
    'H+': this.getHours(), // 小时
    'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  };
  const week = {
    '0': 'Sun',
    '1': 'Mon',
    '2': 'Tue',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sat'
  };

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }

  if (/(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, week[this.getDay() + '']);
  }

  return format;
};

console.area = function() {
  console.log('\n');
  console.log('-- start --');
  console.info.apply(undefined, arguments);
  console.log('--  end  --');
  console.log('\n');
};