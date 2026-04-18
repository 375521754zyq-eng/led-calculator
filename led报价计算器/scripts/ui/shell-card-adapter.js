(function () {
    const moduleGroupMap = {
        indoor_standard: 'indoor_standard_group',
        indoor_soft: 'indoor_soft_group',
        indoor_rental: 'indoor_rental_group',
        outdoor_standard: 'outdoor_standard_group',
        outdoor_soft: 'outdoor_soft_group',
        outdoor_rental: 'outdoor_rental_group',
        crystal: 'crystal_group',
        holographic: 'holographic_group'
    };

    const accessoryGroupOrder = [
        '结构费',
        '箱体',
        '模组配件',
        '工艺',
        '安装调试',
        '线材辅料',
        '网络设备',
        '音响设备',
        '其他设备'
    ];

    const state = {
        activeCategoryId: 'module',
        activeSubCategory: '',
        activeResultTab: 'overview',
        catalog: []
    };

    const shell = {};
    const legacy = {};
    let sizeDebounceTimer = null;
    let statusObserver = null;

    function getEl(id) {
        return document.getElementById(id);
    }

    function normalizeSpace(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function cleanGroupTitle(title) {
        return normalizeSpace(
            String(title || '')
                .replace(/[⭐📦🔧✨👷🔌🌐🔊🎛️💡]/g, '')
                .replace(/（.*?）/g, '')
                .replace(/\(.*?\)/g, '')
        );
    }

    function splitCardText(text) {
        const normalized = normalizeSpace(text);
        const dashedParts = normalized.split(/\s+-\s+/);
        if (dashedParts.length > 1) {
            return {
                title: dashedParts[0].trim(),
                meta: dashedParts.slice(1).join(' - ').trim()
            };
        }

        const priceIndex = normalized.indexOf('¥');
        if (priceIndex > 0) {
            return {
                title: normalized.slice(0, priceIndex).trim(),
                meta: normalized.slice(priceIndex).trim()
            };
        }

        return { title: normalized, meta: '' };
    }

    function labelText(labelEl) {
        const clone = labelEl.cloneNode(true);
        clone.querySelectorAll('input').forEach((input) => input.remove());
        return normalizeSpace(clone.textContent);
    }

    function sanitizeHtml(html) {
        const template = document.createElement('template');
        template.innerHTML = html || '';
        template.content.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
        return template.innerHTML;
    }

    function bindShellDom() {
        shell.customerName = getEl('shellCustomerName');
        shell.projectName = getEl('shellProjectName');
        shell.projectLocation = getEl('shellProjectLocation');
        shell.targetWidth = getEl('shellTargetWidth');
        shell.targetHeight = getEl('shellTargetHeight');
        shell.sidebar = getEl('shellSidebar');
        shell.contentTitle = getEl('shellContentTitle');
        shell.selectionHint = getEl('shellSelectionHint');
        shell.status = getEl('shellStatusMessage');
        shell.subNav = getEl('shellSubNav');
        shell.cardGrid = getEl('shellCardGrid');
        shell.selectedTags = getEl('shellSelectedTags');
        shell.totalPrice = getEl('shellTotalPrice');
        shell.kpiModel = getEl('shellKpiModel');
        shell.kpiLayout = getEl('shellKpiLayout');
        shell.kpiSize = getEl('shellKpiSize');
        shell.kpiPrice = getEl('shellKpiPrice');
        shell.resultPanels = {
            overview: getEl('shellResultOverview'),
            draft: getEl('shellResultDraft'),
            quote: getEl('shellResultQuote'),
            shipping: getEl('shellResultShipping'),
            layout: getEl('shellResultLayout')
        };
    }

    function bindLegacyDom() {
        legacy.customerName = getEl('customerName');
        legacy.projectName = getEl('projectName');
        legacy.projectLocation = getEl('projectLocation');
        legacy.targetWidth = getEl('targetWidth');
        legacy.targetHeight = getEl('targetHeight');
        legacy.productCategory = getEl('productCategory');
        legacy.productModel = getEl('productModel');
        legacy.receivingCardBrand = getEl('receivingCardBrand');
        legacy.powerBrand = getEl('powerBrand');
        legacy.moduleWidth = getEl('moduleWidth');
        legacy.moduleHeight = getEl('moduleHeight');
        legacy.statusMessage = getEl('statusMessage');
        legacy.accessoryContainer = getEl('accessoryCheckboxes');
        legacy.results = {
            overview: getEl('overviewPanel'),
            draft: getEl('workshopDraft'),
            quote: getEl('quotationTable'),
            shipping: getEl('shippingTable'),
            layoutCanvas: getEl('layoutCanvas')
        };
        legacy.metrics = {
            layout: getEl('layoutResult'),
            size: getEl('netSizeResult'),
            price: getEl('totalPrice')
        };
    }

    function buildModuleCategory() {
        const subCategories = Array.from(legacy.productCategory.options).map((option) => ({
            value: option.value,
            label: normalizeSpace(option.textContent)
        }));

        const itemsBySubCategory = {};
        subCategories.forEach((subCategory) => {
            const groupId = moduleGroupMap[subCategory.value];
            const optgroup = getEl(groupId);
            const options = optgroup ? Array.from(optgroup.querySelectorAll('option')) : [];
            itemsBySubCategory[subCategory.value] = options.map((option) => {
                const parsed = splitCardText(option.textContent);
                return {
                    value: option.value,
                    title: parsed.title,
                    meta: parsed.meta
                };
            });
        });

        return {
            id: 'module',
            name: '模组选择',
            type: 'single',
            kind: 'module',
            subCategories,
            itemsBySubCategory
        };
    }

    function buildSelectCategory(id, name, selectEl) {
        return {
            id,
            name,
            type: 'single',
            kind: 'select',
            selectEl,
            items: Array.from(selectEl.options).map((option) => {
                const parsed = splitCardText(option.textContent);
                return {
                    value: option.value,
                    title: parsed.title,
                    meta: parsed.meta
                };
            })
        };
    }

    function buildAccessoryCategories() {
        const groups = Array.from(legacy.accessoryContainer.children)
            .filter((block) => block.querySelector('input[name="accessory"]'))
            .map((block, index) => {
                const titleRaw = block.querySelector('strong')?.textContent || `配件分组 ${index + 1}`;
                const name = cleanGroupTitle(titleRaw);
                const items = Array.from(block.querySelectorAll('label'))
                    .filter((label) => !String(label.getAttribute('style') || '').includes('display: none'))
                    .map((label) => {
                        const checkbox = label.querySelector('input[name="accessory"]');
                        if (!checkbox) return null;
                        const parsed = splitCardText(labelText(label));
                        return {
                            value: checkbox.value,
                            title: parsed.title,
                            meta: parsed.meta,
                            checkbox
                        };
                    })
                    .filter(Boolean);

                return {
                    id: `accessory-${index}`,
                    name,
                    type: block.querySelector('.structure-only') ? 'single' : 'multiple',
                    kind: 'checkbox-group',
                    items
                };
            })
            .filter((group) => group.items.length > 0)
            .sort((a, b) => {
                const aIndex = accessoryGroupOrder.indexOf(a.name);
                const bIndex = accessoryGroupOrder.indexOf(b.name);
                const safeA = aIndex === -1 ? accessoryGroupOrder.length : aIndex;
                const safeB = bIndex === -1 ? accessoryGroupOrder.length : bIndex;
                return safeA - safeB;
            });

        return groups;
    }

    function buildCatalog() {
        const categories = [
            buildModuleCategory(),
            buildSelectCategory('receiving-card', '接收卡品牌', legacy.receivingCardBrand),
            buildSelectCategory('power-brand', '电源品牌', legacy.powerBrand),
            ...buildAccessoryCategories()
        ];

        state.catalog = categories;
        if (!state.activeSubCategory) {
            state.activeSubCategory = legacy.productCategory.value || categories[0].subCategories[0]?.value || '';
        }
    }

    function getCategoryById(categoryId) {
        return state.catalog.find((category) => category.id === categoryId);
    }

    function getSelectionCount(category) {
        if (!category) return 0;
        if (category.kind === 'module') {
            return legacy.productModel.value ? 1 : 0;
        }
        if (category.kind === 'select') {
            return category.selectEl.value ? 1 : 0;
        }
        if (category.kind === 'checkbox-group') {
            return category.items.filter((item) => item.checkbox.checked).length;
        }
        return 0;
    }

    function getSelectionHint(category) {
        if (!category) return '';
        return category.type === 'single' ? '⚙️ 互斥单选' : '☑️ 支持多选';
    }

    function getModuleSelectionLabel() {
        const option = legacy.productModel.options[legacy.productModel.selectedIndex];
        if (!option) return '等待选择';
        return splitCardText(option.textContent).title || normalizeSpace(option.textContent);
    }

    function renderSidebar() {
        shell.sidebar.innerHTML = state.catalog.map((category) => {
            const isActive = category.id === state.activeCategoryId;
            const count = getSelectionCount(category);
            return `
                <div class="shell-nav-item ${isActive ? 'is-active' : ''}" data-shell-category="${escapeHtml(category.id)}">
                    <span>${escapeHtml(category.name)}</span>
                    ${count > 0 ? `<span class="shell-nav-badge">${count}</span>` : ''}
                </div>
            `;
        }).join('');

        shell.sidebar.querySelectorAll('[data-shell-category]').forEach((node) => {
            node.addEventListener('click', () => {
                state.activeCategoryId = node.dataset.shellCategory;
                const activeCategory = getCategoryById(state.activeCategoryId);
                if (activeCategory?.kind === 'module') {
                    state.activeSubCategory = legacy.productCategory.value || state.activeSubCategory;
                }
                renderShell();
            });
        });
    }

    function renderSubNav(category) {
        if (!category || category.kind !== 'module') {
            shell.subNav.innerHTML = '';
            shell.subNav.classList.add('is-hidden');
            return;
        }

        shell.subNav.classList.remove('is-hidden');
        shell.subNav.innerHTML = category.subCategories.map((subCategory) => `
            <button class="shell-sub-nav-item ${subCategory.value === state.activeSubCategory ? 'is-active' : ''}" type="button" data-shell-subcategory="${escapeHtml(subCategory.value)}">
                ${escapeHtml(subCategory.label)}
            </button>
        `).join('');

        shell.subNav.querySelectorAll('[data-shell-subcategory]').forEach((node) => {
            node.addEventListener('click', () => {
                state.activeSubCategory = node.dataset.shellSubcategory;
                renderContent();
            });
        });
    }

    function renderCards(category, items) {
        if (!items.length) {
            shell.cardGrid.innerHTML = '<div class="shell-placeholder">当前分类暂无可选项。</div>';
            return;
        }

        shell.cardGrid.innerHTML = items.map((item) => {
            let isSelected = false;
            if (category.kind === 'module') {
                isSelected = legacy.productCategory.value === state.activeSubCategory && legacy.productModel.value === item.value;
            } else if (category.kind === 'select') {
                isSelected = category.selectEl.value === item.value;
            } else if (category.kind === 'checkbox-group') {
                isSelected = item.checkbox.checked;
            }

            return `
                <div class="shell-item-card ${isSelected ? 'is-selected' : ''}" data-shell-card="${escapeHtml(item.value)}">
                    <div class="shell-card-title">${escapeHtml(item.title)}</div>
                    ${item.meta ? `<div class="shell-card-meta">${escapeHtml(item.meta)}</div>` : ''}
                </div>
            `;
        }).join('');

        shell.cardGrid.querySelectorAll('[data-shell-card]').forEach((node) => {
            node.addEventListener('click', () => {
                handleCardSelection(category, node.dataset.shellCard);
            });
        });
    }

    function renderContent() {
        const category = getCategoryById(state.activeCategoryId);
        if (!category) return;

        shell.contentTitle.textContent = category.name;
        shell.selectionHint.textContent = getSelectionHint(category);
        renderSubNav(category);

        let items = [];
        if (category.kind === 'module') {
            items = category.itemsBySubCategory[state.activeSubCategory] || [];
        } else {
            items = category.items;
        }

        renderCards(category, items);
    }

    function renderSelectedTags() {
        const tags = [];

        const moduleLabel = getModuleSelectionLabel();
        if (moduleLabel && moduleLabel !== '等待选择') {
            tags.push(`<span class="shell-tag is-fixed">模组: ${escapeHtml(moduleLabel)}</span>`);
        }

        const cardOption = legacy.receivingCardBrand.options[legacy.receivingCardBrand.selectedIndex];
        if (cardOption) {
            tags.push(`<span class="shell-tag is-fixed">接收卡: ${escapeHtml(normalizeSpace(cardOption.textContent))}</span>`);
        }

        const powerOption = legacy.powerBrand.options[legacy.powerBrand.selectedIndex];
        if (powerOption) {
            tags.push(`<span class="shell-tag is-fixed">电源: ${escapeHtml(normalizeSpace(powerOption.textContent))}</span>`);
        }

        state.catalog
            .filter((category) => category.kind === 'checkbox-group')
            .forEach((category) => {
                category.items
                    .filter((item) => item.checkbox.checked)
                    .forEach((item) => {
                        tags.push(`
                            <span class="shell-tag">
                                ${escapeHtml(item.title)}
                                <button class="shell-tag-remove" type="button" data-shell-remove="${escapeHtml(item.value)}">×</button>
                            </span>
                        `);
                    });
            });

        if (!tags.length) {
            shell.selectedTags.innerHTML = '<div class="shell-placeholder">暂未选择任何配置项，请在上方点击卡片选择。</div>';
            return;
        }

        shell.selectedTags.innerHTML = tags.join('');
        shell.selectedTags.querySelectorAll('[data-shell-remove]').forEach((node) => {
            node.addEventListener('click', () => {
                removeAccessorySelection(node.dataset.shellRemove);
            });
        });
    }

    function renderKpis() {
        const layoutText = normalizeSpace(legacy.metrics.layout?.textContent) || '等待计算';
        const sizeText = normalizeSpace(legacy.metrics.size?.textContent) || '等待计算';
        const priceText = normalizeSpace(legacy.metrics.price?.textContent) || '¥ 0';

        shell.kpiModel.textContent = getModuleSelectionLabel();
        shell.kpiLayout.textContent = layoutText || '等待计算';
        shell.kpiSize.textContent = sizeText || '等待计算';
        shell.kpiPrice.textContent = priceText;
        shell.totalPrice.textContent = priceText;
    }

    function renderHtmlPanel(targetKey, sourceEl) {
        const target = shell.resultPanels[targetKey];
        if (!target) return;

        const html = sourceEl?.innerHTML ? sanitizeHtml(sourceEl.innerHTML) : '';
        target.innerHTML = html || '<div class="shell-placeholder">结果将在完成计算后显示。</div>';
    }

    function renderLayoutPanel() {
        const target = shell.resultPanels.layout;
        if (!target) return;

        const canvas = legacy.results.layoutCanvas;
        if (!canvas || !canvas.width || !canvas.height) {
            target.innerHTML = '<div class="shell-placeholder">排布图将在完成计算后显示。</div>';
            return;
        }

        target.innerHTML = `<img class="shell-layout-image" src="${canvas.toDataURL('image/png')}" alt="系统排布示意图">`;
    }

    function renderResults() {
        renderHtmlPanel('overview', legacy.results.overview);
        renderHtmlPanel('draft', legacy.results.draft);
        renderHtmlPanel('quote', legacy.results.quote);
        renderHtmlPanel('shipping', legacy.results.shipping);
        renderLayoutPanel();
        activateResultTab(state.activeResultTab);
    }

    function activateResultTab(resultTab) {
        state.activeResultTab = resultTab;
        document.querySelectorAll('[data-shell-result]').forEach((node) => {
            node.classList.toggle('is-active', node.dataset.shellResult === resultTab);
        });

        Object.entries(shell.resultPanels).forEach(([key, panel]) => {
            panel.classList.toggle('is-active', key === resultTab);
        });
    }

    function renderShell() {
        renderSidebar();
        renderContent();
        renderSelectedTags();
        renderKpis();
        renderResults();
        mirrorStatus();
    }

    function syncProjectInputsFromLegacy() {
        shell.customerName.value = legacy.customerName.value || '';
        shell.projectName.value = legacy.projectName.value || '';
        shell.projectLocation.value = legacy.projectLocation.value || '';
        shell.targetWidth.value = legacy.targetWidth.value || '';
        shell.targetHeight.value = legacy.targetHeight.value || '';
    }

    function syncProjectInputsToLegacy() {
        legacy.customerName.value = shell.customerName.value || '';
        legacy.projectName.value = shell.projectName.value || '';
        legacy.projectLocation.value = shell.projectLocation.value || '';
        legacy.targetWidth.value = shell.targetWidth.value || '';
        legacy.targetHeight.value = shell.targetHeight.value || '';
    }

    function mirrorStatus() {
        if (!legacy.statusMessage || !shell.status) return;

        const message = normalizeSpace(legacy.statusMessage.textContent);
        shell.status.textContent = message;
        shell.status.classList.remove('is-visible', 'is-success', 'is-error');

        if (message) {
            shell.status.classList.add('is-visible');
        }

        if (legacy.statusMessage.classList.contains('is-success')) {
            shell.status.classList.add('is-success');
        } else if (legacy.statusMessage.classList.contains('is-error')) {
            shell.status.classList.add('is-error');
        }
    }

    function syncShellFromLegacy() {
        state.activeSubCategory = legacy.productCategory.value || state.activeSubCategory;
        syncProjectInputsFromLegacy();
        renderShell();
    }

    function scheduleCalculate() {
        syncProjectInputsToLegacy();
        clearTimeout(sizeDebounceTimer);
        sizeDebounceTimer = setTimeout(() => {
            if (typeof window.calculate === 'function') {
                window.calculate();
            }
        }, 300);
    }

    function selectModule(subCategoryValue, modelValue) {
        legacy.productCategory.value = subCategoryValue;
        updateProductOptions();
        legacy.productModel.value = modelValue;
        updateModuleSpecs();
        state.activeSubCategory = subCategoryValue;
        if (typeof window.calculate === 'function') {
            window.calculate();
        }
    }

    function selectOption(category, value) {
        category.selectEl.value = value;
        if (typeof window.calculate === 'function') {
            window.calculate();
        }
    }

    function toggleAccessory(category, value) {
        const selectedItem = category.items.find((item) => item.value === value);
        if (!selectedItem) return;

        if (category.type === 'single') {
            const shouldSelect = !selectedItem.checkbox.checked;
            category.items.forEach((item) => {
                item.checkbox.checked = false;
            });
            selectedItem.checkbox.checked = shouldSelect;
            if (typeof validateAccessorySelection === 'function') {
                validateAccessorySelection();
            }
        } else {
            selectedItem.checkbox.checked = !selectedItem.checkbox.checked;
        }

        if (typeof window.calculate === 'function') {
            window.calculate();
        }
    }

    function handleCardSelection(category, value) {
        if (category.kind === 'module') {
            selectModule(state.activeSubCategory, value);
            return;
        }

        if (category.kind === 'select') {
            selectOption(category, value);
            return;
        }

        if (category.kind === 'checkbox-group') {
            toggleAccessory(category, value);
        }
    }

    function removeAccessorySelection(value) {
        state.catalog
            .filter((category) => category.kind === 'checkbox-group')
            .forEach((category) => {
                const item = category.items.find((candidate) => candidate.value === value);
                if (item) {
                    item.checkbox.checked = false;
                }
            });

        if (typeof window.calculate === 'function') {
            window.calculate();
        }
    }

    function bindTopInputs() {
        const simpleBindings = [
            [shell.customerName, legacy.customerName],
            [shell.projectName, legacy.projectName],
            [shell.projectLocation, legacy.projectLocation]
        ];

        simpleBindings.forEach(([source, target]) => {
            source.addEventListener('input', () => {
                target.value = source.value || '';
            });
        });

        shell.targetWidth.addEventListener('input', scheduleCalculate);
        shell.targetHeight.addEventListener('input', scheduleCalculate);
        shell.targetWidth.addEventListener('change', scheduleCalculate);
        shell.targetHeight.addEventListener('change', scheduleCalculate);
    }

    function bindResultTabs() {
        document.querySelectorAll('[data-shell-result]').forEach((node) => {
            node.addEventListener('click', () => {
                activateResultTab(node.dataset.shellResult);
            });
        });
    }

    function observeStatus() {
        if (!legacy.statusMessage) return;
        statusObserver = new MutationObserver(mirrorStatus);
        statusObserver.observe(legacy.statusMessage, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
        });
    }

    function wrapCalculate() {
        const originalCalculate = window.calculate;
        if (typeof originalCalculate !== 'function') return;

        window.calculate = function () {
            const result = originalCalculate.apply(this, arguments);
            syncShellFromLegacy();
            return result;
        };
    }

    function bootstrap() {
        bindShellDom();
        bindLegacyDom();
        if (!legacy.productCategory || !legacy.productModel || !legacy.accessoryContainer) return;

        buildCatalog();
        bindTopInputs();
        bindResultTabs();
        observeStatus();
        wrapCalculate();

        syncShellFromLegacy();
    }

    window.addEventListener('load', () => {
        bootstrap();
        window.setTimeout(syncShellFromLegacy, 50);
    });
})();
