// GitHub仓库中XML文件的URL
const XML_URL = 'https://raw.githubusercontent.com/whx61/dfbad/main/%E4%B8%89%E8%A7%92%E6%B4%B2%E8%A1%8C%E5%8A%A8%E9%BB%91%E6%A6%9C%E5%90%8D%E5%8D%95.xml';

// 页面元素
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const noResultsElement = document.getElementById('no-results');
const dataContainer = document.getElementById('data-container');
const blacklistBody = document.getElementById('blacklist-body');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const clearButton = document.getElementById('clear-button');
const pasteButton = document.getElementById('paste-button');

// 存储所有记录的数组
let allRecords = [];

// 页面加载完成后获取数据
document.addEventListener('DOMContentLoaded', function() {
    fetchBlacklistData();
    
    // 添加搜索事件监听器
    searchButton.addEventListener('click', performSearch);
    clearButton.addEventListener('click', clearSearch);
    pasteButton.addEventListener('click', pasteFromClipboard);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});

// 获取黑名单数据
async function fetchBlacklistData() {
    try {
        const response = await fetch(XML_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlText = await response.text();
        parseXMLData(xmlText);
    } catch (error) {
        console.error('获取数据时出错:', error);
        showError();
    }
}

// 解析XML数据并显示在页面上
function parseXMLData(xmlText) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // 检查是否有解析错误
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('XML解析错误');
        }
        
        // 获取所有Record节点
        const records = xmlDoc.querySelectorAll('Record');
        
        // 清空数组和表格内容
        allRecords = [];
        blacklistBody.innerHTML = '';
        
        // 遍历所有记录并添加到数组和表格中
        records.forEach(record => {
            const recordData = {
                playerId: record.querySelector('被举报人ID')?.textContent || '',
                playerNumber: record.querySelector('被举报人编号')?.textContent || '',
                behavior: record.querySelector('行为描述')?.textContent || '',
                evidence: record.querySelector('证据提供')?.textContent || '',
                rewardContent: record.querySelector('悬赏内容')?.textContent || '',
                rewardAmount: record.querySelector('悬赏金额')?.textContent || ''
            };
            
            allRecords.push(recordData);
        });
        
        // 默认显示隐藏了部分信息的记录
        renderRecordsWithProtection(allRecords);
        
        // 隐藏加载提示，显示数据
        loadingElement.classList.add('hidden');
        dataContainer.classList.remove('hidden');
    } catch (error) {
        console.error('解析XML数据时出错:', error);
        showError();
    }
}

// 渲染带有信息保护的记录（默认视图）
function renderRecordsWithProtection(records) {
    // 清空表格内容
    blacklistBody.innerHTML = '';
    
    records.forEach(record => {
        const row = document.createElement('tr');
        
        // 隐藏部分ID和编号信息
        const protectedId = protectId(record.playerId);
        const protectedNumber = protectNumber(record.playerNumber);
        
        row.innerHTML = `
            <td class="protected-field">${protectedId}</td>
            <td class="protected-field">${protectedNumber}</td>
            <td>${record.behavior}</td>
            <td class="protected-field">***</td>
            <td>${record.rewardContent}</td>
            <td>${record.rewardAmount}</td>
        `;
        
        blacklistBody.appendChild(row);
    });
}

// 保护ID信息（隐藏部分字符）
function protectId(id) {
    if (!id) return '';
    
    // 对于较短的ID，隐藏最后一个字符
    if (id.length <= 3) {
        return id.substring(0, id.length - 1) + '*';
    }
    
    // 对于较长的ID，隐藏中间部分
    const start = id.substring(0, 2);
    const end = id.substring(id.length - 1);
    const middle = '*'.repeat(id.length - 3);
    
    return `${start}${middle}${end}`;
}

// 保护编号信息（隐藏部分数字）
function protectNumber(number) {
    if (!number) return '';
    
    // 只显示前4位和后4位，中间用*代替
    if (number.length <= 8) {
        return '*'.repeat(number.length);
    }
    
    const start = number.substring(0, 4);
    const end = number.substring(number.length - 4);
    const middle = '*'.repeat(number.length - 8);
    
    return `${start}${middle}${end}`;
}

// 执行搜索
function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        // 如果搜索词为空，显示保护信息的记录
        showDefaultView();
        return;
    }
    
    // 仅过滤被举报人ID和编号
    const filteredRecords = allRecords.filter(record => {
        return (
            record.playerId.toLowerCase().includes(searchTerm) ||
            record.playerNumber.toLowerCase().includes(searchTerm)
        );
    });
    
    // 显示完整信息的过滤结果
    renderRecords(filteredRecords);
}

// 渲染记录到表格（完整信息）
function renderRecords(records) {
    // 隐藏所有可能显示的状态元素
    noResultsElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    
    // 清空表格内容
    blacklistBody.innerHTML = '';
    
    if (records.length === 0) {
        // 没有匹配的结果
        dataContainer.classList.add('hidden');
        noResultsElement.classList.remove('hidden');
        return;
    }
    
    // 显示匹配的结果
    noResultsElement.classList.add('hidden');
    dataContainer.classList.remove('hidden');
    
    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.playerId}</td>
            <td>${record.playerNumber}</td>
            <td>${record.behavior}</td>
            <td>${record.evidence}</td>
            <td>${record.rewardContent}</td>
            <td>${record.rewardAmount}</td>
        `;
        
        blacklistBody.appendChild(row);
    });
}

// 显示默认视图
function showDefaultView() {
    // 隐藏所有可能显示的状态元素
    noResultsElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    
    // 显示默认保护视图
    renderRecordsWithProtection(allRecords);
    dataContainer.classList.remove('hidden');
}

// 清空搜索
function clearSearch() {
    searchInput.value = '';
    showDefaultView();
}

// 从剪贴板粘贴内容
async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        searchInput.value = text;
        // 粘贴后自动执行搜索
        performSearch();
    } catch (err) {
        console.error('无法从剪贴板读取内容: ', err);
        // 在不支持Clipboard API的环境下提供备选方案
        searchInput.focus();
        document.execCommand('paste');
    }
}

// 显示错误信息
function showError() {
    loadingElement.classList.add('hidden');
    errorElement.classList.remove('hidden');
}