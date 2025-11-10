'use strict';

// 元素ID
const ELEMENT_ID = {
  TotalAmountLimit: 'total-amount-limit',
  WorkdayDailyCount: 'workday-daily-count',
  WorkdayMinMoney: 'workday-min-money',
  WorkdayMaxMoney: 'workday-max-money',
  WeekendDailyCount: 'weekend-daily-count',
  WeekendMinMoney: 'weekend-min-money',
  WeekendMaxMoney: 'weekend-max-money',
  BeginDate: 'begin-date',
  DateFormat: 'date-format',
  IsFloat: 'is-float',
  LangLocal: 'lang-local',
  Currency: 'currency',
  MoneySeparator: 'money-separator',
  RemarkSeparator: 'remark-separator',
  DataList: 'data-list',
  TemplateDataItem: 'template-data-item',
  PreviewTable: 'preview-table',
  PreviewTableBody: 'preview-table-body',
  PreviewTableRow: 'template-preview-table-row',
  PreviewMoneysCol: 'preview-moneys-col',
  PreviewRemarkCol: 'preview-remark-col',
  TotalAmount: 'total-amount',
  TotalCount: 'total-count',
  CreateTime: 'create-time',
  ExportType: 'export-type',
};
// 日期格式
const DATE_FORMAT = {
  LOCAL_LANG_WITH_WEEKDAY: 'local-lang-with-weekday',
  DASH_FORMAT_WITH_WEEKDAY: 'dash-format-with-weekday',
  SLASH_FORMAT_WITH_WEEKDAY: 'slash-format-with-weekday',
  LOCAL_LANG_FORMAT: 'local-lang-format',
  DASH_FORMAT: 'dash-format',
  SLASH_FORMAT: 'slash-format',
};
// 时间格式
const TIME_FORMAT = {
  LONG_FORMAT: 'long-format',
  SHORT_FORMAT: 'short-format'
};
// 导出类型
const EXPORT_TYPE = {
  IMAGE: 'image',
  EXCEL: 'excel',
  TEXT: 'text',
};

// 应用数据
const appData = {
  settings: {},
  dataList: [],
};

// 初始化页面
function init() {
  initSettings();
  render();
  // onExportData();
}
document.addEventListener('DOMContentLoaded', init);


