---
title: VuePress 博客优化之开启 HTTPS
date: 2022-01-15 20:00
tags:
 - 博客搭建
sidebarDepth: 2
---

## 前言

在[《一篇教你用 VuePress + Github Pages 搭建博客》](一篇教你用%20VuePress%20%2B%20Github%20Pages%20搭建博客.md)中，我们使用 VuePress 搭建了一个博客，最终的效果点击查看
[ latte and cat](https://www.aligoogle.net)。

注意此时，我们的域名还是 [aligoogle.net](http://www.aligoogle.net)，众所周知，开启 HTTPS 有很多好处，比如可以实现数据加密传输等，那我们如何开启 HTTPS 配置呢？

## 一. 购买证书

阿里云提供了免费证书可以使用，在每个自然年内，都可以通过 SSL 证书服务一次性申领 20 张免费证书。

### 1.1 购买证书

访问 [云盾证书服务购买页](https://common-buy.aliyun.com/?commodityCode=cas_dv_public_cn&request=%7B%22product%22:%22cert_product%22,%22domain%22:%22all%22,%22productCode%22:%22symantec-dv-1-starter%22%7D)，
选择「DV 单域名证书（免费试用）」，提示按照下单购买（订单价格为 0 元）。

![vuepress_01-22_01](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_01.3kyw0m9sb4k0.jpg)

### 1.2 创建证书

登录 [SSL证书控制台](https://yundunnext.console.aliyun.com/?spm=a2c4g.11186623.0.0.1d98158eby7LBX&p=cas)，选择「SSL证书」-「免费证书」，点击「创建证书」，就会自动创建一个证书：

![vuepress_01-22_02](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_02.5kux0rc8q7s0.jpg)

### 1.3 证书申请

1. 填写申请

在新创建的证书上，点击「证书申请」，填写以下信息：

![vuepress_01-22_03](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_03.77lj35by0cw0.jpg)

> 注意：免费证书绑定的域名，只能是普通域名，比如 `xx.aligoogle.net` 或者 `aligoogle.net`，所谓统配符域名，就是指以 `*.` 号开头的域名，比如 `*.aligoogle.net`：

![vuepress_01-22_04](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_04.6eahkyvl3ww0.jpg)

> 注意：`xxx.com` 和 `www.xxx.com`，申请一个域名就行。

2. 验证信息

填写完后，进入申请第二步，验证信息：

![vuepress_01-22_05](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_05.weps593g3kg.jpg)

点击「验证」，会出现：

![vuepress_01-22_06](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_06.50df6qcttwo0.jpg)

接下来提交审核，会出现提示：

![vuepress_01-22_07](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_07.5ns9urhbc5o0.jpg)

实际上，不需要等邮件，很快证书状态就会变为「已签发」，此时就可以接着操作了。

![vuepress_01-22_08](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_08.4wrn9lxzf540.jpg)

## 二. 安装证书

### 2.1 下载证书

证书状态变为「已签发」后，点击「下载」：

![vuepress_01-22_09](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_09.t42evo9ffcg.jpg)

然后根据 Web 服务器的类型，下载对应格式的证书文件，这里我们选择 Nginx 进行下载：

![vuepress_01-22_10](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_10.1zmsdtqv86hs.jpg)

像我下载的就是一个名为 `7138509_www.aligoogle.net_nginx` 的 `zip` 压缩包，本地解压后，是一个文件夹，里面有两个文件：

- 7138509_www.aligoogle.net.key
- 7138509_www.aligoogle.net.pem

### 2.2 上传证书

接下来我们要做的就是将下载的证书文件上传到 Web 服务器，并修改服务器的相关配置，开启 HTTPS 监听。

我们先登上服务器，创建一个文件夹存放证书文件：

```shell
# 登录服务器
ssh -v root@8.141.xxx.xxx

# 进入 nginx 配置目录
cd /etc/nginx

# 创建目录存放证书
mkdir cert
```

然后上传下载好的证书文件到服务器上，这里使用 Linux 的 `scp` 命令上传：

`scp` 命令的语法为：

```
scp [可选参数] file_source file_target
```

在本地起一个命令行，然后执行：

```
scp ~/desktop/7138509_www.aligoogle.net_nginx/7138509_www.aligoogle.net.key root@8.141.xxx.xxx:/etc/nginx/cert
scp ~/desktop/7138509_www.aligoogle.net_nginx/7138509_www.aligoogle.net.pem root@8.141.xxx.xxx:/etc/nginx/cert
```

再在服务器上查看是否成功上传：

```
[root@iZ2ze nginx]# cd cert/
[root@iZ2ze cert]# ls
[root@iZ2ze cert]# ls
7138509_www.aligoogle.net.key  7138509_www.aligoogle.net.pem
```

### 2.3 修改配置

接下来我们修改 Nginx 配置：

```shell
vim /etc/nginx/nginx.conf
```

在 http 下新建一个 server：

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

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }

    location / {
      alias /home/www/website/ts/;
      index index.html;
    }
}
```

注意我们修改完后，别忘了重新加载一下 nginx 配置：

```shell
systemctl reload nginx
```

### 2.4 http 重定向

对于原本的 https 请求，我们可以写一个 rewrite 语句，重定向所有的 http 请求到 https 请求：

```nginx
    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
		        rewrite ^(.*)$ https://$host$1;
        root         /usr/share/nginx/html;
      
        location / {
          alias /home/www/website/ts/;
          index index.html;
        }
    }
```

### 2.5 开启端口

阿里云服务器，默认没有开启 HTTPS 监听的 443 端口，所以我们需要 [ESC管理控制台](https://ecs.console.aliyun.com/?spm=a2c4g.11186623.0.0.32cc3103FVUJPR) 的「安全组」页面，开放 443 端口：

![vuepress_01-22_11](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_11.74pjvoaydco0.jpg)

### 2.6 验证

现在，我们访问一下证书绑定的域名，这里是 `https://www.aligoogle.net`，如果网页地址栏出现小锁标志，表示证书已经安装成功：

![vuepress_01-22_12](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220122/vuepress_01-22_12.1i3qdi7ewbls.jpg)

---

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。
