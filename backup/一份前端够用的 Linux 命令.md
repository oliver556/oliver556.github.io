---
title: 一份前端够用的 Linux 命令
date: 2022-01-19 14:22
tags:
 - 博客搭建
sidebarDepth: 2
---

## 一. 前言

我在使用 VuePress 搭建博客之后，又实现了 GitHub 和 Gitee Pages 的自动部署，但我最终还是决定自己建站，而在建站的过程中，必不可少会用到 Linux 命令，所以此篇写一份基本够用的 Linux 命令，
会涵盖博客搭建系列文章用到的各种命令，方便查询和学习使用。

## 二. Owner、Group、Others、Root

Linux 系统是一种多用户系统，它将文件访问者身份分为三种：

### 1. 文件所有者（Owner）

当创建一个用户的时候，Linux 会为该用户创建一个主目录，路径为 `/home/<username>`，我们可以使用 `cd ~`，快捷进入主目录。如果你想放一个私密文件，就可以放在自己的主目录里，然后设置只能自己查看。

### 2. 群组（Group）

每个用户都有一个用户组，方便多人操作的时候，为一群人分配权限。当创建用户的时候，会自动创建一个与它同名的用户组。

如果一个用户同时属于多个组，用户需要在用户组之间切换，才能具有其他用户组的权限。

### 3. 其他人（Others）

既不是文件所有者，又不是文件所属群组成员的用户，就是其他人。

### 4. 超级用户（Root）

Root 用户是一类特殊的用户，该用户可以访问所有文件。

## 三. adduser 添加用户 和 passwd 更改密码

```shell
# 添加一个名为 git 的用户
adduser git

# 设置 git 用户的密码
passwd git
```

但是由于创建的用户权限较低，有的时候我们需要为用户提权，此时我们可以这样做：

```shell
# 会打开 sudoers 配置文件
sudo visudo
```

注意同样是编辑 `sudoers` 配置文件，使用这个命令会比使用 `sudo vim /etc/sudoers` 更安全，除了对语法有校验，并且还会在多用户编辑的时候锁住文件。

打开 `sudoers` 配置文件后，哦我们添加这样一行配置：

```shell
# Allow git to run any commands anywhere
git ALL=(ALL:ALL) ALL
```

简单解释下这句话 `git ALL=(ALL:ALL) ALL`：

- git 表示规则应用的用户名
- 第一个 `ALL` 表示规则应用于所有 hosts
- 第二个 `ALL` 表示规则应用于所有 users
- 第三个 `ALL` 表示规则应用于所有 groups
- 第四个 `ALL` 表示规则应用于所有 commands

我们保存退出后，`git` 用户就会获得 root 权限。

## 四. ls 列出文件和目录

1. `ls` 列出文件和目录

```shell
[root@iZ2ze learn-typescript.git]# ls
branches  config  description  HEAD  hooks  index  info  objects  refs
```

2. `ls -la` 由 `-a` 显示所有文件和目录（包括隐藏）和 `-l` 显示详细列表组成：

```shell
[root@iZ2ze learn-typescript.git]# ls -la
总用量 20
drwxrwxr-x  7 git git  132 12月 15 12:33 .
drwx------  3 git git  127 12月 15 14:51 ..
drwxrwxr-x  2 git git    6 12月 15 12:21 branches
-rw-rw-r--  1 git git   66 12月 15 12:21 config
-rw-rw-r--  1 git git   73 12月 15 12:21 description
-rw-rw-r--  1 git git   23 12月 15 12:21 HEAD
drwxrwxr-x  2 git git 4096 12月 15 13:10 hooks
-rw-rw-r--  1 git git  217 12月 15 12:33 index
drwxrwxr-x  2 git git   21 12月 15 12:21 info
drwxrwxr-x 10 git git   90 12月 15 12:33 objects
drwxrwxr-x  4 git git   31 12月 15 12:21 refs
```

每一行都有 7 列，我们以 `branches` 为例讲解每列的含义：

| drwxrwxr-x      | 2                | git   | git   | 6              | 12月 15 12:21 | branches |
|:----------------|:-----------------|:------|:------|:---------------|:--------------|:---------|
| 文件类型和权限信息 | 链接数或者一级目录树 | 所有者 | 所属组 | 文件大小，单位字节 | 最后修改时间    | 文件名    |

重点看第 1 列的内容，以 `drwxrwxr-x` 为例，这里一共 10 位，

- 第 1 位：表示文件类型，其中 `-` 表示普通文件，`d` 表示目录文件。
- 第 2 到第 4 位：表示所有者权限，第 2 位 到 5 位为 `rwx`，表示所有者可读可写可执行。其中
  - `r` 表示读权限
  - `w` 表示写权限
  - `x` 表示可执行权限
  - `-` 表示无权限
