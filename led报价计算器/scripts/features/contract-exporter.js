const CONTRACT_WORD_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const CONTRACT_XML_NS = 'http://www.w3.org/XML/1998/namespace';

const CONTRACT_TEMPLATE_INDEX = {
    title: 0,
    orderNo: 1,
    productSection: 2,
    totalSentence: 3,
    productTable: 4,
    delivery: 5,
    transport: 6,
    acceptance: 7,
    paymentAdvance: 8,
    paymentBalance: 9,
    ownership: 10,
    warrantyTitle: 11,
    warrantyScope: 12,
    warrantyService: 13,
    wiring: 14,
    breach: 15,
    dispute: 16,
    effectiveness: 17,
    signatureTitle: 19,
    partyASeal: 20,
    partyASigner: 21,
    partyAContact: 22,
    partyAAddress: 23,
    partyAPhone: 24,
    partyADate: 25,
    partyBSeal: 26,
    partyBSigner: 27,
    partyBContact: 28,
    partyBAccountName: 29,
    partyBAccountNo: 30,
    partyBBank: 31,
    partyBAddress: 32,
    partyBPhone: 33,
    partyBDate: 34,
    reminderTitle: 35,
    reminder1: 36,
    reminder2: 37,
    reminder3: 38
};

const CONTRACT_BRAND_EN_MAP = {
    '中航': 'Zhonghang',
    '诺瓦': 'NovaStar',
    '摩西尔': 'Mosaic',
    '凯视达': 'Kystar',
    '卡莱特': 'Colorlight',
    '灰度': 'Huidu',
    '创联': 'Chuanglian',
    '康盛': 'Kangsheng'
};

const CONTRACT_UNIT_EN_MAP = {
    '平方': 'sqm',
    '个': 'pcs',
    '张': 'pcs',
    '台': 'unit',
    '套': 'set',
    '根': 'pc',
    '项': 'item',
    '块': 'pcs',
    '米': 'm',
    '/': '/'
};

const CONTRACT_NAME_EN_MAP = {
    '室内常规模组': 'Indoor Standard LED Module',
    '室内软模组': 'Indoor Flexible LED Module',
    '室内租赁屏及格栅屏': 'Indoor Rental / Grille Screen',
    '户外常规模组': 'Outdoor Standard LED Module',
    '户外软模组': 'Outdoor Flexible LED Module',
    '户外租赁屏及格栅屏': 'Outdoor Rental / Grille Screen',
    '晶膜屏': 'Crystal Film Screen',
    '全息屏': 'Holographic Screen',
    '系统电源': 'Switching Power Supply',
    '接收卡': 'Receiving Card',
    '视频处理器': 'Video Processor',
    '线材及辅料': 'Cables & Accessories',
    '线材辅料': 'Cable & Accessory Pack',
    '结构支架': 'Support Structure',
    '安装调试费': 'Installation & Commissioning',
    'LED 播放器': 'LED Player Software',
    '播放软件': 'Playback Software',
    '物流运输': 'Logistics',
    '供电线': 'Power Cable',
    '信号线': 'Signal Cable',
    '技术支持': 'Technical Support',
    '防水包边': 'Waterproof Edge Trim',
    '散热空调': 'Cooling Air Conditioner',
    '高原地区专项附加费': 'Plateau Project Surcharge',
    '接收卡备品': 'Receiving Card Spare',
    '箱体连接件': 'Cabinet Connectors',
    '防水密封件': 'Waterproof Sealing Set',
    '散热风扇': 'Cooling Fan',
    '箱体门板': 'Cabinet Rear Door Panel',
    '光纤收发器': 'Fiber Transceiver',
    '分屏器': 'Video Splitter',
    'VJ 声光电联动盒': 'VJ Audio-Visual Trigger Box'
};

const CONTRACT_PARAM_EN_MAP = {
    '国标3C认证排线、电源线、网线、磁铁等(含备品)': 'CCC-certified flat cables, power cables, network cables, magnets, etc. (including spares)',
    '电脑手机双端控制软件，免费赠送教程': 'Dual-end control software for PC and mobile, with complimentary tutorial',
    '运费到付': 'Freight collect',
    '单侧10cm铝塑板包边': 'Single-side 10cm aluminum composite trim',
    '2匹工业级空调': '2 HP industrial air conditioner',
    '不锈钢锁扣/连接件': 'Stainless steel locks / connectors',
    '箱体防水胶条/密封胶': 'Cabinet waterproof sealing strip / sealant',
    '12V 静音风扇 (箱体散热)': '12V silent cooling fan (for cabinet heat dissipation)',
    '后维护门板(含锁)': 'Rear maintenance door panel (with lock)',
    '免费提供远程人工技术指导，安装指导，人员培训': 'Free remote technical guidance, installation guidance and staff training',
    '室内标准安装调试服务': 'Indoor standard installation and commissioning service',
    '户外标准安装调试服务': 'Outdoor standard installation and commissioning service',
    '会议室音响30-50平方': 'Conference-room audio system for 30-50 sqm',
    '会议室音响50-100平方': 'Conference-room audio system for 50-100 sqm'
};

