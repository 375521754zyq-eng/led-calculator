const ExportTranslator = (() => {
    const BRAND_MAP = {
        '中航': 'Zhonghang',
        '诺瓦': 'Nova',
        '摩西尔': 'Mosaic',
        '凯视达': 'Kaisida',
        '卡莱特': 'Colorlight',
        '灰度': 'Huidu',
        '创联': 'Chuanglian',
        '康胜': 'Kangsheng',
        '康盛': 'Kangsheng'
    };

    const UNIT_MAP = {
        '㎡': 'sqm',
        '平方': 'sqm',
        '平方米': 'sqm',
        '个': 'pcs',
        '张': 'pcs',
        '台': 'unit',
        '套': 'set',
        '根': 'pc',
        '项': 'item',
        '块': 'pcs',
        '把': 'pc',
        '米': 'm',
        '/': '/'
    };

    const EXACT_TEXT_MAP = {
        '待补充': 'To be added',
        '甲方自备': 'Owner-supplied',
        '现场预留': 'On-site reserved',
        '免费': 'Free',
        '免费赠送': 'Complimentary',
        '运费到付': 'Freight collect',
        '不含备品': 'No spare included',
        'S型级联': 'S-shaped cascade',
        'S 型级联': 'S-shaped cascade',
        '模组固定件': 'Module fixing part',
        '标配售后维护工具': 'Standard maintenance tool',
        '户外后维护专属': 'Outdoor rear-maintenance only',
        '备品率 2%': 'Spare rate 2%',
        '备品率 5%(向上取整)': 'Spare rate 5% (rounded up)',
        '备品率 5%（向上取整）': 'Spare rate 5% (rounded up)',
        '每网口一台': '1 unit per network port',
        '每模组4个': '4 pcs per module',
        '每模组 4 个': '4 pcs per module',
        '每表1把': '1 pc per screen',
        '每表 1 把': '1 pc per screen',
        '每屏1把': '1 pc per screen',
        '每屏 1 把': '1 pc per screen',
        '每30㎡1台': '1 unit per 30 sqm',
        '每30㎡ 1台': '1 unit per 30 sqm',
        '每 30㎡1 台': '1 unit per 30 sqm',
        '10㎡内1张，每增10㎡加1张': '1 pc within 10 sqm, plus 1 pc for each additional 10 sqm',
        '50cm 纯铜网线': '50cm pure-copper network cable',
        '单侧10cm铝塑板': 'Single-side 10cm aluminum composite panel',
        '单侧 10cm 铝塑板': 'Single-side 10cm aluminum composite panel',
        '12V 静音风扇': '12V silent fan',
        '后维护门板(含锁)': 'Rear-maintenance door panel (with lock)',
        '后维护门板 (含锁)': 'Rear-maintenance door panel (with lock)',
        '箱体防水胶条/密封胶': 'Cabinet waterproof sealing strip / sealant',
        '不锈钢锁扣/连接件': 'Stainless steel locks / connectors',
        '排线/HUB75': 'Flat Cable / HUB75',
        '接收卡网线': 'Receiver Network Cable',
        '强磁磁铁': 'High-strength Magnet',
        '模组取板器': 'Module Removal Tool',
        'LED 模组': 'LED Module'
    };

    const GENERIC_PHRASE_REPLACEMENTS = [
        ['（', '('],
        ['）', ')'],
        ['，', ', '],
        ['；', '; '],
        ['：', ': '],
        ['。', '. '],
        ['、', ', '],
        ['LED显示屏', 'LED display'],
        ['LED 显示屏', 'LED display'],
        ['显示模组', 'display module'],
        ['显示屏', 'display screen'],
        ['LED专用电源', 'LED power supply'],
        ['模组', 'module'],
        ['像素间距', 'pixel pitch'],
        ['亮度均匀性', 'brightness uniformity'],
        ['亮度', 'brightness'],
        ['刷新率', 'refresh rate'],
        ['整屏平整度', 'overall flatness'],
        ['平整度', 'flatness'],
        ['反光率', 'reflectance'],
        ['可视角度', 'viewing angle'],
        ['系统电源', 'system power supply'],
        ['接收卡', 'receiving card'],
        ['视频处理器', 'video processor'],
        ['播放器', 'player'],
        ['播放软件', 'player software'],
        ['线材及辅料', 'cables & accessories'],
        ['线材辅料', 'cable & accessory pack'],
        ['排线/HUB75', 'flat cable / HUB75'],
        ['排线', 'flat cable'],
        ['纯铜', 'pure-copper '],
        ['网线', 'network cable'],
        ['电源线', 'power cable'],
        ['信号线', 'signal cable'],
        ['技术支持', 'technical support'],
        ['结构支架', 'support structure'],
        ['钢结构', 'steel structure'],
        ['结构', 'structure'],
        ['安装调试', 'installation and commissioning'],
        ['安装', 'installation'],
        ['调试', 'commissioning'],
        ['防水包边', 'waterproof edge trim'],
        ['包边', 'trim'],
        ['防水', 'waterproof '],
        ['散热空调', 'cooling air conditioner'],
        ['空调', 'air conditioner'],
        ['工业级', 'industrial-grade '],
        ['箱体', 'cabinet'],
        ['压铸铝', 'die-cast aluminum '],
        ['简易', 'simple '],
        ['强磁磁铁', 'high-strength magnet'],
        ['磁铁', 'magnet'],
        ['取板器', 'removal tool'],
        ['售后维护工具', 'maintenance tool'],
        ['高刷', 'high-refresh '],
        ['普通刷', 'standard-refresh '],
        ['极简', 'minimalist '],
        ['免费赠送教程', 'complimentary tutorial'],
        ['免费赠送', 'complimentary'],
        ['免费提供', 'free '],
        ['备品率', 'spare rate'],
        ['备品', 'spare'],
        ['备件', 'spare'],
        ['向上取整', 'rounded up'],
        ['含内部配件', 'including internal accessories'],
        ['后维护', 'rear-maintenance '],
        ['前维护', 'front-maintenance '],
        ['连接件', 'connectors'],
        ['锁扣', 'locks'],
        ['静音风扇', 'silent fan'],
        ['密封胶', 'sealant'],
        ['胶条', 'sealing strip'],
        ['按面积自动', 'auto by area'],
        ['按面积', 'by area'],
        ['按模组数', 'by module count'],
        ['自动匹配', 'auto-matched'],
        ['室内', 'Indoor '],
        ['户外', 'Outdoor '],
        ['西藏', 'Tibet'],
        ['高原', 'plateau']
    ];

    const DYNAMIC_PATTERNS = [
        {
            pattern: /(\d+(?:\.\d+)?)元\/(㎡|平方|平方米|个|张|台|套|根|项|块|把|米)/g,
            replacement: (_, amount, unit) => `CNY ${amount}/${UNIT_MAP[unit] || unit}`
        },
        {
            pattern: /\((\d+(?:\.\d+)?)元\/(㎡|平方|平方米|个|张|台|套|根|项|块|把|米)\)/g,
            replacement: (_, amount, unit) => `(CNY ${amount}/${UNIT_MAP[unit] || unit})`
        },
        {
            pattern: /(\d+)\s*口接收卡/g,
            replacement: '$1-port receiving card'
        },
        {
            pattern: /(\d+)\s*网口视频处理器/g,
            replacement: '$1-port video processor'
        },
        {
            pattern: /(\d+)\s*口/g,
            replacement: '$1-port'
        },
        {
            pattern: /(Zhonghang|Nova|Mosaic|Kaisida|Colorlight|Huidu|Chuanglian|Kangsheng)(?=\d)/g,
            replacement: '$1 '
        },
        {
            pattern: /超\s*5\s*类\/6\s*类网线/g,
            replacement: 'Cat 5e / Cat 6 network cable'
        },
        {
            pattern: /3×2\.5\s*电源线/g,
            replacement: '3×2.5 power cable'
        },
        {
            pattern: /(\d+(?:\.\d+)?)㎡/g,
            replacement: '$1 sqm'
        },
        {
            pattern: /(\d+(?:\.\d+)?)平方米/g,
            replacement: '$1 sqm'
        },
        {
            pattern: /1\s*根带\s*(\d+)\s*个电源/g,
            replacement: '1 cable for $1 power supplies'
        },
        {
            pattern: /1\s*根带\s*(\d+)\s*像素/g,
            replacement: '1 cable supports $1 pixels'
        },
        {
            pattern: /含\s*(\d+)%\s*备品/g,
            replacement: 'Incl. $1% spare'
        },
        {
            pattern: /每箱\s*(\d+)\s*套/g,
            replacement: '$1 sets per cabinet'
        },
        {
            pattern: /每箱\s*(\d+)\s*个/g,
            replacement: '$1 pcs per cabinet'
        },
        {
            pattern: /每箱\s*(\d+)\s*张/g,
            replacement: '$1 pcs per cabinet'
        }
    ];

    function normalizeKey(value) {
        return String(value || '')
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/（/g, '(')
            .replace(/）/g, ')');
    }

    function lookupCatalog(text, categories) {
        if (!text || typeof getText !== 'function') {
            return '';
        }

        for (const category of categories) {
            const translated = getText(text, category, 'en');
            if (translated && translated !== text) {
                return translated;
            }
        }

        return '';
    }

    function replaceBrands(text) {
        let output = text;
        Object.entries(BRAND_MAP).forEach(([source, target]) => {
            output = output.replaceAll(source, target);
        });
        return output;
    }

    function cleanupEnglish(text) {
        return String(text || '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\s+([,.;:()])/g, '$1')
            .replace(/\((\s+)/g, '(')
            .replace(/(\s+)\)/g, ')')
            .trim();
    }

    function toTitleCase(text) {
        const smallWords = new Set(['and', 'or', 'of', 'per', 'for', 'the', 'a', 'an', 'to', 'with', 'by', 'incl.', 'incl']);
        return text.replace(/\b([A-Za-z][A-Za-z0-9/-]*)\b/g, (word) => {
            if (word === word.toUpperCase() || /\d/.test(word)) {
                return word;
            }
            const lower = word.toLowerCase();
            if (smallWords.has(lower)) {
                return lower;
            }
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        });
    }

    function translateGenericText(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        const exact = lookupCatalog(normalized, ['misc']) || EXACT_TEXT_MAP[normalized];
        if (exact) {
            return exact;
        }

        let output = replaceBrands(normalized);
        DYNAMIC_PATTERNS.forEach(({ pattern, replacement }) => {
            output = output.replace(pattern, replacement);
        });
        GENERIC_PHRASE_REPLACEMENTS.forEach(([source, target]) => {
            output = output.replaceAll(source, target);
        });

        return cleanupEnglish(output);
    }

    function translateName(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        const exact = lookupCatalog(normalized, ['products']) || EXACT_TEXT_MAP[normalized];
        if (exact) {
            return exact;
        }

        return toTitleCase(translateGenericText(normalized, lang));
    }

    function translateParam(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        const exact = lookupCatalog(normalized, ['params']) || EXACT_TEXT_MAP[normalized];
        if (exact) {
            return exact;
        }

        return translateGenericText(normalized, lang);
    }

    function translateSpec(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        const exact = lookupCatalog(normalized, ['params', 'products']) || EXACT_TEXT_MAP[normalized];
        if (exact) {
            return exact;
        }

        return translateGenericText(normalized, lang);
    }

    function translateNote(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        const exact = lookupCatalog(normalized, ['misc', 'params']) || EXACT_TEXT_MAP[normalized];
        if (exact) {
            return exact;
        }

        return translateGenericText(normalized, lang);
    }

    function translateUnit(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        const catalogTranslation = lookupCatalog(normalized, ['units']);
        if (catalogTranslation) {
            return catalogTranslation === '㎡' ? 'sqm' : catalogTranslation;
        }

        return UNIT_MAP[normalized] || normalized;
    }

    function translateProjectField(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        return EXACT_TEXT_MAP[normalized] || normalized;
    }

    function translateSpecialText(text, lang = 'en') {
        const normalized = normalizeKey(text);
        if (lang !== 'en' || !normalized) {
            return normalized;
        }

        return lookupCatalog(normalized, ['misc']) || EXACT_TEXT_MAP[normalized] || translateGenericText(normalized, lang);
    }

    return {
        translateGenericText,
        translateName,
        translateParam,
        translateSpec,
        translateNote,
        translateUnit,
        translateProjectField,
        translateSpecialText
    };
})();
