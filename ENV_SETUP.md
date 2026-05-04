# 环境配置说明

## 📁 目录结构

```
d:\xm\wz\
├── shuati/                    # 项目主目录
│   ├── index.html            # 主页面
│   ├── package.json          # Node.js依赖管理
│   ├── requirements.txt      # Python依赖列表
│   ├── .env                  # 环境变量配置
│   ├── .npmrc                # npm配置（使用D盘缓存）
│   ├── pip.ini               # pip配置（使用D盘缓存）
│   ├── setup_env.bat         # Windows环境初始化脚本
│   └── ...                   # 其他项目文件
│
└── shuati-env/               # 环境文件夹（在D盘）
    ├── node_modules/         # npm包安装位置
    ├── npm-cache/           # npm缓存
    ├── pip-cache/           # pip缓存
    └── temp/                # 临时文件
```

## 🚀 快速开始

### 方法一：使用初始化脚本（推荐）

双击运行 `setup_env.bat`，会自动：
1. 创建环境文件夹 `d:\xm\wz\shuati-env`
2. 配置npm和pip使用D盘缓存
3. 设置环境变量

### 方法二：手动配置

#### 1. 安装Node.js依赖

```bash
# 设置npm使用D盘缓存
npm config set cache d:\xm\wz\shuati-env\npm-cache
npm config set prefix d:\xm\wz\shuati-env\node_modules

# 安装项目依赖（可选）
npm install
```

#### 2. 安装Python依赖

```bash
# 使用清华镜像源和D盘缓存
pip install -r requirements.txt --cache-dir d:\xm\wz\shuati-env\pip-cache -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 3. 启动开发服务器

```bash
# 方法1：使用serve（推荐）
npx serve -l 8080 .

# 方法2：使用live-server（支持热重载）
npx live-server --port=8080 .
```

## ⚙️ 配置说明

### npm配置 (.npmrc)

- **缓存路径**: `d:\xm\wz\shuati-env\npm-cache`
- **安装路径**: `d:\xm\wz\shuati-env\node_modules`
- **镜像源**: npmmirror.com（国内加速）

### pip配置 (pip.ini)

- **缓存路径**: `d:\xm\wz\shuati-env\pip-cache`
- **镜像源**: 清华大学（国内加速）

### 环境变量 (.env)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| NPM_CONFIG_CACHE | d:\xm\wz\shuati-env\npm-cache | npm缓存目录 |
| NODE_PATH | d:\xm\wz\shuati-env\node_modules | Node.js模块路径 |
| PIP_CACHE_DIR | d:\xm\wz\shuati-env\pip-cache | pip缓存目录 |
| TEMP/TMP | d:\xm\wz\shuati-env\temp | 临时文件目录 |

## 💾 存储空间预估

| 目录 | 用途 | 预估大小 |
|------|------|----------|
| node_modules/ | npm包 | ~100MB |
| npm-cache/ | npm缓存 | ~200MB |
| pip-cache/ | pip缓存 | ~500MB |
| temp/ | 临时文件 | ~50MB |
| **总计** | | **~850MB** |

## 🔧 常见问题

### Q: 为什么要把环境放在D盘？
A: 避免C盘空间不足，特别是对于大型项目和长期使用。

### Q: 如何清理缓存？
```bash
# 清理npm缓存
npm cache clean --force

# 清理pip缓存
pip cache purge

# 或直接删除文件夹
Remove-Item -Recurse -Force d:\xm\wz\shuati-env\npm-cache, d:\xm\wz\shuati-env\pip-cache
```

### Q: 如何恢复默认配置？
```bash
# 重置npm配置
npm config delete cache
npm config delete prefix

# 删除环境文件夹
Remove-Item -Recurse -Force d:\xm\wz\shuati-env
```

### Q: 多个项目可以共享这个环境吗？
A: 可以！修改 `.env` 和配置文件中的路径为共享目录即可。

## 📊 项目依赖清单

### Node.js (package.json)
- serve: 轻量级静态服务器
- live-server: 支持热重载的开发服务器

### Python (requirements.txt)
- playwright: 浏览器自动化测试
- pandas: 数据处理（可选）
- requests: HTTP请求（可选）

## 🌐 在线访问

启动服务器后，访问：
- 本地: http://localhost:8080
- 局域网: http://你的IP:8080

## 📝 注意事项

1. **首次运行**需要执行 `setup_env.bat` 初始化环境
2. **Git提交**时，`shuati-env/` 文件夹不会被上传（已在.gitignore中排除）
3. **团队协作**时，每个成员都需要单独运行初始化脚本
4. **更换电脑**时，只需复制整个 `shuati/` 文件夹即可

---

**最后更新**: 2026-05-04
**适用系统**: Windows 10/11