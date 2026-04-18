        const ProjectManager = {
            // 保存项目到LocalStorage
            saveProject: function(projectData) {
                const projects = this.getAllProjects();
                const project = {
                    id: 'proj_' + Date.now(),
                    name: projectData.projectName || '未命名项目',
                    customer: projectData.customerName || '',
                    createTime: new Date().toLocaleString('zh-CN'),
                    updateTime: new Date().toLocaleString('zh-CN'),
                    data: projectData
                };
                projects.unshift(project); // 新项目放前面
                // 最多保留50个项目
                if (projects.length > 50) {
                    projects = projects.slice(0, 50);
                }
                localStorage.setItem('led_calculator_projects', JSON.stringify(projects));
                return project.id;
            },
            
            // 获取所有项目
            getAllProjects: function() {
                const data = localStorage.getItem('led_calculator_projects');
                return data ? JSON.parse(data) : [];
            },
            
            // 根据ID获取项目
            getProjectById: function(id) {
                const projects = this.getAllProjects();
                return projects.find(p => p.id === id);
            },
            
            // 删除项目
            deleteProject: function(id) {
                let projects = this.getAllProjects();
                projects = projects.filter(p => p.id !== id);
                localStorage.setItem('led_calculator_projects', JSON.stringify(projects));
            },
            
            // 自动保存当前项目
            autoSave: function(projectData) {
                localStorage.setItem('led_calculator_current', JSON.stringify(projectData));
            },
            
            // 获取自动保存的项目
            getAutoSave: function() {
                const data = localStorage.getItem('led_calculator_current');
                return data ? JSON.parse(data) : null;
            },
            
            // 清除自动保存
            clearAutoSave: function() {
                localStorage.removeItem('led_calculator_current');
            },
            
            // 导出项目为JSON文件
            exportToJSON: function(projectData, filename) {
                const exportData = {
                    version: '1.0',
                    exportTime: new Date().toLocaleString('zh-CN'),
                    project: projectData
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                saveAs(blob, filename || `LED项目_${projectData.projectName || '未命名'}_${new Date().getTime()}.json`);
            },
            
            // 从JSON文件导入项目
            importFromJSON: function(file, callback) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.project) {
                            callback(null, data.project);
                        } else {
                            callback(new Error('无效的项目文件'));
                        }
                    } catch (err) {
                        callback(new Error('文件解析失败'));
                    }
                };
                reader.readAsText(file);
            }
        };
