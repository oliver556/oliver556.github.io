#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果手运行该脚本，则执行 if 里的，如果是 GitHub 自动执行该脚本，则是 else 里的
if [ -z "$GITHUB_TOKEN" ]; then
 msg='deploy'
 githubUrl=git@github.com:oliver556/oliver556.github.io.git  # 替换自己的 GitHub 仓库地址，SSH格式
else
 msg='来自github actions的自动部署'
 # 替换自己的 GitHub 仓库地址，更改的是 @后面的地址 以及 把Kele-Bingtang 改为自己用户名
 githubUrl=https://oliver556:${GITHUB_TOKEN}@github.com/oliver556.github.io.git
 git config --global user.name "oliver556"   # 修改为自己的 GitHub 用户名
 git config --global user.email "oliver556@163.com"  # 修改为自己的 GitHub 邮箱，注册时绑定的邮箱
fi

git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl master:gh-pages # 推送到github gh-pages分支

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:oliver556/Jamison-blog.git master:gh-pages

# 如果发布到 gitee
#git push -f git@gitee.com:oliver556/Jamison-blog.git master:gh-pages

# 如果发布到 个人服务器
git push -f git@115.159.25.132:/home/www/website/blog.git master

cd - # 退回开始所在目录
rm -rf docs/.vuepress/dist