- 第 5 到第 7 位：表示组用户权限，这里也是 `rwx`。
- 第 8 到第 10 位：表示其他用户权限，这里是 `r-x`，表示有可读可执行权限，无写入权限。

> 这里再额外补充一点：

像 `root` 用户创建文件夹的默认权限为 `rwxr-xr-x`:

```shell
[root@iZ2ze www]# mkdir test
[root@iZ2ze www]# ls -l

drwxr-xr-x  2 root root  6 12月 17 23:53 test
```

而创建文件的默认权限是 `rw-r--r--`，注意创建文件默认会取消 `x` 权限：

```shell
[root@iZ2ze www]# touch index.html
[root@iZ2ze www]# ls -l

-rw-r--r--  1 root root  0 12月 17 23:54 index.html
```

这就是为什么我们有时候需要在创建文件后，又加上执行权限。

## 五. chown 更改文件属主，也可以同时更改文件属组

chown（change owner）语法：

```shell
# -R：递归更改文件属组
chown [–R] 属主名 文件名
chown [-R] 属主名：属组名 文件名
```

> 例：

- 将 `index.html` 的所有者更改为 `git`：

```shell
[root@iZ2ze www]# chown git index.html
[root@iZ2ze www]# ls -

-rw-r--r-- 1 git  root  0 12月 17 23:54 index.html
```

- 将 `index.html` 的所有者和群组都改为 `git`：

```shell
[root@iZ2ze www]# chown git:git index.html
[root@iZ2ze www]# ls -l

-rw-r--r-- 1 git  git   0 12月 17 23:54 index.html
```

## 六. chmod 更改文件权限

权限除了用 `r` `w` `x` 这种方式表示，也可以用数字表示，属组与字母的对应关系为：

- `r` → 4
- `w` → 2
- `x` → 1

之所以如此对应关系，主要还是为了方便推导，比如我们希望一个文件可读可写，那我们可以方便的设置权限为 6（4 + 2），同样，如果我们知道一个权限为 3，我们也可以推导出权限为可写可执行，因为只有 2 + 1 才可能等于 3。

我们看下 chmod（change mode）的具体语法：

```shell
# -R：递归更改文件属组
chmod [-R] xyz 文件或目录
```

其中 xyz 分别表示 Owner、Group、Others 的权限，如果我们这样设置一个文件的权限：

```shell
chmod 750 index.html
```

我们可以得知，Owner 的权限为 7，为可读可写可执行，Group 的权限为 5，为可读可执行，Others 的权限为 0，表示不可读写不可执行。对应字母为：`rwxr-x---`。

除了这种数字的方式，还有一种使用符号类型改变权限的方式：

在这种方式里，我们将三种身份 `Owner`、`Group`、`Others`，分别简写为 `u（User）`、`g`、`o`，用 `a` 表示所有身份，再使用 `+` `-` `=` 表示加入、去除、设定一个权限，
`r` `w` `x` 则继续表示读，写，执行权限，举个例子：

```shell
chmod u+x,g-x,o-x index.html
```

意思就是 `Owner` 加上执行权限，`Group` 和 `Others` 去除执行权限。

当然我们也可以直接设置权限

```shell
chmod u=rwx,g=rx,o=r index.html
```

此时文件的权限就相当于 `-rwxr-xr--`。

此外，我们还可以省略不缩写 `ugoa` 这类身份内容，直接写：

```shell
chmod +x index.html
```

此时相当于使用了 `a`，会给所有身份添加执行权限。

## 七. su 切换身份

```shell
# 切换为 git 用户
[git@iZ2ze www]$ su git
```

## 八. whoami 显示用户名

```shell
[git@iZ2ze www]$ whoami
root
```

## 九. pwd 显示当前目录

```shell
[git@iZ2ze www]$ pwd
/home/www
```

## 十. cd 切换工作目录

```shell
# 进入 /home/www/
[git@iZ2ze www]$ cd /home/www

# 进入自己的主目录
[git@iZ2ze www]$ cd ~

# 进入当前目录的上上两层
[git@iZ2ze www]$ cd ../../
```

## 十一. mkdir 创建目录

1. `mkdir` 创建目录：

```shell
[git@iZ2ze www]$ mkdir new_folder
```

2. `mkdir -p` 递归创建目录：

```shell
[git@iZ2ze www]$ mkdir -p one/two/three
```

## 十二. touch 创建文件

用于修改文件或者目录的时间属性，当文件不存在，系统会创建空白文件

```shell
[git@iZ2ze www]$ touch new_file
```

## 十三. echo 打印输出

- echo 是 Shell 命令，用于打印输出：

```shell
# 显示转义字符
[git@iZ2ze www]$ echo "\"test content\""
```

