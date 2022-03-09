#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:oliver556/Jamison-blog.git master:gh-pages

# 如果发布到 gitee
#git push -f git@gitee.com:oliver556/Jamison-blog.git master:gh-pages

# 如果发布到 个人服务器
git push -f git@115.159.25.132:/home/www/website/blog.git master

cd - # 退回开始所在目录
rm -rf docs/.vuepress/dist
