# 部署与回滚手册

生产发布只使用通过 `npm run check` 的 commit。`dist/` 是一次性构建产物，不提交到 Git；每次发布记录 commit SHA、构建时间、执行人和目标环境。

## GitHub Pages

仓库 `GauntWheelCake/shu-scientist-museum` 使用 GitHub Actions 发布，站点 base path 为 `/shu-scientist-museum/`。

1. 在仓库 **Settings → Pages → Build and deployment** 中把 Source 设为 **GitHub Actions**。
2. 合并到 `main` 会触发 `deploy-pages.yml`；也可在 **Actions → Deploy GitHub Pages → Run workflow** 手动触发。
3. 工作流以 Node 22 执行 `npm ci`，设置 `VITE_BASE_PATH=/shu-scientist-museum/` 并构建 `dist/`，随后上传和部署官方 Pages artifact。
4. 等待 `github-pages` environment 成功，在未登录浏览器验证首页、`/scientists/qian-weichang` 深链刷新、静态资源和 404 恢复。
5. 若要自定义域名，在 Pages 设置填写域名，再按 GitHub 给出的记录配置 DNS；DNS 生效后启用 **Enforce HTTPS**。在 HTTPS 生效前不要对外公布域名。

Pages 回滚优先使用 Git 恢复：对错误 commit 创建 `git revert <sha>`，经 CI 通过后合并到 `main`，由工作流重新发布。不要强推或删除发布历史。

## Nginx 服务器部署

建议发布目录采用不可变版本目录，并由符号链接切换当前版本：

```text
/var/www/scientist-museum/releases/<build-id>/
/var/www/scientist-museum/current -> releases/<build-id>/
```

在 CI 或可信构建机执行 `npm ci && npm run check && npm run build`，校验构建包后上传 `dist/` 内容到新的 `<build-id>` 目录。Nginx 站点配置至少包含：

```nginx
server {
    listen 80;
    server_name museum.example.edu.cn;
    root /var/www/scientist-museum/current;
    index index.html;

    access_log /var/log/nginx/scientist-museum.access.log;
    error_log /var/log/nginx/scientist-museum.error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|webp|svg)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }
}
```

配置 DNS 前先确认服务器固定公网 IP；为域名添加 A/AAAA 记录并等待解析生效。使用 Certbot 或组织批准的证书流程签发证书，启用 443、HTTP 到 HTTPS 跳转与自动续期；运行 `nginx -t` 成功后再 reload。访问日志和错误日志分别位于 `/var/log/nginx/scientist-museum.access.log` 与 `/var/log/nginx/scientist-museum.error.log`，接入轮转和磁盘告警，发布后重点检查 404、5xx 和静态资源失败。

## 备份与回滚

- 每次切换前保留当前构建包、SHA-256 校验值、对应 commit SHA 和 Nginx 配置快照；构建包与配置备份放在与 Web 根分离、受访问控制的位置。
- 至少保留最近两个已验证构建包；备份保留期和异地副本按组织数据策略执行，并定期做恢复演练。
- 发布时先上传新目录，校验权限、首页与深链，再原子切换 `current` 链接并 reload Nginx。
- 出现阻塞性问题时，把 `current` 重新指向前一个已验证的 `<build-id>`，运行 `nginx -t` 后 reload；随后验证首页、人物深链、静态资源、日志和 HTTPS。
- 不在故障现场覆盖旧目录；故障构建保留到完成复盘，但不得继续对外提供。
