const https = require('https');

// GitHub API配置
const GITHUB_API = 'api.github.com';
const REPO_OWNER = 'polibee';
const REPO_NAME = 'stocktokenhub';
const JOB_ID = '45217418360'; // Build作业的ID (最新)

// 获取作业日志
function getJobLogs(jobId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: GITHUB_API,
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/actions/jobs/${jobId}/logs`,
            method: 'GET',
            headers: {
                'User-Agent': 'GitHub-Pages-Checker',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve(data);
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// 主函数
async function main() {
    try {
        console.log('🔍 获取构建错误日志...');
        
        const logs = await getJobLogs(JOB_ID);
        
        if (!logs) {
            console.log('❌ 无法获取日志');
            return;
        }

        // 分析日志，查找错误信息
        const lines = logs.split('\n');
        let inBuildStep = false;
        let errorLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // 检测Build website步骤开始
            if (line.includes('Build website')) {
                inBuildStep = true;
                console.log('\n📋 Build website 步骤日志:');
                continue;
            }
            
            // 检测步骤结束
            if (inBuildStep && (line.includes('##[error]') || line.includes('Error:'))) {
                errorLines.push(line);
            }
            
            // 显示构建步骤的相关日志
            if (inBuildStep) {
                // 过滤掉时间戳和一些无用信息
                const cleanLine = line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z\s*/, '')
                                     .replace(/^##\[\w+\]/, '')
                                     .trim();
                
                if (cleanLine && !cleanLine.startsWith('##[')) {
                    console.log(`   ${cleanLine}`);
                }
                
                // 如果遇到下一个步骤，停止
                if (line.includes('Upload build artifacts') || line.includes('##[section]')) {
                    inBuildStep = false;
                }
            }
        }
        
        if (errorLines.length > 0) {
            console.log('\n❌ 发现的错误:');
            errorLines.forEach(error => {
                console.log(`   ${error}`);
            });
        }
        
        console.log('\n💡 完整日志链接:');
        console.log(`   🔗 https://github.com/${REPO_OWNER}/${REPO_NAME}/actions/runs/16026886275/job/${JOB_ID}`);
        
    } catch (error) {
        console.error('❌ 获取日志失败:', error.message);
        
        console.log('\n💡 请手动查看GitHub Actions日志:');
        console.log(`   🔗 https://github.com/${REPO_OWNER}/${REPO_NAME}/actions/runs/16026886275/job/${JOB_ID}`);
    }
}

main();