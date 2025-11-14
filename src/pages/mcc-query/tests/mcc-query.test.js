/**
 * @jest-environment jest-environment-jsdom
 */
// 在测试模块之前模拟导入的 MCCData 模块
const MCCData = [
  {
    title: 'Test1',
    data: [
      {
        code: '1',
        name: 'test1',
        rate: '0.1%',
      }
    ]
  },
  {
    title: 'Test2',
    data: [
      {
        code: '2',
        name: 'test2',
        rate: '0.2%',
      }
    ]
  }
];
// 模拟导入 MCCData 模块
jest.mock('../mcc-data.json', () => MCCData, { virtual: true });

// 测试模块
const { init, render, onSearch, replaceKeyword } = require('../index.js');

describe('MCC查询 - 单元测试', () => {
  const mockFn = jest.fn();

  beforeAll(() => {
    // 设置 DOM 模板结构
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../index.ejs',
      data: { _t: mockFn },
    });
    document.body.innerHTML = html;
  });


  test('表格 UI 结构匹配快照', () => {
    init();
    const html = document.querySelector('main').outerHTML;
    expect(html).toMatchSnapshot();
  });


  test('render() 方法渲染完整数据', () => {
    render(MCCData);

    const tables = document.querySelectorAll('table');
    expect(tables.length).toBe(MCCData.length);

    const firstCategory = MCCData[0];
    const firstTableTitle = tables[0].querySelector('th').textContent;
    expect(firstTableTitle).toBe(firstCategory.title);
  });


  test('onSearch() 方法根据关键词过滤结果', () => {
    render(MCCData);

    const event = { target: { value: '' } };

    // 输入为空时，渲染完整数据
    jest.useFakeTimers();
    onSearch(event);
    jest.runAllTimers();
    expect(document.querySelectorAll('table').length).toBe(MCCData.length);

    // 输入 title 触发搜索
    event.target.value = MCCData[0].title;
    jest.useFakeTimers();
    onSearch(event);
    jest.runAllTimers();
    expect(document.querySelectorAll('table').length).toBeGreaterThan(0);

    // 输入 code 触发搜索
    event.target.value = MCCData[0].data[0].code;
    jest.useFakeTimers();
    onSearch(event);
    jest.runAllTimers();
    expect(document.querySelectorAll('table').length).toBeGreaterThan(0);

    // 输入 name 触发搜索
    event.target.value = MCCData[0].data[0].name;
    jest.useFakeTimers();
    onSearch(event);
    jest.runAllTimers();
    expect(document.querySelectorAll('table').length).toBeGreaterThan(0);

    const hasHighlight = document.body.innerHTML.includes('keyword');
    expect(hasHighlight).toBe(true);
  });


  test('replaceKeyword() 方法包裹关键词文本', () => {
    const result = replaceKeyword('abc');
    expect(result).toBe('<em class="keyword">abc</em>');
  });
});