// 初始化设置
function initSettings() {
  const defaultValues = {
    totalAmountLimit: '10000.00',
    workdayDailyCount: '1',
    workdayMinMoney: '300.00',
    workdayMaxMoney: '500.00',
    weekendDailyCount: '2',
    weekendMinMoney: '700.00',
    weekendMaxMoney: '1000.00',
    beginDate: formatDateToInputValue(new Date()),
    dateFormat: DATE_FORMAT.LOCAL_LANG_WITH_WEEKDAY,
    isFloat: false,
  };
  const settings = { ...defaultValues };
  const totalAmountLimitElement = document.getElementById(ELEMENT_ID.TotalAmountLimit);
  const workdayDailyCountElement = document.getElementById(ELEMENT_ID.WorkdayDailyCount);
  const workdayMinMoneyElement = document.getElementById(ELEMENT_ID.WorkdayMinMoney);
  const workdayMaxMoneyElement = document.getElementById(ELEMENT_ID.WorkdayMaxMoney);
  const weekendDailyCountElement = document.getElementById(ELEMENT_ID.WeekendDailyCount);
  const weekendMinMoneyElement = document.getElementById(ELEMENT_ID.WeekendMinMoney);
  const weekendMaxMoneyElement = document.getElementById(ELEMENT_ID.WeekendMaxMoney);
  const beginDateElement = document.getElementById(ELEMENT_ID.BeginDate);
  const dateFormatElement = document.getElementById(ELEMENT_ID.DateFormat);
  const isFloatElement = document.getElementById(ELEMENT_ID.IsFloat);
  const langLocalElement = document.getElementById(ELEMENT_ID.LangLocal);
  const currencyElement = document.getElementById(ELEMENT_ID.Currency);
  const moneySeparatorElement = document.getElementById(ELEMENT_ID.MoneySeparator);
  const remarkSeparatorElement = document.getElementById(ELEMENT_ID.RemarkSeparator);
  const exportTypeElement = document.getElementById(ELEMENT_ID.ExportType);
  // 总金额上限
  if (totalAmountLimitElement.value) {
    // 获取
    settings.totalAmountLimit = totalAmountLimitElement.value;
  } else {
    // 设置默认值
    totalAmountLimitElement.value = defaultValues.totalAmountLimit;
  }
  // 工作日每天笔数
  if (workdayDailyCountElement.value) {
    settings.workdayDailyCount = workdayDailyCountElement.value;
  } else {
    workdayDailyCountElement.value = defaultValues.workdayDailyCount;
  }
  // 工作日最小金额
  if (workdayMinMoneyElement.value) {
    settings.workdayMinMoney = workdayMinMoneyElement.value;
  } else {
    workdayMinMoneyElement.value = defaultValues.workdayMinMoney;
  }
  // 工作日最大金额
  if (workdayMaxMoneyElement.value) {
    settings.workdayMaxMoney = workdayMaxMoneyElement.value;
  } else {
    workdayMaxMoneyElement.value = defaultValues.workdayMaxMoney;
  }
  // 周末每天笔数
  if (weekendDailyCountElement.value) {
    settings.weekendDailyCount = weekendDailyCountElement.value;
  } else {
    weekendDailyCountElement.value = defaultValues.weekendDailyCount;
  }
  // 周末最小金额
  if (weekendMinMoneyElement.value) {
    settings.weekendMinMoney = weekendMinMoneyElement.value;
  } else {
    weekendMinMoneyElement.value = defaultValues.weekendMinMoney;
  }
  // 周末最大金额
  if (weekendMaxMoneyElement.value) {
    settings.weekendMaxMoney = weekendMaxMoneyElement.value;
  } else {
    weekendMaxMoneyElement.value = defaultValues.weekendMaxMoney;
  }
  // 开始日期
  if (beginDateElement.value) {
    settings.beginDate = beginDateElement.value;
  } else {
    beginDateElement.value = defaultValues.beginDate;
  }
  // 日期格式
  if (dateFormatElement.value) {
    settings.dateFormat = dateFormatElement.value;
  } else {
    dateFormatElement.value = defaultValues.dateFormat;
  }
  // 启用小数
  if (isFloatElement.checked) {
    settings.isFloat = isFloatElement.checked;
  } else {
    isFloatElement.checked = defaultValues.isFloat;
  }
  // 语言环境符号
  settings.langLocal = langLocalElement.value;
  settings.currency = currencyElement.value;
  settings.moneySeparator = moneySeparatorElement.value;
  settings.remarkSeparator = remarkSeparatorElement.value;
  settings.exportType = exportTypeElement.value;
  appData.settings = settings;
}


