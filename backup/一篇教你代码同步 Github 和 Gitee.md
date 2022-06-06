---
title: 一篇教你代码同步 Github 和 Gitee
date: 2022-01-18 16:39
tags:
 - 博客搭建
sidebarDepth: 2
---

## 一. 前言

在上篇 [《一篇教你用 VuePress + Github Pages 搭建博客》](一篇教你用%20VuePress%20%2B%20Github%20Pages%20搭建博客.md)，我们成功的用 VuePress 搭建了博客并部署到 GitHub Pages，
但由于 GitHub 的访问问题，我们可以选择把仓库部署到 Gitee 一份，利用 Gitee 的 Pages 服务再生成一份静态网站用于备用。

## 二. Gitee 导入仓库

上篇我们已经在 GitHub 创建了博客仓库，现在我们在 Gitee 绑定 GitHub 账号后，选择仓库导入：

![vuepress_01-18_01](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220118/vuepress_01-18_01.3mcwq5vr0je0.jpg)

仓库建立后，问题也来了，即我们一份本地仓库，如何保证 GitHub 和 Gitee 仓库代码的同步呢？

### 1. 手动同步

在 Gitee 的项目主页，提供了同步的按钮，你只用点一下，即可与 GitHub 同步更新，但是注意这里的同步功能默认是强制同步。

![vuepress_01-18_02](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220118/vuepress_01-18_02.rl80gtqgbls.jpg)

有点麻烦的是，我们需要在推送到 GitHub 后，再到 Gitee 项目主页手动点击一下。

### 2. 推送两个仓库

除此之外，我们也可以在 sh 脚本文件里，直接推送到两个仓库地址上，我们修改一下上篇的脚本：

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build .

# 进入生成的文件夹
cd public

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:oliver556/Blog.git master:gh-pages
git push -f git@gitee.com:oliver556/Blog.git master:gh-pages

cd -
```

当我们执行 `sh deploy.sh` 的时候，就会自动往两个仓库里推送。

### 3. GitHub Actions 自动同步

我们也可以利用 GitHub Actions，写一个工作流，在发现 GitHub 博客仓库的 gh-pages 分支代码更新后，自动同步到当前代码 Gitee 上。

关于 GitHub Actions 的介绍，可以参考阮一峰老师的[《GitHub Actions 入门教程》](http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)。

为了实现 Gitee 和 GitHub 的同步，我们需要借助一个 action，还好业界已经有现成的实现了，这里我采用的是 [Hub Mirror Action](https://github.com/Yikun/hub-mirror-action)，我们可以看到使用的示例代码：

```yaml
steps:
- name: Mirror the Github organization repos to Gitee.
  uses: Yikun/hub-mirror-action@master
  with:
    src: github/kunpengcompute
    dst: gitee/kunpengcompute
    dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
    dst_token: ${{ secrets.GITEE_TOKEN }}
    account_type: org
    # src_account_type: org
    # dst_account_type: org
```

其中，有四个必填项：

- `src`：表示需要被同步的源端账户名，即我们 GitHub 的账户名，因为我的 GitHub ID 是 oliver556，所以这里我应该改成 `github/oliver556`。
- `dst`：表示需要同步到的目的端账户名，即我们 Gitee 的账户名，因为我的 Gitee ID 也是 oliver556，所以这里我应该改成 `gitee/oliver556`。
- `dst_key`：表示用于在目的端上传代码的私钥，然后将其保存在 Secrets 中。

具体的操作步骤如下：

获取私钥：

```shell
cat ~/.ssh/id_rsa
```

复制私钥内容，然后在要同步的 GitHub 仓库中，选择 "Setting" → "Secrets" → "New repository secret"

![vuepress_01-18_03](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220118/vuepress_01-18_03.5eq28zf89wc0.jpg)

填入 Secret 内容，Name 命名为 "GITEE_PRIVATE_KEY"，Value 为复制的内容

![vuepress_01-18_04](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220118/vuepress_01-18_04.3ahvcexstz80.jpg)

然后点击  `Add secret` 即可。

- dst_token 创建仓库的 API tokens，用于自动创建不存在的仓库。这里我们从 Gitee 上获取，具体地址为 [https://gitee.com/profile/per...](https://gitee.com/profile/personal_access_tokens)。
生成并复制 Token，然后同样的步骤，保存在 GitHub 的 Secrets 中，Name 为 "GITEE_TOKEN"

那么我们就可以在仓库建立的根目录下，建立目录 `.github/workflows`，然后创建一个名为 `syncToGitee.yml` 的文件：

```yml
name: syncToGitee
on:
  push:
    branches:
      - gh-pages
jobs:
  repo-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Mirror the Github organization repos to Gitee.
        uses: Yikun/hub-mirror-action@master
        with:
          src: 'github/oliver556'
          dst: 'gitee/oliver556'
          dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
          dst_token:  ${{ secrets.GITEE_TOKEN }}
          static_list: "learn-typescript"
          force_update: true
	debug: true
```

其中，`static_list` 表示单一仓库同步，`force_update` 为 `true` 表示启用 `git push -f` 强制同步，`debug` 为 `true` 表示启用 `debug` 开关，会显示所有执行命令。

当我们把这样的文件提交到 GitHub，GitHub 会自动检测并运行该脚本。但是现在还有几个问题要注意：

1. 因为我们是提交到 GitHub 的 gp-pages 分支上，这个文件和目录需要写在 gp-pages 分支
2. 观察我们的脚本代码，我们就会发信啊，每次我们 `sh deploy.sh` 的时候，都是编译到 dist 目录，然后重新 git init ，最后强制提交。所以我们在项目的根目录建立 `.github/workflows/syncToGitee.yml` 并没有什么用，
一来提交的是 dist 目录里的代码，二是每次还都会清空重新编译生成代码提交。

为此，我们可以在脚本里添加代码，每次编译完后，再拷贝外层的 `.github/workflows/syncToGitee.yml` 到 dist 目录里，再提交到 GitHub 上。

所以我们依然在项目根目录添加目录和文件，此时的文件结构如下：

```tree
.
└─ publish
└─ .github
│  └─ workflows
│		└─ syncToGitee.yml
└─ package.json
└─ deploy.sh
```

脚本文件代码如下：

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build .

# 进入生成的文件夹
cd public

# 拷贝目录和文件
cp -r ../.github ./

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:oliver556/Blog.git master:gh-pages

cd -
```

此时我们再运行 `sh deploy.sh` 代码提交到 GitHub，就可以在仓库的 Actions 中看到运行记录：

![这里有张图]()

执行时间大概一分钟左右，Gitee 的代码就会自动同步。

至此，我们实现了 GitHub 与 Gitee 代码仓库的同步。
