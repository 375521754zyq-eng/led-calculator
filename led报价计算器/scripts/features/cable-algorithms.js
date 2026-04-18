        function calculateCoordinateRouting(columns, rows, moduleSizeCm, maxLoad) {
            const availableCables = [30, 40, 60, 70, 80, 100, 120, 130];
            let cableCounts = {};
            availableCables.forEach(c => cableCounts[c] = 0);
            
            // 动态行分组极限：256 板最多 3 行，192 板最多 4 行
            let H_max = (moduleSizeCm === 25.6) ? 3 : 4; 
            let r_processed = 0;
            let powerCount = 0;
            
            while (r_processed < rows) {
                let chunkH = Math.min(rows - r_processed, H_max);
                
                // 动态列分组极限
                let W_max = Math.floor(maxLoad / chunkH);
                // 特例放宽：特规 192x192 允许 3x3 九宫格中心 1 带 9
                if (moduleSizeCm === 19.2 && chunkH === 3) W_max = 3; 
                if (W_max < 1) W_max = 1;
                
                let c_processed = 0;
                while (c_processed < columns) {
                    let chunkW = Math.min(columns - c_processed, W_max);
                    
                    // 计算当前电源放置的几何中心坐标 (cx, cy)
                    let cx = c_processed + (chunkW - 1) / 2;
                    let cy = r_processed + (chunkH - 1) / 2;
                    powerCount++;
                    
                    // 遍历管辖区块内的每块模组，计算到电源中心的精确欧氏距离
                    for(let r = 0; r < chunkH; r++) {
                        for(let c = 0; c < chunkW; c++) {
                            let mx = c_processed + c;
                            let my = r_processed + r;
                            // 直线距离公式：√((Δx)² + (Δy)²) * 模组物理尺寸
                            let dist = Math.sqrt(Math.pow(mx - cx, 2) + Math.pow(my - cy, 2)) * moduleSizeCm;
                            
                            // 加上 10cm 接口安全冗余，向上匹配标准成品线缆
                            let required = dist + 10; 
                            let matched = availableCables[availableCables.length - 1]; 
                            for (let len of availableCables) {
                                if (len >= required) {
                                    matched = len;
                                    break;
                                }
                            }
                            cableCounts[matched]++;
                        }
                    }
                    c_processed += chunkW;
                }
                r_processed += chunkH;
            }
            
            // 整理输出 BOM 格式
            let details = [];
            for (let len of availableCables) {
                if (cableCounts[len] > 0) {
                    details.push({ name: `${len}cm 放射电源线`, count: cableCounts[len], desc: `坐标几何发散连线` });
                }
            }
            return { basePowerCount: powerCount, details: details };
        }
        
        // 【核武级算法二】320x160 严格 (P_base - 1) 拓扑推演法
        // 常规 320×160 电源线的 (P - 1) 拆解铁律
        function calculateStandardPowerCables(columns, rows, hp, basePowerCount) {
            let fullRows = Math.floor(rows / hp);
            let tailRows = rows % hp;
            
            // 铁律：跳线 + 串联线总和绝对等于 (通电电源数 - 1)
            let expectedCables = basePowerCount - 1;
            if (expectedCables <= 0) return [];

            let details = [];
            let cablesAssigned = 0;
            
            // A. 垂直跨排大跳线 L_vert
            if (fullRows > 1) {
                let l_vert = Math.min((hp * 16) + 10, 100);
                let count = fullRows - 1;
                details.push({ name: `${l_vert}cm 垂直跨跳线`, count: count, desc: '满载排上下垂直短接' });
                cablesAssigned += count;
            }
            
            // B. 斜拉长跳线 (如果存在满载排和尾数排的断层)
            if (fullRows > 0 && tailRows > 0) {
                details.push({ name: `100cm 斜拉长跳线`, count: 1, desc: '满载排至尾数排供电斜拉' });
                cablesAssigned += 1;
            }
            
            // C. 尾数排内部横接线 L_tail
            if (tailRows > 0) {
                let tailPowerCount = Math.ceil((tailRows * columns) / hp);
                let tailCableCount = tailPowerCount > 0 ? tailPowerCount - 1 : 0;
                if (tailCableCount > 0) {
                    let deltaX = Math.ceil(columns / tailPowerCount);
                    let l_tail = 30 + (deltaX * 10);
                    details.push({ name: `${l_tail}cm 尾数排横接线`, count: tailCableCount, desc: '尾数排内部电源分配' });
                    cablesAssigned += tailCableCount;
                }
            }
            
            // D. 剩余所有名额，全部拨给 40cm 水平串联线
            let horizontalCount = expectedCables - cablesAssigned;
            if (horizontalCount > 0) {
                details.push({ name: `40cm 水平串联线`, count: horizontalCount, desc: '满载排电源横向短接' });
            }
            
            return details;
        }
        
        // 接收卡高度分级配置引擎 (严格按照 V6 规范)
        function calculateReceivingCardsByTier(cardCols, rows) {
            let result = [];
            
            function addCard(name, count, desc) {
                let existing = result.find(item => item.name === name);
                if (existing) {
                    existing.count += count;
                } else {
                    result.push({ name: name, count: count, desc: desc });
                }
            }
            
            let remainingRows = rows;
            
            // 修复：优化分级逻辑，确保连续性和一致性
            while (remainingRows > 0) {
                if (remainingRows <= 12) {
                    // 1-12 行：使用 12 口卡
                    addCard('12 口接收卡', cardCols * 1, '1-12 行标准带载');
                    remainingRows = 0;
                } else if (remainingRows <= 16) {
                    // 13-16 行：使用 16 口卡
                    addCard('16 口接收卡', cardCols * 1, '13-16 行标准带载');
                    remainingRows = 0;
                } else if (remainingRows <= 20) {
                    // 17-20 行：使用 20 口卡
                    addCard('20 口接收卡', cardCols * 1, '17-20 行标准带载');
                    remainingRows = 0;
                } else if (remainingRows <= 24) {
                    // 21-24 行：使用 24 口卡
                    addCard('24 口接收卡', cardCols * 1, '21-24 行标准带载');
                    remainingRows = 0;
                } else if (remainingRows <= 28) {
                    // 25-28 行：使用 12 口 +16 口
                    addCard('12 口接收卡', cardCols * 1, '25-28 行 (主)');
                    addCard('16 口接收卡', cardCols * 1, '25-28 行 (辅)');
                    remainingRows = 0;
                } else if (remainingRows <= 32) {
                    // 29-32 行：使用 16 口 +16 口
                    addCard('16 口接收卡', cardCols * 2, '29-32 行双卡级联');
                    remainingRows = 0;
                } else if (remainingRows <= 40) {
                    // 33-40 行：使用 20 口 +20 口
                    addCard('20 口接收卡', cardCols * 1, '33-40 行主干 (主)');
                    addCard('20 口接收卡', cardCols * 1, '33-40 行主干 (辅)');
                    remainingRows = 0;
                } else {
                    // 40 行以上：使用 24 口卡分段，剩余部分递归处理
                    const cardsNeeded = Math.floor(remainingRows / 24);
                    if (cardsNeeded > 0) {
                        addCard('24 口接收卡', cardCols * cardsNeeded, '超高屏主干截断');
                        remainingRows -= cardsNeeded * 24;
                    } else {
                        // 如果剩余行数不足 24 行，直接按实际行数处理
                        addCard('24 口接收卡', cardCols * 1, '剩余行数处理');
                        remainingRows = 0;
                    }
                }
            }
            
            return result;
        }
        
        // 【核武级算法三】精准 HUB75 排线对称序列算法
        // 规则：根据文档《备货计算公式.md》
        // - 排线总数 = 总模组发货数
        // - 走线特征：奇偶行居中发散
        // 户外箱体 HUB75 排线精确计算（基于 V5.0 文档）
        // 遵循"一箱一卡、内部闭环"法则
        function calculateHUB75Exact(columns, rows, moduleHeightM, structureType = 'indoor', moduleWidthM = 0.32, moduleHeightM2 = 0.16) {
            // 标准排线规格
            const standardCables = [20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160];
            const moduleHeightCm = moduleHeightM * 100;
            const moduleWidthCm = moduleWidthM * 100;
            
            // 如果不是户外箱体，使用原来的居中发散算法
            if (structureType !== 'outdoor_box') {
                return calculateHUB75Indoor(columns, rows, moduleHeightM);
            }
            
            // === 户外箱体精确算法 ===
            // 验证模组规格是否匹配 960×960 箱体
            // 960×960 箱体：3 列×6 行 = 18 个 320×160 模组
            const isStandardModule = Math.abs(moduleWidthCm - 32) < 0.1 && Math.abs(moduleHeightCm - 16) < 0.1;
            
            if (!isStandardModule) {
                // 非标准模组，使用室内算法
                console.warn(`户外箱体结构：模组规格${moduleWidthCm}×${moduleHeightCm}cm 不匹配 960×960 箱体，使用室内算法`);
                return calculateHUB75Indoor(columns, rows, moduleHeightM);
            }
            
            // === 960×960 标准箱体固定排线规则 ===
            // 每个箱体：2 根 20cm + 2 根 40cm + 2 根 60cm
            // 计算需要多少个完整的 960×960 箱体（3 列×6 行）
            const boxCount960 = Math.floor(columns / 3) * Math.floor(rows / 6);
            
            const cableDetails = [];
            let totalCables = 0;
            
            // 标准 960×960 箱体排线配置
            if (boxCount960 > 0) {
                cableDetails.push({ length: 20, count: boxCount960 * 2, type: '箱体固定配置' });
                cableDetails.push({ length: 40, count: boxCount960 * 2, type: '箱体固定配置' });
                cableDetails.push({ length: 60, count: boxCount960 * 2, type: '箱体固定配置' });
                totalCables += boxCount960 * 6;
            }
            
            // 第一步：确定单卡管辖的列数和行数
            // 320×160 模组：1 卡管 3 列，管满 6 行
            let cardColumns = 3;  // 每卡管的列数
            let cardRows = 6;     // 每卡管的行数（箱体高度）
            
            // 计算需要多少张接收卡
            const totalCardsCol = Math.ceil(columns / cardColumns);
            const totalCardsRow = Math.ceil(rows / cardRows);
            const totalCards = totalCardsCol * totalCardsRow;
            
            // 遍历每个接收卡（处理非标准部分）
            for (let cardRow = 0; cardRow < totalCardsRow; cardRow++) {
                for (let cardCol = 0; cardCol < totalCardsCol; cardCol++) {
                    // 该卡实际管辖的行数和列数
                    const startRow = cardRow * cardRows;
                    const actualRows = Math.min(cardRows, rows - startRow);
                    
                    const startCol = cardCol * cardColumns;
                    const actualCols = Math.min(cardColumns, columns - startCol);
                    
                    // 第二步：计算纵向发散线（接收卡→起点模组）
                    // 接收卡在管辖区域的正中间
                    const centerRowIndex = Math.floor(actualRows / 2);
                    const M = Math.ceil(actualRows / 2); // 单侧发散层数
                    
                    const verticalCables = {};
                    
                    for (let r = 0; r < actualRows; r++) {
                        const distanceFromCenter = Math.abs(r - centerRowIndex);
                        if (distanceFromCenter === 0) continue; // 中间行不需要纵向线
                        
                        // 理论线长 = 距离 × 模组高度 + 3cm余量
                        let calculatedLen = distanceFromCenter * moduleHeightCm + 3;
                        
                        // 向上匹配标准规格
                        let matchedLen = standardCables[0];
                        for (let len of standardCables) {
                            if (len >= calculatedLen) {
                                matchedLen = len;
                                break;
                            }
                        }
                        
                        verticalCables[matchedLen] = (verticalCables[matchedLen] || 0) + 1;
                    }
                    
                    // 第三步：计算横向级联线（同行模组串联）
                    // 每行需要 (列数-1) 根20cm排线
                    const horizontal20cm = (actualCols - 1) * actualRows;
                    
                    // 汇总到总结果
                    Object.keys(verticalCables).forEach(len => {
                        const existing = cableDetails.find(d => d.length === parseInt(len));
                        if (existing) {
                            existing.count += verticalCables[len];
                        } else {
                            cableDetails.push({
                                length: parseInt(len),
                                count: verticalCables[len],
                                type: '纵向发散'
                            });
                        }
                        totalCables += verticalCables[len];
                    });
                    
                    // 添加横向20cm排线
                    if (horizontal20cm > 0) {
                        const existing = cableDetails.find(d => d.length === 20);
                        if (existing) {
                            existing.count += horizontal20cm;
                        } else {
                            cableDetails.push({
                                length: 20,
                                count: horizontal20cm,
                                type: '横向级联'
                            });
                        }
                        totalCables += horizontal20cm;
                    }
                }
            }
            
            // 排序
            cableDetails.sort((a, b) => a.length - b.length);
            
            // 转换为details数组格式
            let details = cableDetails.map(cable => ({
                name: `${cable.length}cm 排线`,
                count: cable.count,
                desc: `${cable.type} (${cable.length}cm)`
            }));
            
            // 校验：排线总数应该等于模组总数
            const totalModules = columns * rows;
            
            return {
                details: details,
                totalCables: totalCables,
                validation: totalCables === totalModules,
                totalModules: totalModules,
                cardCount: totalCards
            };
        }
        
        // 室内排线计算（居中发散算法）
        function calculateHUB75Indoor(columns, rows, moduleHeightM) {
            const standardCables = [20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160];
            const totalHeight = rows * moduleHeightM;
            const moduleHeightCm = moduleHeightM * 100;
            const centerRow = Math.floor(rows / 2);
            
            const cableStats = {};
            
            for (let c = 0; c < columns; c++) {
                for (let r = 0; r < rows; r++) {
                    const distanceFromCenter = Math.abs(r - centerRow);
                    let calculatedLen = Math.round(distanceFromCenter * moduleHeightCm);
                    if (calculatedLen < 20) calculatedLen = 20;
                    
                    let matchedLen = standardCables[0];
                    for (let len of standardCables) {
                        if (len >= calculatedLen) {
                            matchedLen = len;
                            break;
                        }
                    }
                    if (calculatedLen > standardCables[standardCables.length - 1]) {
                        matchedLen = standardCables[standardCables.length - 1];
                    }
                    
                    cableStats[matchedLen] = (cableStats[matchedLen] || 0) + 1;
                }
            }
            
            let details = [];
            const sortedLengths = Object.keys(cableStats).sort((a, b) => parseInt(a) - parseInt(b));
            
            sortedLengths.forEach(len => {
                details.push({ 
                    name: `${len}cm 排线`, 
                    count: cableStats[len], 
                    desc: `居中发散 (总高${(totalHeight).toFixed(1)}m)` 
                });
            });
            
            return details;
        }
        
        // 传统电源线计算函数（备用）
        function calculatePowerCables(columns, rows, modulesPerPower, moduleWidth, moduleHeight, isSpecial = false) {
            const moduleW = moduleWidth * 1000;
            const moduleH = moduleHeight * 1000;
            
            const totalModules = columns * rows;
            const totalPowers = Math.ceil(totalModules / modulesPerPower);
            const remainder = totalModules % modulesPerPower;
            const actualPowers = remainder > 2 ? totalPowers : totalPowers - 1;
            
            const horizontalCables_40cm = actualPowers > 0 ? actualPowers - 1 : 0;
            
            let verticalCables_Lvert = 0;
            let totalLvertLength = 0;
            
            if (actualPowers > 0) {
                const powersPerRow = Math.floor(columns / modulesPerPower);
                const hasCrossRow = actualPowers > powersPerRow;
                
                if (hasCrossRow) {
                    const totalRows = Math.ceil(actualPowers / powersPerRow);
                    verticalCables_Lvert = totalRows - 1;
                    const Hp = moduleH / 10;
                    const L_vert = Math.min((Hp * 16) + 10, 100);
                    totalLvertLength = verticalCables_Lvert * L_vert;
                }
            }
            
            let tailCable_Ltail = 0;
            let LtailLength = 0;
            
            if (remainder > 0 && remainder <= 2) {
                const deltaX = remainder;
                LtailLength = 30 + (deltaX * 10);
                tailCable_Ltail = 1;
            } else if (remainder > 2) {
                tailCable_Ltail = 1;
                LtailLength = 30;
            }
            
            return {
                horizontal_40cm: horizontalCables_40cm,
                vertical_Lvert: verticalCables_Lvert,
                tail_Ltail: tailCable_Ltail,
                totalLength_cm: (horizontalCables_40cm * 40) + totalLvertLength + LtailLength,
                LvertLength_cm: totalLvertLength,
                LtailLength_cm: LtailLength
            };
        }
        
        // 模组排线计算函数
        function calculateDataCables(columns, rows, moduleWidth, moduleHeight) {
            const moduleW = moduleWidth * 1000;
            const moduleH = moduleHeight * 1000;
            
            const isSquare = Math.abs(moduleW - moduleH) < 1;
            const is320x160 = Math.abs(moduleW - 320) < 1 && Math.abs(moduleH - 160) < 1;
            const is192x192 = Math.abs(moduleW - 192) < 1 && Math.abs(moduleH - 192) < 1;
            const is256x256 = Math.abs(moduleW - 256) < 1 && Math.abs(moduleH - 256) < 1;
            
            let baseLength_cm, increment_cm;
            
            if (is320x160 || moduleW === 320) {
                baseLength_cm = 20;
                increment_cm = 20;
            } else if (is192x192 || is256x256) {
                baseLength_cm = 40;
                increment_cm = 20;
            } else {
                baseLength_cm = 20;
                increment_cm = 20;
            }
            
            const actualRows = rows;
            const isOddRows = actualRows % 2 === 1;
            const centerRow = Math.floor(actualRows / 2);
            
            let totalCables = 0;
            let cableLengths = [];
            
            for (let c = 0; c < columns; c++) {
                for (let r = 0; r < actualRows; r++) {
                    const distanceFromCenter = Math.abs(r - centerRow);
                    const cableLength = baseLength_cm + (distanceFromCenter * increment_cm);
                    cableLengths.push(cableLength);
                    totalCables++;
                }
            }
            
            return {
                totalCables: totalCables,
                cableLengths: cableLengths,
                baseLength_cm: baseLength_cm,
                increment_cm: increment_cm,
                isOddRows: isOddRows,
                centerRow: centerRow
            };
        }
        
        // 新型电源线计算函数（支持 320×160 等模组）
        // 规则：行优先布局 + 动态线长 + S 型串联
        // 根据修改文档公式体系重新实现
        function calculatePowerCablesNew(columns, rows, modulesPerPower, moduleWidth, moduleHeight) {
            const moduleW = moduleWidth * 1000; // mm
            const moduleH = moduleHeight * 1000;
            
            const totalModules = columns * rows;
            const totalPowers = Math.ceil(totalModules / modulesPerPower);
            
            // 余数处理
            const remainder = totalModules % modulesPerPower;
            const actualPowers = remainder > 2 ? totalPowers : totalPowers - 1;
            
            // 电源布局：按行分布（修改文档规则）
            // 每行电源数 = CEILING(总电源数 / 总行数)
            const powersPerRow = Math.ceil(actualPowers / rows);
            const totalPowerRows = Math.ceil(actualPowers / powersPerRow);
            
            // 计算每行实际有多少个电源
            const powerDistribution = [];
            let remainingPowers = actualPowers;
            for (let r = 0; r < rows; r++) {
                const powersInThisRow = Math.min(powersPerRow, remainingPowers);
                powerDistribution.push(powersInThisRow);
                remainingPowers -= powersInThisRow;
            }
            
            // 电源线统计
            const cableStats = {}; // {length: count}
            let verticalCables = 0;
            let verticalLength = 0;
            let horizontalCables = 0;
            
            // 模拟 S 型串联路径
            // 奇数行（0,2,4...）：从左到右
            // 偶数行（1,3,5...）：从右到左
            let powerPositions = []; // [{row, colInRow}]
            
            for (let r = 0; r < rows; r++) {
                const powersInThisRow = powerDistribution[r];
                const isOddRow = r % 2 === 1; // 偶数行（从 0 开始）
                
                for (let i = 0; i < powersInThisRow; i++) {
                    // 奇数行：从左到右（索引 0,1,2...）
                    // 偶数行：从右到左（索引 n,n-1,n-2...）
                    const colIndex = isOddRow ? i : (powersInThisRow - 1 - i);
                    powerPositions.push({row: r, colInRow: colIndex, actualIndex: i});
                }
            }
            
            // 计算电源线长度
            for (let i = 0; i < powerPositions.length - 1; i++) {
                const curr = powerPositions[i];
                const next = powerPositions[i + 1];
                
                // 判断是行内连接还是行间连接
                if (curr.row === next.row) {
                    // 行内连接（水平串联）
                    horizontalCables++;
                    // 计算间隔模组数
                    const moduleGap = Math.abs(curr.colInRow - next.colInRow) - 1;
                    // 线缆长度 = 40 + (间隔模组数 × 20)
                    const cableLength = 40 + (Math.max(0, moduleGap) * 20);
                    
                    // 添加到统计
                    cableStats[cableLength] = (cableStats[cableLength] || 0) + 1;
                } else {
                    // 行间连接（垂直跳线）
                    verticalCables++;
                    // 计算两个电源之间的模组间隔数
                    const rowGap = next.row - curr.row; // 行数差
                    // 垂直跳线长度 = 基础长度 + (间隔模组数 × 10)
                    // 基础长度：两个电源本身的高度差（约 20-30cm）
                    // 每多一个模组增加 10cm，最多不超过 100cm
                    const baseLength = 30; // 基础长度（电源高度 + 余量）
                    const modulesBetween = (rowGap - 1) * Math.ceil(columns / modulesPerPower); // 间隔的模组数
                    const vLength = Math.min(baseLength + (modulesBetween * 10), 100);
                    
                    verticalLength += vLength;
                    
                    // 添加到统计（转换为整数）
                    const lengthCm = Math.round(vLength);
                    cableStats[lengthCm] = (cableStats[lengthCm] || 0) + 1;
                }
            }
            
            // 转换为数组格式便于显示
            const cableDetails = Object.keys(cableStats).sort((a, b) => parseInt(a) - parseInt(b)).map(length => ({
                length: parseInt(length),
                count: cableStats[length]
            }));
            
            // 校验：总线数 = P - 1
            const totalCables = horizontalCables + verticalCables;
            const expectedCables = actualPowers - 1;
            if (totalCables !== expectedCables) {
                console.warn(`校验警告：总线数 ${totalCables} ≠ 预期 ${expectedCables}`);
            }
            
            return {
                totalPowers: actualPowers,
                cableDetails: cableDetails,
                horizontalCables: horizontalCables,
                verticalCables: verticalCables,
                verticalLength_cm: Math.round(verticalLength),
                totalCables: totalCables,
                powerDistribution: powerDistribution,
                validation: totalCables === expectedCables
            };
        }
