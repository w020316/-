# 刷题网站环境初始化脚本 (PowerShell版)
# 将所有依赖和缓存存放在D盘

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  刷题网站环境初始化 (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 定义路径
$envPath = "d:\xm\wz\shuati-env"
$npmCache = "$envPath\npm-cache"
$nodeModules = "$envPath\node_modules"
$pipCache = "$envPath\pip-cache"
$tempDir = "$envPath\temp"

# 创建目录结构
Write-Host "[*] 创建目录结构..." -ForegroundColor Yellow
@($npmCache, $nodeModules, $pipCache, $tempDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Force -Path $_ | Out-Null
        Write-Host "    ✓ 创建: $_" -ForegroundColor Green
    } else {
        Write-Host "    ○ 已存在: $_" -ForegroundColor Gray
    }
}

Write-Host ""

# 设置环境变量（当前会话）
Write-Host "[*] 设置环境变量..." -ForegroundColor Yellow
$env:NPM_CONFIG_CACHE = $npmCache
$env:NODE_PATH = $nodeModules
$env:PIP_CACHE_DIR = $pipCache
$env:TEMP = $tempDir
$env:TMP = $tempDir

Write-Host "    ✓ NPM_CONFIG_CACHE = $npmCache" -ForegroundColor Green
Write-Host "    ✓ NODE_PATH = $nodeModules" -ForegroundColor Green
Write-Host "    ✓ PIP_CACHE_DIR = $pipCache" -ForegroundColor Green
Write-Host "    ✓ TEMP/TMP = $tempDir" -ForegroundColor Green
Write-Host ""

# 配置npm
Write-Host "[*] 配置npm..." -ForegroundColor Yellow
try {
    npm config set cache $npmCache 2>$null
    npm config set prefix $nodeModules 2>$null
    Write-Host "    ✓ npm配置完成" -ForegroundColor Green
} catch {
    Write-Host "    ! npm未安装或配置失败" -ForegroundColor Red
}

Write-Host ""

# 配置pip（如果Python存在）
Write-Host "[*] 配置pip..." -ForegroundColor Yellow
if (Get-Command python -ErrorAction SilentlyContinue) {
    try {
        python -m pip config set global.cache-dir $pipCache 2>$null
        Write-Host "    ✓ pip配置完成" -ForegroundColor Green
    } catch {
        Write-Host "    ! pip配置失败" -ForegroundColor Red
    }
} else {
    Write-Host "    ! Python未安装，跳过pip配置" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  环境初始化完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "存储位置:" -ForegroundColor White
Write-Host "  • npm包:     $nodeModules" -ForegroundColor Gray
Write-Host "  • npm缓存:   $npmCache" -ForegroundColor Gray
Write-Host "  • pip缓存:   $pipCache" -ForegroundColor Gray
Write-Host "  • 临时文件:   $tempDir" -ForegroundColor Gray
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor White
Write-Host "  1. 运行 'npm install' 安装Node.js依赖" -ForegroundColor Gray
Write-Host "  2. 运行 'pip install -r requirements.txt' 安装Python依赖" -ForegroundColor Gray
Write-Host "  3. 运行 'npm start' 启动开发服务器" -ForegroundColor Gray
Write-Host ""
Write-Host "提示: 此脚本仅对当前会话有效。如需永久生效，请设置系统环境变量。" -ForegroundColor Yellow
Write-Host ""

# 暂停（可选）
Read-Host "按回车键退出"