---
title: VuePress 博客优化之开启 Gzip 压缩
date: 2022-01-22 22:58
tags:
 - 搭建博客
sidebarDepth: 2
---

## 前言

在 [《一篇教你用 VuePress + Github Pages 搭建博客》](一篇教你用%20VuePress%20%2B%20Github%20Pages%20搭建博客.md) 中，我们使用 VuePress 搭建了一个博客，
在 [《一篇从购买服务器到部署博客代码的详细教程》](一篇从购买服务器到部署博客代码的详细教程.md) 中，我们将代码部署到服务器上，最终的效果查看：[ latte and cat](https://www.aligoogle.net)。
今天我们来学习如何开启服务器的 Gzip 压缩。

## 一. Gzip 压缩

关于 Gzip 压缩，引用 MDN 的[介绍](https://developer.mozilla.org/zh-CN/docs/Glossary/GZip_compression) ：

Gzip 是一种用于文件压缩与解压缩的文件格式。它基于 Deflate 算法，可将文件压缩地更小，从而实现更快的网络传输。
Web服务器与现代浏览器普遍地支持 Gzip，这意味着服务器可以在发送文件之前自动使用 Gzip 压缩文件，而浏览器可以在接收文件时自行解压缩文件。

而对于我们而言，开启 Gzip，不仅能提高网站打开速度，还能节约网站流量，像我购买的服务器是按照使用流量付费，开启 Gzip 就是在为自己省钱。

## 二. Nginx 与 Gzip

Nginx 内置了 ngx_http_gzip_module 模块，该模块会拦截请求，并对需要做 Gzip 压缩的文件做压缩。因为是内部集成，所以我们只用修改 Nginx 的配置，就可以直接开启。

```shell
# 登陆服务器
ssh -v root@8.147.xxx.xxx

# 进入 Nginx 目录
cd /etc/nginx

# 修改 Nginx 配置
vim nginx.conf
```

在 server 中添加 Gzip 压缩相关配置：

```nginx
# Settings for a TLS enabled server.
#
server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  www.aligoogle.net; # 替换成证书绑定的域名
    # root         /usr/share/nginx/html;

    ssl_certificate "cert/7138509_www.aligoogle.net.pem"; # 替换已经上传的证书文件的目录和名称。
    ssl_certificate_key "cert/7138509_www.aligoogle.net.key"; # 替换已经上传的证书私钥文件的目录和名称。
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  5m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    location / {
      alias /home/www/website/ts/;
      index index.html;
    }
    
    # 这里是新增的 gzip 设置
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_types application/atom+xml application/geo+json application/javascript application/x-javascript application/json application/ld+json application/manifest+json application/rdf+xml application/rss+xml application/xhtml+xml application/xml font/eot font/otf font/ttf image/svg+xml text/css text/javascript text/plain text/xml;
}
```

这里简要介绍一下涉及到的配置项含义，更具体的可以查看 Nginx 官方文档里的 [解释](http://nginx.org/en/docs/http/ngx_http_gzip_module.html) ：

1. gzip → 是否开启 gzip 模块 on 表示开启 off 表示关闭，默认是 off
2. gzip_min_length → 设置压缩的最小文件大小，小于该设置值的文件将不会压缩
3. gzip_comp_level → 压缩级别，从 1 到 9，默认 1，数字越大压缩效果越好，但也会越占用 CPU 时间，这里选了一个常见的折中值
4. gzip_types → 进行压缩的文件类型

修改完后，不要忘记重新加载一次 Nginx 配置：

```shell
systemctl reload nginx
```



## 三. 验证

第一种验证方式是直接查看网络请求，打开浏览器的调试工具，查看 `NetWork` 请求，如果请求响应头的 `Content-Encoding` 字段为 `gzip`，就表示成功开启了 Gzip：

![vuepress_01-22_22](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_22.3yvy4p49g14.jpg)

第二种方式是通过站长工具验证，打开 [网页GZIP压缩检测](https://tool.chinaz.com/gzips/) ，输入网站，进行查询

![vuepress_01-22_23](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_23.6dfkjmsmfv40.jpg)

---

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。