// 初始化数据
function initData() {
  const totalAmountLimit = parseFloat(appData.settings.totalAmountLimit) || 0;
  const workdayDailyCount = parseInt(appData.settings.workdayDailyCount) || 0;
  const workdayMinMoney = parseFloat(appData.settings.workdayMinMoney) || 0;
  const workdayMaxMoney = parseFloat(appData.settings.workdayMaxMoney) || 0;
  const weekendDailyCount = parseInt(appData.settings.weekendDailyCount) || 0;
  const weekendMinMoney = parseFloat(appData.settings.weekendMinMoney) || 0;
  const weekendMaxMoney = parseFloat(appData.settings.weekendMaxMoney) || 0;
  const beginDate = appData.settings.beginDate;
  const dateFormat = appData.settings.dateFormat;
  const isFloat = appData.settings.isFloat;
  const langLocal = appData.settings.langLocal;
  
  const dataList = [];
  let currentDateTime = new Date(beginDate).getTime();
  let totalAmount = 0;

  if (totalAmountLimit <= 0) return;

  while (totalAmount < totalAmountLimit) {
    const date = new Date(currentDateTime);
    const item = {
      millisecond: currentDateTime,
      date: formatDate(date, langLocal, dateFormat),
      moneys: [],
    };
    let moneys = [];
    let tempTotalAmount = 0;
    let isMaxTotalAmount = false;

    if (date.getDay() === 0 || date.getDay() === 6) {
      moneys = weekendDailyCount <= 0 ? [] : getRandomMoneys(weekendDailyCount, weekendMinMoney, weekendMaxMoney, isFloat);
    } else {
      moneys = workdayDailyCount <= 0 ? [] : getRandomMoneys(workdayDailyCount, workdayMinMoney, workdayMaxMoney, isFloat);
    }

    tempTotalAmount = totalAmount + (moneys.length === 0 ? 0 : moneys.reduce((prev, curr) => prev + curr));

    if (tempTotalAmount > totalAmountLimit) {
      while (moneys.length > 0) {
        const lastItemMoney = moneys.pop();
        tempTotalAmount -= lastItemMoney;
        if (tempTotalAmount <= totalAmountLimit) break;
      }
      isMaxTotalAmount = true;
    }

    if (isMaxTotalAmount && moneys.length === 0) {
      break;
    }

    totalAmount = tempTotalAmount;
    item.moneys = moneys;
    dataList.push(item);

    if (isMaxTotalAmount) break;
    
    // 计算下一天
    const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    currentDateTime = nextDay.getTime();
  }

  appData.dataList = dataList;
}


// 获取随机金额数组
function getRandomMoneys(count, min, max, isFloat) {
  const randomNumber = () => {
    const number = Math.random() * (max - min) + min;
    return isFloat ? Math.round(number * 100) / 100 : Math.round(number);
  };
  return Array.from({length: count}, () => randomNumber());
}


// 渲染数据列表
function renderDataList() {
  const dataListElement = document.getElementById(ELEMENT_ID.DataList);
  const templateDataItem = document.getElementById(ELEMENT_ID.TemplateDataItem);
  const langLocal = appData.settings.langLocal;
  const currency = appData.settings.currency;
  const moneySeparator = appData.settings.moneySeparator;
  const remarkSeparator = appData.settings.remarkSeparator;
  dataListElement.innerHTML = '';
  for (const item of appData.dataList) {
    const dataItemElement = templateDataItem.content.cloneNode(true);
    const dataLabelElement = dataItemElement.querySelector('label[for="money"]');
    const dataInputElement = dataItemElement.querySelector('input#money');
    const id = formatDataItemId(item.millisecond);
    dataLabelElement.setAttribute('for', id);
    dataLabelElement.innerHTML = item.date;
    dataInputElement.id = id;
    dataInputElement.value = item.moneys.map(money => formatCurrency(money, langLocal, { currency })).join(moneySeparator) + remarkSeparator;
    dataListElement.appendChild(dataItemElement);
  }
}


// 格式化数据项ID
function formatDataItemId(id) {
  return `date-${id}`;
}


