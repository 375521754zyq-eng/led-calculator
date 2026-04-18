        function getCurrentProjectData() {
            return {
                projectName: document.getElementById('projectName')?.value || '',
                customerName: document.getElementById('customerName')?.value || '',
                projectLocation: document.getElementById('projectLocation')?.value || '',
                productCategory: document.getElementById('productCategory')?.value || '',
                productModel: document.getElementById('productModel')?.value || '',
                targetWidth: document.getElementById('targetWidth')?.value || '',
                targetHeight: document.getElementById('targetHeight')?.value || '',
                cardBrand: document.getElementById('receivingCardBrand')?.value || 'zhonghang',
                powerBrand: document.getElementById('powerBrand')?.value || 'chuanglian',
                cabinetType: document.getElementById('cabinetType')?.value || '',
                selectedAccessories: Array.from(document.querySelectorAll('input[name="accessory"]:checked')).map(cb => cb.value),
                createTime: new Date().toLocaleString('zh-CN')
            };
        }
        
        // 加载项目数据到界面
        function loadProjectData(data) {
            if (!data) return;
            
            if (document.getElementById('projectName')) {
                document.getElementById('projectName').value = data.projectName || '';
            }
            if (document.getElementById('customerName')) {
                document.getElementById('customerName').value = data.customerName || '';
            }
            if (document.getElementById('projectLocation')) {
                document.getElementById('projectLocation').value = data.projectLocation || '';
            }
            if (document.getElementById('productCategory')) {
                document.getElementById('productCategory').value = data.productCategory || '';
                updateProductOptions();
            }
            if (document.getElementById('productModel') && data.productModel) {
                setTimeout(() => {
                    document.getElementById('productModel').value = data.productModel;
                    updateModuleSpecs();
                }, 100);
            }
            if (document.getElementById('targetWidth')) {
                document.getElementById('targetWidth').value = data.targetWidth || '';
            }
            if (document.getElementById('targetHeight')) {
                document.getElementById('targetHeight').value = data.targetHeight || '';
            }
            if (document.getElementById('receivingCardBrand')) {
                document.getElementById('receivingCardBrand').value = data.cardBrand || 'zhonghang';
            }
            if (document.getElementById('powerBrand')) {
                document.getElementById('powerBrand').value = data.powerBrand || 'chuanglian';
            }
            if (document.getElementById('cabinetType')) {
                document.getElementById('cabinetType').value = data.cabinetType || '';
            }
            
            // 恢复配件选择
            document.querySelectorAll('input[name="accessory"]').forEach(cb => {
                cb.checked = data.selectedAccessories && data.selectedAccessories.includes(cb.value);
            });
            
            // 触发计算
            setTimeout(() => calculate(), 200);
        }
        
        // 显示历史记录列表
        function showProjectHistory() {
            const projects = ProjectManager.getAllProjects();
            let html = '<div style="max-height: 400px; overflow-y: auto;">';
            
            if (projects.length === 0) {
                html += '<p style="text-align: center; color: #999; padding: 20px;">暂无历史记录</p>';
            } else {
                html += '<table style="width: 100%; border-collapse: collapse;">';
                html += '<thead><tr style="background: #f5f5f5;">';
                html += '<th style="padding: 10px; text-align: left;">项目名称</th>';
                html += '<th style="padding: 10px; text-align: left;">客户</th>';
                html += '<th style="padding: 10px; text-align: left;">时间</th>';
                html += '<th style="padding: 10px; text-align: center;">操作</th>';
                html += '</tr></thead><tbody>';
                
                projects.forEach((proj, index) => {
                    html += `<tr style="border-bottom: 1px solid #eee; ${index % 2 === 0 ? 'background: #fafafa;' : ''}">`;
                    html += `<td style="padding: 10px;">${proj.name}</td>`;
                    html += `<td style="padding: 10px;">${proj.customer || '-'}</td>`;
                    html += `<td style="padding: 10px; font-size: 12px; color: #666;">${proj.createTime}</td>`;
                    html += `<td style="padding: 10px; text-align: center;">`;
                    html += `<button onclick="loadProjectById('${proj.id}')" style="padding: 4px 12px; margin-right: 5px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">加载</button>`;
                    html += `<button onclick="exportProjectById('${proj.id}')" style="padding: 4px 12px; margin-right: 5px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">导出</button>`;
                    html += `<button onclick="deleteProjectById('${proj.id}')" style="padding: 4px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">删除</button>`;
                    html += `</td></tr>`;
                });
                
                html += '</tbody></table>';
            }
            
            html += '</div>';
            
            // 创建弹窗
            const modal = document.createElement('div');
            modal.id = 'historyModal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
            modal.innerHTML = `
                <div style="background: white; border-radius: 8px; width: 90%; max-width: 800px; max-height: 80%; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <div style="padding: 15px 20px; background: #1e3a5f; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">📋 项目历史记录</h3>
                        <button onclick="closeHistoryModal()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
                    </div>
                    <div style="padding: 20px;">
                        ${html}
                    </div>
                    <div style="padding: 15px 20px; background: #f5f5f5; text-align: right;">
                        <button onclick="importProjectFromFile()" style="padding: 8px 20px; margin-right: 10px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">📂 从文件导入</button>
                        <button onclick="closeHistoryModal()" style="padding: 8px 20px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // 关闭历史记录弹窗
        function closeHistoryModal() {
            const modal = document.getElementById('historyModal');
            if (modal) modal.remove();
        }
        
        // 根据ID加载项目
        function loadProjectById(id) {
            const project = ProjectManager.getProjectById(id);
            if (project && project.data) {
                loadProjectData(project.data);
                closeHistoryModal();
                alert('项目加载成功！');
            } else {
                alert('项目不存在！');
            }
        }
        
        // 根据ID导出项目
        function exportProjectById(id) {
            const project = ProjectManager.getProjectById(id);
            if (project && project.data) {
                ProjectManager.exportToJSON(project.data, `LED项目_${project.name}_${new Date().getTime()}.json`);
            } else {
                alert('项目不存在！');
            }
        }
        
        // 根据ID删除项目
        function deleteProjectById(id) {
            if (confirm('确定要删除这个项目吗？')) {
                ProjectManager.deleteProject(id);
                showProjectHistory(); // 刷新列表
            }
        }
        
        // 导入项目从文件
        function importProjectFromFile() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    ProjectManager.importFromJSON(file, function(err, data) {
                        if (err) {
                            alert('导入失败：' + err.message);
                        } else {
                            loadProjectData(data);
                            closeHistoryModal();
                            alert('项目导入成功！');
                        }
                    });
                }
            };
            input.click();
        }
        
        // 保存当前项目到历史记录
        function saveCurrentProject() {
            const projectName = document.getElementById('projectName')?.value;
            if (!projectName) {
                alert('请先填写项目名称！');
                return;
            }
            const data = getCurrentProjectData();
            const id = ProjectManager.saveProject(data);
            alert('项目保存成功！');
        }
        
        // 导出当前项目为JSON
        function exportCurrentProject() {
            const projectName = document.getElementById('projectName')?.value;
            if (!projectName) {
                alert('请先填写项目名称！');
                return;
            }
            const data = getCurrentProjectData();
            ProjectManager.exportToJSON(data);
        }
        
        // 页面加载时恢复自动保存的数据
        window.addEventListener('load', function() {
            const autoSaveData = ProjectManager.getAutoSave();
            if (autoSaveData) {
                if (confirm('检测到未保存的项目，是否恢复？')) {
                    loadProjectData(autoSaveData);
                } else {
                    ProjectManager.clearAutoSave();
                }
            }
        });
