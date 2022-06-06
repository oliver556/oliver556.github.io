---
title: VuePress 博客优化之 last updated 最后更新时间如何设置
date: 2022-01-21 22:01
tags:
 - 博客搭建
sidebarDepth: 2
---

## 一. 前言

在 [《一篇教你用 VuePress + Github Pages 搭建博客》](一篇教你用%20VuePress%20%2B%20Github%20Pages%20搭建博客.md)中，我们使用了 VuePress 搭建了一个博客，
但是浏览最终的站点：[ latte and cat](https://www.aligoogle.net)，我们会发现，在每篇文章的底部，并没有像 VuePress 官方文档那样，出现最后更新的时间：

![vuepress_01-21_01](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_01.5rr1obhhywo0.jpg)

这篇我们来探究下如何实现最后更新时间。

## 二. 官方自带

查阅 VuePress 的 [官方文档](https://vuepress.vuejs.org/zh/plugin/official/plugin-last-updated.html#%E4%BD%BF%E7%94%A8)，我们可以知道，VuePress 自带显示最后更新时间的插件，
在默认主题下，无序安装本插件，因为 VuePress 的 core 中已经包含此插件。

你可以在 `config.js` 文件中直接使用：

```js
// .vuepress/config.js
module.exports = {
  themeConfig: {
    lastUpdated: '上次更新', // string | boolean
  }
}
```

注意，`themeConfig.lastUpdated` 默认是关闭的，在给定一个字符串后，它会作为前缀显示（默认值是：Last Updated）。

在这个示例代码中，我们设置 `lastUpdated` 的值为 “上次更新”，最终的效果应该跟上面的 VuePress 官网的截图是一致的。

在这里，也给了一个使用须知：

> 由于 lastUpdated 是基于 git 的, 所以你只能在一个基于 git 的项目中启用它。此外，由于使用的时间戳来自 git commit，因此它将仅在给定页的第一次提交之后显示，并且仅在该页面后续提交更改时更新。

那我们按照文档配置一下试试，结果发现并没有出现所谓的最后更新时间，因为没有内容显示，显得这里的空白也很大：

![vuepress_01-21_02](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_02.61dxo222jic0.jpg)

## 三. 查看插件源码

那这是为什么呢？回顾下我们代码编译和提交的过程，其实我们是在本地写好源码，然后执行构建命令，将构建后的结果 `git init`，然后强制提交到远程仓库。这里从我们的 `deploy.sh` 脚本可以看出：

```shell
npm run build .

cd public

git init
git add -A
git commit -m 'deploy'

git push -f git@115.159.25.132:/home/www/website/ts.git master
```

那应该没有什么问题呀，我们就是作为 git 仓库提交的，也提交了一个 commit，为什么会显示不出来呢？

而且说起来，last updated 最后更新时间是怎么生成的呢？他怎么就根据 git 的提交记录自动生成时间了呢？

为了解决这个问题，也为了满足我们的好奇心，我们不妨去看下 npm 包 `@vuepress/plugin-last-updated` 的 [源码](https://github.com/vuejs/vuepress/blob/master/packages/@vuepress/plugin-last-updated/index.js)，
结果发现它的源码意外的简单：

```js
const path = require('path')
const spawn = require('cross-spawn')

/**
 * @type {import('@vuepress/types').Plugin}
 */
module.exports = (options = {}, context) => ({
  extendPageData ($page) {
    const { transformer, dateOptions } = options
    const timestamp = getGitLastUpdatedTimeStamp($page._filePath)
    const $lang = $page._computed.$lang
    if (timestamp) {
      const lastUpdated = typeof transformer === 'function'
        ? transformer(timestamp, $lang)
        : defaultTransformer(timestamp, $lang, dateOptions)
      $page.lastUpdated = lastUpdated
      $page.lastUpdatedTimestamp = timestamp
    }
  }
})

function defaultTransformer (timestamp, lang, dateOptions) {
  return new Date(timestamp).toLocaleString(lang, dateOptions)
}

function getGitLastUpdatedTimeStamp (filePath) {
  let lastUpdated
  try {
    lastUpdated = parseInt(spawn.sync(
      'git',
      ['log', '-1', '--format=%at', path.basename(filePath)],
      { cwd: path.dirname(filePath) }
    ).stdout.toString('utf-8')) * 1000
  } catch (e) { /* do not handle for now */ }
  return lastUpdated
}
```

通过源码，我们可以发现，之所以能生成时间，其实是通过利用 `git log` 命令获取时间，然后写入 `$page` 全局属性中。

## 四. $page

那 $page 是什么呢，我们查看 [官方文档 - 全局计算属性](https://vuepress.vuejs.org/zh/guide/global-computed.html#site)章节：

> 在 VuePress 中，内置了一些核心的 [计算属性](https://cn.vuejs.org/v2/guide/computed.html#计算属性)，以供默认主题或自定义主题使用。

对于每隔页面，都会有一个 `$page` 计算属性，官方还给了一个 `$page` 的示例：

```json
{
  "title": "Global Computed",
  "frontmatter": {
    "sidebar": "auto"
  },
  "regularPath": "/zh/miscellaneous/global-computed.html",
  "key": "v-bc9a3e3f9692d",
  "path": "/zh/miscellaneous/global-computed.html",
  "headers": [
    {
      "level": 2,
      "title": "$site",
      "slug": "site"
    },
    {
      "level": 2,
      "title": "$page",
      "slug": "page"
    },
    "..."
  ]
}
```

我们由此可以想到，VuePress 其实针对每个页面都生成了一个 `$page` 计算属性，然后在多个地方展示计算属性的值，那突破口就来了，如果我们像源码那样，直接向 `$page` 写入一个 `lastUpdated` 属性呢？

## 五. Markdown 中使用 Vue

我们每个页面都是根据 markdown 文件生成的，我们怎么在一个 markdown 文件中向 `$page` 写入一个 `lastUpdated` 属性呢，还好在 VuePress 中，markdown 是可以直接使用 Vue 语法的，这里使用

`vuepress-theme-reco` 主题的示例代码作为讲解：

```vue
// 在 markdown 文案中直接写

<p class="demo" :class="$style.example"></p>

<style module>
.example {
  color: #41b883;
}
</style>

<script>
export default {
  props: ['slot-key'],
  mounted () {
    document.querySelector(`.${this.$style.example}`)
      .textContent = '这个块是被内联的脚本渲染的，样式也采用了内联样式。'
  }
}
</script>
```

在页面的展示效果如下：

![vuepress_01-21_03](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_03.2oufgt3sfhe0.jpg)

那么我们直接在 Markdown 中直接写入如下的 Vue 代码：

```vue
<script>
export default {
  mounted () {
    this.$page.lastUpdated = "2022/1/6 下午6:09:09";
  }
}
</script>
```

我们本地运行代码，然后查看页面，就会发现真的成功写入了最后更新时间：

![vuepress_01-21_04](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_04.5mqnrzo7bn00.jpg)

## 六. Vue 组件

但是这样每篇都插入一段 Vue 代码，很麻烦呀，我可以勉强接受手动更新一下时间，但我不能接受每次那么多篇都要手动改一下呀，即便用批量替换也有点麻烦，就没有更优化的方式吗？

那我们可以将这段 Vue 代码抽离成一个 Vue 组件，将具体的时间封装在组件中，然后每个 md 文件引入这个组件即可，而 VuePress 也是可以支持引入组件的。查看下 [官方文档](https://vuepress.vuejs.org/zh/guide/using-vue.html#escaping) ：

> 所有在 .vuepress/components 中找到的 *.vue 文件将会自动地被注册为全局的异步组件，如：

```tree
.
└─ .vuepress
   └─ components
      ├─ demo-1.vue
      ├─ OtherComponent.vue
      └─ Foo
         └─ Bar.vue
```

> 你可以直接使用这些组件在任意的 Markdown 文件中（组件名是通过文件名取到的）：

```markdown
<demo-1/>
<OtherComponent/>
<Foo-Bar/>
```

那我们就在 `.vuepress` 文件夹下新建一个 `components` 文件夹，然后创建一个 `LastUpdated.md` 文件，代码为：

```vue
<template>
</template>

<script>
export default {
  props: ['slot-key'],
  mounted () {
      this.$page.lastUpdated = "2022/1/6 下午2:00:00";
  }
};
</script>
```

然后我们在具体要使用这个时间的 md 文件里写入：

```markdown
<LastUpdated />
```

自然也是成功的写入了时间：

![vuepress_01-21_05](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_05.6rzlgl8gqio0.jpg)

这样我们每次修改 LastUpdated 组件里的时间，所有引入该组件的地方时间都会改变

## 七. Markdown

这个问题看似是通过曲线救国的方式解决了，就是每次都需要手动更新一次，而且所有引用的地方都会更新，如果要实现某个地方局部更新，还要自己写入时间，其实还是有点麻烦的。

让我们再回顾下官方文档里的介绍：

> 由于 lastUpdated 是基于 git 的, 所以你只能在一个基于 git 的项目中启用它。此外，由于使用的时间戳来自 git commit，因此它将仅在给定页的第一次提交之后显示，并且仅在该页面后续提交更改时更新。

还有官方文档里的 [这句](https://vuepress.vuejs.org/zh/theme/writing-a-theme.html#网站和页面的元数据) ：

> lastUpdated 是这个文件最后一次 git 提交的 UNIX 时间戳

那这句里的「这个文件」到底是指哪个文件呢？回想下我们的提交方式，我们每次只提交了编译后的文件，编译的文件为 HTML 文件，虽然它是以 git 仓库的形式提交的，但在它编译完后就应该已经是静态的了，
不可能是在运行 HTML 文件的时候再通过 git 仓库获取最后提交时间的吧，所以这个文件不应该是指编译后的文件，那排除掉编译后的文件，其实我们就可以想到，这里的文件指的其实应该是你编写的 markdown 文件。
在你执行编译命令的时候，从 git log 中获取时间，写入编译后的代码中。

这也可以解释为什么我们按照官方文档配置后，没有显示时间，因为我们的源码确实不是 git 仓库，我们只是把编译后的代码生成了一个代码仓库提交上去，那自然是获取不到时间。

所以我们进入源码的根目录，然后执行 `git init`，要注意，如果要生成最后更新时间，需要：

1. 仓库 git init
2. 文件至少 commit 一次

但当我们 `git add` 的时候，可能会报错，会提示你已经添加了另外一个 git 仓库在你当前的仓库：

> You've added another git repository inside your current repository.

这是因为我们编译生成的 dist 目录也是一个 git 仓库，但其实解决方式很简单，我们直接用一个 `.gitignore` 文件将 `dist` 目录忽略掉不就好了，这是 `.gitignore` 文件写入的内容：

```
node_modules
dist
```

我们 commit 后再运行代码，就会看到每篇文章都会出现最后更新时间：

![vuepress_01-21_06](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_06.2hoqz52rbcw0.jpg)

## 八. Last updated

如果你想更改时间前面的 `Last Updated:` 这段字符，你可以在 `config.js` 写入：

```js
module.exports = {
  themeConfig: {
    lastUpdated: '上次更新'
  }
}
````

展示的效果就会变为：

![vuepress_01-21_07](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_07.13kown23lcgw.jpg)

## 九. 更改格式

如果你想更改时间展示的格式，参照 [@vuepress/plugin-last-updated 的官方文档](https://vuepress.vuejs.org/zh/plugin/official/plugin-last-updated.html)

```js
const moment = require('moment');

module.exports = {
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          moment.locale(lang)
          return moment(timestamp).fromNow()
        }
      }
    ]
  ]
}
```

![vuepress_01-21_08](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220121/vuepress_01-21_08.5m5l7l8u2go0.jpg)

至此，虽然绕了一圈，但还是简单的解决了这个问题。

---

如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。