// 渲染预览表格
function renderPreviewTable() {
  const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
  const templatePreviewTableRow = document.getElementById(ELEMENT_ID.PreviewTableRow);
  const previewMoneysColElement = document.getElementById(ELEMENT_ID.PreviewMoneysCol);
  const previewRemarkColElement = document.getElementById(ELEMENT_ID.PreviewRemarkCol);
  const totalAmountElement = document.getElementById(ELEMENT_ID.TotalAmount);
  const totalCountElement = document.getElementById(ELEMENT_ID.TotalCount);
  const createTimeElement = document.getElementById(ELEMENT_ID.CreateTime);
  const dateFormat = appData.settings.dateFormat;
  const langLocal = appData.settings.langLocal;
  const currency = appData.settings.currency;
  const moneySeparator = appData.settings.moneySeparator;
  const remarkSeparator = appData.settings.remarkSeparator;
  const inputs = document.querySelectorAll(appData.dataList.map(item => `#${formatDataItemId(item.millisecond)}`).join(','));
  let minMoneysStr = null;
  let minRemarkStr = null;
  let totalAmount = 0;
  let totalCount = 0;
  previewTableBodyElement.innerHTML = '';
  for (const inputElement of inputs) {
    const inputValue = inputElement.value;
    const remarkSeparatorIndex = inputValue.indexOf(remarkSeparator);
    const moneysStr = remarkSeparatorIndex >= 0 ? inputValue.substring(0, remarkSeparatorIndex) : inputValue;
    const remarkStr = remarkSeparatorIndex >= 0 ? inputValue.substring(remarkSeparatorIndex + 1) : '';
    const moneys = moneysStr.split(moneySeparator).map(money => parseFormatedCurrency(money, langLocal, { currency }));
    const rowElement = templatePreviewTableRow.content.cloneNode(true);
    const cells = rowElement.querySelectorAll('td');
    cells[0].innerHTML = document.querySelector(`label[for="${inputElement.id}"]`).innerHTML;
    cells[1].innerHTML = moneysStr;
    cells[2].innerHTML = remarkStr;
    minMoneysStr = minMoneysStr === null ? moneysStr : moneysStr.length < minMoneysStr.length ? moneysStr : minMoneysStr;
    minRemarkStr = minRemarkStr === null ? remarkStr : remarkStr.length < minRemarkStr.length ? remarkStr : minRemarkStr;
    totalAmount += moneys.reduce((prev, curr) => prev + curr * 100, 0);
    totalCount += moneys.length;
    previewTableBodyElement.appendChild(rowElement);
  }
  const styles = {
    borderLeft: '1px solid #000',
    borderTop: '1px solid #000',
    padding: '0.2rem 0.4rem'
  };
  const minMoneysStrRect = calculateTextRect(minMoneysStr, styles);
  const minRemarkStrRect = calculateTextRect(minRemarkStr, styles);
  previewMoneysColElement.style.minWidth = `${minMoneysStrRect.width}px`;
  previewRemarkColElement.style.minWidth = `${minRemarkStrRect.width < 40 ? 40 : minRemarkStrRect.width}px`;
  totalAmount = Math.round(totalAmount) / 100;
  totalAmountElement.innerHTML = formatCurrency(totalAmount, langLocal, { currency });
  totalCountElement.innerHTML = totalCount;
  createTimeElement.innerHTML = formatDate(new Date(), langLocal, dateFormat) + ' ' + formatTime(new Date(), langLocal, TIME_FORMAT.SHORT_FORMAT);
}


// 渲染所有数据
function render() {
  initData();
  renderDataList();
  renderPreviewTable();
}


