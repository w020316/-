# 环境配置 - 所有资源存放在D盘，避免占用C盘
# 使用方法: 在PowerShell中运行 . .env\setup.ps1

$env:PIP_CACHE_DIR = "D:\xm\wz\shuati\.cache\pip"
$env:PLAYWRIGHT_BROWSERS_PATH = "D:\xm\wz\shuati\.cache\playwright"
$env:TEMP = "D:\xm\wz\shuati\.cache\temp"
$env:TMP = "D:\xm\wz\shuati\.cache\temp"

New-Item -ItemType Directory -Force -Path "D:\xm\wz\shuati\.cache\pip","D:\xm\wz\shuati\.cache\playwright","D:\xm\wz\shuati\.cache\temp","D:\xm\wz\shuati\.cache\npm" | Out-Null

npm config set cache "D:\xm\wz\shuati\.cache\npm" --global 2>$null

Write-Host "OK - D drive configured" -ForegroundColor Green
