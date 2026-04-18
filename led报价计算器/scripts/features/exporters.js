        function getLiveProjectField() {
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

        function getLiveProjectInfo(baseInfo) {
            const safeBaseInfo = baseInfo || {};
            return {
                customer: getLiveProjectField('shellCustomerName', 'customerName') || safeBaseInfo.customer || '',
                project: getLiveProjectField('shellProjectName', 'projectName') || safeBaseInfo.project || '',
                location: getLiveProjectField('shellProjectLocation', 'projectLocation') || safeBaseInfo.location || '',
                date: safeBaseInfo.date || new Date().toLocaleDateString('zh-CN')
            };
        }

        function syncExportProjectInfo(data) {
            if (!data) {
                return { projectInfo: getLiveProjectInfo() };
            }

            data.projectInfo = getLiveProjectInfo(data.projectInfo);

            if (window.contractData && data === window.quotationData) {
                window.contractData.projectInfo = {
                    ...(window.contractData.projectInfo || {}),
                    ...data.projectInfo
                };
            }

            return data;
        }

        function exportQuotationToExcel() {
            if (!window.quotationData || !window.quotationData.items) {
                alert('请先计算报价后再导出Excel');
                return;
            }

            const data = syncExportProjectInfo(window.quotationData);
            const wb = XLSX.utils.book_new();
            
            const ws = XLSX.utils.aoa_to_sheet([]);
            
            // 标题样式
            const titleStyle = { font: { bold: true, sz: 18 }, alignment: { horizontal: 'center' } };
            const headerStyle = { font: { bold: true, sz: 11 }, fill: { fgColor: { rgb: '667EEA' } }, font: { color: { rgb: 'FFFFFF' } } };
            const cellStyle = { alignment: { vertical: 'center', wrapText: true } };
            const numberStyle = { alignment: { horizontal: 'right' } };
            const totalStyle = { font: { bold: true, sz: 12 }, fill: { fgColor: { rgb: 'E8F4FD' } } };
            
            let row = 1;
            
            // 标题
            XLSX.utils.sheet_add_aoa(ws, [['菲利视界 LED显示屏报价表']], { origin: `A${row}` });
            ws[`A${row}`].s = titleStyle;
            ws['!merges'] = [{ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 6 } }];
            row += 2;
            
            // 项目信息
            const infoData = [
                ['客户 Client', data.projectInfo.customer || ''],
                ['项目名称 Project', data.projectInfo.project || ''],
                ['项目地点 Location', data.projectInfo.location || ''],
                ['报价日期 Quote Date', data.projectInfo.date || '']
            ];
            infoData.forEach((info, i) => {
                XLSX.utils.sheet_add_aoa(ws, [[info[0], info[1]]], { origin: `A${row + i}` });
                ws[`A${row + i}`].s = { font: { bold: true } };
            });
            row += infoData.length + 2;
            
            // 表头
            const headers = ['编号 No.', '名称/品牌 Items/Brand', '参数 Parameter', '单位 Unit', '数量 Number', '单价 Unit Price', '金额 Amount(RMB)'];
            XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${row}` });
            headers.forEach((_, i) => {
                const cell = String.fromCharCode(65 + i) + row;
                ws[cell].s = headerStyle;
            });
            row++;
            
            // 数据行
            data.items.forEach(item => {
                const rowData = [
                    item.no || '',
                    item.name || '',
                    item.param || '',
                    item.unit || '',
                    item.qty || '',
                    item.price === null ? '' : item.price,
                    item.amount === null ? (item.amount === '甲方自备' ? '甲方自备' : item.amount === '现场预留' ? '现场预留' : item.amount) : item.amount
                ];
                XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: `A${row}` });
                
                // 设置行高
                ws['!rows'] = ws['!rows'] || [];
                ws['!rows'][row - 1] = { hpx: 30 };
                
                row++;
            });
            row++;
            
            // 总计
            XLSX.utils.sheet_add_aoa(ws, [['屏幕物料总价（未税）', '', '', '', '', '', data.totalPrice || 0]], { origin: `A${row}` });
            ws[`A${row}`].s = totalStyle;
            ws[`G${row}`].s = { font: { bold: true, sz: 12 }, alignment: { horizontal: 'right' }, numFmt: '#,##0.00' };
            ws['!merges'] = ws['!merges'] || [];
            ws['!merges'].push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 5 } });
            row++;
            
            // 备注
            XLSX.utils.sheet_add_aoa(ws, [['* 参考总价，最终以合同确认为准']], { origin: `A${row}` });
            ws[`A${row}`].s = { font: { italic: true, color: { rgb: '666666' } }, font: { sz: 10 } };
            ws['!merges'] = ws['!merges'] || [];
            ws['!merges'].push({ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 6 } });
            
            // 设置列宽
            ws['!cols'] = [
                { wch: 8 },   // 编号
                { wch: 25 },  // 名称
                { wch: 55 },  // 参数
                { wch: 10 },  // 单位
                { wch: 12 },  // 数量
                { wch: 15 },  // 单价
                { wch: 18 }   // 金额
            ];
            
            // 设置打印区域和页面设置（A4）
            ws['!pageSetup'] = {
                paperSize: 9,  // A4
                orientation: 'portrait',
                fitToWidth: 1,
                fitToHeight: 0
            };
            ws['!margins'] = { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5 };

            XLSX.utils.book_append_sheet(wb, ws, '商业报价明细表');
            
            const fileName = `菲利视界_LED报价_${data.projectInfo.project}_${data.projectInfo.date.replace(/\//g, '-')}.xlsx`;
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // 移动端：使用 base64 方式
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
                const url = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + wbout;
                window.open(url, '_blank');
            } else {
                XLSX.writeFile(wb, fileName);
            }
        }

        function exportShippingToExcel() {
            if (!window.shippingData || !window.shippingData.items) {
                alert('请先计算报价后再导出Excel');
                return;
            }

            const data = syncExportProjectInfo(window.shippingData);
            const wb = XLSX.utils.book_new();
            
            const ws = XLSX.utils.aoa_to_sheet([]);
            
            const titleStyle = { font: { bold: true, sz: 18 }, alignment: { horizontal: 'center' } };
            const headerStyle = { font: { bold: true, sz: 11 }, fill: { fgColor: { rgb: '667EEA' } }, font: { color: { rgb: 'FFFFFF' } } };
            const totalStyle = { font: { bold: true, sz: 12 }, fill: { fgColor: { rgb: 'E8F4FD' } } };
            
            let row = 1;
            
            // 标题
            XLSX.utils.sheet_add_aoa(ws, [['菲利视界 LED显示屏发货备料表']], { origin: `A${row}` });
            ws[`A${row}`].s = titleStyle;
            ws['!merges'] = [{ s: { r: row - 1, c: 0 }, e: { r: row - 1, c: 6 } }];
            row += 2;
            
            // 项目信息
            const infoData = [
                ['客户 Client', data.projectInfo.customer || ''],
                ['项目名称 Project', data.projectInfo.project || ''],
                ['项目地点 Location', data.projectInfo.location || ''],
                ['报价日期 Date', data.projectInfo.date || '']
            ];
            infoData.forEach((info, i) => {
                XLSX.utils.sheet_add_aoa(ws, [[info[0], info[1]]], { origin: `A${row + i}` });
                ws[`A${row + i}`].s = { font: { bold: true } };
            });
            row += infoData.length + 2;
            
            // 表头
            const headers = ['物料名称', '规格型号', '理论用量', '备品数量', '发货总量', '单位', '备注'];
            XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${row}` });
            headers.forEach((_, i) => {
                const cell = String.fromCharCode(65 + i) + row;
                ws[cell].s = headerStyle;
            });
            row++;
            
            // 数据行
            data.items.forEach(item => {
                const rowData = [
                    item.name || '',
                    item.spec || '',
                    item.theory || '',
                    item.spare || '',
                    item.total || '',
                    item.unit || '',
                    item.note || ''
                ];
                XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: `A${row}` });
                ws['!rows'] = ws['!rows'] || [];
                ws['!rows'][row - 1] = { hpx: 25 };
                row++;
            });
            
            // 设置列宽
            ws['!cols'] = [
                { wch: 22 },  // 物料名称
                { wch: 28 },  // 规格型号
                { wch: 12 },  // 理论用量
                { wch: 12 },  // 备品数量
                { wch: 12 },  // 发货总量
                { wch: 8 },   // 单位
                { wch: 25 }   // 备注
            ];
            
            // 设置打印区域和页面设置（A4）
            ws['!pageSetup'] = {
                paperSize: 9,
                orientation: 'portrait',
                fitToWidth: 1,
                fitToHeight: 0
            };
            ws['!margins'] = { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5 };

            XLSX.utils.book_append_sheet(wb, ws, '发货备料表');
            
            const fileName = `菲利视界_LED发货备料_${data.projectInfo.project}_${data.projectInfo.date.replace(/\//g, '-')}.xlsx`;
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
                const url = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + wbout;
                window.open(url, '_blank');
            } else {
                XLSX.writeFile(wb, fileName);
            }
        }

        function exportQuotationToWord(lang) {
            if (!window.quotationData || !window.quotationData.items) {
                alert('请先计算报价后再导出Word');
                return;
            }

            const data = syncExportProjectInfo(window.quotationData);
            const isEnglish = lang === 'en';
            const translator = typeof ExportTranslator !== 'undefined' ? ExportTranslator : null;

            function translateItem(item) {
                if (!isEnglish) {
                    return {
                        name: item.name,
                        param: item.param,
                        unit: item.unit,
                        amount: item.amount
                    };
                }

                return {
                    name: translator ? translator.translateName(item.name, lang) : item.name,
                    param: translator ? translator.translateParam(item.param, lang) : item.param,
                    unit: translator ? translator.translateUnit(item.unit, lang) : item.unit,
                    amount: translator ? translator.translateSpecialText(item.amount, lang) : item.amount
                };
            }

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${isEnglish ? 'Philips LED Display Quotation' : '菲利视界 LED显示屏报价表'}</title>
    <style>
        @page { size: A4; margin: 0.5cm; }
        body { font-family: ${isEnglish ? "'Arial', 'Helvetica', sans-serif" : "'SimSun', '宋体', Arial, sans-serif"}; font-size: 12px; margin: 0; padding: 20px; }
        .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 8px; border: 1px solid #000; }
        .info-label { font-weight: bold; width: 120px; background: #f5f5f5; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table th { background: #667EEA; color: white; padding: 10px; border: 1px solid #000; font-weight: bold; }
        .data-table td { padding: 8px; border: 1px solid #000; }
        .total-row { background: #E8F4FD; font-weight: bold; }
        .note { font-style: italic; color: #666; font-size: 10px; }
    </style>
</head>
<body>
    <div class="title">${isEnglish ? 'Philips LED Display Quotation' : '菲利视界 LED显示屏报价表'}</div>
    
    <table class="info-table">
        <tr><td class="info-label">${isEnglish ? 'Customer' : '客户'}</td><td>${data.projectInfo.customer ? (isEnglish && translator ? translator.translateProjectField(data.projectInfo.customer, lang) : data.projectInfo.customer) : ''}</td></tr>
        <tr><td class="info-label">${isEnglish ? 'Project Name' : '项目名称'}</td><td>${data.projectInfo.project || ''}</td></tr>
        <tr><td class="info-label">${isEnglish ? 'Location' : '项目地点'}</td><td>${data.projectInfo.location ? (isEnglish && translator ? translator.translateProjectField(data.projectInfo.location, lang) : data.projectInfo.location) : ''}</td></tr>
        <tr><td class="info-label">${isEnglish ? 'Quote Date' : '报价日期'}</td><td>${data.projectInfo.date || ''}</td></tr>
    </table>
    
    <table class="data-table">
        <thead>
            <tr>
                <th style="width:40px;">${isEnglish ? 'No.' : '编号'}</th>
                <th style="width:120px;">${isEnglish ? 'Name/Brand' : '名称/品牌'}</th>
                <th>${isEnglish ? 'Parameter' : '参数'}</th>
                <th style="width:50px;">${isEnglish ? 'Unit' : '单位'}</th>
                <th style="width:60px;">${isEnglish ? 'Qty' : '数量'}</th>
                <th style="width:80px;">${isEnglish ? 'Price' : '单价'}</th>
                <th style="width:100px;">${isEnglish ? 'Amount' : '金额'}</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map(item => {
                const t = translateItem(item);
                return `
            <tr>
                <td>${item.no || ''}</td>
                <td>${t.name}</td>
                <td>${t.param}</td>
                <td>${t.unit}</td>
                <td>${item.qty || ''}</td>
                <td>${item.price === null ? '-' : item.price || ''}</td>
                <td>${item.amount === null ? '-' : (t.amount || 0)}</td>
            </tr>
            `;}).join('')}
            <tr class="total-row">
                <td colspan="6" style="text-align:right;">${isEnglish ? 'Total Amount (Excl. Tax)' : '屏幕物料总价（未税）'}</td>
                <td>¥ ${(data.totalPrice || 0).toLocaleString()}</td>
            </tr>
        </tbody>
    </table>
    
    <p class="note">* ${isEnglish ? 'Estimate, subject to contract confirmation' : '参考总价，最终以合同确认为准'}</p>
</body>
</html>`;

            const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `菲利视界_LED报价_${data.projectInfo.project}_${data.projectInfo.date.replace(/\//g, '-')}.doc`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                saveAs(blob, `菲利视界_LED报价_${data.projectInfo.project}_${data.projectInfo.date.replace(/\//g, '-')}.doc`);
            }
        }

        function exportShippingToWord(lang) {
            if (!window.shippingData || !window.shippingData.items) {
                alert('请先计算报价后再导出Word');
                return;
            }

            const data = syncExportProjectInfo(window.shippingData);
            const isEnglish = lang === 'en';
            const translator = typeof ExportTranslator !== 'undefined' ? ExportTranslator : null;

            function translateShippingItem(item) {
                if (!isEnglish) {
                    return {
                        name: item.name,
                        spec: item.spec || '',
                        note: item.note || '',
                        unit: item.unit
                    };
                }

                return {
                    name: translator ? translator.translateName(item.name, lang) : item.name,
                    spec: translator ? translator.translateSpec(item.spec, lang) : (item.spec || ''),
                    note: translator ? translator.translateNote(item.note, lang) : (item.note || ''),
                    unit: translator ? translator.translateUnit(item.unit, lang) : item.unit
                };
            }

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${isEnglish ? 'Philips LED Display Shipping List' : '菲利视界 LED显示屏发货备料表'}</title>
    <style>
        @page { size: A4; margin: 0.5cm; }
        body { font-family: ${isEnglish ? "'Arial', 'Helvetica', sans-serif" : "'SimSun', '宋体', Arial, sans-serif"}; font-size: 11px; margin: 0; padding: 20px; }
        .title { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 8px; border: 1px solid #000; }
        .info-label { font-weight: bold; width: 120px; background: #f5f5f5; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table th { background: #667EEA; color: white; padding: 8px; border: 1px solid #000; font-weight: bold; }
        .data-table td { padding: 6px; border: 1px solid #000; }
    </style>
</head>
<body>
    <div class="title">${isEnglish ? 'Philips LED Display Shipping List' : '菲利视界 LED显示屏发货备料表'}</div>
    
    <table class="info-table">
        <tr><td class="info-label">${isEnglish ? 'Customer' : '客户'}</td><td>${isEnglish && translator ? translator.translateProjectField(data.projectInfo.customer, lang) : (data.projectInfo.customer || '')}</td></tr>
        <tr><td class="info-label">${isEnglish ? 'Project Name' : '项目名称'}</td><td>${data.projectInfo.project || ''}</td></tr>
        <tr><td class="info-label">${isEnglish ? 'Location' : '项目地点'}</td><td>${isEnglish && translator ? translator.translateProjectField(data.projectInfo.location, lang) : (data.projectInfo.location || '')}</td></tr>
        <tr><td class="info-label">${isEnglish ? 'Date' : '报价日期'}</td><td>${data.projectInfo.date || ''}</td></tr>
    </table>
    
    <table class="data-table">
        <thead>
            <tr>
                <th>${isEnglish ? 'Item Name' : '物料名称'}</th>
                <th>${isEnglish ? 'Specification' : '规格型号'}</th>
                <th>${isEnglish ? 'Theory Qty' : '理论用量'}</th>
                <th>${isEnglish ? 'Spare Qty' : '备品数量'}</th>
                <th>${isEnglish ? 'Total Qty' : '发货总量'}</th>
                <th>${isEnglish ? 'Unit' : '单位'}</th>
                <th>${isEnglish ? 'Note' : '备注'}</th>
            </tr>
        </thead>
        <tbody>
            ${data.items.map(item => {
                const t = translateShippingItem(item);
                return `
            <tr>
                <td>${t.name}</td>
                <td>${t.spec}</td>
                <td style="text-align:center;">${item.theory || ''}</td>
                <td style="text-align:center;">${item.spare || ''}</td>
                <td style="text-align:center;">${item.total || ''}</td>
                <td style="text-align:center;">${t.unit}</td>
                <td>${t.note}</td>
            </tr>
            `;}).join('')}
        </tbody>
    </table>
</body>
</html>`;

            const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `菲利视界_LED发货备料_${data.projectInfo.project}_${data.projectInfo.date.replace(/\//g, '-')}.doc`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                saveAs(blob, `菲利视界_LED发货备料_${data.projectInfo.project}_${data.projectInfo.date.replace(/\//g, '-')}.doc`);
            }
        }

        function getBrandName(brand) {
            const names = {
                'zhonghang': '中航',
                'nova': '诺瓦/摩西尔',
                'kaisida': '凯视达',
                'colorlight': '卡莱特',
                'huidu': '灰度'
            };
            return names[brand] || brand;
        }
        
        // 辅助函数：获取箱体类型中文名称
        function getCabinetTypeName(cabinetType) {
            const isIndoorCabinet = ['640x480', '640x640', '320x480', '320x640'].includes(cabinetType);
            const cabinetCategory = isIndoorCabinet ? '室内压铸铝' : '户外';
            const cabinetUnit = isIndoorCabinet ? '块' : '个';
            
            let cabinetSizeName = '';
            if (isIndoorCabinet) {
                cabinetSizeName = cabinetType === '640x480' ? '640×480mm' : 
                                  cabinetType === '640x640' ? '640×640mm' : 
                                  cabinetType === '320x480' ? '320×480mm' : '320×640mm';
            } else {
                cabinetSizeName = cabinetType === 'standard' ? '标准' : 
                                  cabinetType === 'waterproof' ? '防水' : '简易';
            }
            
            return {
                isIndoorCabinet,
                cabinetCategory,
                cabinetUnit,
                cabinetSizeName
            };
        }

        // 自动选择最佳压铸铝箱体规格
        function getBestCabinetType(columns, rows, moduleWidth, moduleHeight) {
            // 计算屏幕总尺寸(mm)
            const totalWidth = columns * moduleWidth * 1000;
            const totalHeight = rows * moduleHeight * 1000;
            
            // 定义可用箱体规格
            const cabinetSpecs = [
                { type: '640x640', width: 640, height: 640, price: 350 },
                { type: '640x480', width: 640, height: 480, price: 210 },
                { type: '320x640', width: 320, height: 640, price: 195 },
                { type: '320x480', width: 320, height: 480, price: 185 }
            ];
            
            let bestCabinet = cabinetSpecs[0];
            let minWaste = Infinity;
            
            cabinetSpecs.forEach(cabinet => {
                // 计算该箱体规格下的列数和行数
                const cabinetCols = Math.ceil(totalWidth / cabinet.width);
                const cabinetRows = Math.ceil(totalHeight / cabinet.height);
                
                // 计算实际使用的箱体总面积
                const actualCabinetWidth = cabinetCols * cabinet.width;
                const actualCabinetHeight = cabinetRows * cabinet.height;
                
                // 计算浪费的面积比例
                const wasteArea = (actualCabinetWidth * actualCabinetHeight) - (totalWidth * totalHeight);
                const wasteRatio = wasteArea / (actualCabinetWidth * actualCabinetHeight);
                
                // 计算箱体数量
                const cabinetCount = cabinetCols * cabinetRows;
                const totalCost = cabinetCount * cabinet.price;
                
                // 综合评分：浪费比例 + 成本因素（归一化）
                const score = wasteRatio + (totalCost / 100000);
                
                if (score < minWaste) {
                    minWaste = score;
                    bestCabinet = { ...cabinet, cols: cabinetCols, rows: cabinetRows, count: cabinetCount, totalCost };
                }
            });
            
            return bestCabinet;
        }

        function drawLayout(columns, rows, totalModules, totalPowerCount, receivingCards, modulesPerPower = 6) {
            const ctx = document.getElementById('layoutCanvas').getContext('2d');
            const canvas = document.getElementById('layoutCanvas');
            const container = canvas.parentElement;
            canvas.width = container.clientWidth - 40;
            
            // 动态计算每个模组格子的渲染尺寸
            const padding = 60;
            const cellSize = Math.min(60, (canvas.width - padding * 2) / columns);
            canvas.height = rows * cellSize + padding * 2 + 80; // 留出底部图例空间
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. 绘制背景与标题 (背面视角)
            ctx.fillStyle = '#333';
            ctx.font = 'bold 18px Microsoft YaHei';
            ctx.textAlign = 'center';
            ctx.fillText(`车间级背部物理走线排布图 (背面视角) - ${columns}列 × ${rows}行`, canvas.width / 2, 30);

            const startX = (canvas.width - columns * cellSize) / 2;
            const startY = padding;

            // 2. 绘制模组矩阵 (黑色背景代表屏体背面)
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(startX, startY, columns * cellSize, rows * cellSize);
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 1;
            for (let r = 0; r <= rows; r++) {
                ctx.beginPath(); ctx.moveTo(startX, startY + r * cellSize); ctx.lineTo(startX + columns * cellSize, startY + r * cellSize); ctx.stroke();
            }
            for (let c = 0; c <= columns; c++) {
                ctx.beginPath(); ctx.moveTo(startX + c * cellSize, startY); ctx.lineTo(startX + c * cellSize, startY + rows * cellSize); ctx.stroke();
            }

            // 3. 阵列化布置电源 (绿色) 和 电源走线 (红色)
            ctx.fillStyle = 'rgba(40, 167, 69, 0.8)';
            ctx.strokeStyle = '#ff4757';
            ctx.lineWidth = 2;
            let currentPower = 0;
            
            // 使用全局变量或传入的参数
            const mpp = modulesPerPower || window.lastModulesPerPower || 6;
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    let moduleIndex = r * columns + c;
                    // 假设电源放置在它带载的第一个模组位置
                    if (moduleIndex % mpp === 0 && currentPower < totalPowerCount) {
                        let px = startX + c * cellSize;
                        let py = startY + r * cellSize;
                        
                        // 画电源块
                        ctx.fillRect(px + 4, py + 4, cellSize - 8, cellSize - 8);
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 10px Arial';
                        ctx.fillText(`P${currentPower + 1}`, px + cellSize/2, py + cellSize/2 + 4);
                        ctx.fillStyle = 'rgba(40, 167, 69, 0.8)';

                        // 画电源串联线 (向右或向下级联)
                        if (c + 1 < columns && (moduleIndex + 1) % mpp !== 0) {
                            ctx.beginPath();
                            ctx.moveTo(px + cellSize/2, py + cellSize/2);
                            ctx.lineTo(px + cellSize*1.5, py + cellSize/2);
                            ctx.stroke();
                        }
                        currentPower++;
                    }
                }
            }

            // 4. 布置接收卡 (橙色) 和 级联网线 (蓝色)
            ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
            const colsPerCard = Math.max(1, Math.floor(columns / receivingCards));
            let cardCenters = [];

            for (let i = 0; i < receivingCards; i++) {
                // 接收卡居中放置在它负责的列中间
                let c = Math.min(columns - 1, i * colsPerCard + Math.floor(colsPerCard / 2));
                let r = Math.floor(rows / 2); // 简化展示：放中间行
                
                let cx = startX + c * cellSize;
                let cy = startY + r * cellSize;
                cardCenters.push({x: cx + cellSize/2, y: cy + cellSize/2});

                // 画接收卡块
                ctx.fillRect(cx + 2, cy + 2, cellSize - 4, cellSize - 4);
                ctx.fillStyle = '#000';
                ctx.fillText(`R${i + 1}`, cx + cellSize/2, cy + cellSize/2 + 4);
                ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';

                // 画排线发散示意 (灰色细线)
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx + cellSize/2, cy + cellSize/2);
                ctx.lineTo(cx + cellSize/2, startY + 10); // 向上发散
                ctx.moveTo(cx + cellSize/2, cy + cellSize/2);
                ctx.lineTo(cx + cellSize/2, startY + rows * cellSize - 10); // 向下发散
                ctx.stroke();
            }

            // 画接收卡网线 S 型级联 (蓝色主干线)
            ctx.strokeStyle = '#1e90ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < cardCenters.length - 1; i++) {
                ctx.moveTo(cardCenters[i].x, cardCenters[i].y);
                ctx.lineTo(cardCenters[i+1].x, cardCenters[i+1].y);
            }
            ctx.stroke();

            // 5. 绘制专业图例
            const legendY = canvas.height - 40;
            ctx.fillStyle = '#333';
            ctx.font = '13px Microsoft YaHei';
            ctx.textAlign = 'left';
            
            // 电源图例
            ctx.fillStyle = 'rgba(40, 167, 69, 0.8)'; ctx.fillRect(startX, legendY, 15, 15);
            ctx.fillStyle = '#333'; ctx.fillText('系统电源 (含 220V 走线)', startX + 25, legendY + 12);
            
            // 接收卡图例
            ctx.fillStyle = 'rgba(255, 165, 0, 0.9)'; ctx.fillRect(startX + 180, legendY, 15, 15);
            ctx.fillStyle = '#333'; ctx.fillText('接收卡 (含排线发散)', startX + 205, legendY + 12);

            // 网线图例
            ctx.strokeStyle = '#1e90ff'; ctx.lineWidth = 3; 
            ctx.beginPath(); ctx.moveTo(startX + 360, legendY + 8); ctx.lineTo(startX + 390, legendY + 8); ctx.stroke();
            ctx.fillStyle = '#333'; ctx.fillText('主通讯网线级联', startX + 400, legendY + 12);
        }

        // 页面加载时自动初始化
        window.onload = function() {
            updateProductOptions();
            calculate();
        };
        
        // 验证配件辅料选择（确保结构费只能选 1 项）
        function validateAccessorySelection() {
            const structureCheckboxes = document.querySelectorAll('.structure-only');
            const checkedStructure = Array.from(structureCheckboxes).find(cb => cb.checked);
            
            // 当选中一个结构费时，自动取消其他结构费的选择
            if (checkedStructure) {
                structureCheckboxes.forEach(cb => {
                    if (cb !== checkedStructure) {
                        cb.checked = false;
                    }
                });
            }
        }