// 绘制表格
function drawTable(tableElement) {
  // 计算表格宽度和高度（不能直接获取CSS盒子属性，因为CSS盒子属性通常带有小数，小数会导致Cancas绘制精度问题）
  let tableWidth = 0;
  let tableHeight = 0;
  const columns = [];
  tableElement.querySelectorAll('col').forEach(col => {
    tableWidth += col.offsetWidth;
    columns.push(col.offsetWidth);
  });
  // 表格表头行数据
  const theadRows = [];
  let tableTHeadHeight = 0;
  tableElement.querySelectorAll('thead tr').forEach((rowElement, index) => {
    tableHeight += rowElement.offsetHeight;
    tableTHeadHeight += rowElement.offsetHeight;
    theadRows.push({
      texts: rowElement.innerText.split('\t'),
      height: rowElement.offsetHeight
    });
  });
  // 表格主体行数据
  const tbodyRows = [];
  let tableTBodyHeight = 0;
  tableElement.querySelectorAll('tbody tr').forEach((rowElement, index) => {
    tableHeight += rowElement.offsetHeight;
    tableTBodyHeight += rowElement.offsetHeight;
    tbodyRows.push({
      texts: rowElement.innerText.split('\t'),
      height: rowElement.offsetHeight
    });
  });
  // 表格页脚行数据
  const tfootRows = [];
  let tableTFootHeight = 0;
  tableElement.querySelectorAll('tfoot tr').forEach((rowElement, index) => {
    tableHeight += rowElement.offsetHeight;
    tableTFootHeight += rowElement.offsetHeight;
    tfootRows.push({
      texts: rowElement.innerText.split('\t'),
      height: rowElement.offsetHeight
    });
  });
  const cellStyle = window.getComputedStyle(tableElement.querySelector('td'));
  // 表格样式
  const tableStyle = {
    width: tableWidth,
    height: tableHeight,
    columns,
    theadRows,
    tbodyRows,
    tfootRows,
    tableTHeadHeight,
    tableTBodyHeight,
    tableTFootHeight,
    tableMargin: 4,
    tableBorderColor: cellStyle.borderTopColor,
    tableBorderWidth: parseInt(cellStyle.borderTopWidth),
    textIndent: parseFloat(cellStyle.paddingLeft),
    fontColor: '#000000',
    fontSize: 12,
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
  };
  const scaleFactor = 4;
  const canvasWidth = tableStyle.width + tableStyle.tableMargin * 2;
  const canvasHeight = tableStyle.height + tableStyle.tableMargin * 2;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvasWidth * scaleFactor;
  canvas.height = canvasHeight * scaleFactor;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-9999';
  canvas.style.backgroundColor = '#ffffff';

  document.body.appendChild(canvas);

  // 缩放上下文
  ctx.scale(scaleFactor, scaleFactor);

  // 清除画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 填充白色背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 全局文本样式
  ctx.textBaseline = 'middle';

  // 绘制表格边框
  drawTableBorder(ctx, tableStyle);

  // 绘制表格表头
  drawTableHeader(ctx, tableStyle);

  // 绘制表格主体
  drawTableBody(ctx, tableStyle);

  // 绘制表格页脚
  drawTableFooter(ctx, tableStyle);
  
  return canvas;
}

function drawTableBorder(ctx, tableStyle) {
  // 外边框
  ctx.strokeStyle = tableStyle.tableBorderColor;
  ctx.lineWidth = tableStyle.tableBorderWidth;
  ctx.strokeRect(tableStyle.tableMargin, tableStyle.tableMargin, tableStyle.width, tableStyle.height);

  // 内边框 - 行
  [].concat(tableStyle.theadRows, tableStyle.tbodyRows, tableStyle.tfootRows).forEach((row, rowIndex) => {
    if (rowIndex === 0) return;
    ctx.moveTo(tableStyle.tableMargin, tableStyle.tableMargin + row.height * rowIndex);
    ctx.lineTo(tableStyle.tableMargin + tableStyle.width, tableStyle.tableMargin + row.height * rowIndex);
    ctx.stroke();
  });

  // 内边框 - 列
  let lastX = tableStyle.tableMargin;
  const firstRowHeight = tableStyle.theadRows[0].height;
  const offsetY = tableStyle.tableMargin;
  tableStyle.columns.forEach((width, colIndex) => {
    if (colIndex === tableStyle.columns.length - 1) return;
    if (colIndex === 0) {
      ctx.moveTo(lastX + width, offsetY + firstRowHeight);
      ctx.lineTo(lastX + width, offsetY + tableStyle.height);
    } else {
      ctx.moveTo(lastX + width, offsetY + firstRowHeight);
      ctx.lineTo(lastX + width, offsetY + tableStyle.height - tableStyle.tableTFootHeight);
    }
    ctx.stroke();
    lastX += width;
  });
}


