const https = require('https');
const fs = require('fs');

// GitHub API配置
const GITHUB_API = 'api.github.com';
const REPO_OWNER = 'polibee';
const REPO_NAME = 'stocktokenhub';

// 获取工作流运行详情
function getWorkflowRuns() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: GITHUB_API,
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=5`,
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
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// 获取工作流作业详情
function getWorkflowJobs(runId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: GITHUB_API,
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs/${runId}/jobs`,
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
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

const JOB_ID = '45218063239'; // 替换为实际的作业ID

// 主函数
async function main() {
    try {
        console.log('🔍 检查最新的工作流错误...');
        
        const runs = await getWorkflowRuns();
        
        if (!runs.workflow_runs || runs.workflow_runs.length === 0) {
            console.log('❌ 未找到工作流运行记录');
            return;
        }

        // 查找最新的失败的Build and Deploy工作流
        const failedRuns = runs.workflow_runs.filter(run => 
            run.name === 'Build and Deploy' && run.conclusion === 'failure'
        );
        
        const failedRun = failedRuns[0]; // 获取最新的失败运行

        if (!failedRun) {
            console.log('✅ 未找到失败的Build and Deploy工作流');
            return;
        }

        console.log(`\n📋 失败的工作流详情:`);
        console.log(`   🆔 Run ID: ${failedRun.id}`);
        console.log(`   📅 时间: ${new Date(failedRun.created_at).toLocaleString('zh-CN')}`);
        console.log(`   🔗 链接: ${failedRun.html_url}`);
        console.log(`   ❌ 结论: ${failedRun.conclusion}`);

        // 获取作业详情
        console.log('\n🔍 获取作业详情...');
        const jobs = await getWorkflowJobs(failedRun.id);
        
        if (jobs.jobs && jobs.jobs.length > 0) {
            jobs.jobs.forEach(job => {
                console.log(`\n📋 作业: ${job.name}`);
                console.log(`   ⏱️  状态: ${job.status}`);
                console.log(`   ❌ 结论: ${job.conclusion}`);
                console.log(`   🔗 日志: ${job.html_url}`);
                
                if (job.steps && job.steps.length > 0) {
                    console.log('   📝 步骤:');
                    job.steps.forEach(step => {
                        const status = step.conclusion === 'failure' ? '❌' : 
                                     step.conclusion === 'success' ? '✅' : '⏳';
                        console.log(`      ${status} ${step.name} (${step.conclusion || step.status})`);
                    });
                }
            });
        }

        console.log('\n💡 建议检查:');
        console.log('   1. 查看具体的错误日志链接');
        console.log('   2. 检查是否有新的依赖问题');
        console.log('   3. 验证所有文件路径是否正确');
        console.log('   4. 确认GitHub Actions权限设置');
        
    } catch (error) {
        console.error('❌ 检查失败:', error.message);
        
        if (error.message.includes('getaddrinfo ENOTFOUND')) {
            console.log('\n💡 网络连接问题，请检查:');
            console.log('   1. 网络连接是否正常');
            console.log('   2. 是否需要代理设置');
        }
    }
}

main();