        function showExportLanguageDialog(exportType) {
            // 关闭已存在的弹窗
            const existingModal = document.getElementById('exportLangModal');
            if (existingModal) existingModal.remove();
            
            const modal = document.createElement('div');
            modal.id = 'exportLangModal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
            
            modal.innerHTML = `
                <div style="background: white; border-radius: 8px; padding: 30px; width: 320px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <h3 style="margin-bottom: 25px; color: #333; font-size: 18px;">🌐 选择导出语言</h3>
                    <div style="margin-bottom: 25px; text-align: left;">
                        <label style="display: block; margin: 15px 0; cursor: pointer; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; transition: all 0.3s;" onmouseover="this.style.borderColor='#4CAF50'" onmouseout="this.style.borderColor='#e0e0e0'">
                            <input type="radio" name="exportLang" value="zh" checked style="margin-right: 10px; transform: scale(1.2);"> 
                            <span style="font-size: 16px;">🇨🇳 中文版本 (Chinese)</span>
                        </label>
                        <label style="display: block; margin: 15px 0; cursor: pointer; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; transition: all 0.3s;" onmouseover="this.style.borderColor='#2196F3'" onmouseout="this.style.borderColor='#e0e0e0'">
                            <input type="radio" name="exportLang" value="en" style="margin-right: 10px; transform: scale(1.2);"> 
                            <span style="font-size: 16px;">🇺🇸 英文版本 (English)</span>
                        </label>
                    </div>
                    <div>
                        <button onclick="confirmExport('${exportType}')" style="padding: 12px 35px; margin-right: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: bold;">确认导出</button>
                        <button onclick="closeExportDialog()" style="padding: 12px 35px; background: #999; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px;">取消</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // 关闭导出语言选择弹窗
        function closeExportDialog() {
            const modal = document.getElementById('exportLangModal');
            if (modal) modal.remove();
        }
        
        // 确认导出
        function confirmExport(exportType) {
            const selectedLang = document.querySelector('input[name="exportLang"]:checked');
            if (!selectedLang) {
                alert('请选择导出语言！');
                return;
            }
            
            const lang = selectedLang.value;
            closeExportDialog();
            
            if (exportType === 'quotation') {
                exportQuotationToWord(lang);
            } else if (exportType === 'shipping') {
                exportShippingToWord(lang);
            } else if (exportType === 'contract') {
                exportContractToWord(lang);
            }
        }