// 绘制表格表头
function drawTableHeader(ctx, tableStyle) {
  // 文本样式
  ctx.fillStyle = tableStyle.fontColor;
  ctx.font = `500 ${tableStyle.fontSize}px ${tableStyle.fontFamily}`;
  ctx.textAlign = 'center';

  tableStyle.theadRows.forEach((row, rowIndex) => {
    if (row.texts.length === 1) {
      ctx.fillText(
        row.texts[0],
        tableStyle.tableMargin + tableStyle.width / 2,
        tableStyle.tableMargin + row.height / 2
      );
    } else {
      let lastX = tableStyle.tableMargin;
      tableStyle.columns.forEach((width, colIndex) => {
        ctx.fillText(
          row.texts[colIndex],
          lastX + width / 2,
          tableStyle.tableMargin + row.height * rowIndex + row.height / 2
        );
        lastX += width;
      });
    }
  });
}


// 绘制表格主体
function drawTableBody(ctx, tableStyle) {
  // 文本样式
  ctx.fillStyle = tableStyle.fontColor;
  ctx.font = `400 ${tableStyle.fontSize}px ${tableStyle.fontFamily}`;
  
  const tbodyStartY = tableStyle.tableMargin + tableStyle.tableTHeadHeight;
  tableStyle.tbodyRows.forEach((row, rowIndex) => {
    let lastX = tableStyle.tableMargin;
    tableStyle.columns.forEach((width, colIndex) => {
      if (colIndex === 0) {
        ctx.textAlign = 'center';
        ctx.fillText(
          row.texts[colIndex],
          lastX + width / 2,
          tbodyStartY + row.height * rowIndex + row.height / 2
        );
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(
          row.texts[colIndex],
          lastX + tableStyle.textIndent,
          tbodyStartY + row.height * rowIndex + row.height / 2
        );
      }
      lastX += width;
    });
  });
}


// 绘制表格页脚
function drawTableFooter(ctx, tableStyle) {
  // 文本样式
  ctx.fillStyle = tableStyle.fontColor;
  ctx.font = `500 ${tableStyle.fontSize}px ${tableStyle.fontFamily}`;

  const tfootStartY = tableStyle.tableMargin + tableStyle.tableTHeadHeight + tableStyle.tableTBodyHeight;
  tableStyle.tfootRows.forEach((row, rowIndex) => {
    if (row.texts[0]) {
      cellWidth = tableStyle.columns[0];
      ctx.textAlign = 'right';
      ctx.fillText(
        row.texts[0],
        tableStyle.tableMargin + cellWidth - tableStyle.textIndent,
        tfootStartY + row.height * rowIndex + row.height / 2
      );
    }
    if (row.texts[1]) {
      const offsetX = tableStyle.columns[0];
      ctx.textAlign = 'left';
      ctx.fillText(
        row.texts[1],
        tableStyle.tableMargin + offsetX + tableStyle.textIndent,
        tfootStartY + row.height * rowIndex + row.height / 2
      );
    }
  });
}


// 导出图片数据
function exportImage(tableElement, fileName) {
  const canvas = drawTable(tableElement);
  const dataURL = canvas.toDataURL('image/jpeg');
  document.body.removeChild(canvas);
  download(dataURL, `${fileName}.jpg`);
}