const CONTRACT_EN_REPLACEMENTS = [
    ['（', '('],
    ['）', ')'],
    ['，', ', '],
    ['；', '; '],
    ['：', ': '],
    ['。', '. '],
    ['、', ', '],
    ['㎡', ' sqm'],
    ['平方', ' sqm'],
    ['西藏', 'Tibet'],
    ['高原', 'plateau'],
    ['室内', 'Indoor '],
    ['户外', 'Outdoor '],
    ['显示屏', 'display screen'],
    ['显示模组', 'display module'],
    ['模组', 'module'],
    ['高刷', 'high-refresh '],
    ['普通刷', 'standard-refresh '],
    ['专用', 'dedicated '],
    ['电源', 'power supply'],
    ['接收卡', 'receiving card'],
    ['视频处理器', 'video processor'],
    ['播放器', 'player'],
    ['播放软件', 'player software'],
    ['线材及辅料', 'cables & accessories'],
    ['线材辅料', 'cable & accessory pack'],
    ['排线', 'flat cable'],
    ['网线', 'network cable'],
    ['电源线', 'power cable'],
    ['磁铁', 'magnet'],
    ['结构支架', 'support structure'],
    ['结构', 'structure'],
    ['包边', 'trim'],
    ['防水', 'waterproof '],
    ['安装调试', 'installation and commissioning'],
    ['安装', 'installation'],
    ['调试', 'commissioning'],
    ['箱体', 'cabinet'],
    ['压铸铝', 'die-cast aluminum '],
    ['简易', 'simple '],
    ['备品', 'spare'],
    ['备件', 'spare'],
    ['连接件', 'connectors'],
    ['密封件', 'sealing set'],
    ['门板', 'door panel'],
    ['风扇', 'fan'],
    ['空调', 'air conditioner'],
    ['工业级', 'industrial-grade '],
    ['免费赠送', 'complimentary'],
    ['含内部配件', 'including internal accessories'],
    ['含3%备品', 'including 3% spare'],
    ['含5%备品', 'including 5% spare'],
    ['网口', '-port'],
    ['口接收卡', '-port receiving card'],
    ['口视频处理器', '-port video processor'],
    ['远程', 'remote '],
    ['人工技术指导', 'technical guidance'],
    ['安装指导', 'installation guidance'],
    ['人员培训', 'staff training'],
    ['铝塑板', 'aluminum composite panel'],
    ['静音风扇', 'silent fan'],
    ['后维护', 'rear-maintenance '],
    ['前维护', 'front-maintenance '],
    ['真空吸盘', 'vacuum suction tool'],
    ['充电款', 'wireless version'],
    ['插电款', 'corded version'],
    ['会议室音响', 'conference-room audio system'],
    ['声光电联动盒', 'audio-visual trigger box']
];

