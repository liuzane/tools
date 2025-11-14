/**
 * @jest-environment jest-environment-jsdom
 */
// 测试模块前置条件
const fixedDate = new Date(2025, 0, 1, 0, 0, 0, 0); // 固定日期 2025-01-01 00:00:00:000，用于测试时间相关的函数
jest.spyOn(Math, 'random').mockReturnValue(0.5); // 固定随机数 0.5，用于测试随机数相关的函数
jest.useFakeTimers({ now: fixedDate });

// 测试模块
const {
  ELEMENT_ID,
  DATE_FORMAT,
  TIME_FORMAT,
  EXPORT_TYPE,
  appData,
  init,
  onDateFormatChange,
  onCreateData
} = require('../index.js');

describe('信用卡刷卡计划 - 单元测试', () => {
  const langDataMap = {
    'settings.lang-local': 'en-US',
    'settings.currency': 'USD',
    'settings.money-separator': ', ',
    'settings.remark-separator': ';',
  };
  const mockFn = jest.fn(key => langDataMap[key] || key);
  const originAppData = JSON.parse(JSON.stringify(appData)); // 保存原始数据，用于测试完成后恢复

  beforeAll(() => {
    // 设置 DOM 模板结构
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../index.ejs',
      data: {
        _t: mockFn,
        langDataMap,
      },
    });
    document.body.innerHTML = html;
  });


  afterAll(() => {
    // 恢复 Math.random 的原始实现
    Math.random.mockRestore();
    // 在每个测试用例结束后，恢复真实的计时器
    jest.useRealTimers();
    // 在每个测试用例结束后，清除所有模拟函数的调用记录
    jest.clearAllMocks();
  });

  beforeEach(() => {
     // 恢复原始数据
    for (const key in appData) {
      appData[key] = JSON.parse(JSON.stringify(originAppData[key]));
    }
    init();
  });


  test('页面 UI 结构匹配快照', () => {
    init();
    const html = document.querySelector('main').outerHTML;
    expect(html).toMatchSnapshot();
  });

  test('onDateFormatChange() 改变日期格式方法测试', () => {
    const event = { target: { value: DATE_FORMAT.DASH_FORMAT } };
    onDateFormatChange(event);
    const enUSFormatDate = '01-01-2025';

    const dataListElement = document.getElementById(ELEMENT_ID.DataList);
    expect(dataListElement.querySelector('.data-label').textContent).toBe(enUSFormatDate);

    const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
    expect(previewTableBodyElement.querySelector('td').textContent).toBe(enUSFormatDate);
  });

  test('onCreateData() 创建数据方法测试', () => {
    document.getElementById(ELEMENT_ID.TotalAmountLimit).value = '1000.00';
    document.getElementById(ELEMENT_ID.WorkdayDailyCount).value = '2';
    document.getElementById(ELEMENT_ID.WorkdayMinMoney).value = '400.00';
    document.getElementById(ELEMENT_ID.WorkdayMaxMoney).value = '400.00';
    onCreateData();

    expect(appData.settings.totalAmountLimit).toBe('1000.00');

    expect(appData.dataList.length).toBe(1);
  });

  test('onPreview() 预览数据方法测试', () => {
    document.getElementById(ELEMENT_ID.DataList).querySelector('input').value = '$1000.00';

    onPreview();

    const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
    expect(previewTableBodyElement.querySelector('tr:nth-child(1) td:nth-child(2)').textContent).toBe('$1000.00');
  });

  test('onExportTypeChange() 和 onExportData() 导出数据类型方法测试', () => {
    // 保存原始的document方法
    const originalCreateElement = document.createElement.bind(document);
    const mockClickHandler = jest.fn();
    const mockRemoveChild = jest.fn();
    // 创建模拟的a元素
    const mockElement = document.createElement('a');
    Object.assign(mockElement, {
      click: mockClickHandler,
      remove: mockRemoveChild
    });

    // 模拟创建a标签
    document.createElement = jest.fn().mockImplementation((tagName) => {
      if (tagName === 'a') {
        return mockElement;
      }
      return originalCreateElement(tagName);
    });

    const fileName = 'title_20250101000000';

    // 测试导出图片类型
    const event = { target: { value: EXPORT_TYPE.IMAGE } };
    onExportTypeChange(event);
    onExportData();
    expect(appData.settings.exportType).toBe(EXPORT_TYPE.IMAGE);
    expect(mockElement.download).toBe(`${fileName}.jpg`);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
    expect(mockRemoveChild).toHaveBeenCalledTimes(1);

    // 测试导出CSV类型
    event.target.value = EXPORT_TYPE.EXCEL;
    onExportTypeChange(event);
    onExportData();
    expect(appData.settings.exportType).toBe(EXPORT_TYPE.EXCEL);
    expect(mockElement.download).toBe(`${fileName}.csv`);
    expect(mockClickHandler).toHaveBeenCalledTimes(2);
    expect(mockRemoveChild).toHaveBeenCalledTimes(2);

    // 测试导出文本类型
    event.target.value = EXPORT_TYPE.TEXT;
    onExportTypeChange(event);
    onExportData();
    expect(appData.settings.exportType).toBe(EXPORT_TYPE.TEXT);
    expect(mockElement.download).toBe(`${fileName}.txt`);
    expect(mockClickHandler).toHaveBeenCalledTimes(3);
    expect(mockRemoveChild).toHaveBeenCalledTimes(3);
  });
});