// 导出Excel数据
function exportExcel(tableElement, fileName) {
  const bom = true;
  const delimiter = ',';
  const rows = [];
  for (const tr of tableElement.querySelectorAll('tr')) {
    const cells = [];
    const tds = tr.querySelectorAll('th,td');
    for (const td of tds) {
      let text = td.innerText.replace(/\u00A0/g, ' ').trim(); // 处理 &nbsp;
      if (text.includes('"')) text = text.replace(/"/g, '""');
      if (text.includes(delimiter) || text.includes('\n') || text.includes('\r') || text.includes('"')) {
        text = `"${text}"`;
      }
      cells.push(text);
    }
    rows.push(cells.join(delimiter));
  }
  const csvContent = (bom ? '\uFEFF' : '') + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  download(url, `${fileName}.csv`);
}


// 导出文本数据
function exportText(tableElement, fileName) {
  const text = tableElement.innerText.replace(/(\t)/g, '  ');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  download(url, `${fileName}.txt`);
}


/*  ========== 页面绑定事件函数开始 ========== */
// 日期格式 Change 事件
function onDateFormatChange(event) {
  appData.settings.dateFormat = event.target.value;
  appData.dataList.forEach(item => {
    item.date = formatDate(new Date(item.millisecond), appData.settings.langLocal, appData.settings.dateFormat);
  });
  renderDataList();
  renderPreviewTable();
}
window.onDateFormatChange = onDateFormatChange;


// 生成数据事件
function onCreateData() {
  initSettings();
  render();
}
window.onCreateData = onCreateData;


// 预览数据表格事件
function onPreview() {
  renderPreviewTable();
}
window.onPreview = onPreview;


// 导出类型 Change 事件
function onExportTypeChange(event) {
  appData.settings.exportType = event.target.value;
}
window.onExportTypeChange = onExportTypeChange;


// 导出数据事件
function onExportData() {
  const previewTableElement = document.getElementById(ELEMENT_ID.PreviewTable);
  const title = previewTableElement.querySelector('th:nth-child(1)').innerText;
  const date = new Date();
  const time = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const fileName = `${title}_${time}`.replace(/\s+/g, '_');
  switch (appData.settings.exportType) {
    case EXPORT_TYPE.IMAGE:
      exportImage(previewTableElement, fileName);
      break;

    case EXPORT_TYPE.EXCEL:
      exportExcel(previewTableElement, fileName);
      break;

    case EXPORT_TYPE.TEXT:
    default:
      exportText(previewTableElement, fileName);
      break;
  }
}
window.onExportData = onExportData;
/*  ========== 页面绑定事件函数结束 ========== */


/*  ========== 辅助函数开始 ========== */
/**
 * 浏览器 I18N 日期格式化。
 * @method formatDate
 * @param {date} date
 * @param {string} langLocal
 * @param {string} mode
 * @return {string}
 */
function formatDate(date, langLocal = window.navigator.language, mode = DATE_FORMAT.LOCAL_LANG_WITH_WEEKDAY) {
  let langOptions = {};
  switch (mode) {
    // 格式：YYYY-MM-DD 周dd
    case DATE_FORMAT.DASH_FORMAT_WITH_WEEKDAY:
    // 格式：YYYY/MM/DD 周dd
    case DATE_FORMAT.SLASH_FORMAT_WITH_WEEKDAY:
      langOptions = {
        year: 'numeric',
        month: 'numeric',
        day: '2-digit',
        weekday: 'short'
      };
      break;

    // 格式：YYYY年MM月DD日
    case DATE_FORMAT.LOCAL_LANG_FORMAT:
      langOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      };
      break;

    // 格式：YYYY-MM-DD
    case DATE_FORMAT.DASH_FORMAT:
    // 格式：YYYY/MM/DD
    case DATE_FORMAT.SLASH_FORMAT:
      langOptions = {
        year: 'numeric',
        month: 'numeric',
        day: '2-digit'
      };
      break;

    // 格式：YYYY年MM月DD日周dd
    case DATE_FORMAT.LOCAL_LANG_WITH_WEEKDAY:
    default:
      langOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        weekday: 'short'
      };
      break;
  }
  const isDashFormat = mode === DATE_FORMAT.DASH_FORMAT_WITH_WEEKDAY || mode === DATE_FORMAT.DASH_FORMAT;
  // 检查是否为短格式（连接符为 /）
  const isShortFormat = langOptions.weekday !== 'long' && (langOptions.month === 'numeric' || langOptions.month === '2-digit');
  // 配置 formatToParts 方法返回独立的日期部件
  const formatter = new Intl.DateTimeFormat(langLocal, langOptions);
  // 获取日期的各个组成部分
  const parts = formatter.formatToParts(date);
  // 从部件中提取年、月、日的值，并用中划线连接
  const formattedDate = parts.map(({ type, value }) => {
    switch (type) {
      case 'literal':
        return isDashFormat && value === '/' ? '-' : value;

      case 'weekday':
        return isShortFormat ? ' ' + value : value;

      default:
        return value;
    }
  }).join('');
  return formattedDate;
}

