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
const {
  init,
  render,
  onSearch,
  replaceKeyword
} = require('../index.js');

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


  describe('init() 页面快照测试', () => {
    beforeAll(() => {
      // 初始化页面
      init();
    });

    test('搜索框UI快照', () => {
      const html = document.getElementById('query').outerHTML;
      expect(cleanHtmlSpacing(html)).toMatchSnapshot();
    });

    test('表格UI快照', () => {
      const html = document.getElementById('table-container').outerHTML;
      expect(cleanHtmlSpacing(html)).toMatchSnapshot();
    });
  });



  describe('render() 方法测试', () => {
    test('渲染完整数据', () => {
      render(MCCData);

      const tables = document.querySelectorAll('table');
      expect(tables.length).toBe(MCCData.length);

      const firstCategory = MCCData[0];
      const firstTableTitle = tables[0].querySelector('th').textContent;
      expect(firstTableTitle).toBe(firstCategory.title);
    });
  });


  describe('onSearch() 方法测试', () => {
    const event = { target: { value: '' } };

    beforeEach(() => {
      render(MCCData);
      jest.useFakeTimers();
    });

    test('输入为空时，渲染完整数据', () => {
      onSearch(event);
      jest.runAllTimers();
      expect(document.querySelectorAll('table').length).toBe(MCCData.length);
    });

    test('输入 title 触发搜索', () => {
      event.target.value = MCCData[0].title;
      onSearch(event);
      jest.runAllTimers();
      expect(document.querySelectorAll('table').length).toBeGreaterThan(0);
    });

    test('输入 code 触发搜索', () => {
      event.target.value = MCCData[0].data[0].code;
      onSearch(event);
      jest.runAllTimers();
      expect(document.querySelectorAll('table').length).toBeGreaterThan(0);
    });

    test('输入 name 触发搜索', () => {
      event.target.value = MCCData[0].data[0].name;
      onSearch(event);
      jest.runAllTimers();
      expect(document.querySelectorAll('table').length).toBeGreaterThan(0);
    });

    test('搜索结果包含关键词高亮', () => {
      event.target.value = MCCData[0].data[0].name;
      onSearch(event);
      jest.runAllTimers();
      const hasHighlight = document.body.innerHTML.includes('keyword');
      expect(hasHighlight).toBe(true);
    });
  });


  describe('replaceKeyword() 方法测试', () => {
    test('包裹关键词文本', () => {
      const result = replaceKeyword('abc');
      expect(result).toBe('<em class="keyword">abc</em>');
    });
  });
});
