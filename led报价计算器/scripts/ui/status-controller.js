        (function () {
            const statusEl = document.getElementById('statusMessage');
            const originalCalculate = window.calculate;

            const setStatus = (type, message) => {
                if (!statusEl) return;
                statusEl.textContent = message || '';
                statusEl.classList.remove('is-success', 'is-error');
                if (type === 'success') statusEl.classList.add('is-success');
                if (type === 'error') statusEl.classList.add('is-error');
                statusEl.classList.toggle('is-visible', Boolean(message));
            };

            const getNumber = (id) => {
                const el = document.getElementById(id);
                if (!el) return NaN;
                return Number(String(el.value).trim());
            };

            const validateInputs = () => {
                const width = getNumber('targetWidth');
                const height = getNumber('targetHeight');
                if (!Number.isFinite(width) || !Number.isFinite(height)) {
                    return '请输入有效的宽度与高度（数字）。';
                }
                if (width <= 0 || height <= 0) {
                    return '宽度与高度必须大于 0。';
                }
                return '';
            };

            if (typeof originalCalculate === 'function') {
                window.calculate = function () {
                    const error = validateInputs();
                    if (error) {
                        setStatus('error', error);
                        return;
                    }
                    setStatus('success', '正在计算，请稍候...');
                    try {
                        originalCalculate();
                        setStatus('success', '计算完成。');
                    } catch (err) {
                        console.error(err);
                        setStatus('error', '计算失败，请检查输入或刷新页面后重试。');
                        throw err;
                    }
                };
            }

            const debounce = (fn, wait) => {
                let timer;
                return function (...args) {
                    clearTimeout(timer);
                    timer = setTimeout(() => fn.apply(this, args), wait);
                };
            };

            const autoCalculate = debounce(() => {
                if (typeof window.calculate === 'function') {
                    window.calculate();
                }
            }, 500);

            const autoInputs = [
                'targetWidth',
                'targetHeight',
                'productModel',
                'productCategory',
                'receivingCardBrand',
                'powerBrand'
            ];

            autoInputs.forEach((id) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('change', autoCalculate);
            });

            const sizeInputs = ['targetWidth', 'targetHeight'];
            sizeInputs.forEach((id) => {
                const el = document.getElementById(id);
                if (!el) return;
                el.addEventListener('input', autoCalculate);
            });
        })();