function contractRoundCurrency(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function contractCleanField(value) {
    const text = String(value || '').trim();
    return text === '待补充' ? '' : text;
}

function contractFormatDateParts(dateText) {
    const normalizedText = String(dateText || '').replace(/[年月]/g, '/').replace(/[日.]/g, '');
    const date = new Date(normalizedText || Date.now());
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

    return {
        year: String(safeDate.getFullYear()),
        month: String(safeDate.getMonth() + 1),
        day: String(safeDate.getDate())
    };
}

function contractCreateOrderNo() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `FXGD-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function contractFormatNumber(value, fractionDigits = 2, locale = 'en-US') {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return '';
    }

    return numeric.toLocaleString(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
}

function contractFormatQty(value) {
    if (value === null || typeof value === 'undefined' || value === '') {
        return '';
    }

    if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim())) {
        value = Number(value);
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        if (Math.abs(value - Math.round(value)) < 1e-9) {
            return String(Math.round(value));
        }

        return value.toFixed(3).replace(/\.?0+$/, '');
    }

    return String(value);
}

function contractNumberToChineseUpper(value) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [
        ['元', '万', '亿', '兆'],
        ['', '拾', '佰', '仟']
    ];

    let amount = Math.abs(contractRoundCurrency(value));
    let output = '';

    for (let i = 0; i < fraction.length; i += 1) {
        output += (digit[Math.floor(amount * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }

    output = output || '整';
    amount = Math.floor(amount);

    for (let i = 0; i < unit[0].length && amount > 0; i += 1) {
        let section = '';
        for (let j = 0; j < unit[1].length && amount > 0; j += 1) {
            section = digit[amount % 10] + unit[1][j] + section;
            amount = Math.floor(amount / 10);
        }

        section = section.replace(/(零.)*零$/, '').replace(/^$/, '零');
        output = section + unit[0][i] + output;
    }

    return output
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
}

function contractBelowThousandToEnglish(value) {
    const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (value === 0) return '';
    if (value < 10) return ones[value];
    if (value < 20) return teens[value - 10];
    if (value < 100) {
        const ten = Math.floor(value / 10);
        const remainder = value % 10;
        return tens[ten] + (remainder ? `-${ones[remainder]}` : '');
    }

    const hundred = Math.floor(value / 100);
    const remainder = value % 100;
    return `${ones[hundred]} Hundred${remainder ? ` ${contractBelowThousandToEnglish(remainder)}` : ''}`;
}

function contractIntegerToEnglish(value) {
    if (value === 0) return 'Zero';

    const groups = [
        { value: 1000000000, label: 'Billion' },
        { value: 1000000, label: 'Million' },
        { value: 1000, label: 'Thousand' },
        { value: 1, label: '' }
    ];

    let remaining = value;
    const parts = [];

    groups.forEach((group) => {
        if (remaining >= group.value) {
            const section = Math.floor(remaining / group.value);
            remaining %= group.value;
            const sectionText = contractBelowThousandToEnglish(section);
            parts.push(group.label ? `${sectionText} ${group.label}` : sectionText);
        }
    });

    return parts.join(' ');
}

function contractNumberToEnglishCurrency(value) {
    const rounded = contractRoundCurrency(value);
    const integerPart = Math.floor(rounded);
    const decimalPart = Math.round((rounded - integerPart) * 100);
    const integerText = contractIntegerToEnglish(integerPart);
    const decimalText = decimalPart ? `${contractIntegerToEnglish(decimalPart)} Cents` : 'Zero Cents';
    return `${integerText} Yuan and ${decimalText} Only`;
}

function contractSafeFilenamePart(value) {
    const text = contractCleanField(value) || 'project';
    return text.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').slice(0, 80);
}

function contractReplaceAll(text, search, replacement) {
    return String(text).split(search).join(replacement);
}

function contractTranslateWithCatalog(text, category) {
    if (typeof getText !== 'function') {
        return '';
    }

    try {
        const translated = getText(text, category, 'en');
        return translated && translated !== text ? translated : '';
    } catch (error) {
        return '';
    }
}

function contractContainsAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
}

function contractIsFreeItem(item) {
    const name = String(item.name || '');
    return (Number(item.price) === 0 && Number(item.amount) === 0) || name.includes('播放器') || name.includes('播放软件');
}

function contractShouldIncludeItem(item) {
    const name = String(item.name || '');
    return !['物流运输', '供电线', '信号线', '技术支持'].includes(name);
}

function contractTranslateGenericToEnglish(text) {
    const cleanText = contractCleanField(text);
    if (!cleanText) {
        return '';
    }

    if (typeof ExportTranslator !== 'undefined') {
        return ExportTranslator.translateGenericText(cleanText, 'en');
    }

    let output = cleanText;
    Object.entries(CONTRACT_BRAND_EN_MAP).forEach(([source, target]) => {
        output = contractReplaceAll(output, source, target);
    });

    CONTRACT_EN_REPLACEMENTS.forEach(([source, target]) => {
        output = contractReplaceAll(output, source, target);
    });

    output = output
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.;:()])/g, '$1')
        .replace(/\((\s+)/g, '(')
        .replace(/(\s+)\)/g, ')')
        .trim();

    return output;
}

function contractTranslateUnit(unit, lang) {
    const cleanUnit = contractCleanField(unit);
    if (lang !== 'en') {
        return cleanUnit;
    }

    if (typeof ExportTranslator !== 'undefined') {
        return ExportTranslator.translateUnit(cleanUnit, lang);
    }

    const translated = contractTranslateWithCatalog(cleanUnit, 'units');
    if (translated) {
        return translated;
    }

    return CONTRACT_UNIT_EN_MAP[cleanUnit] || cleanUnit;
}

function contractTranslateName(name, lang) {
    const cleanName = contractCleanField(name);
    if (lang !== 'en') {
        return cleanName;
    }

    if (typeof ExportTranslator !== 'undefined') {
        return ExportTranslator.translateName(cleanName, lang);
    }

    const translated = contractTranslateWithCatalog(cleanName, 'products');
    if (translated) {
        return translated;
    }

    if (CONTRACT_NAME_EN_MAP[cleanName]) {
        return CONTRACT_NAME_EN_MAP[cleanName];
    }

    return contractTranslateGenericToEnglish(cleanName);
}

function contractTranslateParam(param, lang) {
    const cleanParam = contractCleanField(param);
    if (lang !== 'en') {
        return cleanParam;
    }

    if (typeof ExportTranslator !== 'undefined') {
        return ExportTranslator.translateParam(cleanParam, lang);
    }

    const translated = contractTranslateWithCatalog(cleanParam, 'params');
    if (translated) {
        return translated;
    }

    if (CONTRACT_PARAM_EN_MAP[cleanParam]) {
        return CONTRACT_PARAM_EN_MAP[cleanParam];
    }

    return contractTranslateGenericToEnglish(cleanParam);
}

function contractGetItemNote(item, lang) {
    const text = `${item.name || ''} ${item.param || ''}`;

    if (contractIsFreeItem(item)) {
        return lang === 'en' ? 'Complimentary' : '免费赠送';
    }

    if (contractContainsAny(text, ['模组', '模块'])) {
        return lang === 'en' ? '3-year warranty' : '质保三年';
    }

    if (contractContainsAny(text, ['电源', '接收卡', '处理器', '收发器', '分屏器'])) {
        if (text.includes('电源')) {
            return lang === 'en' ? 'Incl. spare, 1-year warranty' : '含备品，质保一年';
        }
        return lang === 'en' ? '1-year warranty' : '质保一年';
    }

    if (contractContainsAny(text, ['结构', '包边', '箱体'])) {
        return lang === 'en' ? 'Mounting accessories included' : '含安装附件';
    }

    if (contractContainsAny(text, ['线材', '排线', '网线', '电源线', '磁铁'])) {
        return lang === 'en' ? 'Provisioned according to screen area' : '按面积配足';
    }

    if (contractContainsAny(text, ['高原', '西藏', 'Tibet'])) {
        return lang === 'en' ? 'For plateau / Tibet projects' : '针对高原/西藏项目';
    }

    if (contractContainsAny(text, ['备品', '备件', '3%'])) {
        return lang === 'en' ? 'Incl. spare item' : '含备品';
    }

    return '';
}

function contractFormatCurrency(value, lang, withSymbol = true) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return '';
    }

    const formatted = contractFormatNumber(numeric, 2);
    if (!withSymbol) {
        return formatted;
    }

    return lang === 'en' ? `CNY ${formatted}` : `¥${formatted}`;
}

function contractFormatUnitPrice(item, lang) {
    if (contractIsFreeItem(item)) {
        return lang === 'en' ? 'Free' : '免费';
    }

    const numeric = Number(item.price);
    return Number.isFinite(numeric) ? contractFormatCurrency(numeric, lang, false) : '';
}

function contractFormatItemAmount(item, lang) {
    if (contractIsFreeItem(item)) {
        return '';
    }

    const numeric = Number(item.amount);
    return Number.isFinite(numeric) ? contractFormatCurrency(numeric, lang, true) : '';
}

function contractBuildItems(contractData, lang) {
    const rawItems = (contractData && contractData.quotationItems) || (window.quotationData && window.quotationData.items) || [];

    return rawItems
        .filter(contractShouldIncludeItem)
        .map((item) => ({
            no: item.no === null || typeof item.no === 'undefined' ? '' : String(item.no),
            name: contractTranslateName(item.name, lang),
            param: contractTranslateParam(item.param, lang),
            unit: contractTranslateUnit(item.unit, lang),
            qty: contractFormatQty(item.qty),
            priceText: contractFormatUnitPrice(item, lang),
            amountText: contractFormatItemAmount(item, lang),
            note: contractGetItemNote(item, lang)
        }));
}

function contractGetFinancials(contractData) {
    const rawItems = (contractData && contractData.quotationItems) || (window.quotationData && window.quotationData.items) || [];
    const financial = (contractData && contractData.financial) || {};

    const totalExcludingTax = Number.isFinite(Number(financial.totalExcludingTax))
        ? Number(financial.totalExcludingTax)
        : rawItems.reduce((sum, item) => sum + (Number.isFinite(Number(item.amount)) ? Number(item.amount) : 0), 0);
    const vatRate = Number.isFinite(Number(financial.vatRate)) ? Number(financial.vatRate) : 0.13;
    const vatAmount = Number.isFinite(Number(financial.vatAmount))
        ? Number(financial.vatAmount)
        : contractRoundCurrency(totalExcludingTax * vatRate);
    const totalIncludingTax = Number.isFinite(Number(financial.totalIncludingTax))
        ? Number(financial.totalIncludingTax)
        : contractRoundCurrency(totalExcludingTax + vatAmount);
    const prepaymentRate = Number.isFinite(Number(financial.prepaymentRate)) ? Number(financial.prepaymentRate) : 0.5;
    const finalPaymentRate = Number.isFinite(Number(financial.finalPaymentRate)) ? Number(financial.finalPaymentRate) : 0.5;

    return {
        totalExcludingTax,
        vatRate,
        vatAmount,
        totalIncludingTax,
        prepaymentRate,
        finalPaymentRate,
        prepaymentAmount: contractRoundCurrency(totalIncludingTax * prepaymentRate),
        finalPaymentAmount: contractRoundCurrency(totalIncludingTax * finalPaymentRate)
    };
}

function contractGetLiveField() {
    const ids = Array.from(arguments);
    for (const id of ids) {
        const el = document.getElementById(id);
        if (!el || typeof el.value === 'undefined') continue;
        const value = String(el.value || '').trim();
        if (value) {
            return value;
        }
    }
    return '';
}

function contractGetLiveProjectInfo(baseInfo) {
    const safeBaseInfo = baseInfo || {};
    return {
        customer: contractGetLiveField('shellCustomerName', 'customerName') || safeBaseInfo.customer || '',
        project: contractGetLiveField('shellProjectName', 'projectName') || safeBaseInfo.project || '',
        location: contractGetLiveField('shellProjectLocation', 'projectLocation') || safeBaseInfo.location || '',
        date: safeBaseInfo.date || new Date().toLocaleDateString('zh-CN')
    };
}

function contractBuildDocumentData(lang) {
    const source = window.contractData || {};
    const projectInfo = contractGetLiveProjectInfo(source.projectInfo || {});
    source.projectInfo = {
        ...(source.projectInfo || {}),
        ...projectInfo
    };
    const dateText = contractCleanField(projectInfo.date) || new Date().toLocaleDateString('zh-CN');

    return {
        lang,
        orderNo: contractCreateOrderNo(),
        customer: contractCleanField(projectInfo.customer),
        project: contractCleanField(projectInfo.project),
        location: contractCleanField(projectInfo.location),
        dateText,
        dateParts: contractFormatDateParts(dateText),
        items: contractBuildItems(source, lang),
        financials: contractGetFinancials(source),
        amountUpperZh: contractNumberToChineseUpper(contractGetFinancials(source).totalIncludingTax),
        amountUpperEn: contractNumberToEnglishCurrency(contractGetFinancials(source).totalIncludingTax),
        isPlateauProject: Boolean(source.flags && source.flags.isPlateauProject)
    };
}

function contractCreateWordNode(documentNode, localName) {
    return documentNode.createElementNS(CONTRACT_WORD_NS, `w:${localName}`);
}

function contractGetDirectChildren(node, localName) {
    return Array.from(node.childNodes).filter((child) => child.nodeType === 1 && (!localName || child.localName === localName));
}

function contractGetFirstDescendant(node, localName) {
    return node.getElementsByTagNameNS(CONTRACT_WORD_NS, localName)[0] || null;
}

function contractReplaceParagraphText(paragraph, text) {
    const documentNode = paragraph.ownerDocument;
    const runProps = contractGetFirstDescendant(paragraph, 'rPr');

    contractGetDirectChildren(paragraph).forEach((child) => {
        if (child.localName !== 'pPr') {
            paragraph.removeChild(child);
        }
    });

    const run = contractCreateWordNode(documentNode, 'r');
    if (runProps) {
        run.appendChild(runProps.cloneNode(true));
    }

    const textNode = contractCreateWordNode(documentNode, 't');
    const stringValue = String(text || '');
    if (/^\s|\s$/.test(stringValue) || stringValue.includes('  ')) {
        textNode.setAttributeNS(CONTRACT_XML_NS, 'xml:space', 'preserve');
    }
    textNode.textContent = stringValue;
    run.appendChild(textNode);
    paragraph.appendChild(run);
}

function contractSetCellText(cell, text) {
    let paragraphs = contractGetDirectChildren(cell, 'p');
    if (!paragraphs.length) {
        const paragraph = contractCreateWordNode(cell.ownerDocument, 'p');
        cell.appendChild(paragraph);
        paragraphs = [paragraph];
    }

    const primaryParagraph = paragraphs[0];
    paragraphs.slice(1).forEach((paragraph) => cell.removeChild(paragraph));
    contractReplaceParagraphText(primaryParagraph, text);
}

function contractSetRowCells(row, values) {
    const cells = contractGetDirectChildren(row, 'tc');
    cells.forEach((cell, index) => {
        contractSetCellText(cell, values[index] || '');
    });
}

function contractRebuildProductTable(table, documentData, lang) {
    const existingRows = contractGetDirectChildren(table, 'tr');
    if (existingRows.length < 16) {
        throw new Error('Contract template table structure is incomplete.');
    }

    const headerTemplate = existingRows[0].cloneNode(true);
    const itemTemplate = existingRows[1].cloneNode(true);
    const subtotalTemplate = existingRows[10].cloneNode(true);
    const vatTemplate = existingRows[11].cloneNode(true);
    const totalTemplate = existingRows[12].cloneNode(true);
    const qualityHeaderTemplate = existingRows[13].cloneNode(true);
    const qualityBodyTemplate = existingRows[14].cloneNode(true);
    const deliveryHeaderTemplate = existingRows[15].cloneNode(true);

    existingRows.forEach((row) => table.removeChild(row));

    const headerRow = headerTemplate.cloneNode(true);
    contractSetRowCells(headerRow, lang === 'en'
        ? ['No.', 'Item / Brand', 'Specification', 'Unit', 'Qty', 'Unit Price (CNY)', 'Amount (CNY)', 'Note']
        : ['编号', '名称/品牌', '参数规格', '单位', '数量', '单价(元)', '合计(元)', '备注']);
    table.appendChild(headerRow);

    documentData.items.forEach((item) => {
        const row = itemTemplate.cloneNode(true);
        contractSetRowCells(row, [
            item.no,
            item.name,
            item.param,
            item.unit,
            item.qty,
            item.priceText,
            item.amountText,
            item.note
        ]);
        table.appendChild(row);
    });

    const subtotalRow = subtotalTemplate.cloneNode(true);
    contractSetRowCells(subtotalRow, [
        '',
        lang === 'en' ? 'Total Amount (Excl. VAT)' : '屏幕总价（未税）',
        '',
        '',
        '',
        '',
        contractFormatCurrency(documentData.financials.totalExcludingTax, lang, true),
        ''
    ]);
    table.appendChild(subtotalRow);

    const vatRow = vatTemplate.cloneNode(true);
    contractSetRowCells(vatRow, [
        '',
        lang === 'en' ? 'VAT (13%)' : '增值税（13%）',
        '',
        '',
        '',
        '',
        contractFormatCurrency(documentData.financials.vatAmount, lang, true),
        ''
    ]);
    table.appendChild(vatRow);

    const totalRow = totalTemplate.cloneNode(true);
    contractSetRowCells(totalRow, [
        '',
        lang === 'en' ? 'Total Amount (Incl. VAT)' : '含税总计',
        '',
        '',
        '',
        '',
        contractFormatCurrency(documentData.financials.totalIncludingTax, lang, true),
        lang === 'en' ? '(If there is any minor calculation difference from the quotation, this contract shall prevail.)' : '（如与报价存在微小计算差异，以合同为准）'
    ]);
    table.appendChild(totalRow);

    const qualityHeaderRow = qualityHeaderTemplate.cloneNode(true);
    contractSetRowCells(qualityHeaderRow, [
        lang === 'en' ? 'II. Product Quality and Technical Standards' : '二、 产品质量与技术标准',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]);
    table.appendChild(qualityHeaderRow);

    const qualityBodyRow = qualityBodyTemplate.cloneNode(true);
    contractSetRowCells(qualityBodyRow, [
        lang === 'en'
            ? 'Product quality shall comply with SJ/T11141-2012, General Specification for LED Electronic Displays. Screen brightness uniformity shall be not less than 99%, and overall panel flatness shall be not more than 0.1mm.'
            : '产品质量符合国家标准《LED电子显示屏通用规范》SJ/T11141-2012。屏体亮度均匀性≥99%，整屏平整度≤0.1mm。',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]);
    table.appendChild(qualityBodyRow);

    const deliveryHeaderRow = deliveryHeaderTemplate.cloneNode(true);
    contractSetRowCells(deliveryHeaderRow, [
        lang === 'en' ? 'III. Delivery, Transportation and Acceptance' : '三、 交货期、运输及验收',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]);
    table.appendChild(deliveryHeaderRow);
}

function contractUpdateParagraphs(elements, documentData, lang) {
    const totalText = contractFormatCurrency(documentData.financials.totalIncludingTax, lang, true);
    const advancePercent = contractRoundCurrency(documentData.financials.prepaymentRate * 100);
    const balancePercent = contractRoundCurrency(documentData.financials.finalPaymentRate * 100);
    const customerSuffix = documentData.customer ? ` ${documentData.customer}` : '';

    const paragraphText = lang === 'en'
        ? {
            title: 'LED Display Sales Contract',
            orderNo: `Order No.: ${documentData.orderNo}`,
            productSection: 'I. Product Details and Total Price',
            totalSentence: `The total contract amount is ${totalText} (Amount in words: ${documentData.amountUpperEn}), inclusive of 13% VAT. The detailed breakdown is as follows:`,
            delivery: documentData.isPlateauProject
                ? 'Delivery: Party B shall ship the goods within 15 working days after receiving the down payment. Additional production and logistics lead time has been reserved for plateau / remote-area delivery.'
                : 'Delivery: Party B shall ship the goods within 15 working days after receiving the down payment.',
            transport: 'Transportation: Dedicated road freight. Freight shall be borne by Party A (freight collect). Party A is advised to purchase cargo transportation insurance.',
            acceptance: 'Acceptance: After the goods arrive at the location designated by Party A, Party A shall inspect them on site. Any objection regarding appearance, quantity or other issues shall be raised in writing within 15 days after receipt; otherwise, the goods shall be deemed accepted.',
            paymentAdvance: `IV. Payment Terms: Within 3 working days after signing this contract, Party A shall pay ${advancePercent}% of the total contract amount, namely ${contractFormatCurrency(documentData.financials.prepaymentAmount, lang, true)}, as the advance payment.`,
            paymentBalance: `After the goods arrive at Party A's location, installation and commissioning are completed, and acceptance is passed, Party A shall pay the remaining ${balancePercent}% of the contract amount, namely ${contractFormatCurrency(documentData.financials.finalPaymentAmount, lang, true)}, within 3 working days.`,
            ownership: 'Before all payments are fully settled, ownership of the LED display shall remain with Party B.',
            warrantyTitle: 'V. Service and Warranty: LED modules are warranted for 3 years. Power supplies, receiving cards, processors and other peripheral devices are warranted for 1 year, starting from the date of acceptance.',
            warrantyScope: 'The warranty covers failures caused by product quality issues. Failures caused by corrosive gases/liquids in Party A\'s installation environment, unstable voltage, man-made damage or other external factors are not covered by the free warranty.',
            warrantyService: 'Party B provides free remote technical guidance, software training and troubleshooting. Free on-site service is not included during the warranty period. If on-site service is required, Party B shall charge CNY 500 per person per day, and all related travel expenses shall be borne by Party A.',
            wiring: 'VI. Other Terms: Power supply and cabling: Party A shall be responsible for routing qualified power cables (recommended: RVV 5×4mm² cable with 40A 3P breaker) and network signal cables to the screen installation position. Estimated startup power: ____ KW; normal operating power: ____ KW.',
            breach: 'Liability for Breach: Both parties shall strictly perform this contract. The breaching party shall compensate the other party for the resulting losses. If performance becomes impossible due to force majeure, the corresponding liability may be exempted.',
            dispute: 'Dispute Resolution: Any dispute arising from the performance of this contract shall first be resolved through friendly negotiation. Failing that, either party may file a lawsuit with the people\'s court having jurisdiction over Party B\'s domicile.',
            effectiveness: 'This contract is made in duplicate, with each party holding one copy. It shall take effect from the date when both parties sign/seal it and Party B receives the advance payment.',
            signatureTitle: '(Signature Page)',
            partyASeal: `Party A (Seal):${customerSuffix}`,
            partyASigner: 'Authorized Signatory:',
            partyAContact: 'Contact Person:',
            partyAAddress: 'Address:',
            partyAPhone: 'Tel:',
            partyADate: 'Date:      Year      Month      Day',
            partyBSeal: 'Party B (Seal): Shenzhen Fengxing Optoelectronic Display Technology Co., Ltd.',
            partyBSigner: 'Authorized Signatory:',
            partyBContact: 'Contact Person:',
            partyBAccountName: 'Account Name: Fengxing Lihua (Shenzhen) Visual Technology Co., Ltd.',
            partyBAccountNo: 'Account No.: 4000 0237 0920 0156 636',
            partyBBank: 'Bank: Industrial and Commercial Bank of China, Shenzhen Huangbei Sub-branch',
            partyBAddress: 'Address: Room 1404, Rongchao Yinglong Building, No. 5 Longfu Road, Longgang District, Shenzhen',
            partyBPhone: 'Tel: 13202333317',
            partyBDate: 'Date:      Year      Month      Day',
            reminderTitle: 'Reminder:',
            reminder1: 'Please carefully verify the product specifications, quantities, amounts, payment terms, and the rights and obligations of both parties in this contract.',
            reminder2: 'Fields under "Party A" that are not sourced from the quotation are intentionally left blank and may be completed before signing.',
            reminder3: documentData.isPlateauProject
                ? 'This contract is generated according to the current quotation. Plateau / Tibet project lead-time and surcharge clauses have been retained according to the template.'
                : 'This contract is generated according to the current quotation. Any fields without source data are intentionally left blank for later confirmation.'
        }
        : {
            title: 'LED显示屏销售合同',
            orderNo: `订单编号： ${documentData.orderNo}`,
            productSection: '一、 产品明细及总价',
            totalSentence: `本合同总金额为人民币 ${documentData.amountUpperZh}（${totalText}），此价格为含13%增值税价格。具体明细如下：`,
            delivery: documentData.isPlateauProject
                ? '交货期：乙方收到定金后 15个工作日 内发货（因高原/偏远地区物流周期较长，已预留充足生产及运输时间）。'
                : '交货期：乙方收到定金后 15个工作日 内发货。',
            transport: '运输方式：专线汽运，运费由甲方承担（到付）。建议甲方购买运输保险。',
            acceptance: '验收：货物抵达甲方指定地点后，甲方应现场验货。如有外观、数量等问题，须在收货后 15天 内提出书面异议，逾期视为验收合格。',
            paymentAdvance: `四、 付款方式：合同签订后3个工作日内，甲方向乙方支付合同总价的 ${advancePercent}% 作为预付款，即 ${contractFormatCurrency(documentData.financials.prepaymentAmount, lang, true)}。`,
            paymentBalance: `货到甲方所在地，安装调试完毕并验收合格后3个工作日内，甲方向乙方支付合同尾款 ${balancePercent}%，即 ${contractFormatCurrency(documentData.financials.finalPaymentAmount, lang, true)}。`,
            ownership: '在全部款项结清前，该显示屏的所有权仍归乙方所有。',
            warrantyTitle: '五、 产品服务与质保：本产品LED模组质保三年，电源、接收卡、处理器等外设质保一年，自验收合格之日起算。',
            warrantyScope: '质保范围为产品自身质量原因导致的故障。若因甲方安装环境存在腐蚀性气体、液体，或电压不稳、人为损坏等原因导致故障，不在免费质保范围内。',
            warrantyService: '乙方提供免费的远程技术指导、软件教学及故障排查。质保期内不提供免费上门服务。如确需上门，乙方将收取技术服务费每人每天500元，且由此产生的差旅费用由甲方承担。',
            wiring: '六、 其他约定：供电与布线：甲方需负责将符合要求的电源（建议使用国标RVV 5×4mm²电缆及40A 3P空开）及网络信号线布设至屏体安装位置。显示屏启动功率约____KW，使用功率约____KW。',
            breach: '违约责任：双方应严格履行本合同。任何一方违约，应承担给对方造成的损失。因不可抗力导致合同无法履行，可免除相应违约责任。',
            dispute: '争议解决：本合同履行过程中发生争议，双方应友好协商；协商不成，任何一方均可向乙方所在地人民法院提起诉讼。',
            effectiveness: '本合同一式两份，甲乙双方各执一份，自双方签字盖章且乙方收到预付款之日起生效。',
            signatureTitle: '（以下为签署页）',
            partyASeal: `甲方（盖章）：${customerSuffix}`,
            partyASigner: '代表人（签章）：',
            partyAContact: '联系人：',
            partyAAddress: '地址：',
            partyAPhone: '电话：',
            partyADate: '日期：    年    月    日',
            partyBSeal: '乙方（盖章）： 深圳风行光电显示技术有限公司',
            partyBSigner: '代表人（签章）：',
            partyBContact: '联系人：',
            partyBAccountName: '户名： 风行利华（深圳）视觉科技有限公司',
            partyBAccountNo: '账号： 4000 0237 0920 0156 636',
            partyBBank: '开户行： 中国工商银行深圳黄贝支行',
            partyBAddress: '地址： 深圳市龙岗区龙福路5号荣超英隆大厦1404',
            partyBPhone: '电话： 13202333317',
            partyBDate: '日期：    年    月    日',
            reminderTitle: '温馨提示：',
            reminder1: '请务必仔细核对合同中产品规格、数量、金额、付款方式及双方权利义务条款。',
            reminder2: '“甲方”栏位中未从报价数据取得的信息已留空，可在正式签署前按实际资料补充。',
            reminder3: documentData.isPlateauProject
                ? '本合同已根据当前报价内容生成；高原/西藏项目相关交货周期及专项费用条款已按模板保留。'
                : '本合同已根据当前报价内容生成；没有来源数据的字段已按要求留白，待双方确认后补充。'
        };

    Object.entries(CONTRACT_TEMPLATE_INDEX).forEach(([key, index]) => {
        if (key === 'productTable') {
            return;
        }

        const element = elements[index];
        if (element && element.localName === 'p') {
            contractReplaceParagraphText(element, paragraphText[key] || '');
        }
    });
}