- 创建或覆盖文件内容为 "test content"

```shell
[git@iZ2ze www]$ echo "test content" > index.html
```

- 如果是想追加内容，就用 `>>`：

```shell
[git@iZ2ze www]$ echo "test content" > index.html
[git@iZ2ze www]$ cat index.html
test content

[git@iZ2ze www]$ echo "test content" >> index.html
[git@iZ2ze www]$ cat index.html
test content
test content
```

## 十四. cat 连接文件并打印输出

- 查看文件内容：

```shell
[git@iZ2ze www]$ cat ~/.ssh/id_rsa.pub
```

- 清空 index.html 内容：

```shell
[git@iZ2ze www]$ cat /dev/null > index.html
```

- 把 index.html 的内容写入 second.html：

```shell
[git@iZ2ze www]$ cat index.html > second.html
```

- 把 index.html 的内容追加写入 second.html：

```shell
[git@iZ2ze www]$ cat index.html >> second.html
```

- 把 index.html 和 second.html 追加写入 third.html：

```shell
[git@iZ2ze www]$ cat index.html second.html >> third.html
```

## 十五. cp 复制文件或目录

将目录 website/ 下的所有文件复制到新目录 static 下：

```shell
# -r：若给出的源文件是一个目录文件，此时将复制该目录下所有的子目录和文件
[git@iZ2ze www]$ cp -r website/ static
```

## 十六. mv 移动并重命名

- 文件改名：

```shell
[git@iZ2ze www]$ mv index.html index2.html
```

- 隐藏文件：

```shell
# 文件名加上 .
[git@iZ2ze www]$ mv index.html .index.html
```

- 移动文件：

```shell
# 仅仅移动
[git@iZ2ze www]$ mv /home/www/index.html /home/static/

# 移动并重命名
[git@iZ2ze www]$ mv /home/www/index.html /home/static/index2.html
```

- 批量移动：

```shell
[git@iZ2ze www]$ mv /home/www/website/* /home/www/static 
```

## 十七. rm 删除一个文件或者目录

```shell
# 系统会询问
[git@iZ2ze www]$ rm file

# -f 表示直接删除
# -r 表示目录下的所有文件删除

# 删除当前目录下的所有文件及目录
[git@iZ2ze www]$ rm -r *

# 跑路
[git@iZ2ze www]$ rm -rf /*
```

## 十八. vi / vim

Linux 内建 vi 文书编辑器，Vim 是从 vi 发展出来的一个文本编辑器。

基本上 vi / vim 共分为三种模式，分别是**命令模式（Command mode）**，**输入模式（Insert mode）** 和 **底线命令模式（Last line mode）**。
我们边操作边介绍这三种模式：我们执行 `vim index.html`，如果没有该文件，则会创建文件：

```shell
[git@iZ2ze www]$ vim index.html
```

此时界面为：

![vuepress_01-19_04](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_04.4bs8aodmb9i0.jpg)

此时是命令模式，在命令模式下，输入的任何字符都会被视为命令，接下来几个常用的命令：

- `i` → 切换到输入模式
- `x` → 删除当前光标所在处的字符
- `:` → 切换到底线命令模式

我们按下 `i`，便会进入输入模式：

![vuepress_01-19_05](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_05.3s8iann31660.jpg)

输入模式下，左下角有 `-- INSERT -- ` 标志：

此时我们可以进行各种输入，当输入完毕后，按下 ESC 回到命令模式：

![vuepress_01-19_06](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_06.api3kawxp6g.jpg)

此时左下角的 INSERT 已经消失不见了，如果我们要保存退出，我们先输入 `:`，进入底线命令模式：

![vuepress_01-19_07](https://cdn.jsdelivr.net/gh/oliver556/image-hosting@master/20220119/vuepress_01-19_07.152juy9zpug0.jpg)

在底线命令模式中，常见的命令有：

- `w` → 保存文件
- `q` → 退出程序

我们输入 `wq`，表示保存并退出，此时我们就会发现并创建了一个 HTML 文件。

## 十九. ssh 远程连接工具

> 注意: `ssh` 监听是 22 端口。

- 其基本语法为：

```shell
ssh [OPTIONS] [-p PORT] [USER@]HOSTNAME [COMMAND]
```

- 监听端口示例：

```shell
[git@iZ2ze www]$ ssh -p 300 git@8.8.8.8
```

- 打开调试模式：

```shell
# -v 冗祥模式，打印关于运行情况的调试信息
[git@iZ2ze www]$ ssh -v git@8.8.8.8
```

---
如果有错误或者不严谨的地方，请务必给予指正，十分感谢。如果喜欢或者 有所启发，欢迎 star，对作者也是一种鼓励。
