        const priceDB = {
            modules: {
                // 室内常规模组
                '1.25': 5900,
                '1.538': 3680,
                '1.86': 2380,
                '2.0': 2180,
                '2.5': 1380,
                '3.0': 1180,
                '3.0_high': 1280,
                '4.0': 880,
                '4.0_alt1': 1080,
                '4.0_alt2': 1080,
                // 室内软模组
                '1.25_soft': 8280,
                '1.538_soft': 5080,
                '1.86_soft': 3180,
                '2.0_soft': 2900,
                '2.5_soft': 1980,
                '3.0_soft': 1780,
                '4.0_soft': 1480,
                // 室内租赁屏
                '3.91_rental': 2580,
                '2.976_rental': 3080,
                '2.604_rental': 3380,
                '3.91_tile': 2950,
                // 室内格栅屏
                '3.91_grid_500': 1380,
                '3.91_grid_2000': 2200,
                '3.91_grid_4500': 3100,
                // 户外常规模组
                '2.5o_normal': 3380,
                '2.5o_high': 3480,
                '3.076o_normal': 2580,
                '3.076o_high': 2680,
                '4o_normal': 1680,
                '4o_high': 1780,
                '5.0o_normal': 1380,
                '5.0o_high': 1580,
                '6.0o_normal': 1280,
                '6.0o_high': 1880,
                '8.0o_normal': 1480,
                '8.0o_high': 1580,
                '10.0o_normal': 1180,
                '10.0o_high': 1280,
                // 户外软模组
                '2.5o_soft': 5880,
                '3.076o_soft': 4680,  // 修复：设置合理价格
                '4o_soft': 3050,
                // 户外租赁屏
                '3.91o_rental': 2880,
                '2.976o_rental': 4080,
                '2.604o_rental': 5480,
                '3.91o_grid_4500': 4700,
                // 晶膜屏
                'P20_crystal': 6000,
                'P15_crystal': 7000,
                'P10_crystal': 8800,
                'P8_crystal': 10800,
                'P6.25_crystal': 11250,
                'P5_crystal': 17800,
                'P4_crystal': 22000,
                // 全息屏
                'P3.91_holo_16s': 11180,
                'P3.91_holo_32s_1600': 7800,
                'P3.91_holo_32s_2000': 8840,
                'P4.81_holo': 9360,
                'P3.9-7.8_holo': 8450,
                'P6.25_holo_2000': 6240,
                'P6.25_holo_2500': 6760
            },
            receivingCards: {
                zhonghang: { '12': 75, '16': 98, '20': 105, '24': 115, '320': 135 },
                nova: { '12': 88, '16': 115 },
                kaisida: { '8': 68, '12': 75, '16': 88, '320': 128 },
                colorlight: { '8': 96, '12': 102, '16': 125, '20': 125 },
                huidu: { '8': 96, '12': 115, '16': 132, 'D16': 480, 'B6L': 1280, 'C16': 680 },
                kaishida: { 'integrated': 550 }
            },
            processors: {
                zhonghang: { '2': 880, '4': 1380, '6': 2980, '8': 3380, '10': 4880, '14': 5800, '16': 6580, '20': 10500, '24': 12000, '28': 13500, '2_lock': 880 },
                nova: { '2': 850, '4': 1400, '6': 3350, '8': 5000, '10': 5500, '12': 11800, '16': 12800, '20': 0, '24': 18500 },
                colorlight: { '2': 850, '4': 1500, '6': 3650, '8': 4580, '12': 6000, '16': 12800, '20': 14000 },
                huidu: { '2': 680, '4': 980, '6': 2700, '8': 3800, '12': 4800, '16': 5500, '20': 11500, '30': 25500, '40': 37500 },
                kaisida: { '2_lock': 780, '4_lock': 1180, '6': 2680, '8': 4080, '10': 5800, '12': 6800, '16': 12800 },
                pandora: { 'KP1': 480, 'KP2': 1280 }
            },
            power: {
                '5V40A_kangsheng': 38,
                '5V60A_kangsheng': 75,
                '5V40A_chuanglian': 42,
                '5V60A_chuanglian': 78,
                '5V40A_juneng': 45
            },
            structure: {
                'E': { '1-4': 380, '5-9': 280, '10-16': 200, '16+': 180 },
                'Z': { '0-9': 300, '10-15': 220, '15+': 200 },
                'outdoor_rear': 500,
                'outdoor_front': 300
            },
            cabinet: {
                'simple': 350,
                'waterproof': 550,
                'column_15': 950
            },
            installation: {
                indoor: { '1': 500, '2': 350, '3': 300, '4-6': 250, '7-10': 200, '10+': 180, '30+': 150 },
                outdoor: { 'high': 500, 'normal': 300 }
            },
            servers: {
                'ksvD1': 8500,
                'ops': 1800
            },
            devices: {
                'fiber_transceiver': 780,
                'splitter': 950,
                'audio_30-50': 2850,
                'audio_50-100': 3850,
                'vj_box': 2800
            },
            tools: {
                'vacuum_plug_wired': 550,
                'vacuum_plug_wireless': 780
            },
            box: {
                // 室内压铸铝箱体
                '640x480': 210,
                '640x640': 350,
                '320x480': 185,
                '320x640': 195,
                // 户外标准箱体
                'standard': 1200,
                'waterproof': 1500,
                'simple': 800
            },
            // 其它配件辅料价格数据库
            accessories: {
                // E 结构
                'E_1_4': { price: 380, unit: '㎡', type: 'structure', name: 'E 结构 1-4㎡' },
                'E_5_9': { price: 280, unit: '㎡', type: 'structure', name: 'E 结构 5-9㎡' },
                'E_10_16': { price: 200, unit: '㎡', type: 'structure', name: 'E 结构 10-16㎡' },
                // E结构（自动按面积计费）
                'E_structure': { price: 0, unit: '㎡', type: 'structure_auto', name: 'E 结构' },
                // 甄结构（自动按面积计费）
                'Z_structure': { price: 0, unit: '㎡', type: 'structure_auto', name: '甄结构' },
                // 户外结构
                'outdoor_rear_structure': { price: 500, unit: '㎡', type: 'structure', name: '户外后维护钢结构' },
                'outdoor_front_structure': { price: 300, unit: '㎡', type: 'structure', name: '户外前维护钢结构' },
                // 箱体组装
                'simple_box': { price: 350, unit: '㎡', type: 'cabinet', name: '简易箱体加组装' },
                'waterproof_box': { price: 550, unit: '㎡', type: 'cabinet', name: '防水箱体加组装' },
                'column_15': { price: 950, unit: '㎡', type: 'cabinet', name: '双立柱箱体 15㎡以下' },
                // 模组配件
                'indoor_bevel': { price: 10, unit: '张', type: 'module', name: '室内模组换斜边套件' },
                'outdoor_bevel': { price: 20, unit: '张', type: 'module', name: '户外模组加斜边套件' },
                // 工艺
                'gob_coating': { price: 600, unit: '㎡', type: 'process', name: 'GOB 镀膜工艺' },
                // 安装调试
                'install_indoor_auto': { price: 0, unit: '㎡', type: 'install_auto', name: '室内安装调试（自动计费）' },
                'install_outdoor_high': { price: 500, unit: '㎡', type: 'install', name: '户外安装高空' },
                'install_outdoor_normal': { price: 300, unit: '㎡', type: 'install', name: '户外安装非高空' },
                // 线材辅料
                'cable_materials': { price: 100, unit: '㎡', type: 'cable', name: '线材辅料' },
                // 室内压铸铝箱体
                'cabinet_640x480': { price: 210, unit: '块', type: 'cabinet', name: '室内压铸铝箱体 640*480' },
                'cabinet_640x640': { price: 350, unit: '块', type: 'cabinet', name: '室内压铸铝箱体 640*640' },
                'cabinet_320x480': { price: 185, unit: '块', type: 'cabinet', name: '室内压铸铝箱体 320*480' },
                'cabinet_320x640': { price: 195, unit: '块', type: 'cabinet', name: '室内压铸铝箱体 320*640' },
                // 自动匹配压铸铝箱体
                'cabinet_auto': { price: 0, unit: '块', type: 'cabinet_auto', name: '压铸铝箱体（自动匹配）' },
                // 网络设备
                'fiber_transceiver': { price: 780, unit: '台', type: 'network', name: '中航光纤收发器' },
                'splitter': { price: 950, unit: '台', type: 'network', name: '中航分屏器' },
                // 音响设备
                'audio_30_50': { price: 2850, unit: '套', type: 'audio', name: '会议室音响 30-50 平方' },
                'audio_50_100': { price: 3850, unit: '套', type: 'audio', name: '会议室音响 50-100 平方' },
                // 其他设备
                'vj_box': { price: 2800, unit: '台', type: 'other', name: 'VJ 声光电联动盒' },
                'vacuum_wired': { price: 550, unit: '台', type: 'tool', name: '前维护真空吸盘插电款' },
                'vacuum_wireless': { price: 780, unit: '台', type: 'tool', name: '前维护真空吸盘充电款' }
            }
        };

        let layoutChart = null;

        // 产品型号配置数据库
        const productConfig = {
            // 室内常规模组
            '1.25': { width: 320, height: 160, pitch: 1.25, price: 5900, type: 'indoor' },
            '1.538': { width: 320, height: 160, pitch: 1.538, price: 3680, type: 'indoor' },
            '1.86': { width: 320, height: 160, pitch: 1.86, price: 2380, type: 'indoor' },
            '2.0': { width: 320, height: 160, pitch: 2.0, price: 2180, type: 'indoor' },
            '2.5': { width: 320, height: 160, pitch: 2.5, price: 1380, type: 'indoor' },
            '3.0_low': { width: 192, height: 192, pitch: 3.0, price: 1180, type: 'indoor' },
            '3.0': { width: 320, height: 160, pitch: 3.0, price: 1280, type: 'indoor' },
            '4.0': { width: 256, height: 256, pitch: 4.0, price: 880, type: 'indoor' },
            '4.0_alt1': { width: 128, height: 256, pitch: 4.0, price: 1080, type: 'indoor' },
            '4.0_alt2': { width: 320, height: 160, pitch: 4.0, price: 1080, type: 'indoor' },
            // 室内软模组
            '1.25_soft': { width: 320, height: 160, pitch: 1.25, price: 8280, type: 'indoor' },
            '1.538_soft': { width: 320, height: 160, pitch: 1.538, price: 5080, type: 'indoor' },
            '1.86_soft': { width: 320, height: 160, pitch: 1.86, price: 3180, type: 'indoor' },
            '2.0_soft': { width: 320, height: 160, pitch: 2.0, price: 2900, type: 'indoor' },
            '2.5_soft': { width: 320, height: 160, pitch: 2.5, price: 1980, type: 'indoor' },
            '3.0_soft': { width: 320, height: 160, pitch: 3.0, price: 1780, type: 'indoor' },
            '4.0_soft': { width: 320, height: 160, pitch: 4.0, price: 1480, type: 'indoor' },
            // 室内租赁屏
            '3.91_rental': { width: 500, height: 500, pitch: 3.91, price: 2580, type: 'indoor' },
            '2.976_rental': { width: 500, height: 500, pitch: 2.976, price: 3080, type: 'indoor' },
            '2.604_rental': { width: 500, height: 500, pitch: 2.604, price: 3380, type: 'indoor' },
            '3.91_tile': { width: 500, height: 500, pitch: 3.91, price: 2950, type: 'indoor' },
            '3.91_grid_500': { width: 1000, height: 1000, pitch: 3.91, price: 1380, type: 'indoor' },
            '3.91_grid_2000': { width: 1000, height: 1000, pitch: 3.91, price: 2200, type: 'indoor' },
            '3.91_grid_4500': { width: 1000, height: 1000, pitch: 3.91, price: 3100, type: 'indoor' },
            // 户外常规
            '2.5o_normal': { width: 320, height: 160, pitch: 2.5, price: 3380, type: 'outdoor' },
            '2.5o_high': { width: 320, height: 160, pitch: 2.5, price: 3480, type: 'outdoor' },
            '3.076o_normal': { width: 320, height: 160, pitch: 3.076, price: 2580, type: 'outdoor' },
            '3.076o_high': { width: 320, height: 160, pitch: 3.076, price: 2680, type: 'outdoor' },
            '4o_normal': { width: 320, height: 160, pitch: 4.0, price: 1680, type: 'outdoor' },
            '4o_high': { width: 320, height: 160, pitch: 4.0, price: 1780, type: 'outdoor' },
            '5.0o_normal': { width: 320, height: 160, pitch: 5.0, price: 1380, type: 'outdoor' },
            '5.0o_high': { width: 320, height: 160, pitch: 5.0, price: 1580, type: 'outdoor' },
            '6.0o_normal': { width: 320, height: 160, pitch: 6.0, price: 1280, type: 'outdoor' },
            '6.0o_high': { width: 320, height: 160, pitch: 6.0, price: 1880, type: 'outdoor' },
            '8.0o_normal': { width: 320, height: 160, pitch: 8.0, price: 1480, type: 'outdoor' },
            '8.0o_high': { width: 320, height: 160, pitch: 8.0, price: 1580, type: 'outdoor' },
            '10.0o_normal': { width: 320, height: 160, pitch: 10.0, price: 1180, type: 'outdoor' },
            '10.0o_high': { width: 320, height: 160, pitch: 10.0, price: 1280, type: 'outdoor' },
            // 户外软模组
            '2.5o_soft': { width: 320, height: 160, pitch: 2.5, price: 5880, type: 'outdoor' },
            '3.076o_soft': { width: 320, height: 160, pitch: 3.076, price: 4680, type: 'outdoor' },  // 修复：设置合理价格
            '4o_soft': { width: 320, height: 160, pitch: 4.0, price: 3050, type: 'outdoor' },
            // 户外租赁屏
            '3.91o_rental': { width: 500, height: 500, pitch: 3.91, price: 2880, type: 'outdoor' },
            '2.976o_rental': { width: 500, height: 500, pitch: 2.976, price: 4080, type: 'outdoor' },
            '2.604o_rental': { width: 500, height: 500, pitch: 2.604, price: 5480, type: 'outdoor' },
            '3.91o_grid_4500': { width: 1000, height: 1000, pitch: 3.91, price: 4700, type: 'outdoor' },
            // 晶膜屏
            'P20_crystal': { width: 1000, height: 400, pitch: 20, price: 6000, type: 'special' },
            'P15_crystal': { width: 990, height: 390, pitch: 15, price: 7000, type: 'special' },
            'P10_crystal': { width: 1000, height: 400, pitch: 10, price: 8800, type: 'special' },
            'P8_crystal': { width: 1000, height: 400, pitch: 8, price: 10800, type: 'special' },
            'P6.25_crystal': { width: 1000, height: 400, pitch: 6.25, price: 11250, type: 'special' },
            'P5_crystal': { width: 1000, height: 320, pitch: 5, price: 17800, type: 'special' },
            'P4_crystal': { width: 1000, height: 240, pitch: 4, price: 22000, type: 'special' },
            // 全息屏
            'P3.91_holo_16s': { width: 250, height: 1062, pitch: 3.91, price: 11180, type: 'special' },
            'P3.91_holo_32s_1600': { width: 250, height: 1062, pitch: 3.91, price: 7800, type: 'special' },
            'P3.91_holo_32s_2000': { width: 250, height: 1062, pitch: 3.91, price: 8840, type: 'special' },
            'P4.81_holo': { width: 250, height: 1062, pitch: 4.81, price: 9360, type: 'special' },
            'P3.9-7.8_holo': { width: 250, height: 1062, pitch: 7.8, price: 8450, type: 'special' },
            'P6.25_holo_2000': { width: 250, height: 1062, pitch: 6.25, price: 6240, type: 'special' },
            'P6.25_holo_2500': { width: 250, height: 1062, pitch: 6.25, price: 6760, type: 'special' }
        };

        // 更新产品选项
        function updateProductOptions() {
            const category = document.getElementById('productCategory').value;
            
            // 隐藏所有选项组
            const groups = ['indoor_standard_group', 'indoor_soft_group', 'indoor_rental_group', 
                           'outdoor_standard_group', 'outdoor_soft_group', 'outdoor_rental_group',
                           'crystal_group', 'holographic_group'];
            groups.forEach(g => {
                document.getElementById(g).style.display = 'none';
            });
            
            // 显示对应选项组
            const groupMap = {
                'indoor_standard': 'indoor_standard_group',
                'indoor_soft': 'indoor_soft_group',
                'indoor_rental': 'indoor_rental_group',
                'outdoor_standard': 'outdoor_standard_group',
                'outdoor_soft': 'outdoor_soft_group',
                'outdoor_rental': 'outdoor_rental_group',
                'crystal': 'crystal_group',
                'holographic': 'holographic_group'
            };
            
            if (groupMap[category]) {
                document.getElementById(groupMap[category]).style.display = 'block';
            }
            
            // 自动选择第一个选项
            const modelSelect = document.getElementById('productModel');
            if (modelSelect.options.length > 1) {
                modelSelect.selectedIndex = 1;
            }
            
            updateModuleSpecs();
        }

        // 更新模组规格
        function updateModuleSpecs() {
            const model = document.getElementById('productModel').value;
            const config = productConfig[model];
            
            if (config) {
                document.getElementById('moduleWidth').value = config.width;
                document.getElementById('moduleHeight').value = config.height;
            }
        }

        // 向上取整函数
        function ceiling(value) {
            return Math.ceil(value);
        }

