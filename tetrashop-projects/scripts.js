// اضافه کردن به script.js
async function runPythonScript(projectName, inputData = '') {
    const response = await fetch('http://localhost:5000/api/run-script', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            script: projectName,
            input: inputData
        })
    });
    
    return await response.json();
}

// رابط کاربری برای اجرای اسکریپت‌ها
function createProjectInterface(project) {
    return `
        <div class="project-card">
            <h3>${project.icon} ${project.name}</h3>
            <p>${project.description}</p>
            <span class="project-status ${project.statusClass}">${project.status}</span>
            
            <div class="project-controls">
                <input type="text" id="input-${project.script}" 
                       placeholder="ورودی اسکریپت..." class="input-field">
                <button onclick="executeScript('${project.script}')" 
                        class="run-btn">
                    🚀 اجرای اسکریپت
                </button>
            </div>
            
            <div id="output-${project.script}" class="output-box"></div>
        </div>
    `;
}

async function executeScript(scriptName) {
    const input = document.getElementById(`input-${scriptName}`).value;
    const outputDiv = document.getElementById(`output-${scriptName}`);
    
    outputDiv.innerHTML = '<div class="loading">در حال اجرا...</div>';
    
    try {
        const result = await runPythonScript(scriptName, input);
        
        if (result.success) {
            outputDiv.innerHTML = `
                <div class="success-output">
                    <h4>✅ خروجی اسکریپت:</h4>
                    <pre>${JSON.stringify(result.output, null, 2)}</pre>
                </div>
            `;
        } else {
            outputDiv.innerHTML = `
                <div class="error-output">
                    <h4>❌ خطا:</h4>
                    <pre>${result.error}</pre>
                </div>
            `;
        }
    } catch (error) {
        outputDiv.innerHTML = `
            <div class="error-output">
                <h4>❌ خطای ارتباط:</h4>
                <pre>${error.message}</pre>
            </div>
        `;
    }
}