/**
 * 浏览器 I18N 时间格式化。
 * @method formatTime
 * @param {date} date
 * @param {string} langLocal
 * @param {string} mode
 * @return {string}
 */
function formatTime(date, langLocal = window.navigator.language, mode = TIME_FORMAT.LONG_FORMAT) {
  let langOptions = {};
  switch (mode) {
    // 格式：HH:mm
    case TIME_FORMAT.SHORT_FORMAT:
      langOptions = {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit'
      };
      break;

    // 格式：HH:mm:ss
    case TIME_FORMAT.LONG_FORMAT:
    default:
      langOptions = {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      break;
  }
  return new Intl.DateTimeFormat(langLocal, langOptions).format(date);
}


// 浏览器 I18N 货币格式化器
const CurrencyFormatter = (langLocal, options) => new Intl.NumberFormat(langLocal, {
  style: 'currency',
  minimumFractionDigits: 2,
  ...options
});


/**
 * 浏览器 I18N 货币格式化。
 * @method formatCurrency
 * @param {string|number} money
 * @param {string} langLocal
 * @param {object} options
 * @return {string}
 */
function formatCurrency(money, langLocal = window.navigator.language, options) {
  return CurrencyFormatter(langLocal, options).format(money);
}


/**
 * 浏览器 I18N 货币反序列化。
 * @method parseFormatedCurrency
 * @param {string} formattedString
 * @param {string} locale
 * @return {number}
 */
function parseFormatedCurrency(formattedString, langLocal = window.navigator.language, options) {
  // 创建格式化器来获取区域设置信息
  const formatter = CurrencyFormatter(langLocal, options);
  
  // 获取该区域设置的格式化部件
  const parts = formatter.formatToParts(1234.56);
  
  // 提取货币符号、千位分隔符和小数点
  let currencySymbol = '';
  let groupSeparator = '';
  let decimalSeparator = '';
  
  parts.forEach(part => {
    if (part.type === 'currency') currencySymbol = part.value;
    if (part.type === 'group') groupSeparator = part.value;
    if (part.type === 'decimal') decimalSeparator = part.value;
  });
  
  // 移除货币符号和千位分隔符，替换小数点
  let cleanString = formattedString
    .replace(new RegExp(`\\${currencySymbol}`), '') // 移除货币符号
    .replace(new RegExp(`\\${groupSeparator}`, 'g'), '') // 移除千位分隔符
    .replace(new RegExp(`\\${decimalSeparator}`), '.'); // 替换为标准小数点
  
  return parseFloat(cleanString);
}


/**
 * 格式化日期为输入框值。
 * @method formatDateToInputValue
 * @param {date} date
 * @return {string}
 */
function formatDateToInputValue(date) {
  if (isNaN(date.getTime())) {
    return '';
  }
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  return `${dateYear}-${dateMonth < 10 ? '0' + dateMonth : dateMonth}-${dateDay < 10 ? '0' + dateDay : dateDay}`;
}


/**
 * 计算文本矩形大小。
 * @method calculateTextRect
 * @param {string} text
 * @param {object} styles
 * @return {number}
 */
function calculateTextRect(text, styles) {
  const spanElement = document.createElement('span');
  spanElement.innerHTML = text;
  spanElement.style.position = 'absolute';
  spanElement.style.visibility = 'hidden';
  spanElement.style.whiteSpace = 'nowrap';
  if (styles) {
    for (const styleKey in styles) {
      spanElement.style[styleKey] = styles[styleKey];
    }
  }
  document.body.appendChild(spanElement);
  const rect = spanElement.getBoundingClientRect();
  document.body.removeChild(spanElement);
  return rect;
}


/**
 * 下载文件。
 * @method download
 * @param {string} url
 * @param {string} name
 */
function download(url, name) {
  const aDom = document.createElement('a');
  aDom.download = name;
  aDom.href = url;
  document.body.appendChild(aDom);
  aDom.click();
  aDom.remove();
}
/*  ========== 辅助函数结束 ========== */
