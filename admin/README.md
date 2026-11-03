# 管理后台

`orders.html`、`cdk.html` 于 2026-11-03 从 web2 线上版本同步入库；本次仅新增 Waitlist 导航。
`waitlist.html` 使用现有 `/api/admin/login` 和 `/api/pianotuner/subscribers`，只读查询，不修改名单或发送邮件。
名单不内嵌到 HTML，不在仓库保存真实报名数据。报名时间保留原始记录（旧数据未标时区）；当前生产服务器为 UTC，近 7 天按 UTC 计算滚动 168 小时。

管理页使用 Cloudflare Access（邮箱验证码 + WebAuthn），API 同时校验 Access 签名身份和后台 JWT；页面自动登录，无需输入后台密码。`deploy-verify` 来源单独标注为疑似测试记录，仍计入总数。

`admin/` 在公共网站构建流程中仍属于 `ORIGIN_ONLY`，后续整站发布通过 symlink 保留此目录。
这里保存管理页源文件；管理页变更单独按以下显式清单部署，不能把整个 `admin/` 覆盖上传：

1. 从 `root@108.186.222.233:/var/www/html-pianotuner/admin/` 下载本次涉及的现有文件，比对、合并线上变化。
2. 将线上 `admin/` 用 tar 备份至 `/root/backups/` 并验证归档可读。
3. 仅上传 `admin.css`、`orders.html`、`cdk.html`、`waitlist.html`（先样式后页面） 到线上 `admin/`，先上传临时文件再逐个重命名。
4. 核对本地、Git 和线上 SHA-256 一致，确认公网管理路径进入 Cloudflare Access、源站未验证身份的管理 API 为 401，后端 health 为 200。
5. 提交并推送同一批文件。无需重启 nginx 或后端。

页面查询与筛选的浏览器验证使用合成数据；生产名单验证只读，禁止提交测试订阅或修改现有记录。

2026-11-03：三个管理页共用 `admin.css`，与官网的暖中性色、青色、Inter 和标志保持一致；引用带版本号，后续改样式时同步更新版本。Inter 使用线上已有 `/fonts/Inter-var.woff2`，中文由系统字体兜底。
