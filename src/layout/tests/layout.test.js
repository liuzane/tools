/**
 * @jest-environment jest-environment-jsdom
 */

describe('布局组件 - 单元测试', () => {
  const title = 'Test Title';

  test('head.ejs 渲染页面元信息', () => {
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../head.ejs',
      data: {
        langDataMap: {
          'meta.keywords': 'Test Keywords',
          'meta.description': 'Test Description',
        },
        title,
        css: ['/css/test.css']
      },
    });

    expect(html).toMatchSnapshot();
  });


  test('title.ejs 渲染标题', () => {
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../title.ejs',
      data: {
        title,
      },
    });

    expect(html).toMatchSnapshot();
  });

  
  test('menus.ejs 渲染菜单', () => {
    const mockFn = jest.fn(key => key);
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../menus.ejs',
      data: { _t: mockFn },
    });

    expect(html).toMatchSnapshot();

    expect(mockFn).toHaveBeenCalledWith('test.name');
  });
});