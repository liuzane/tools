/**
 * @jest-environment jest-environment-jsdom
 */

describe('布局组件 - 单元测试', () => {
  const langDataMap = {
    title: 'Test Title',
    keywords: 'Test Keywords',
    description: 'Test Description',
  };
  const mockFn = jest.fn(key => langDataMap[key] || key);

  test('head.ejs 渲染页面元信息', () => {
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../head.ejs',
      data: {
        langDataMap,
        _t: mockFn,
        css: ['/css/test.css']
      },
    });

    expect(html).toMatchSnapshot();

    expect(mockFn).toHaveBeenCalledWith('title');
  });


  test('title.ejs 渲染标题', () => {
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../title.ejs',
      data: { _t: mockFn },
    });

    expect(html).toMatchSnapshot();

    expect(mockFn).toHaveBeenCalledWith('title');
  });

  
  test('menus.ejs 渲染菜单', () => {
    const html = renderHTMLByEJS({
      dir: __dirname,
      filePath: '../menus.ejs',
      data: { _t: mockFn },
    });

    expect(html).toMatchSnapshot();

    expect(mockFn).toHaveBeenCalledWith('test.name');
  });
});