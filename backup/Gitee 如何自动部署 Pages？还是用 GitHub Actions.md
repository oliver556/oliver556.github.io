---
title: Gitee 如何自动部署 Pages？还是用 GitHub Actions
date: 2022-01-19 13:30
tags:
 - 博客搭建
sidebarDepth: 2
---

## 一. Gitee Pages

在上篇[《一篇教你代码同步 Github 和 Gitee》](一篇教你代码同步%20Github%20和%20Gitee.md)中，我们使用 GitHub Actions 解决了 GitHub 代码自动同步 Gitee 的问题，
但我们的博客仓库代码同步到 Gitee 后，并不能像 GitHub 一样自动部署 Pages，如果不使用付费的 Gitee Pages Pro 服务，那我们该怎么实现 Gitee 自动部署 Pages 呢？

## 二. GitHub Actions

答案是接着使用 GitHub Actions！你可能会想，Gitee 也有 GitHub Actions 服务吗？Gitee 也会像 GitHub 一样检测 `.github/workflows/` 目录下的 YAML 文件，然后执行吗？

这当然是不可能的，Gitee 并不支持 GitHub 的这套方式，但我们为什么一定要借用 Gitee 的能力呢？我们在 GitHub Actions 中，模拟登录 Gitee，点击项目的部署按钮，不也是一种实现方式吗？

## 三. 搜索 Actions

我们接下来去找一些适合的 GitHub Actions，我们可以在 GitHub 的 [官网市场](https://github.com/marketplace?type=actions)，或者 [awesome actions](https://github.com/sdras/awesome-actions)仓库，
再或者直接在 GitHub 搜索比如 `gitee pages actions` 之类的关键词。

![vuepress_01-19_01](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_01.6w55v6szlo40.jpg)

最终，我们决定使用 [Gitee Pages Action](https://github.com/marketplace/actions/gitee-pages-action)，查看一下主页的示例代码：

```yaml
name: Sync

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@master
        env:
          # 注意在 Settings->Secrets 配置 GITEE_RSA_PRIVATE_KEY
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
        with:
          # 注意替换为你的 GitHub 源仓库地址
          source-repo: git@github.com:doocs/leetcode.git
          # 注意替换为你的 Gitee 目标仓库地址
          destination-repo: git@gitee.com:Doocs/leetcode.git

      - name: Build Gitee Pages
        uses: yanglbme/gitee-pages-action@main
        with:
          # 注意替换为你的 Gitee 用户名
          gitee-username: yanglbme
          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
          gitee-repo: doocs/leetcode
          # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
          branch: main
```

我们之前已经实现了 GitHub 代码同步 Gitee，这里我们直接使用后半部分的自动部署 actions，结合上篇的 YAML 文件代码，最终的修改如下：

```yaml
name: syncToGitee
on:
  push:
    branches:
      - gh-pages
jobs:
  repo-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@master
        env:
          # 注意在 Settings->Secrets 配置 GITEE_RSA_PRIVATE_KEY
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
        with:
          # 注意替换为你的 GitHub 源仓库地址
          source-repo: git@github.com:doocs/leetcode.git
          # 注意替换为你的 Gitee 目标仓库地址
          destination-repo: git@gitee.com:Doocs/leetcode.git

      - name: Build Gitee Pages
        uses: yanglbme/gitee-pages-action@main
        with:
          # 注意替换为你的 Gitee 用户名
          gitee-username: oliver556
          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
          gitee-repo: oliver556/Blog
          # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
          branch: main
```

注意不要忘了在仓库的设置里添加 Secrets，输入 Gitee 的登录密码，然后保存名为 `GITEE_PASSWORD`

## 四. YAML 文件语法报错

如果 Actions 运行失败并出现了这种错误：

![vuepress_01-19_02](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_02.2c2b2bdexo9w.jpg)

这是因为你的 YAML 语法写的有问题，可能是哪里没对齐。可以在 [YAML在线格式化](https://verytoolz.com/yaml-formatter.html) 校验下你的 YAML 文件，也可以顺便看一下阮一峰老师的 [YAML 语言教程](https://www.ruanyifeng.com/blog/2016/07/yaml.html)。

## 五. 再次运行

修改了代码之后，我们可以再执行一遍 `sh deploy.sh`，然后在 GitHub 上查看运行情况：

![vuepress_01-19_03](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_03.56sm5hbeezs0.jpg)

当运行成功，我们再查看 Gitee 的地址，就会发现已经部署为最新的版本了。

---

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。
