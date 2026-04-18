        (function () {
            const panelMap = {
                overview: 'overviewPanel',
                draft: 'workshopDraft',
                quote: 'quotationTable',
                shipping: 'shippingTable',
                layout: 'canvasContainer'
            };

            const getEl = (id) => document.getElementById(id);

            const getSelectedText = (id) => {
                const el = getEl(id);
                if (!el || el.selectedIndex < 0) return '';
                return el.options[el.selectedIndex].textContent.trim();
            };

            const getInputNumber = (id) => {
                const value = Number(String(getEl(id)?.value || '').trim());
                return Number.isFinite(value) ? value : 0;
            };

            const formatMetric = (value, fallback) => {
                if (!value || value === '-' || value === '—') return fallback;
                return value;
            };

            const updatePreviewCard = () => {
                const width = getInputNumber('targetWidth');
                const height = getInputNumber('targetHeight');
                const area = width > 0 && height > 0 ? (width * height).toFixed(2) : '0.00';
                const category = getSelectedText('productCategory') || '等待选择';
                const modelText = getSelectedText('productModel') || '等待选择';
                const model = modelText.split(' - ')[0];
                const moduleWidth = getEl('moduleWidth')?.value || '-';
                const moduleHeight = getEl('moduleHeight')?.value || '-';
                const previewScreen = getEl('previewScreen');

                getEl('previewCategoryLabel').textContent = category;
                getEl('previewModelLabel').textContent = model;
                getEl('previewSizeLabel').textContent = `${width.toFixed(2)}m × ${height.toFixed(2)}m`;
                getEl('previewAreaLabel').textContent = `${area}㎡`;
                getEl('previewModuleLabel').textContent = `${moduleWidth} × ${moduleHeight}mm`;

                if (previewScreen && width > 0 && height > 0) {
                    previewScreen.style.aspectRatio = `${Math.max(width, 1)} / ${Math.max(height, 1)}`;
                }
            };

            const normalizePanelTitles = () => {
                const titleMap = {
                    overviewPanel: '项目基础参数',
                    workshopDraft: '车间算量推演',
                    quotationTable: '商业报价明细',
                    shippingTable: '发货备料表',
                    canvasContainer: '系统排布示意图'
                };

                Object.entries(titleMap).forEach(([panelId, title]) => {
                    const panel = getEl(panelId);
                    const heading = panel?.querySelector('h3');
                    if (heading) {
                        heading.textContent = title;
                    }
                });

                const quoteButtons = getEl('quotationTable')?.querySelectorAll('.export-btn') || [];
                if (quoteButtons[0]) quoteButtons[0].textContent = '导出 Word';
                if (quoteButtons[1]) quoteButtons[1].textContent = '导出 Excel';

                const shippingButtons = getEl('shippingTable')?.querySelectorAll('.export-btn') || [];
                if (shippingButtons[0]) shippingButtons[0].textContent = '导出 Word';
                if (shippingButtons[1]) shippingButtons[1].textContent = '导出 Excel';

                getEl('previewModeLabel').textContent = getEl('totalPrice')?.textContent?.trim() !== '¥ 0' ? '方案已生成' : '实时配置中';
            };

            const refreshHeadlineMetrics = () => {
                const modelText = getSelectedText('productModel') || '等待选择';
                const layoutText = getEl('layoutResult')?.textContent?.trim() || '等待计算';
                const sizeText = getEl('netSizeResult')?.textContent?.trim() || `${getInputNumber('targetWidth').toFixed(2)}m × ${getInputNumber('targetHeight').toFixed(2)}m`;
                const priceText = getEl('totalPrice')?.textContent?.trim() || '¥ 0';

                getEl('headlineMetricModel').textContent = modelText.split(' - ')[0];
                getEl('headlineMetricLayout').textContent = formatMetric(layoutText, '等待计算');
                getEl('headlineMetricSize').textContent = formatMetric(sizeText, '等待计算');
                getEl('headlineMetricPrice').textContent = priceText;
            };

            const activatePanel = (target) => {
                Object.entries(panelMap).forEach(([name, id]) => {
                    const panel = getEl(id);
                    if (!panel) return;
                    panel.classList.toggle('panel-hidden', name !== target);
                });

                document.querySelectorAll('#resultTabs .tab-btn').forEach((button) => {
                    button.classList.toggle('is-active', button.dataset.target === target);
                });
            };

            const bindTabs = () => {
                document.querySelectorAll('#resultTabs .tab-btn').forEach((button) => {
                    button.addEventListener('click', () => {
                        activatePanel(button.dataset.target);
                    });
                });
            };

            const bindJumpButtons = () => {
                document.querySelectorAll('[data-jump-target]').forEach((button) => {
                    button.addEventListener('click', () => {
                        const target = button.dataset.jumpTarget;
                        activatePanel(target);
                        getEl('resultsWorkspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                });
            };

            const bindPreviewInputs = () => {
                [
                    'productCategory',
                    'productModel',
                    'targetWidth',
                    'targetHeight',
                    'moduleWidth',
                    'moduleHeight'
                ].forEach((id) => {
                    const el = getEl(id);
                    if (!el) return;
                    el.addEventListener('change', updatePreviewCard);
                    el.addEventListener('input', updatePreviewCard);
                });
            };

            const bindStructureSelection = () => {
                document.querySelectorAll('.structure-only').forEach((checkbox) => {
                    checkbox.addEventListener('change', () => {
                        if (!checkbox.checked) return;
                        document.querySelectorAll('.structure-only').forEach((other) => {
                            if (other !== checkbox) {
                                other.checked = false;
                            }
                        });
                    });
                });
            };

            const bindAccessoryAutoCalculate = () => {
                document.querySelectorAll('input[name="accessory"]').forEach((checkbox) => {
                    checkbox.addEventListener('change', () => {
                        updatePreviewCard();
                        if (typeof window.calculate === 'function') {
                            window.calculate();
                        }
                    });
                });
            };

            const originalCalculate = window.calculate;
            if (typeof originalCalculate === 'function') {
                window.calculate = function () {
                    const canvasContainer = getEl('canvasContainer');
                    if (canvasContainer && canvasContainer.style.display === 'none') {
                        canvasContainer.style.display = 'block';
                    }

                    const result = originalCalculate.apply(this, arguments);
                    updatePreviewCard();
                    refreshHeadlineMetrics();
                    normalizePanelTitles();
                    return result;
                };
            }

            bindTabs();
            bindJumpButtons();
            bindPreviewInputs();
            bindStructureSelection();
            bindAccessoryAutoCalculate();
            activatePanel('overview');
            updatePreviewCard();
            refreshHeadlineMetrics();
            normalizePanelTitles();

            window.addEventListener('load', () => {
                updatePreviewCard();
                refreshHeadlineMetrics();
                normalizePanelTitles();
            });
        })();
