'use strict';
import MCCData from './mcc-data.json';

// 等待DOM加载完成后执行
// document.addEventListener('DOMContentLoaded', function() {
//   console.log(MCCData);
//   const templateTable = document.getElementById('template-table');
//   const templateRow = document.getElementById('template-row');
// });

// 渲染全量数据
render(MCCData);

// 渲染数据函数
function render(data) {
  // 表格模板元素
  const tableContainerElement = document.getElementById('table-container');
  const templateTable = document.getElementById('template-table');
  const templateTableRow = document.getElementById('template-table-row');

  tableContainerElement.innerHTML = '';
  for (const category of data) {
    const tableElement = templateTable.content.cloneNode(true);
    const tableHeadElement = tableElement.querySelector('thead');
    const tableBodyElement = tableElement.querySelector('tbody');
    tableHeadElement.querySelector('th:nth-child(1)').innerHTML = category.title;
    category.data.forEach(item => {
      const rowElement = templateTableRow.content.cloneNode(true);
      const cells = rowElement.querySelectorAll('td');
      cells[0].innerHTML = item.code;
      cells[1].innerHTML = item.name;
      cells[2].innerHTML = item.rate;
      tableBodyElement.appendChild(rowElement);
    });
    tableContainerElement.appendChild(tableElement);
  }
}

let time = null;

// 搜索函数
function onSearch(event) {
  const value = event.target.value.trim().toLowerCase();
  clearTimeout(time);
  if (!value) {
    render(MCCData);
    return;
  }
  time = setTimeout(() => {
    const newMCCData = [];
    for (category of MCCData) {
      let isTitleMatch = false;
      let title = category.title;
      if (title.toLowerCase().includes(value)) {
        isTitleMatch = true;
        title = category.title.replace(value, replaceKeyword(value));
      }
      const data = [];
      category.data.forEach(item => {
        let newItem = {};
        if (item.code.toLowerCase().includes(value)) {
          newItem.code = item.code.replace(value, replaceKeyword(value));
        }
        if (item.name.toLowerCase().includes(value)) {
          newItem.name = item.name.replace(value, replaceKeyword(value));
        }
        if (Object.keys(newItem).length > 0) {
          data.push({ ...item, ...newItem });
        }
      });
      if (isTitleMatch || data.length > 0) {
        newMCCData.push({ title, data });
      }
    }
    render(newMCCData);
  }, 500);
}

// 注册搜索事件
window.onSearch = onSearch;

// 替换搜索关键词函数
function replaceKeyword(keyword) {
  return `<em class="keyword">${ keyword }</em>`;
}
