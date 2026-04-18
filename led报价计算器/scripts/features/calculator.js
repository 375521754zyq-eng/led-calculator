        function calculate() {
            console.log('开始计算...');
            try {
            // 存储报价数据用于导出
            window.quotationData = {};
            window.shippingData = {};
            window.contractData = {};
            
            // 获取输入值
            const customerName = document.getElementById('customerName').value;
            const projectName = document.getElementById('projectName').value;
            const projectLocation = document.getElementById('projectLocation').value;
            const productCategory = document.getElementById('productCategory').value;
            const targetWidth = parseFloat(document.getElementById('targetWidth').value);
            const targetHeight = parseFloat(document.getElementById('targetHeight').value);
            const productModel = document.getElementById('productModel').value;
            const cardBrand = document.getElementById('receivingCardBrand').value;
            const powerBrand = document.getElementById('powerBrand').value;
            
            // 【输入验证】
            if (!targetWidth || targetWidth <= 0 || !targetHeight || targetHeight <= 0) {
                alert('请输入有效的尺寸（宽度和高度必须大于 0）');
                return;
            }
            
            const config = productConfig[productModel];
            if (!config) {
                alert('请选择有效的产品型号');
                return;
            }
            
            // 计算输入面积（向上取整，用于配件辅料计算）
            const inputArea = ceiling(targetWidth * targetHeight);
            
            // 获取选中的配件辅料（从复选框）
            const selectedAccessories = Array.from(document.querySelectorAll('input[name="accessory"]:checked'))
                .map(cb => cb.value);
            
            // 从配件辅料类型中提取结构类型（使用第一个结构费选项）
            let structureType = 'E'; // 默认
            const structureOption = selectedAccessories.find(v => 
                v.startsWith('E_') || v.startsWith('Z_') || 
                v === 'embedded' || v.startsWith('outdoor_')
            );
            
            if (structureOption) {
                if (structureOption.startsWith('E_')) {
                    structureType = 'E';
                } else if (structureOption.startsWith('Z_') || structureOption === 'Z_structure') {
                    structureType = 'Z';
                } else if (structureOption === 'embedded') {
                    structureType = 'embedded';
                } else if (structureOption.startsWith('outdoor_rear')) {
                    structureType = 'outdoor_rear';
                } else if (structureOption.startsWith('outdoor_front')) {
                    structureType = 'outdoor_front';
                } else if (structureOption === 'E_structure') {
                    structureType = 'E';
                }
            }
            
            // 产品类别中文名称映射
            const categoryNameMap = {
                'indoor_standard': '室内常规模组',
                'indoor_soft': '室内软模组',
                'indoor_rental': '室内租赁屏及格栅屏',
                'outdoor_standard': '户外常规模组',
                'outdoor_soft': '户外软模组',
                'outdoor_rental': '户外租赁屏及格栅屏',
                'crystal': '晶膜屏',
                'holographic': '全息屏'
            };
            const productCategoryName = categoryNameMap[productCategory] || 'LED 显示屏';
            
            const moduleWidth = config.width / 1000;
            const moduleHeight = config.height / 1000;
            const pitchValue = config.pitch / 1000;
            const modulePrice = config.price;
            const productType = config.type;
            
            const isOutdoor = (structureType === 'outdoor_rear' || structureType === 'outdoor_front' || structureType === 'outdoor_box' || productType === 'outdoor');
            const isSpecial = (productType === 'special');
            
            // 【获取箱体类型】从选中的配件中推导箱体类型
            let cabinetType = '';
            if (structureType === 'outdoor_box') {
                // 从选中的配件中查找箱体类型
                const cabinetOptions = ['640x480', '640x640', '320x480', '320x640', 'standard', 'waterproof', 'simple'];
                for (const acc of selectedAccessories) {
                    if (acc.startsWith('cabinet_')) {
                        cabinetType = acc.replace('cabinet_', '');
                        break;
                    }
                }
                // 如果没有选择，默认为 standard
                if (!cabinetType) cabinetType = 'standard';
            }

            // 【步骤 1：物理排布与边框计算】
            const columns = ceiling(targetWidth / moduleWidth);
            const rows = ceiling(targetHeight / moduleHeight);
            const totalModules = columns * rows;
            const netWidth = columns * moduleWidth;
            const netHeight = rows * moduleHeight;
            const netArea = netWidth * netHeight;
            const actualArea = targetWidth * targetHeight;
            
            // 修复：使用整数计算像素点，避免浮点数精度误差
            const horizontalPixels = Math.round(netWidth / pitchValue);
            const verticalPixels = Math.round(netHeight / pitchValue);
            const totalPixels = horizontalPixels * verticalPixels;

            // 初始化默认值（避免未定义导致 NaN）
            let frameWidth = netWidth + 0.20;
            let frameHeight = netHeight + 0.20;
            
            // 修复：晶膜屏/全息屏使用专属边框计算逻辑
            if (isSpecial) {
                // 晶膜屏/全息屏：仅能定制长度，最长 1500mm
                // 结构类型简化为：无边框（贴膜式）或简单边框
                if (structureType === 'embedded') {
                    // 嵌入式：无边框
                    frameWidth = netWidth;
                    frameHeight = netHeight;
                } else if (structureType === 'outdoor_rear' || structureType === 'outdoor_front' || structureType === 'outdoor_box') {
                    // 户外结构：增加边框
                    frameWidth = netWidth + 0.20;
                    frameHeight = netHeight + 0.20;
                } else {
                    // 室内默认：极简边框 2cm
                    frameWidth = netWidth + 0.02;
                    frameHeight = netHeight + 0.02;
                }
            } else if (structureType === 'E') {
                frameWidth = netWidth + 0.09; frameHeight = netHeight + 0.09;
            } else if (structureType === 'Z') {
                frameWidth = netWidth + 0.04; frameHeight = netHeight + 0.04;
            } else if (structureType === 'embedded') {
                frameWidth = netWidth + 0.01; frameHeight = netHeight + 0.01;
            } else if (structureType === 'outdoor_rear') {
                frameWidth = netWidth + 0.20; frameHeight = netHeight + 0.20;
            }
            // 默认值已在上面初始化
            const perimeter = (frameWidth + frameHeight) * 2;

            // 向上取整提醒
            const reminderText = `⚠️ 根据向上取整原则，最接近的物理净尺寸为 ${netWidth.toFixed(2)}米 × ${netHeight.toFixed(2)}米`;

            // 【步骤 2：电源配置法则（品牌：康盛 5V40A200W）】
            let basePowerCount = 0;
            let modulesPerPower = 6;
            let boxCount = 0;

            if (structureType === 'outdoor_rear') {
                boxCount = ceiling(totalModules / 18);
                basePowerCount = boxCount * 5;
            } else if (structureType === 'outdoor_front') {
                // 修复：户外前维护电源配置逻辑 - 向上取整确保电源充足
                modulesPerPower = 5;
                basePowerCount = ceiling(totalModules / modulesPerPower);
            } else if (structureType === 'outdoor_box') {
                // 户外箱体式：960×960 标准箱体，每个箱体 18 个模组，每个箱体 5 个电源
                boxCount = ceiling(totalModules / 18);
                basePowerCount = boxCount * 5;
            } else {
                if ([1.25, 1.538, 1.86, 2.0, 2.5].includes(config.pitch)) {
                    modulesPerPower = 6;
                } else {
                    modulesPerPower = 8;
                }
                const rem = totalModules % modulesPerPower;
                basePowerCount = Math.floor(totalModules / modulesPerPower);
                if (rem > 2) basePowerCount += 1;
            }
            
            const sparePowerCount = ceiling(basePowerCount * 0.05);
            const totalPowerCount = basePowerCount + sparePowerCount;

            // 【步骤 3：接收卡智能匹配规则库 (品牌：中航)】
            // 根据文档：P1.25/P1.538为专机，P1.86/P2/P2.5按1列/卡，P3/P4按3列/卡，P4大板按2列/卡
            let receivingCards = 0;
            let cardType = '12';
            let cardCostPerColumn = 0;
            let receivingCardItems = [];
            
            // 确定每卡管的列数
            let colsPerCard = 3; // 默认3列
            if (config.pitch === 1.25 || config.pitch === 1.538 || config.pitch === 1.86 || config.pitch === 2 || config.pitch === 2.5) {
                colsPerCard = 1; // 小间距按1列/卡
            } else if (config.width === 256 && config.height === 256) {
                colsPerCard = 3; // P4大板(256×256)按3列/卡
            }

            if (structureType === 'outdoor_rear' || structureType === 'outdoor_box') {
                // 户外后维护/箱体：总模组数÷18得出接收卡数量，全部用12口
                receivingCards = ceiling(totalModules / 18);
                cardType = '12';
                receivingCardItems = [{ name: '12口接收卡', count: receivingCards, desc: '总模组数÷18' }];
            } else if (config.pitch === 1.25) {
                // P1.25专机：320口卡，1列/卡，最大8行
                cardType = '320';
                receivingCards = columns * ceiling(rows / 8);
                receivingCardItems = [{ name: '320口接收卡', count: receivingCards, desc: 'P1.25专机' }];
            } else if (config.pitch === 1.538) {
                // P1.538：最大12行
                receivingCards = columns * ceiling(rows / 12);
                receivingCardItems = [{ name: '12口接收卡', count: receivingCards, desc: 'P1.538最大12行' }];
            } else {
                // 常规室内屏（P2-P10）- 使用新的分级算法
                const cardCols = ceiling(columns / colsPerCard);
                receivingCardItems = calculateReceivingCardsByTier(cardCols, rows);
                receivingCards = receivingCardItems.reduce((sum, item) => sum + item.count, 0);
                cardType = receivingCardItems.length === 1 ? receivingCardItems[0].name.replace(/\s*/g, '').replace('接收卡', '') : '多型号';
                cardCostPerColumn = receivingCardItems.reduce((sum, item) => {
                    const portKey = item.name.replace(/\s*/g, '').replace('接收卡', '').replace('口', '');
                    const price = priceDB.receivingCards[cardBrand][portKey] || 0;
                    return sum + price * item.count;
                }, 0);
            }

            // 【步骤 4：视频处理器查表选型】
            let processorModel = '';
            let processorPorts = 2;
            let processorPrice = 880;
            
            // 修复：使用小于等于判断，确保边界值正确归类
            if (totalPixels <= 1300000) {
                processorModel = '双网口'; processorPorts = 2; processorPrice = 880;
            } else if (totalPixels <= 2600000) {
                processorModel = '四网口'; processorPorts = 4; processorPrice = 1380;
            } else if (totalPixels <= 3900000) {
                processorModel = '六网口'; processorPorts = 6; processorPrice = 2980;
            } else if (totalPixels <= 5200000) {
                processorModel = '八网口'; processorPorts = 8; processorPrice = 3380;
            } else if (totalPixels <= 6500000) {
                processorModel = '十网口'; processorPorts = 10; processorPrice = 4880;
            } else if (totalPixels <= 9100000) {
                processorModel = '十四网口'; processorPorts = 14; processorPrice = 5800;
            } else if (totalPixels <= 10400000) {
                processorModel = '十六网口'; processorPorts = 16; processorPrice = 6580;
            } else if (totalPixels <= 13000000) {
                processorModel = '二十网口'; processorPorts = 20; processorPrice = 10500;
            } else if (totalPixels <= 15600000) {
                processorModel = '二十四网口'; processorPorts = 24; processorPrice = 12000;
            } else if (totalPixels <= 18200000) {
                processorModel = '二十八网口'; processorPorts = 28; processorPrice = 13500;
            } else {
                processorModel = '双台组合'; processorPorts = 56; processorPrice = 13500 * 2;
            }

            // 【步骤 5：车间动态走线精细化算量】
            // 判断模组类型，调用对应的核武级算法
            // 修复：统一使用容差匹配判断模组类型
            const isStandardModule = Math.abs(config.width - 320) < 1 && Math.abs(config.height - 160) < 1; // 320×160 标准模组
            
            let powerCableDetails, dataCableDetails, powerCableTotal;
            
            // 所有模组都使用统一的电源串联方式：行内横向串联 + S 型垂直连接
            // 1. 先计算电源数量（根据模组类型）
            // 2. 然后使用标准串联算法计算电源线
            if (isStandardModule) {
                // 320×160 拓扑算法（严格 P-1 推演）- 使用新型电源线计算函数
                const hp = modulesPerPower; // 每行电源数
                const powerCableResult = calculatePowerCablesNew(columns, rows, hp, moduleWidth, moduleHeight);
                powerCableDetails = { 
                    details: powerCableResult.cableDetails.map(c => ({
                        name: `${c.length}cm 电源线`,
                        count: c.count,
                        desc: `S 型串联 (${c.length}cm)`
                    })),
                    totalCables: powerCableResult.totalCables,
                    validation: powerCableResult.validation
                };
                powerCableTotal = powerCableDetails.totalCables;
            } else {
                // 192×192、256×256、其他模组：都使用标准串联方式
                // 每行能放的电源数 = Math.ceil(列数 / 每电源带载的模组列数)
                // 对于正方形模组，带载规则不同
                let hp;
                if (config.width === 192 && config.height === 192) {
                    hp = Math.ceil(columns / 2); // 192×192: 2 列 1 卡
                } else if (config.width === 256 && config.height === 256) {
                    hp = Math.ceil(columns / 2); // 256×256: 2 列 1 卡
                } else {
                    hp = modulesPerPower; // 其他
                }
                powerCableDetails = { details: calculateStandardPowerCables(columns, rows, hp, basePowerCount) };
                powerCableTotal = powerCableDetails.details.reduce((sum, d) => sum + d.count, 0);
            }
            
            // 2. 调用精准 HUB75 算法（根据文档：排线总数 = 总模组数）
            // 检查用户是否选择了箱体配件
            const selectedBoxAccessories = selectedAccessories.filter(acc => 
                acc === 'simple_box' || acc === 'waterproof_box' || acc === 'column_15' || 
                acc.startsWith('cabinet_')
            );
            
            if (selectedBoxAccessories.length > 0) {
                // 用户选择了箱体，按照箱体数量计算排线：每个箱体固定 2 根 20cm + 2 根 40cm + 2 根 60cm
                // 计算箱体数量
                let boxCount = 0;
                selectedBoxAccessories.forEach(accKey => {
                    const accessory = priceDB.accessories[accKey];
                    if (accessory && (accessory.type === 'cabinet' || accessory.type === 'cabinet_auto')) {
                        if (accKey === 'cabinet_auto') {
                            // 自动匹配最佳压铸铝箱体
                            const bestCabinet = getBestCabinetType(columns, rows, moduleWidth, moduleHeight);
                            boxCount += bestCabinet.count;
                        } else if (accKey.startsWith('cabinet_')) {
                            // 压铸铝箱体：按块计算
                            const cabinetSize = accKey.replace('cabinet_', '');
                            const cabinetArea = parseFloat(cabinetSize.split('x')[0]) * parseFloat(cabinetSize.split('x')[1]) / 1000000;
                            boxCount += ceiling(netArea / cabinetArea);
                        } else {
                            // 简易/防水/双立柱箱体：按面积计算，假设每个箱体 1㎡
                            boxCount += ceiling(netArea);
                        }
                    }
                });
                
                // 如果箱体数量为 0，至少为 1
                if (boxCount === 0) boxCount = 1;
                
                // 每个箱体固定排线配置：2 根 20cm + 2 根 40cm + 2 根 60cm
                dataCableDetails = {
                    details: [
                        { name: '20cm 排线', count: boxCount * 2, desc: '箱体固定配置 (20cm)' },
                        { name: '40cm 排线', count: boxCount * 2, desc: '箱体固定配置 (40cm)' },
                        { name: '60cm 排线', count: boxCount * 2, desc: '箱体固定配置 (60cm)' }
                    ],
                    totalCables: boxCount * 6
                };
            } else {
                // 用户未选择箱体，使用原有算法
                const hub75Result = calculateHUB75Exact(columns, rows, moduleHeight, structureType, moduleWidth, moduleHeight);
                
                // 兼容两种返回格式：对象 { details: [...] } 或数组 [...]
                if (hub75Result && Array.isArray(hub75Result.details)) {
                    // 新算法格式：对象 { details: [...], totalCables: ... }
                    dataCableDetails = hub75Result;
                } else if (hub75Result && Array.isArray(hub75Result)) {
                    // 旧算法格式：直接是数组 [...]
                    dataCableDetails = {
                        details: hub75Result,
                        totalCables: hub75Result.reduce((sum, d) => sum + d.count, 0)
                    };
                } else {
                    // 备用：如果没有返回有效数据，使用备用算法
                    dataCableDetails = calculateDataCables(columns, rows, moduleWidth, moduleHeight);
                }
                
                // 备用：如果新算法没有生成排线，使用备用算法
                if (!dataCableDetails.details || dataCableDetails.details.length === 0) {
                    dataCableDetails = calculateDataCables(columns, rows, moduleWidth, moduleHeight);
                }
            }
            
            const dataCables = dataCableDetails.totalCables;
            const ethernetCables = receivingCards > 1 ? receivingCards - 1 : 0;
            const magnets = (structureType === 'outdoor_rear' || structureType === 'outdoor_front') ? 0 : totalModules * 4;

            // 【步骤 6：商务价格核算与户外补丁】
            const moduleTotal = modulePrice * actualArea;
            const powerPrice = priceDB.power[powerBrand] || 38;
            const powerTotal = powerPrice * totalPowerCount;
            
            // 修复：接收卡多型号时分别计算价格
            let cardTotal = 0;
            let cardPrice = 0; // 定义变量用于单型号情况
            if (receivingCardItems && receivingCardItems.length > 1) {
                // 多型号接收卡：分别计算每种型号的价格后求和
                receivingCardItems.forEach(item => {
                    const portCount = item.name.replace(/\s*/g, '').replace('接收卡', '').replace('口', '');
                    const price = priceDB.receivingCards[cardBrand][portCount] || 75;
                    cardTotal += price * item.count;
                });
                // 多型号时计算平均价格用于显示（避免除零）
                cardPrice = receivingCards > 0 ? cardTotal / receivingCards : 0;
            } else {
                // 单型号接收卡
                const cardKey = cardType.split('+')[0].replace('口', '');
                cardPrice = priceDB.receivingCards[cardBrand][cardKey] || 75;
                cardTotal = cardPrice * receivingCards;
            }
            const processorTotal = processorPrice;
            
            let structurePricePerSqm = 200;
            if (structureType === 'E') {
                if (netArea < 5) structurePricePerSqm = 380;
                else if (netArea < 10) structurePricePerSqm = 280;
                else if (netArea < 17) structurePricePerSqm = 200;
                else structurePricePerSqm = 180;
            } else if (structureType === 'Z') {
                if (netArea < 10) structurePricePerSqm = 300;
                else if (netArea < 16) structurePricePerSqm = 220;
                else structurePricePerSqm = 200;
            } else if (structureType === 'outdoor_rear') {
                structurePricePerSqm = 500;
            } else if (structureType === 'outdoor_box') {
                // 户外箱体式：结构费按箱体价格计算，不按平方
                structurePricePerSqm = 0; // 箱体价格单独计算
            } else if (structureType === 'outdoor_front') {
                structurePricePerSqm = 300;
            } else if (structureType === 'embedded') {
                structurePricePerSqm = 200;
            }
            
            // 箱体价格计算（户外箱体式专属）
            let cabinetTotal = 0;
            let cabinetPricePerUnit = 0;
            let cabinetUnitName = '个'; // 单位：个（户外）或 块（室内压铸铝）
            if (structureType === 'outdoor_box') {
                cabinetPricePerUnit = priceDB.box[cabinetType] || 1200;
                // 判断是室内压铸铝箱体还是户外箱体
                if (['640x480', '640x640', '320x480', '320x640'].includes(cabinetType)) {
                    cabinetUnitName = '块';
                }
                cabinetTotal = cabinetPricePerUnit * boxCount;
            }
            
            const structureTotal = structurePricePerSqm * actualArea;
            const installTotal = (productType === 'indoor' || productType === 'special' ? 200 : 300) * netArea;
            const accessoriesTotal = 100 * netArea; // 线材辅料固定 100 元/㎡
            
            // 计算用户选择的配件辅料总价
            let selectedAccessoriesTotal = 0;
            if (selectedAccessories && selectedAccessories.length > 0) {
                selectedAccessories.forEach(accessoryKey => {
                    const accessory = priceDB.accessories[accessoryKey];
                    if (accessory) {
                        let qty = 0;
                        let price = accessory.price;
                        // E结构和甄结构根据面积自动计算价格
                        if (accessory.type === 'structure_auto') {
                            qty = netArea;
                            if (accessoryKey === 'E_structure') {
                                // E结构价格：1-4㎡ 380/㎡，5-9㎡ 280/㎡，10-16㎡ 200/㎡，16㎡以上 180/㎡
                                if (netArea <= 4) price = 380;
                                else if (netArea <= 9) price = 280;
                                else if (netArea <= 16) price = 200;
                                else price = 180;
                            } else if (accessoryKey === 'Z_structure') {
                                // 甄结构价格：9㎡以下 300/㎡，10-15㎡ 220/㎡，15㎡及以上 200/㎡
                                if (netArea <= 9) price = 300;
                                else if (netArea <= 15) price = 220;
                                else price = 200;
                            }
                        } else if (accessory.type === 'structure' || accessory.type === 'install' || accessory.type === 'process' || accessory.type === 'cable') {
                            qty = netArea;
                        } else if (accessory.type === 'install_auto') {
                            // 室内安装调试自动分级计费
                            qty = netArea;
                            if (accessoryKey === 'install_indoor_auto') {
                                // 室内安装调试价格分级：1-3㎡ 300/㎡，4-6㎡ 250/㎡，7-10㎡ 200/㎡，10㎡以上 180/㎡，30㎡以上 150/㎡
                                if (netArea <= 3) price = 300;
                                else if (netArea <= 6) price = 250;
                                else if (netArea <= 10) price = 200;
                                else if (netArea <= 30) price = 180;
                                else price = 150;
                            }
                        } else if (accessory.type === 'module') {
                            // 模组配件（含斜边套件）
                            qty = totalModules;
                        } else if (accessory.type === 'cabinet' || accessory.type === 'cabinet_auto') {
                            // 区分按块计算和按面积计算的箱体
                            if (accessoryKey === 'cabinet_auto') {
                                // 自动匹配最佳压铸铝箱体
                                const bestCabinet = getBestCabinetType(columns, rows, moduleWidth, moduleHeight);
                                qty = bestCabinet.count;
                                price = bestCabinet.price;
                            } else if (accessoryKey.startsWith('cabinet_')) {
                                // 按块计算的箱体（640x480, 640x640 等）
                                const cabinetSize = accessoryKey.replace('cabinet_', '');
                                const cabinetArea = parseFloat(cabinetSize.split('x')[0]) * parseFloat(cabinetSize.split('x')[1]) / 1000000;
                                qty = ceiling(netArea / cabinetArea);
                            } else {
                                // 按面积计算的箱体（简易箱体、防水箱体、双立柱箱体）
                                qty = netArea;
                            }
                        } else if (accessory.type === 'network') {
                            if (accessoryKey === 'fiber_transceiver') {
                                qty = processorPorts;
                            } else {
                                qty = 1;
                            }
                        } else if (accessory.type === 'audio') {
                            qty = 1;
                        } else {
                            qty = 1;
                        }
                        selectedAccessoriesTotal += price * qty;
                    }
                });
            }
            
            let edgeTotal = 0;
            let edgeLength = 0;
            let acTotal = 0;
            let acCount = 0;
            if (structureType === 'outdoor_rear' || structureType === 'outdoor_box') {
                // 防水包边：(宽+0.2 + 高+0.2) × 2 × 200元/米
                edgeLength = (frameWidth + 0.2 + frameHeight + 0.2) * 2;
                edgeTotal = edgeLength * 200;
                // 散热空调：2 匹/30 平方，2500 元/台（向上取整确保足够）
                acCount = Math.ceil(netArea / 30);
                if (acCount < 1) acCount = 1;
                acTotal = acCount * 2500;
            }

            const totalPrice = moduleTotal + powerTotal + cardTotal + processorTotal + structureTotal + installTotal + accessoriesTotal + edgeTotal + acTotal + cabinetTotal + selectedAccessoriesTotal;

            // --- 更新 DOM 面板 ---
            const typeNameMap = {
                'indoor': '室内',
                'outdoor': '户外',
                'special': '特种'
            };
            const structureNameMap = {
                'E': 'E 结构',
                'Z': '臻结构',
                'embedded': '嵌入式',
                'outdoor_rear': '户外后维护',
                'outdoor_front': '户外前维护',
                'outdoor_box': '户外箱体式（960×960）'
            };
            document.getElementById('projectTypeResult').textContent = 
                typeNameMap[productType] + ' P' + config.pitch + ' ' + 
                structureNameMap[structureType];
            document.getElementById('moduleSpecResult').textContent = `${Math.round(moduleWidth*1000)}mm × ${Math.round(moduleHeight*1000)}mm`;
            document.getElementById('layoutResult').textContent = `${columns}列 × ${rows}行 (共 ${totalModules} 块)`;
            document.getElementById('netSizeResult').textContent = `${netWidth.toFixed(2)}m × ${netHeight.toFixed(2)}m (${netArea.toFixed(2)}㎡)`;
            document.getElementById('totalSizeResult').textContent = `${frameWidth.toFixed(2)}m × ${frameHeight.toFixed(2)}m`;
            document.getElementById('pixelCountResult').textContent = Math.round(totalPixels).toLocaleString() + ' 点';

            document.getElementById('totalPrice').textContent = '¥ ' + Math.round(totalPrice).toLocaleString();

            // 更新草稿区
            document.getElementById('workshopDraft').innerHTML = `
                <h3>车间算量推演</h3>
                <div class="draft-section">
                    <h4>1. 实际物理尺寸与向上取整验证</h4>
                    <p><strong>目标尺寸：</strong>${targetWidth}m × ${targetHeight}m</p>
                    <p><strong>模组规格：</strong>${Math.round(moduleWidth*1000)}mm × ${Math.round(moduleHeight*1000)}mm</p>
                    <p><strong>列数计算：</strong>CEILING(${targetWidth} ÷ ${moduleWidth}) = ${columns}列</p>
                    <p><strong>行数计算：</strong>CEILING(${targetHeight} ÷ ${moduleHeight}) = ${rows}行</p>
                    <p><strong>总模组数：</strong>${columns} × ${rows} = ${totalModules}块</p>
                    <p><strong>净显示面积：</strong>${netWidth.toFixed(3)}m × ${netHeight.toFixed(3)}m = ${netArea.toFixed(2)}㎡</p>
                    <p><strong>外框总尺寸：</strong>${frameWidth.toFixed(3)}m × ${frameHeight.toFixed(3)}m</p>
                    <p class="warning-note">${reminderText}</p>
                </div>
                <div class="draft-section">
                    <h4>2. 总像素点计算</h4>
                    <p><strong>水平像素：</strong>${netWidth.toFixed(3)}m ÷ ${(config.pitch/1000).toFixed(4)}m = ${Math.round(netWidth / (config.pitch/1000))}点</p>
                    <p><strong>垂直像素：</strong>${netHeight.toFixed(3)}m ÷ ${(config.pitch/1000).toFixed(4)}m = ${Math.round(netHeight / (config.pitch/1000))}点</p>
                    <p><strong>总像素点：</strong>${Math.round(totalPixels).toLocaleString()}点</p>
                </div>
                <div class="draft-section">
                    <h4>3. 处理器查表匹配结果</h4>
                    <p><strong>总像素点：</strong>${Math.round(totalPixels).toLocaleString()}点</p>
                    <p><strong>匹配型号：</strong>${processorModel}</p>
                    <p><strong>网口数量：</strong>${processorPorts}网口</p>
                    <p><strong>单价：</strong>¥${processorPrice.toLocaleString()}</p>
                </div>
                ${structureType === 'outdoor_rear' || structureType === 'outdoor_box' ? `
                <div class="draft-section">
                    <h4>4. 户外特有项计算</h4>
                    <p><strong>防水包边：</strong>(宽 +0.2 + 高 +0.2)×2 = (${frameWidth.toFixed(2)}+0.2 + ${frameHeight.toFixed(2)}+0.2)×2 = ${(frameWidth + frameHeight + 0.4).toFixed(2)}米</p>
                    <p><strong>包边费用：</strong>${(frameWidth + frameHeight + 0.4).toFixed(2)}米 × ¥200/米 = ¥${edgeTotal.toLocaleString()}</p>
                    <p><strong>空调数量：</strong>CEILING(${netArea.toFixed(2)}㎡ ÷ 30㎡/台) = ${acCount}台</p>
                    <p><strong>空调费用：</strong>${acCount}台 × ¥2500/台 = ¥${acTotal.toLocaleString()}</p>
                </div>
                ` : ''}
                ${structureType === 'outdoor_box' ? `
                <div class="draft-section">
                    <h4>5. 户外箱体配置计算</h4>
                    ${['640x480', '640x640', '320x480', '320x640'].includes(cabinetType) ? `
                    <p><strong>箱体类型：</strong>室内压铸铝箱体</p>
                    <p><strong>箱体规格：</strong>${cabinetType === '640x480' ? '640×480mm' : cabinetType === '640x640' ? '640×640mm' : cabinetType === '320x480' ? '320×480mm' : '320×640mm'}</p>
                    ` : `
                    <p><strong>箱体类型：</strong>户外${cabinetType === 'standard' ? '标准' : cabinetType === 'waterproof' ? '防水' : '简易'}箱体</p>
                    <p><strong>箱体规格：</strong>960×960mm 标准箱体</p>
                    <p><strong>模组排列：</strong>3 列 × 6 行 = 18 个模组/箱</p>
                    `}
                    <p><strong>箱体数量：</strong>CEILING(${totalModules}个模组 ÷ 18) = ${boxCount}个箱体</p>
                    <p><strong>电源配置：</strong>${boxCount}箱 × 5 个电源/箱 = ${basePowerCount}个电源</p>
                    <p><strong>接收卡配置：</strong>${boxCount}个箱体 × 1 卡/箱 = ${receivingCards}张接收卡（一箱一卡）</p>
                    <p><strong>箱体单价：</strong>¥${cabinetPricePerUnit.toLocaleString()}/${['640x480', '640x640', '320x480', '320x640'].includes(cabinetType) ? '块' : '个'}</p>
                    <p><strong>箱体总价：</strong>${boxCount}${['640x480', '640x640', '320x480', '320x640'].includes(cabinetType) ? '块' : '个'} × ¥${cabinetPricePerUnit.toLocaleString()} = ¥${cabinetTotal.toLocaleString()}</p>
                    <p><strong>箱体配件：</strong></p>
                    <ul>
                        <li>箱体连接件：${boxCount}箱 × 4 套/箱 = ${boxCount * 4}套</li>
                        <li>防水密封件：${boxCount}箱 × 1 套/箱 = ${boxCount}套</li>
                        <li>散热风扇：${boxCount}箱 × 2 个/箱 = ${boxCount * 2}个</li>
                        <li>箱体门板：${boxCount}箱 × 1 套/箱 = ${boxCount}套</li>
                    </ul>
                </div>
                ` : ''}
            `;

            // 更新报价明细表
            let quotationHTML = `
                <div class="table-header">
                    <h3>商业报价明细</h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="export-btn" type="button" onclick="showExportLanguageDialog('quotation')">导出 Word</button>
                        <button class="export-btn" type="button" onclick="showExportLanguageDialog('contract')">导出合同</button>
                        <button class="export-btn" type="button" onclick="exportQuotationToExcel()">导出 Excel</button>
                    </div>
                </div>
                
                <!-- 项目信息 -->
                <div class="project-info" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 5px 10px; width: 80px;"><strong>客户 Client</strong></td>
                            <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${customerName || '待补充'}</td>
                            <td style="padding: 5px 10px; width: 80px;"><strong>项目名称 Project</strong></td>
                            <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${projectName || '菲利视界 LED显示屏'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 10px;"><strong>项目地点 Location</strong></td>
                            <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${projectLocation || '待补充'}</td>
                            <td style="padding: 5px 10px;"><strong>报价日期 Quote Date</strong></td>
                            <td style="padding: 5px 10px; border-bottom: 1px solid #ddd;">${new Date().toLocaleDateString('zh-CN')}</td>
                        </tr>
                    </table>
                </div>

                <table class="quotation-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">编号 No.</th>
                            <th>名称/品牌 Items/Brand</th>
                            <th>参数 Parameter</th>
                            <th style="width: 60px;">单位 Unit</th>
                            <th style="width: 80px;">数量 Number</th>
                            <th style="width: 100px;">单价 Unit Price</th>
                            <th style="width: 120px;">金额 Amount(RMB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>${productCategoryName}</td>
                            <td>P${config.pitch} ${Math.round(moduleWidth*1000)}mm×${Math.round(moduleHeight*1000)}mm；像素间距≤${config.pitch}mm；整屏平整度≤0.08mm；反光率＜1%；可视角度≥175°；亮度均匀性≥99%</td>
                            <td>平方</td>
                            <td>${actualArea.toFixed(3)}</td>
                            <td>${modulePrice.toLocaleString()}</td>
                            <td>${(modulePrice * actualArea).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>系统电源</td>
                            <td>${getBrandName(powerBrand).replace('康胜', '创联').replace('创联', '创联5V40A')} LED专用电源(含5%备品)</td>
                            <td>个</td>
                            <td>${totalPowerCount}</td>
                            <td>${powerPrice.toLocaleString()}</td>
                            <td>${powerTotal.toLocaleString()}</td>
                        </tr>
                        ${receivingCardItems && receivingCardItems.length > 1 ? 
                            receivingCardItems.map((item, index) => {
                                const portCount = item.name.replace(/\s*/g, '').replace('接收卡', '').replace('口', '');
                                const price = priceDB.receivingCards[cardBrand][portCount] || 75;
                                return `<tr>
                            <td>3-${index + 1}</td>
                            <td>接收卡</td>
                            <td>LED显示屏接收卡 ${item.name} (${getBrandName(cardBrand)})</td>
                            <td>张</td>
                            <td>${item.count}</td>
                            <td>${price.toLocaleString()}</td>
                            <td>${(price * item.count).toLocaleString()}</td>
                        </tr>`;
                            }).join('') : 
                            `<tr>
                            <td>3</td>
                            <td>接收卡</td>
                            <td>LED显示屏接收卡 ${cardType} (${getBrandName(cardBrand)})</td>
                            <td>张</td>
                            <td>${receivingCards}</td>
                            <td>${cardPrice.toLocaleString()}</td>
                            <td>${cardTotal.toLocaleString()}</td>
                        </tr>`}
                        <tr>
                            <td>${receivingCardItems && receivingCardItems.length > 1 ? '4' : '4'}</td>
                            <td>视频处理器</td>
                            <td>${getBrandName(cardBrand)} ${processorModel}网口视频处理器</td>
                            <td>台</td>
                            <td>1</td>
                            <td>${processorPrice.toLocaleString()}</td>
                            <td>${processorPrice.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>线材及辅料</td>
                            <td>国标3C认证排线、电源线、网线、磁铁等(含备品)</td>
                            <td>平方</td>
                            <td>${netArea.toFixed(3)}</td>
                            <td>100</td>
                            <td>${accessoriesTotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>结构支架</td>
                            <td>${structureNameMap[structureType] || '室内极简钢结构及极简防护包边'}</td>
                            <td>平方</td>
                            <td>${actualArea.toFixed(3)}</td>
                            <td>${structurePricePerSqm.toLocaleString()}</td>
                            <td>${structureTotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>安装调试费</td>
                            <td>${productType === 'indoor' || productType === 'special' ? '室内' : '户外'}标准安装调试服务</td>
                            <td>平方</td>
                            <td>${netArea.toFixed(3)}</td>
                            <td>${(productType === 'indoor' || productType === 'special' ? 200 : 300).toLocaleString()}</td>
                            <td>${installTotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>LED播放器</td>
                            <td>电脑手机双端控制软件，免费赠送教程</td>
                            <td>套</td>
                            <td>1</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>物流运输</td>
                            <td>运费到付</td>
                            <td>/</td>
                            <td>1</td>
                            <td>/</td>
                            <td>/</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>供电线</td>
                            <td>3×2.5 电源线 (1根带20个电源)</td>
                            <td>根</td>
                            <td>${ceiling(totalPowerCount / 20)}</td>
                            <td>/</td>
                            <td>甲方自备</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td>信号线</td>
                            <td>超5类/6类网线 (1根带650000像素)</td>
                            <td>根</td>
                            <td>${ceiling(totalPixels / 650000)}</td>
                            <td>/</td>
                            <td>甲方自备</td>
                        </tr>
                        <tr>
                            <td>12</td>
                            <td>技术支持</td>
                            <td>免费提供远程人工技术指导，安装指导，人员培训，布线图效果图施工图</td>
                            <td>项</td>
                            <td>1</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
                
                <!-- 配件辅料项目（动态生成） -->
                <div id="accessoryItems"></div>

                <!-- 价格汇总 -->
                <div class="price-summary" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; text-align: left;"><strong>项目</strong></td>
                            <td style="padding: 10px; text-align: right;"><strong>金额</strong></td>
                        </tr>
                        <tr style="background: #fff;">
                            <td style="padding: 10px; text-align: left; font-size: 16px;"><strong>屏幕物料总价（未税）</strong></td>
                            <td style="padding: 10px; text-align: right; font-size: 18px; color: #d32f2f;"><strong>¥ ${Math.round(totalPrice).toLocaleString()}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: left; color: #666; font-size: 12px;">* 参考总价，最终以合同确认为准</td>
                        </tr>
                    </table>
                </div>
            `;
            document.getElementById('quotationTable').innerHTML = quotationHTML;

            // 构建报价项目列表
            let quoteItems = [
                { no: 1, name: productCategoryName, param: `P${config.pitch} ${Math.round(moduleWidth*1000)}mm×${Math.round(moduleHeight*1000)}mm；像素间距≤${config.pitch}mm`, unit: '平方', qty: actualArea.toFixed(3), price: modulePrice, amount: modulePrice * actualArea },
                { no: 2, name: '系统电源', param: `${getBrandName(powerBrand).replace('康胜', '创联').replace('创联', '创联5V40A')} LED专用电源(含5%备品)`, unit: '个', qty: totalPowerCount, price: powerPrice, amount: powerTotal }
            ];

            // 接收卡：支持多型号显示
            if (receivingCardItems && receivingCardItems.length > 1) {
                receivingCardItems.forEach((item, index) => {
                    const portCount = item.name.replace(/\s*/g, '').replace('接收卡', '').replace('口', '');
                    const price = priceDB.receivingCards[cardBrand][portCount] || 0;
                    quoteItems.push({ 
                        no: '3-' + (index + 1), 
                        name: item.name, 
                        param: `${getBrandName(cardBrand)} ${portCount}口接收卡`, 
                        unit: '张', 
                        qty: item.count, 
                        price: price, 
                        amount: price * item.count 
                    });
                });
            } else {
                quoteItems.push({ no: 3, name: '接收卡', param: `LED显示屏接收卡 ${cardType} (${getBrandName(cardBrand)})`, unit: '张', qty: receivingCards, price: cardPrice, amount: cardTotal });
            }

            quoteItems.push(
                { no: 4, name: '视频处理器', param: `${getBrandName(cardBrand)} ${processorModel}网口视频处理器`, unit: '台', qty: 1, price: processorPrice, amount: processorPrice },
                { no: 5, name: '线材及辅料', param: '国标3C认证排线、电源线、网线、磁铁等(含备品)', unit: '平方', qty: netArea.toFixed(3), price: 100, amount: accessoriesTotal },
                { no: 6, name: '结构支架', param: structureNameMap[structureType] || '室内极简钢结构及极简防护包边', unit: '平方', qty: actualArea.toFixed(3), price: structurePricePerSqm, amount: structureTotal }
            );

            // 如果是户外箱体式，添加箱体项目
            if (structureType === 'outdoor_box') {
                // 使用辅助函数获取箱体类型信息
                const cabinetInfo = getCabinetTypeName(cabinetType);
                
                quoteItems.push(
                    { no: '6-1', name: `LED 显示屏${cabinetInfo.cabinetCategory}箱体`, param: `${cabinetInfo.cabinetSizeName}${cabinetInfo.cabinetCategory}箱体 (含内部配件)`, unit: cabinetInfo.cabinetUnit, qty: boxCount, price: cabinetPricePerUnit, amount: cabinetTotal },
                    { no: '6-2', name: `${cabinetInfo.cabinetCategory}箱体备品`, param: `${cabinetInfo.cabinetSizeName}${cabinetInfo.cabinetCategory}箱体备品 (3%)`, unit: cabinetInfo.cabinetUnit, qty: ceiling(boxCount * 0.03), price: cabinetPricePerUnit, amount: ceiling(boxCount * 0.03) * cabinetPricePerUnit },
                    { no: '6-3', name: '箱体连接件', param: '不锈钢锁扣/连接件', unit: '套', qty: boxCount * 4, price: 15, amount: boxCount * 4 * 15 },
                    { no: '6-4', name: '防水密封件', param: '箱体防水胶条/密封胶', unit: '套', qty: boxCount, price: 20, amount: boxCount * 20 },
                    { no: '6-5', name: '散热风扇', param: '12V 静音风扇 (箱体散热)', unit: '个', qty: boxCount * 2, price: 25, amount: boxCount * 2 * 25 },
                    { no: '6-6', name: '箱体门板', param: '后维护门板 (含锁)', unit: '套', qty: boxCount, price: 80, amount: boxCount * 80 }
                );
            }

            quoteItems.push(
                { no: 7, name: '安装调试费', param: `${productType === 'indoor' || productType === 'special' ? '室内' : '户外'}标准安装调试服务`, unit: '平方', qty: netArea.toFixed(3), price: (productType === 'indoor' || productType === 'special' ? 200 : 300), amount: installTotal }
            );

            // 户外后维护/箱体额外费用
            if (structureType === 'outdoor_rear' || structureType === 'outdoor_box') {
                quoteItems.push(
                    { no: '7-1', name: '防水包边', param: '单侧10cm铝塑板包边', unit: '米', qty: edgeLength.toFixed(2), price: 200, amount: edgeTotal },
                    { no: '7-2', name: '散热空调', param: '2匹工业级空调', unit: '台', qty: acCount, price: 2500, amount: acTotal }
                );
            }

            quoteItems.push(
                { no: 8, name: 'LED 播放器', param: '电脑手机双端控制软件，免费赠送教程', unit: '套', qty: 1, price: 0, amount: 0 },
                { no: 9, name: '物流运输', param: '运费到付', unit: '/', qty: 1, price: null, amount: null },
                { no: 10, name: '供电线', param: `3×2.5 电源线 (1 根带 20 个电源)`, unit: '根', qty: ceiling(totalPowerCount / 20), price: null, amount: '甲方自备' },
                { no: 11, name: '信号线', param: '超 5 类/6 类网线 (1 根带 650000 像素)', unit: '根', qty: ceiling(totalPixels / 650000), price: null, amount: '甲方自备' },
                { no: 12, name: '技术支持', param: '免费提供远程人工技术指导，安装指导，人员培训', unit: '项', qty: 1, price: 0, amount: 0 }
            );
            
            // 添加用户选择的配件辅料项目
            if (selectedAccessories && selectedAccessories.length > 0) {
                let accessoryNo = 13;
                selectedAccessories.forEach(accessoryKey => {
                    const accessory = priceDB.accessories[accessoryKey];
                    if (accessory) {
                        // 跳过结构费类型（因为第 6 项"结构支架"已包含）
                        if (accessory.type === 'structure' || accessory.type === 'structure_auto') {
                            return; // 跳过结构费
                        }

                        let qty = 0;
                        let amount = 0;

                        // 根据配件类型计算数量和金额（使用实际面积 netArea，不取整）
                        if (accessory.type === 'install' || accessory.type === 'process' || accessory.type === 'cable') {
                            // 按平方计算的配件（使用实际面积，不取整）
                            qty = netArea;
                            amount = accessory.price * netArea;
                        } else if (accessory.type === 'module') {
                            // 模组配件（含斜边套件）
                            qty = totalModules;
                            amount = accessory.price * totalModules;
                        } else if (accessory.type === 'cabinet') {
                            // 箱体：需要根据尺寸计算数量
                            const cabinetSize = accessoryKey.replace('cabinet_', '');
                            const cabinetArea = parseFloat(cabinetSize.split('x')[0]) * parseFloat(cabinetSize.split('x')[1]) / 1000000; // 转换为平方米
                            qty = ceiling(inputArea / cabinetArea);
                            amount = accessory.price * qty;
                        } else if (accessory.type === 'network') {
                            // 网络设备：根据网口数量计算
                            if (accessoryKey === 'fiber_transceiver') {
                                qty = processorPorts; // 每个网口一台
                                amount = accessory.price * qty;
                            } else {
                                qty = 1;
                                amount = accessory.price;
                            }
                        } else if (accessory.type === 'audio') {
                            // 音响设备：根据面积选择
                            qty = 1;
                            amount = accessory.price;
                        } else {
                            // 其他设备
                            qty = 1;
                            amount = accessory.price;
                        }
                        
                        quoteItems.push({
                            no: accessoryNo++,
                            name: accessory.name,
                            param: `${accessory.price}元/${accessory.unit}`,
                            unit: accessory.unit,
                            qty: qty,
                            price: accessory.price,
                            amount: amount
                        });
                    }
                });
            }

            const quoteTotalExcludingTax = quoteItems.reduce((sum, item) => {
                return sum + (typeof item.amount === 'number' ? item.amount : 0);
            }, 0);
            const vatRate = 0.13;
            const vatAmount = Math.round(quoteTotalExcludingTax * vatRate * 100) / 100;
            const totalIncludingTax = Math.round((quoteTotalExcludingTax + vatAmount) * 100) / 100;
            const plateauLocationPattern = /(西藏|拉萨|那曲|阿里|日喀则|昌都|林芝|山南|高原|tibet)/i;
            const isPlateauProject = plateauLocationPattern.test(projectLocation || '') || quoteItems.some(item => String(item.name || '').includes('高原'));

            // 存储报价数据用于导出 Excel
            window.quotationData = {
                projectInfo: {
                    customer: customerName || '待补充',
                    project: projectName || '菲利视界 LED 显示屏',
                    location: projectLocation || '待补充',
                    date: new Date().toLocaleDateString('zh-CN')
                },
                items: quoteItems,
                totalPrice: totalPrice
            };

            window.contractData = {
                projectInfo: {
                    customer: customerName || '',
                    project: projectName || '',
                    location: projectLocation || '',
                    date: new Date().toLocaleDateString('zh-CN')
                },
                quotationItems: quoteItems.map(item => ({ ...item })),
                financial: {
                    totalExcludingTax: quoteTotalExcludingTax,
                    vatRate: vatRate,
                    vatAmount: vatAmount,
                    totalIncludingTax: totalIncludingTax,
                    prepaymentRate: 0.5,
                    finalPaymentRate: 0.5
                },
                screen: {
                    productCategory: productCategory,
                    productCategoryName: productCategoryName,
                    productModel: productModel,
                    productType: productType,
                    structureType: structureType,
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    moduleWidthMm: config.width,
                    moduleHeightMm: config.height,
                    pitch: config.pitch,
                    columns: columns,
                    rows: rows,
                    totalModules: totalModules,
                    netWidth: netWidth,
                    netHeight: netHeight,
                    netArea: netArea,
                    actualArea: actualArea,
                    totalPixels: totalPixels,
                    basePowerCount: basePowerCount,
                    sparePowerCount: sparePowerCount,
                    totalPowerCount: totalPowerCount,
                    cardBrand: cardBrand,
                    cardType: cardType,
                    receivingCards: receivingCards,
                    processorModel: processorModel,
                    processorPorts: processorPorts,
                    selectedAccessories: selectedAccessories.slice()
                },
                flags: {
                    isPlateauProject: isPlateauProject
                }
            };
            
            // 动态生成配件辅料 HTML 并插入到表格中（排除结构费，因为第 6 项已包含）
            if (selectedAccessories && selectedAccessories.length > 0) {
                let accessoryHTML = '';
                let accessoryNo = 13;
                selectedAccessories.forEach(accessoryKey => {
                    const accessory = priceDB.accessories[accessoryKey];
                    if (accessory) {
                        // 跳过结构费类型（因为第 6 项"结构支架"已包含）
                        if (accessory.type === 'structure' || accessory.type === 'structure_auto') {
                            return; // 跳过结构费
                        }
                        
                        let qty = 0;
                        let amount = 0;
                        
                        if (accessory.type === 'install' || accessory.type === 'process' || accessory.type === 'cable') {
                            qty = netArea;
                            amount = accessory.price * netArea;
                        } else if (accessory.type === 'module') {
                            qty = totalModules;
                            amount = accessory.price * totalModules;
                        } else if (accessory.type === 'cabinet') {
                            // 区分按块计算和按面积计算的箱体
                            if (accessoryKey.startsWith('cabinet_')) {
                                // 按块计算的箱体（640x480, 640x640 等）
                                const cabinetSize = accessoryKey.replace('cabinet_', '');
                                const cabinetArea = parseFloat(cabinetSize.split('x')[0]) * parseFloat(cabinetSize.split('x')[1]) / 1000000;
                                qty = ceiling(inputArea / cabinetArea);
                                amount = accessory.price * qty;
                            } else {
                                // 按面积计算的箱体（简易箱体、防水箱体、双立柱箱体）
                                qty = netArea;
                                amount = accessory.price * netArea;
                            }
                        } else if (accessory.type === 'network') {
                            if (accessoryKey === 'fiber_transceiver') {
                                qty = processorPorts;
                                amount = accessory.price * qty;
                            } else {
                                qty = 1;
                                amount = accessory.price;
                            }
                        } else if (accessory.type === 'audio') {
                            qty = 1;
                            amount = accessory.price;
                        } else {
                            qty = 1;
                            amount = accessory.price;
                        }
                        
                        accessoryHTML += `<tr>
                            <td>${accessoryNo++}</td>
                            <td>${accessory.name}</td>
                            <td>${accessory.price}元/${accessory.unit}</td>
                            <td>${accessory.unit}</td>
                            <td>${qty}</td>
                            <td>${accessory.price.toLocaleString()}</td>
                            <td>${amount.toLocaleString()}</td>
                        </tr>`;
                    }
                });
                
                // 将配件辅料插入到报价表中（在第 12 项之后）
                const quotationTableBody = document.querySelector('#quotationTable .quotation-table tbody');
                if (quotationTableBody) {
                    // 直接使用 insertAdjacentHTML 插入到 tbody 末尾
                    quotationTableBody.insertAdjacentHTML('beforeend', accessoryHTML);
                }
            }

            // 生成发货备料表（理论量/备品量/发货量三列分离）
            const moduleSpareRate = 0.02; // 2% 模组备品率
            const moduleSpareQty = ceiling(totalModules * moduleSpareRate);
            const totalModuleQty = totalModules + moduleSpareQty;
            
            // 计算接收卡备品：10平以内多配1个，每增加10平增加1个
            const cardSpareQty = netArea <= 10 ? 1 : ceiling(netArea / 10);
            const totalReceivingCards = receivingCards + cardSpareQty;
            
            // 生成电源线详细统计（支持新算法）
            let powerCableRows = '';
            if (powerCableDetails.details) {
                // 新算法格式：{ details: [{name, count, desc}] }
                let totalPowerCables = 0;
                powerCableDetails.details.forEach(cable => {
                    powerCableRows += `<tr>
                        <td>电源线</td>
                        <td>${cable.name}</td>
                        <td>${cable.count}</td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;">${cable.count}</td>
                        <td>根</td>
                        <td>${cable.desc}</td>
                    </tr>`;
                    totalPowerCables += cable.count;
                });
                
                // 添加电源线统计摘要
                if (totalPowerCables > 0) {
                    powerCableRows += `<tr style="background-color: #f8f9fa;">
                        <td colspan="2"><strong>电源线统计</strong></td>
                        <td><strong>${totalPowerCables}</strong></td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;"><strong>${totalPowerCables}</strong></td>
                        <td>根</td>
                        <td>${isStandardModule ? '严格 (P-1) 拓扑推演' : '统一串联方式'}</td>
                    </tr>`;
                }
            } else {
                // 传统电源线
                let totalPowerCables = 0;
                if (powerCableDetails.horizontal_40cm > 0) {
                    powerCableRows += `<tr>
                        <td>电源线</td>
                        <td>40cm 水平串联线</td>
                        <td>${powerCableDetails.horizontal_40cm}</td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;">${powerCableDetails.horizontal_40cm}</td>
                        <td>根</td>
                        <td>电源间水平串联</td>
                    </tr>`;
                    totalPowerCables += powerCableDetails.horizontal_40cm;
                }
                if (powerCableDetails.vertical_Lvert > 0) {
                    powerCableRows += `<tr>
                        <td>电源线</td>
                        <td>L_vert 垂直跳线 (${(powerCableDetails.LvertLength_cm / powerCableDetails.vertical_Lvert).toFixed(0)}cm/根)</td>
                        <td>${powerCableDetails.vertical_Lvert}</td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;">${powerCableDetails.vertical_Lvert}</td>
                        <td>根</td>
                        <td>跨行垂直跳线 (总长${powerCableDetails.LvertLength_cm.toFixed(0)}cm)</td>
                    </tr>`;
                    totalPowerCables += powerCableDetails.vertical_Lvert;
                }
                if (powerCableDetails.tail_Ltail > 0) {
                    powerCableRows += `<tr>
                        <td>电源线</td>
                        <td>L_tail 尾数排连线 (${powerCableDetails.LtailLength_cm.toFixed(0)}cm)</td>
                        <td>${powerCableDetails.tail_Ltail}</td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;">${powerCableDetails.tail_Ltail}</td>
                        <td>根</td>
                        <td>最后一排借电连线</td>
                    </tr>`;
                    totalPowerCables += powerCableDetails.tail_Ltail;
                }
                // 添加电源线统计摘要
                if (totalPowerCables > 0) {
                    powerCableRows += `<tr style="background-color: #f8f9fa;">
                        <td colspan="2"><strong>电源线统计</strong></td>
                        <td><strong>${totalPowerCables}</strong></td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;"><strong>${totalPowerCables}</strong></td>
                        <td>根</td>
                        <td>传统串联方式</td>
                    </tr>`;
                }
            }
            
            // 生成模组排线详细统计（支持新算法）
            let dataCableRows = '';
            if (dataCableDetails.details) {
                // 新算法格式：{ details: [{name, count, desc}] }
                let totalDataCables = 0;
                dataCableDetails.details.forEach(cable => {
                    dataCableRows += `<tr>
                        <td>模组排线</td>
                        <td>${cable.name}</td>
                        <td>${cable.count}</td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;">${cable.count}</td>
                        <td>根</td>
                        <td>${cable.desc}</td>
                    </tr>`;
                    totalDataCables += cable.count;
                });
                
                // 添加排线统计摘要
                if (totalDataCables > 0) {
                    dataCableRows += `<tr style="background-color: #f8f9fa;">
                        <td colspan="2"><strong>排线统计</strong></td>
                        <td><strong>${totalDataCables}</strong></td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;"><strong>${totalDataCables}</strong></td>
                        <td>根</td>
                        <td>精准对称发散序列</td>
                    </tr>`;
                }
            } else {
                // 旧算法格式：{ cableLengths: [] }
                const cableLengthStats = {};
                dataCableDetails.cableLengths.forEach(length => {
                    cableLengthStats[length] = (cableLengthStats[length] || 0) + 1;
                });
                
                // 按长度排序并生成行（显示所有长度）
                const sortedLengths = Object.keys(cableLengthStats).sort((a, b) => parseInt(a) - parseInt(b));
                sortedLengths.forEach(length => {
                    const count = cableLengthStats[length];
                    dataCableRows += `<tr>
                        <td>模组排线</td>
                        <td>${length}cm 排线</td>
                        <td>${count}</td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;">${count}</td>
                        <td>根</td>
                        <td>居中发散序列</td>
                    </tr>`;
                });
                
                // 添加统计摘要
                if (sortedLengths.length > 0) {
                    dataCableRows += `<tr style="background-color: #f8f9fa;">
                        <td colspan="2"><strong>排线统计</strong></td>
                        <td><strong>${dataCableDetails.totalCables}</strong></td>
                        <td style="color: #999;">0</td>
                        <td style="color: #28a745; font-weight: bold;"><strong>${dataCableDetails.totalCables}</strong></td>
                        <td>根</td>
                        <td>共${sortedLengths.length}种长度 (${sortedLengths[0]}cm - ${sortedLengths[sortedLengths.length - 1]}cm)</td>
                    </tr>`;
                }
            }
            
            const shippingHTML = `
                <div class="table-header">
                    <h3>发货备料表</h3>
                    <div style="display: flex; gap: 10px;">
                        <button class="export-btn" type="button" onclick="showExportLanguageDialog('shipping')">导出 Word</button>
                        <button class="export-btn" type="button" onclick="exportShippingToExcel()">导出 Excel</button>
                    </div>
                </div>
                <table class="quotation-table">
                    <thead>
                        <tr>
                            <th>物料名称</th>
                            <th>规格型号</th>
                            <th>理论用量</th>
                            <th>备品数量</th>
                            <th>发货总量</th>
                            <th>单位</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>LED 模组</td>
                            <td>P${config.pitch} ${Math.round(moduleWidth*1000)}×${Math.round(moduleHeight*1000)}mm</td>
                            <td>${totalModules}</td>
                            <td style="color: #ffc107; font-weight: bold;">${moduleSpareQty}</td>
                            <td style="color: #28a745; font-weight: bold;">${totalModuleQty}</td>
                            <td>块</td>
                            <td>备品率 2%</td>
                        </tr>
                        <tr>
                            <td>系统电源</td>
                            <td>${powerBrand.replace('_', ' ')}</td>
                            <td>${basePowerCount}</td>
                            <td style="color: #ffc107; font-weight: bold;">${sparePowerCount}</td>
                            <td style="color: #28a745; font-weight: bold;">${totalPowerCount}</td>
                            <td>个</td>
                            <td>备品率 5%（向上取整）</td>
                        </tr>
                        ${receivingCardItems && receivingCardItems.length > 1 ? 
                            receivingCardItems.map((item, index) => `<tr>
                            <td>接收卡 ${index + 1}</td>
                            <td>${getBrandName(cardBrand)} ${item.name}</td>
                            <td>${item.count}</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">${item.count}</td>
                            <td>张</td>
                            <td>${item.desc}</td>
                        </tr>`).join('') + `
                        <tr>
                            <td>接收卡备品</td>
                            <td>${getBrandName(cardBrand)} 接收卡备品</td>
                            <td>0</td>
                            <td style="color: #ffc107; font-weight: bold;">${cardSpareQty}</td>
                            <td style="color: #28a745; font-weight: bold;">${cardSpareQty}</td>
                            <td>张</td>
                            <td>10㎡内1张，每增10㎡加1张</td>
                        </tr>` : 
                        `<tr>
                            <td>接收卡</td>
                            <td>${getBrandName(cardBrand)} ${cardType}口</td>
                            <td>${receivingCards}</td>
                            <td style="color: #ffc107; font-weight: bold;">${cardSpareQty}</td>
                            <td style="color: #28a745; font-weight: bold;">${totalReceivingCards}</td>
                            <td>张</td>
                            <td>10㎡内1张，每增10㎡加1张</td>
                        </tr>`}
                        <tr>
                            <td>视频处理器</td>
                            <td>${getBrandName(cardBrand)} ${processorModel}</td>
                            <td>1</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">1</td>
                            <td>台</td>
                            <td>不含备品</td>
                        </tr>
                        ${powerCableRows}
                        ${dataCableRows}
                        <tr>
                            <td>接收卡网线</td>
                            <td>50cm 纯铜网线</td>
                            <td>${ethernetCables}</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">${ethernetCables}</td>
                            <td>根</td>
                            <td>S 型级联</td>
                        </tr>
                        ${structureType !== 'outdoor_rear' && structureType !== 'outdoor_front' ? `
                        <tr>
                            <td>强磁磁铁</td>
                            <td>模组固定件</td>
                            <td>${magnets}</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">${magnets}</td>
                            <td>个</td>
                            <td>每模组 4 个</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td>模组取板器</td>
                            <td>标配售后维护工具</td>
                            <td>1</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">1</td>
                            <td>把</td>
                            <td>每表 1 把</td>
                        </tr>
                        ${structureType === 'outdoor_rear' ? `
                        <tr>
                            <td>防水包边</td>
                            <td>单侧 10cm 铝塑板</td>
                            <td>${perimeter.toFixed(2)}</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">${perimeter.toFixed(2)}</td>
                            <td>米</td>
                            <td>户外后维护专属</td>
                        </tr>
                        <tr>
                            <td>散热空调</td>
                            <td>2 匹 工业级空调</td>
                            <td>${acCount}</td>
                            <td style="color: #999;">0</td>
                            <td style="color: #28a745; font-weight: bold;">${acCount}</td>
                            <td>台</td>
                            <td>每 30㎡1 台</td>
                        </tr>
                        ` : ''}
                        
                        ${selectedAccessories && selectedAccessories.length > 0 ? selectedAccessories.map(accessoryKey => {
                            const accessory = priceDB.accessories[accessoryKey];
                            if (!accessory) return '';
                            
                            let theoryQty = 0;
                            let totalQty = 0;
                            let note = '';
                            
                            let price = accessory.price;
                            if (accessory.type === 'structure' || accessory.type === 'install' || accessory.type === 'process' || accessory.type === 'cable') {
                                theoryQty = netArea;
                                totalQty = netArea;
                                note = `按面积 (${accessory.price}元/㎡)`;
                            } else if (accessory.type === 'install_auto') {
                                // 室内安装调试自动分级计费
                                theoryQty = netArea;
                                totalQty = netArea;
                                if (accessoryKey === 'install_indoor_auto') {
                                    if (netArea <= 3) price = 300;
                                    else if (netArea <= 6) price = 250;
                                    else if (netArea <= 10) price = 200;
                                    else if (netArea <= 30) price = 180;
                                    else price = 150;
                                    note = `室内安装 ${price}元/㎡ (按面积自动)`;
                                }
                            } else if (accessory.type === 'module') {
                                theoryQty = totalModules;
                                totalQty = totalModules;
                                note = `按模组数 (${accessory.price}元/${accessory.unit})`;
                            } else if (accessory.type === 'cabinet' || accessory.type === 'cabinet_auto') {
                                // 区分压铸铝箱体和简易/防水/双立柱箱体
                                if (accessoryKey === 'cabinet_auto') {
                                    // 自动匹配最佳压铸铝箱体
                                    const bestCabinet = getBestCabinetType(columns, rows, moduleWidth, moduleHeight);
                                    const spareQty = ceiling(bestCabinet.count * 0.03);
                                    theoryQty = bestCabinet.count;
                                    totalQty = bestCabinet.count + spareQty;
                                    note = `自动匹配 ${bestCabinet.type} (${bestCabinet.price}元/块)`;
                                } else if (accessoryKey.startsWith('cabinet_')) {
                                    // 压铸铝箱体：按块计算
                                    const cabinetSize = accessoryKey.replace('cabinet_', '');
                                    const cabinetArea = parseFloat(cabinetSize.split('x')[0]) * parseFloat(cabinetSize.split('x')[1]) / 1000000;
                                    const cabinetQty = ceiling(inputArea / cabinetArea);
                                    const spareQty = ceiling(cabinetQty * 0.03);
                                    theoryQty = cabinetQty;
                                    totalQty = cabinetQty + spareQty;
                                    note = `含 3% 备品 (${accessory.price}元/${accessory.unit})`;
                                } else {
                                    // 简易/防水/双立柱箱体：按面积计算
                                    theoryQty = netArea;
                                    const spareQty = ceiling(netArea * 0.03);
                                    totalQty = theoryQty + spareQty;
                                    note = `含 3% 备品 (${accessory.price}元/${accessory.unit})`;
                                }
                            } else if (accessory.type === 'network') {
                                if (accessoryKey === 'fiber_transceiver') {
                                    theoryQty = processorPorts;
                                    totalQty = processorPorts;
                                    note = '每网口一台';
                                } else {
                                    theoryQty = 1;
                                    totalQty = 1;
                                    note = '按项目配置';
                                }
                            } else if (accessory.type === 'audio') {
                                theoryQty = 1;
                                totalQty = 1;
                                note = accessoryKey === 'audio_30_50' ? '适用 30-50 平方' : '适用 50-100 平方';
                            } else {
                                theoryQty = 1;
                                totalQty = 1;
                                note = '按项目配置';
                            }
                            
                            return `<tr>
                                <td>${accessory.name}</td>
                                <td>${accessory.price}元/${accessory.unit}</td>
                                <td>${theoryQty}</td>
                                <td style="color: #999;">${accessory.type === 'cabinet' ? ceiling(theoryQty * 0.03) : '-'}</td>
                                <td style="color: #28a745; font-weight: bold;">${totalQty}</td>
                                <td>${accessory.unit}</td>
                                <td>${note}</td>
                            </tr>`;
                        }).join('') : ''}
                    </tbody>
                </table>
                <div class="quotation-note" style="margin-top: 10px; border-left-color: #17a2b8;">
                    <strong>发货说明：</strong>
                    <ul>
                        <li><strong>备品物理隔离：</strong>备品不计入布线计算基数</li>
                        <li><strong>电源备品率：</strong>5%（向上取整）</li>
                        <li><strong>模组备品率：</strong>2%（向上取整，可按合同约定调整）</li>
                        <li><strong>接收卡备品：</strong>10㎡内1张，每增10㎡加1张</li>
                        <li><strong>视频处理器：</strong>不含备品</li>
                        <li><strong>线缆类：</strong>不含备品（建议现场多备 2-3 根）</li>
                        ${isStandardModule ? '<li><strong>电源线布局：</strong>列优先布局 + S 型串联（320×160 模组专用）</li>' : ''}
                    </ul>
                </div>
            `;
            document.getElementById('shippingTable').innerHTML = shippingHTML;

            // 存储发货数据用于导出Excel
            const shippingItems = [
                { name: 'LED模组', spec: `P${config.pitch} ${Math.round(moduleWidth*1000)}×${Math.round(moduleHeight*1000)}mm`, theory: totalModules, spare: moduleSpareQty, total: totalModuleQty, unit: '块', note: '备品率2%' },
                { name: '系统电源', spec: powerBrand.replace('_', ' '), theory: basePowerCount, spare: sparePowerCount, total: totalPowerCount, unit: '个', note: '备品率5%' }
            ];

            // 接收卡：支持多型号显示
            if (receivingCardItems && receivingCardItems.length > 1) {
                receivingCardItems.forEach(item => {
                    shippingItems.push({ name: item.name, spec: getBrandName(cardBrand), theory: item.count, spare: 0, total: item.count, unit: '张', note: item.desc });
                });
                // 添加接收卡备品
                shippingItems.push({ name: '接收卡备品', spec: `${getBrandName(cardBrand)} 接收卡备品`, theory: 0, spare: cardSpareQty, total: cardSpareQty, unit: '张', note: '10㎡内1张，每增10㎡加1张' });
            } else {
                shippingItems.push({ name: '接收卡', spec: `${getBrandName(cardBrand)} ${cardType}口`, theory: receivingCards, spare: cardSpareQty, total: totalReceivingCards, unit: '张', note: '10㎡内1张，每增10㎡加1张' });
            }

            shippingItems.push(
                { name: '视频处理器', spec: `${getBrandName(cardBrand)} ${processorModel}`, theory: 1, spare: 0, total: 1, unit: '台', note: '不含备品' }
            );

            // 添加电源线数据
            if (powerCableDetails.details) {
                powerCableDetails.details.forEach(cable => {
                    shippingItems.push({ name: '电源线', spec: cable.name, theory: cable.count, spare: 0, total: cable.count, unit: '根', note: cable.desc });
                });
            }

            // 添加数据线/排线数据
            if (dataCableDetails.details) {
                dataCableDetails.details.forEach(cable => {
                    shippingItems.push({ name: '排线/HUB75', spec: cable.name, theory: cable.count, spare: 0, total: cable.count, unit: '根', note: cable.desc });
                });
            }

            shippingItems.push({ name: '接收卡网线', spec: '50cm 纯铜网线', theory: ethernetCables, spare: 0, total: ethernetCables, unit: '根', note: 'S型级联' });

            if (structureType !== 'outdoor_rear' && structureType !== 'outdoor_front' && structureType !== 'outdoor_box') {
                shippingItems.push({ name: '强磁磁铁', spec: '模组固定件', theory: magnets, spare: 0, total: magnets, unit: '个', note: '每模组4个' });
            }

            shippingItems.push({ name: '模组取板器', spec: '标配售后维护工具', theory: 1, spare: 0, total: 1, unit: '把', note: '每表1把' });

            // 户外后维护/箱体额外发货项
            if (structureType === 'outdoor_rear' || structureType === 'outdoor_box') {
                shippingItems.push({ name: '防水包边', spec: '单侧10cm铝塑板', theory: edgeLength.toFixed(2), spare: 0, total: edgeLength.toFixed(2), unit: '米', note: '户外后维护专属' });
                shippingItems.push({ name: '散热空调', spec: '2匹工业级空调', theory: acCount, spare: 0, total: acCount, unit: '台', note: '每30㎡1台' });
            }

            // 户外箱体额外发货项
            if (structureType === 'outdoor_box') {
                // 使用辅助函数获取箱体类型信息
                const cabinetInfo = getCabinetTypeName(cabinetType);
                
                shippingItems.push({ name: `LED 显示屏${cabinetInfo.cabinetCategory}箱体`, spec: `${cabinetInfo.cabinetSizeName}${cabinetInfo.cabinetCategory}箱体`, theory: boxCount, spare: ceiling(boxCount * 0.03), total: boxCount + ceiling(boxCount * 0.03), unit: cabinetInfo.cabinetUnit, note: '含 3% 备品' });
                shippingItems.push({ name: '箱体连接件', spec: '不锈钢锁扣/连接件', theory: boxCount * 4, spare: 0, total: boxCount * 4, unit: '套', note: '每箱 4 套' });
                shippingItems.push({ name: '防水密封件', spec: '箱体防水胶条/密封胶', theory: boxCount, spare: 0, total: boxCount, unit: '套', note: '每箱 1 套' });
                shippingItems.push({ name: '散热风扇', spec: '12V 静音风扇', theory: boxCount * 2, spare: 0, total: boxCount * 2, unit: '个', note: '每箱 2 个' });
                shippingItems.push({ name: '箱体门板', spec: '后维护门板 (含锁)', theory: boxCount, spare: 0, total: boxCount, unit: '套', note: '每箱 1 套' });
            }
            
            // 添加用户选择的配件辅料
            if (selectedAccessories && selectedAccessories.length > 0) {
                selectedAccessories.forEach(accessoryKey => {
                    const accessory = priceDB.accessories[accessoryKey];
                    if (accessory) {
                        let theoryQty = 0;
                        let spareQty = 0;
                        let totalQty = 0;
                        let note = '';
                        
                        // 根据配件类型计算数量（使用实际面积 netArea，不取整）
                        let price = accessory.price;
                        if (accessory.type === 'structure_auto') {
                            // E结构和甄结构根据面积自动计算价格
                            theoryQty = netArea;
                            totalQty = netArea;
                            if (accessoryKey === 'E_structure') {
                                if (netArea <= 4) price = 380;
                                else if (netArea <= 9) price = 280;
                                else if (netArea <= 16) price = 200;
                                else price = 180;
                                note = `E结构 ${price}元/㎡ (按面积自动)`;
                            } else if (accessoryKey === 'Z_structure') {
                                if (netArea <= 9) price = 300;
                                else if (netArea <= 15) price = 220;
                                else price = 200;
                                note = `甄结构 ${price}元/㎡ (按面积自动)`;
                            }
                        } else if (accessory.type === 'structure' || accessory.type === 'install' || accessory.type === 'process' || accessory.type === 'cable') {
                            // 按平方计算的配件
                            theoryQty = netArea;
                            totalQty = netArea;
                            note = `按面积计算 (${accessory.price}元/㎡)`;
                        } else if (accessory.type === 'install_auto') {
                            // 室内安装调试自动分级计费
                            theoryQty = netArea;
                            totalQty = netArea;
                            if (accessoryKey === 'install_indoor_auto') {
                                if (netArea <= 3) price = 300;
                                else if (netArea <= 6) price = 250;
                                else if (netArea <= 10) price = 200;
                                else if (netArea <= 30) price = 180;
                                else price = 150;
                                note = `室内安装 ${price}元/㎡ (按面积自动)`;
                            }
                        } else if (accessory.type === 'module') {
                            // 模组配件
                            theoryQty = totalModules;
                            totalQty = totalModules;
                            note = `按模组数量 (${accessory.price}元/${accessory.unit})`;
                        } else if (accessory.type === 'cabinet' || accessory.type === 'cabinet_auto') {
                            // 区分压铸铝箱体和简易/防水/双立柱箱体
                            if (accessoryKey === 'cabinet_auto') {
                                // 自动匹配最佳压铸铝箱体
                                const bestCabinet = getBestCabinetType(columns, rows, moduleWidth, moduleHeight);
                                theoryQty = bestCabinet.count;
                                spareQty = ceiling(bestCabinet.count * 0.03);
                                totalQty = theoryQty + spareQty;
                                note = `自动匹配 ${bestCabinet.type} (${bestCabinet.price}元/块)`;
                            } else if (accessoryKey.startsWith('cabinet_')) {
                                // 压铸铝箱体：按块计算
                                const cabinetSize = accessoryKey.replace('cabinet_', '');
                                const cabinetArea = parseFloat(cabinetSize.split('x')[0]) * parseFloat(cabinetSize.split('x')[1]) / 1000000;
                                theoryQty = ceiling(inputArea / cabinetArea);
                                spareQty = ceiling(theoryQty * 0.03);
                                totalQty = theoryQty + spareQty;
                                note = `含 3% 备品 (${accessory.price}元/${accessory.unit})`;
                            } else {
                                // 简易/防水/双立柱箱体：按面积计算
                                theoryQty = netArea;
                                spareQty = ceiling(netArea * 0.03);
                                totalQty = theoryQty + spareQty;
                                note = `含 3% 备品 (${accessory.price}元/${accessory.unit})`;
                            }
                        } else if (accessory.type === 'network') {
                            // 网络设备
                            if (accessoryKey === 'fiber_transceiver') {
                                theoryQty = processorPorts;
                                totalQty = processorPorts;
                                note = '每网口一台';
                            } else {
                                theoryQty = 1;
                                totalQty = 1;
                                note = '按项目配置';
                            }
                        } else if (accessory.type === 'audio') {
                            // 音响设备
                            theoryQty = 1;
                            totalQty = 1;
                            note = accessoryKey === 'audio_30_50' ? '适用 30-50 平方' : '适用 50-100 平方';
                        } else {
                            // 其他设备
                            theoryQty = 1;
                            totalQty = 1;
                            note = '按项目配置';
                        }
                        
                        shippingItems.push({
                            name: accessory.name,
                            spec: `${accessory.price}元/${accessory.unit}`,
                            theory: theoryQty,
                            spare: spareQty,
                            total: totalQty,
                            unit: accessory.unit,
                            note: note
                        });
                    }
                });
            }

            window.shippingData = {
                projectInfo: {
                    customer: customerName || '待补充',
                    project: projectName || '菲利视界 LED显示屏',
                    location: projectLocation || '待补充',
                    date: new Date().toLocaleDateString('zh-CN')
                },
                items: shippingItems
            };

            // 触发底部的图表重绘
            if (typeof drawLayout === "function") {
                drawLayout(columns, rows, totalModules, totalPowerCount, receivingCards, modulesPerPower);
            }
            
            // 存储全局变量供图表使用
            window.lastModulesPerPower = modulesPerPower;
            
            // 自动保存当前项目
            const currentData = getCurrentProjectData();
            ProjectManager.autoSave(currentData);
            
            console.log('计算完成！');
            } catch (error) {
                console.error('计算错误详情:', {
                    error: error.message,
                    stack: error.stack,
                    inputs: { targetWidth, targetHeight, productModel, structureType }
                });
                alert(`计算出错：${error.message}\n请检查输入参数是否合理，或联系技术支持`);
            }
        }