function contractSaveBlob(blob, fileName) {
    if (typeof saveAs === 'function') {
        saveAs(blob, fileName);
        return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportContractToWord(lang) {
    if (!window.contractData || !window.contractData.quotationItems || !window.contractData.quotationItems.length) {
        alert('请先计算报价后再导出合同');
        return;
    }

    if (!window.CONTRACT_TEMPLATE_BASE64) {
        alert('合同模板尚未加载完成，请稍后再试');
        return;
    }

    if (typeof JSZip === 'undefined') {
        alert('合同导出组件尚未加载完成，请稍后再试');
        return;
    }

    try {
        const safeLang = lang === 'en' ? 'en' : 'zh';
        const documentData = contractBuildDocumentData(safeLang);
        const zip = await JSZip.loadAsync(window.CONTRACT_TEMPLATE_BASE64, { base64: true });
        const xmlText = await zip.file('word/document.xml').async('string');
        const xmlDocument = new DOMParser().parseFromString(xmlText, 'application/xml');

        if (xmlDocument.getElementsByTagName('parsererror').length) {
            throw new Error('Failed to parse contract template XML.');
        }

        const body = xmlDocument.getElementsByTagNameNS(CONTRACT_WORD_NS, 'body')[0];
        if (!body) {
            throw new Error('Contract template body is missing.');
        }

        const bodyElements = contractGetDirectChildren(body);
        const table = bodyElements[CONTRACT_TEMPLATE_INDEX.productTable];
        if (!table || table.localName !== 'tbl') {
            throw new Error('Contract template product table was not found.');
        }

        contractUpdateParagraphs(bodyElements, documentData, safeLang);
        contractRebuildProductTable(table, documentData, safeLang);

        let outputXml = new XMLSerializer().serializeToString(xmlDocument);
        if (!outputXml.startsWith('<?xml')) {
            outputXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${outputXml}`;
        }

        zip.file('word/document.xml', outputXml);

        const blob = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        const fileDate = contractFormatDateParts(documentData.dateText);
        const fileDateText = `${fileDate.year}-${fileDate.month.padStart(2, '0')}-${fileDate.day.padStart(2, '0')}`;
        const projectPart = contractSafeFilenamePart(documentData.project || documentData.customer || 'project');
        const fileName = safeLang === 'en'
            ? `LED_Sales_Contract_${projectPart}_${fileDateText}.docx`
            : `LED显示屏销售合同_${projectPart}_${fileDateText}.docx`;

        contractSaveBlob(blob, fileName);
    } catch (error) {
        console.error('Contract export failed:', error);
        alert('合同导出失败，请稍后重试');
    }
}
