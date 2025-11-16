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
  defaultSettings,
  appData,
  init,
  initSettings,
  initData,
  getRandomMoneys,
  onDateFormatChange,
  onCreateData,
  onDeleteDataItem,
  onPreview,
  onExportTypeChange,
  onExportData,
  formatDate,
  formatTime,
  formatCurrency,
  parseFormatedCurrency,
  customFormatDate,
  calculateTextRect
} = require('../index.js');

describe('信用卡刷卡计划 - 单元测试', () => {
  // 测试模板必要数据
  const langDataMap = {
    'settings.lang-local': 'zh-CN',
    'settings.currency': 'CNY',
    'settings.money-separator': '、',
    'settings.remark-separator': '；',
  };
  const mockFn = jest.fn(key => langDataMap[key] || key);
  let languageSpy;
  // 设置测试数据
  function restoreAppData() {
    defaultSettings.totalAmountLimit = '1000.00';
    defaultSettings.workdayDailyCount = '1';
    defaultSettings.workdayMinMoney = '100.00';
    defaultSettings.workdayMaxMoney = '100.00';
    defaultSettings.weekendDailyCount = '2';
    defaultSettings.weekendMinMoney = '100.00';
    defaultSettings.weekendMaxMoney = '100.00';
    defaultSettings.beginDate = '2025-01-01';
    defaultSettings.dateFormat = DATE_FORMAT.LOCAL_LANG_WITH_WEEKDAY;
    defaultSettings.isFloat = false;
    appData.settings = {
      ...defaultSettings,
      langLocal: langDataMap['settings.lang-local'],
      currency: langDataMap['settings.currency'],
      moneySeparator: langDataMap['settings.money-separator'],
      remarkSeparator: langDataMap['settings.remark-separator'],
    };
    appData.dataList = [];
  }

  beforeAll(() => {
    // 在每个测试用例开始前，创建一个对 window.navigator.language 的 getter 的监听（spy）
    languageSpy = jest.spyOn(window.navigator, 'language', 'get');
    // 模拟它的返回值
    languageSpy.mockReturnValue('zh-CN');

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
    // 在每个测试用例结束后，移除对 window.navigator.language 的监听（spy）
    languageSpy.mockRestore();
  });


  describe('init() 页面快照测试', () => {
    beforeAll(() => {
      // 初始化页面
      init();
    });

    test('测试页面设置UI快照', () => {
      const settingsHtml = document.querySelector('.settings').innerHTML;
      const langLocalElement = document.getElementById(ELEMENT_ID.LangLocal);
      const currencyElement = document.getElementById(ELEMENT_ID.Currency);
      const moneySeparatorElement = document.getElementById(ELEMENT_ID.MoneySeparator);
      const remarkSeparatorElement = document.getElementById(ELEMENT_ID.RemarkSeparator);
      const html = `${settingsHtml} ${langLocalElement.outerHTML} ${currencyElement.outerHTML} ${moneySeparatorElement.outerHTML} ${remarkSeparatorElement.outerHTML}`;
      expect(cleanHtmlSpacing(html)).toMatchSnapshot();
    });

    test('测试渲染数据列表快照', () => {
      const dataListElement = document.getElementById(ELEMENT_ID.DataList);
      expect(cleanHtmlSpacing(dataListElement.innerHTML)).toMatchSnapshot();
    });

    test('测试渲染预览表格快照', () => {
      const previewTableElement = document.getElementById(ELEMENT_ID.PreviewTable);
      expect(cleanHtmlSpacing(previewTableElement.innerHTML)).toMatchSnapshot();
    });
  });


  describe('initSettings() 初始化设置方法测试', () => {
    beforeEach(() => {
      // 每个测试用例开始前，恢复默认数据
      restoreAppData();
    });

    test('测试初始化默认值', () => {
      defaultSettings.totalAmountLimit = '1000.00';
      initSettings();
      expect(document.getElementById(ELEMENT_ID.TotalAmountLimit).value).toBe('1000.00');
      expect(appData.settings.totalAmountLimit).toBe('1000.00');
    });

    test('测试初始化界面设置数据', () => {
      document.getElementById(ELEMENT_ID.TotalAmountLimit).value = '2000.00';
      initSettings(false);
      expect(appData.settings.totalAmountLimit).toBe('2000.00');
    });
  });


  describe('initData() 初始化数据方法测试', () => {
    beforeEach(() => {
      // 每个测试用例开始前，恢复默认数据
      restoreAppData();
    });

    test('测试各项参数为假值时的情况', () => {
      appData.settings.totalAmountLimit = null;
      appData.settings.workdayDailyCount = null;
      appData.settings.workdayMinMoney = null;
      appData.settings.workdayMaxMoney = null;
      appData.settings.weekendDailyCount = null;
      appData.settings.weekendMinMoney = null;
      appData.settings.weekendMaxMoney = null;
      initData();
      expect(appData.dataList.length).toBeGreaterThan(0);
    });

    test('测试生成的金额数据大于总金额且最后一个金额列表无数据的边界的情况', () => {
      appData.settings.totalAmountLimit = '201.00';
      appData.settings.workdayDailyCount = '1';
      appData.settings.workdayMinMoney = '100.00';
      appData.settings.workdayMaxMoney = '100.00';
      appData.settings.weekendDailyCount = '0';
      initData();
      const totalAmount = appData.dataList.reduce((acc, item) => acc + item.moneys.reduce((sum, money) => sum + money, 0), 0);
      expect(totalAmount).toBe(200);
    });

    test('测试生成的金额数据大于总金额且最后一个金额列表有数据的边界的情况', () => {
      appData.settings.totalAmountLimit = '1000.00';
      appData.settings.workdayDailyCount = '4';
      appData.settings.workdayMinMoney = '100.00';
      appData.settings.workdayMaxMoney = '100.00';
      appData.settings.weekendDailyCount = '0';
      initData();
      const totalAmount = appData.dataList.reduce((acc, item) => acc + item.moneys.reduce((sum, money) => sum + money, 0), 0);
      expect(totalAmount).toBe(1000);
    });

    test('测试工作日笔数为 0 时的情况', () => {
      appData.settings.totalAmountLimit = '200.00';
      appData.settings.workdayDailyCount = '0';
      appData.settings.workdayMinMoney = '100.00';
      appData.settings.workdayMaxMoney = '100.00';
      appData.settings.weekendDailyCount = '1';
      initData();
      expect(appData.dataList.filter(item => item.moneys.length > 0).length).toBe(2);
    });

    test('测试周末笔数为 0 时的情况', () => {
      appData.settings.totalAmountLimit = '700.00';
      appData.settings.workdayDailyCount = '1';
      appData.settings.workdayMinMoney = '100.00';
      appData.settings.workdayMaxMoney = '100.00';
      appData.settings.weekendDailyCount = '0';
      initData();
      expect(appData.dataList.filter(item => item.moneys.length > 0).length).toBe(7);
    });

    test('测试总金额为 0 时的情况', () => {
      appData.settings.totalAmountLimit = '0';
      initData();
      expect(appData.dataList.length).toBe(0);
    });

    test('测试工作日笔数以及周末笔数为 0 时的情况', () => {
      appData.settings.workdayDailyCount = '0';
      appData.settings.weekendDailyCount = '0';
      initData();
      expect(appData.dataList.length).toBe(0);
    });

    test('测试工作日数额以及周末数额为 0 时的情况', () => {
      appData.settings.workdayMinMoney = '0';
      appData.settings.workdayMaxMoney = '0';
      appData.settings.weekendMinMoney = '0';
      appData.settings.weekendMaxMoney = '0';
      initData();
      expect(appData.dataList.length).toBe(0);
    });
  });

  
  describe('getRandomMoneys() 生成随机金额方法测试', () => {
    test('测试生成随机金额 - 没有小数位', () => {
      const moneys = getRandomMoneys(1, 100, 200, false);
      expect(moneys.length).toBe(1);
      expect(moneys.reduce((sum, money) => sum + money, 0)).toBeCloseTo(150);
    });

    test('测试生成随机金额 - 有小数位', () => {
      const moneys = getRandomMoneys(1, 100.5, 200.5, true);
      expect(moneys.length).toBe(1);
      expect(moneys.reduce((sum, money) => sum + money, 0)).toBeCloseTo(150.5);
    });
  });


  describe('onDateFormatChange() 改变日期格式方法测试', () => {
    beforeAll(() => {
      init();
    });

    test('测试改变日期格式', () => {
      const event = { target: { value: DATE_FORMAT.DASH_FORMAT } };
      onDateFormatChange(event);
      const expectedDate = '2025-01-01';
      
      expect(appData.settings.dateFormat).toBe(DATE_FORMAT.DASH_FORMAT);

      expect(appData.dataList[0].date).toBe(expectedDate);

      const dataListElement = document.getElementById(ELEMENT_ID.DataList);
      expect(dataListElement.querySelector('.data-label').textContent).toBe(expectedDate);

      const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
      expect(previewTableBodyElement.querySelector('td').textContent).toBe(expectedDate);
    });
  });


  describe('onCreateData() 创建数据方法测试', () => {
    beforeAll(() => {
      document.getElementById(ELEMENT_ID.TotalAmountLimit).value = '200.00';
      document.getElementById(ELEMENT_ID.WorkdayDailyCount).value = '2';
      document.getElementById(ELEMENT_ID.WorkdayMinMoney).value = '200.00';
      document.getElementById(ELEMENT_ID.WorkdayMaxMoney).value = '200.00';
      onCreateData();
    });

    test('测试生成设置是否按预期设置', () => {
      expect(appData.settings.totalAmountLimit).toBe('200.00');
      expect(appData.dataList.length).toBe(1);
    });

    test('测试生成数据列表是否按预期渲染数据', () => {
      const dataListElement = document.getElementById(ELEMENT_ID.DataList);
      const inputElement = dataListElement.querySelector('input');
      expect(inputElement.value).toBe('¥200.00' + appData.settings.remarkSeparator);
    });

    test('测试生成预览表格是否按预期渲染数据', () => {
      const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
      const firstAmountCell = previewTableBodyElement.querySelector('tr:nth-child(1) td:nth-child(2)');
      expect(firstAmountCell.textContent).toBe('¥200.00');
    });
  });


  describe('onDeleteDataItem() 删除数据项方法测试', () => {
    beforeAll(() => {
      document.getElementById(ELEMENT_ID.TotalAmountLimit).value = '100.00';
      document.getElementById(ELEMENT_ID.WorkdayDailyCount).value = '1';
      document.getElementById(ELEMENT_ID.WorkdayMinMoney).value = '100.00';
      document.getElementById(ELEMENT_ID.WorkdayMaxMoney).value = '100.00';
      onCreateData();
    });

    test('测试删除数据项是否按预期删除', () => {
      const mockFn = jest.fn();
      const mockElement = {
        parentElement: {
          remove: mockFn
        }
      };
      onDeleteDataItem(mockElement);
      expect(mockFn).toBeCalledTimes(1);
    });
  });


  describe('onPreview() 预览数据表格方法测试', () => {
    beforeAll(() => {
      init();
    });

    test('测试数据列表去掉金额分割符和备注分隔符后预览数据表格是否按预期渲染数据', () => {
      const dataListElement = document.getElementById(ELEMENT_ID.DataList);
      const inputElement = dataListElement.querySelector('input');
      inputElement.value = '¥100.00';
      onPreview();
      const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
      const firstAmountCell = previewTableBodyElement.querySelector('tr:nth-child(1) td:nth-child(2)');
      expect(firstAmountCell.textContent).toBe('¥100.00');
    });

    test('测试预览数据表格列宽逻辑', () => {
      // 保存原始方法
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      
      // 模拟整个原型方法
      mockGetBoundingClientRect = jest.fn();

      mockGetBoundingClientRect.mockReturnValue({
        width: 100,
      });
      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

      onPreview();

      const previewRemarkColElement = document.getElementById(ELEMENT_ID.PreviewRemarkCol);
      expect(previewRemarkColElement.style.minWidth).toBe('100px');
      
      // 恢复原始方法
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    test('覆盖 renderPreviewTable 方法分支测试', () => {
      const dataListElement = document.getElementById(ELEMENT_ID.DataList);
      const moneyInputElements = dataListElement.querySelectorAll('input');
      const firstInputElement = moneyInputElements[0];
      const secondInputElement = moneyInputElements[1];
      firstInputElement.value = '¥100.00' + appData.settings.moneySeparator + '¥100.00' + appData.settings.remarkSeparator + '备注备注';
      secondInputElement.value = '¥100.00' + appData.settings.remarkSeparator + '备注';
      onPreview();

      const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
      const secondRowElement = previewTableBodyElement.querySelector('tr:nth-child(2)');
      expect(secondRowElement.querySelector('td:nth-child(2)').textContent).toBe('¥100.00');
      expect(secondRowElement.querySelector('td:nth-child(3)').textContent).toBe('备注');
    });
  });


  describe('onExportTypeChange() 和 onExportData() 导出数据类型方法测试', () => {
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

    // 测试导出文件名称
    const fileName = 'title_20250101000000';
    // 模拟事件参数
    const event = { target: { value: '' } };

    beforeEach(() => {
      mockClickHandler.mockClear();
      mockRemoveChild.mockClear();
    });

    afterAll(() => {
      // 恢复原始方法
      document.createElement = originalCreateElement;
    });

    test('测试导出图片类型', () => {
      const previewTableElement = document.getElementById(ELEMENT_ID.PreviewTable);
      const tFooteElement = previewTableElement.querySelector('tfoot');
      tFooteElement.innerHTML += '<tr><td></td><td></td></tr>';
      event.target.value = EXPORT_TYPE.IMAGE;
      onExportTypeChange(event);
      onExportData();
      expect(appData.settings.exportType).toBe(EXPORT_TYPE.IMAGE);
      expect(mockElement.download).toBe(`${fileName}.jpg`);
      expect(mockClickHandler).toHaveBeenCalledTimes(1);
      expect(mockRemoveChild).toHaveBeenCalledTimes(1);
    });

    test('测试导出CSV类型', () => {
      const previewTableBodyElement = document.getElementById(ELEMENT_ID.PreviewTableBody);
      const remarkCellElement = previewTableBodyElement.querySelector('tr:nth-child(1) td:nth-child(3)');
      remarkCellElement.textContent = '备注"备注"备注';
      event.target.value = EXPORT_TYPE.EXCEL;
      onExportTypeChange(event);
      onExportData();
      expect(appData.settings.exportType).toBe(EXPORT_TYPE.EXCEL);
      expect(mockElement.download).toBe(`${fileName}.csv`);
      expect(mockClickHandler).toHaveBeenCalledTimes(1);
      expect(mockRemoveChild).toHaveBeenCalledTimes(1);
    });

    test('测试导出文本类型', () => {
      event.target.value = EXPORT_TYPE.TEXT;
      onExportTypeChange(event);
      onExportData();
      expect(appData.settings.exportType).toBe(EXPORT_TYPE.TEXT);
      expect(mockElement.download).toBe(`${fileName}.txt`);
      expect(mockClickHandler).toHaveBeenCalledTimes(1);
      expect(mockRemoveChild).toHaveBeenCalledTimes(1);
    });
  });


  describe('formatDate() 格式化日期方法测试', () => {
    const date = new Date();
    let localLang = '';

    test('测试默认日期格式', () => {
      expect(formatDate(date)).toBe('2025年1月1日周三');
    });

    test('测试中国地区日期格式', () => {
      localLang = 'zh-CN';
      expect(formatDate(date, localLang, DATE_FORMAT.LOCAL_LANG_WITH_WEEKDAY)).toBe('2025年1月1日周三');
      expect(formatDate(date, localLang, DATE_FORMAT.DASH_FORMAT_WITH_WEEKDAY)).toBe('2025-01-01 周三');
      expect(formatDate(date, localLang, DATE_FORMAT.SLASH_FORMAT_WITH_WEEKDAY)).toBe('2025/01/01 周三');
      expect(formatDate(date, localLang, DATE_FORMAT.LOCAL_LANG_FORMAT)).toBe('2025年1月1日');
      expect(formatDate(date, localLang, DATE_FORMAT.DASH_FORMAT)).toBe('2025-01-01');
      expect(formatDate(date, localLang, DATE_FORMAT.SLASH_FORMAT)).toBe('2025/01/01');
    });

    test('测试美国地区日期格式', () => {
      localLang = 'en-US';
      expect(formatDate(date, localLang, DATE_FORMAT.LOCAL_LANG_WITH_WEEKDAY)).toBe('Wed, Jan 1, 2025');
      expect(formatDate(date, localLang, DATE_FORMAT.DASH_FORMAT_WITH_WEEKDAY)).toBe('Wed, 01-01-2025');
      expect(formatDate(date, localLang, DATE_FORMAT.SLASH_FORMAT_WITH_WEEKDAY)).toBe('Wed, 01/01/2025');
      expect(formatDate(date, localLang, DATE_FORMAT.LOCAL_LANG_FORMAT)).toBe('Jan 1, 2025');
      expect(formatDate(date, localLang, DATE_FORMAT.DASH_FORMAT)).toBe('01-01-2025');
      expect(formatDate(date, localLang, DATE_FORMAT.SLASH_FORMAT)).toBe('01/01/2025');
    });
  });


  describe('formatTime() 格式化时间方法测试', () => {
    const date = new Date();
    
    test('测试默认语言(language = zh-CN)以及默认格式的时间格式', () => {
      expect(formatTime(date)).toBe('00:00:00');
    });

    test('测试短时间格式', () => {
      expect(formatTime(date, undefined, TIME_FORMAT.SHORT_FORMAT)).toBe('00:00');
    });

    test('测试长时间格式', () => {
      expect(formatTime(date, undefined, TIME_FORMAT.LONG_FORMAT)).toBe('00:00:00');
    });
  });


  describe('formatCurrency() 格式化货币方法测试', () => {
    const amount = 1000.00;

    test('测试默认语言(language = zh-CN)格式化', () => {
      const currency = 'CNY';
      expect(formatCurrency(amount, undefined, { currency })).toBe('¥1,000.00');
    });

    test('测试美元格式化', () => {
      const currency = 'USD';
      expect(formatCurrency(amount, 'en-US', { currency })).toBe('$1,000.00');
    });
  });


  describe('parseFormatedCurrency() 解析格式化货币方法测试', () => {
    test('测试解析默认语言(language = zh-CN)格式化货币', () => {
      const currency = 'CNY';
      const formattedCurrency = '¥1,000.00';
      expect(parseFormatedCurrency(formattedCurrency, undefined, { currency })).toBe(1000.00);
    });

    test('测试解析美元格式化货币', () => {
      const currency = 'USD';
      const formattedCurrency = '$1,000.00';
      expect(parseFormatedCurrency(formattedCurrency, 'en-US', { currency })).toBe(1000.00);
    });
  });

  

  describe('customFormatDate() 自定义格式化日期方法测试', () => {
    const date = new Date();

    test('测试默认日期格式', () => {
      expect(customFormatDate(date)).toBe('2025-01-01 00:00:00');
    });

    test('测试自定义日期格式', () => {
      expect(customFormatDate(date, 'YYYYMMDDhhmmssSSS')).toBe('20250101000000000');
      expect(customFormatDate(date, 'YY-M-D')).toBe('25-1-1');
      expect(customFormatDate(date, 'M-D')).toBe('1-1');
    });

    test('测试没有传入日期参数', () => {
      expect(customFormatDate()).toBe('2025-01-01 00:00:00');
    });

    test('测试日期参数错误的情况', () => {
      expect(customFormatDate('test')).toBe('');
    });
  });


  describe('calculateTextRect() 计算文本矩形方法测试', () => {
    // 保存原始方法
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    // 模拟整个原型方法
    const mockGetBoundingClientRect = jest.fn();

    beforeAll(() => {
      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    });

    afterAll(() => {
      // 恢复原始方法
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    test('测试文本宽高', () => {
      mockGetBoundingClientRect.mockReturnValue({
        width: 100,
        height: 20
      });

      const rect = calculateTextRect('test');
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(20);
    });

    test('测试空字符串', () => {
      mockGetBoundingClientRect.mockReturnValue({
        width: 0,
        height: 0
      });

      const rect = calculateTextRect('');
      expect(rect.width).toBe(0);
      expect(rect.height).toBe(0);
    });
  });
});
