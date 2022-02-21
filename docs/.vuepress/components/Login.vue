<template>
  <div class="login-form">
    <div class="form-header">用户名</div>
    <div>
      <input
        type="text"
        class="form-control"
        placeholder="请输入用户名 ..."
        v-model="username"
      />
    </div>
    <div class="form-header">密码</div>
    <div>
      <input
        type="password"
        class="form-control"
        placeholder="请输入密码 ..."
        v-model="password"
      />
    </div>

    <div class="btn-row">
      <button class="btn" @click="login">登录</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  created() {
    document.onkeyup = (e) => {
      let key = window.event.keyCode;
      if (key == 13) {
        this.login();
      }
    };
  },
  methods: {
    login() {
      let { username, password, expire, loginKey } =
        this.$themeConfig.privatePage;
      if (this.username && this.password) {
        // 某个文章有用户信息，则覆盖全局的信息
        if (this.$route.query.singlePage) {
          this.$filterPosts.forEach((item) => {
            if (item.path == this.$route.query.toPath) {
              username = item.frontmatter.username;
              password = item.frontmatter.password;
              loginKey = item.frontmatter.title;
              expire = item.frontmatter.expire || expire;
              return;
            }
          });
        }
        if (this.username == username && this.password == password) {
          const data = JSON.stringify({
            username: this.username,
            password: this.password,
            time: new Date().getTime(),
            expire: expire,
          });
          window.localStorage.setItem(loginKey, data);
          addTip("登录成功，正在跳转 ...", "success");
          if (this.$route.query.toPath) {
            this.$router.push({
              path: this.$route.query.toPath,
            });
          } else {
            this.$router.push({
              path: "/",
            });
          }
        } else {
          this.password = ""; // 清空密码
          addTip("用户名或者密码错误！请联系博主获取用户名和密码！", "danger");
        }
      } else if (this.username == "" && this.password != "") {
        addTip("用户名不能为空！", "warning");
      } else if (this.username != "" && this.password == "") {
        addTip("密码不能为空！", "warning");
      } else {
        addTip("您访问的文章是私密文章，请先输入用户名和密码！", "info");
      }
    },
  },
};
/**
 * 添加消息提示
 * content：内容
 * type：弹窗类型（tip、success、warning、danger）
 * startHeight：第一个弹窗的高度，默认 50
 * dieTime：弹窗消失时间（毫秒），默认 3000 毫秒
 */
function addTip(content, type, startHeight = 50, dieTime = 3000) {
  var tip = document.querySelectorAll(".private-tip");
  var time = new Date().getTime();
  // 获取最后消息提示元素的高度
  var top = tip.length == 0 ? 0 : tip[tip.length - 1].getAttribute("data-top");
  // 如果产生两个以上的消息提示，则出现在上一个提示的下面，即高度添加，否则默认 50
  var lastTop =
    parseInt(top) +
    (tip.length != 0 ? tip[tip.length - 1].offsetHeight + 17 : startHeight);

  let div = document.createElement("div");
  div.className = `private-tip tip-${type} ${time}`;
  div.style.top = parseInt(top) + "px";
  div.setAttribute("data-top", lastTop);
  if (type == "info" || type == 1) {
    div.innerHTML = `<i class="iconfont icon-info icon"></i><p class="tip-info-content">${content}</p>`;
  } else if (type == "success" || type == 2) {
    div.innerHTML = `<i class="iconfont icon-dagouyouquan icon"></i><p class="tip-success-content">${content}</p>`;
  } else if (type == "danger" || type == 3) {
    div.innerHTML = `<i class="iconfont icon-cuowu icon"></i><p class="tip-danger-content">${content}</p>`;
  } else if (type == "warning" || type == 4) {
    div.innerHTML = `<i class="iconfont icon-gantanhao icon"></i><p class="tip-warning-content">${content}</p>`;
  }
  document.body.appendChild(div);

  let timeTip = document.getElementsByClassName(time)[0];
  setTimeout(() => {
    timeTip.style.top = parseInt(lastTop) + "px";
    timeTip.style.opacity = "1";
  }, 10);

  // 消息提示 dieTime 秒后隐藏并被删除
  setTimeout(() => {
    timeTip.style.top = "0px";
    timeTip.style.opacity = "0";

    // 下面的所有元素回到各自曾经的出发点
    var allTipElement = nextAllTipElement(timeTip);
    for (let i = 0; i < allTipElement.length; i++) {
      var next = allTipElement[i];
      var top =
        parseInt(next.getAttribute("data-top")) - next.offsetHeight - 17;
      next.setAttribute("data-top", top);
      next.style.top = top + "px";
    }
    setTimeout(() => {
      timeTip.remove();
    }, 500);
  }, dieTime);
}
/**
 * 获取后面的兄弟元素
 */
function nextAllTipElement(elem) {
  var r = [];
  var n = elem;
  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== elem) {
      r.push(n);
    }
  }
  return r;
}
</script>

<style lang="stylus">
.login-form {
  padding: 1rem;
  box-sizing: border-box;

  .btn-row {
    margin-top: 1rem;
    text-align: center;
  }

  .btn {
    padding: 0.6rem 2rem;
    outline: none;
    background-color: #60C084;
    color: white;
    border: 0;
    cursor: pointer;
  }

  .form-header {
    color: #13b9e2;
    margin-bottom: 0.5rem;
  }

  .form-control {
    padding: 0.6rem;
    border: 2px solid #ddd;
    width: 100%;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
    outline: none;
    transition: border 0.2s ease;

    &:focus {
      border: 2px solid #aaa;
    }
  }
}

div.v-dialog-overlay {
  opacity: 1 !important;
}

.private-tip {
  position: fixed;
  display: flex;
  top: -10px;
  left: 50%;
  opacity: 0;
  min-width: 320px;
  transform: translateX(-50%);
  transition: opacity 0.3s linear, top 0.4s, transform 0.4s;
  z-index: 99999;
  padding: 15px 15px 15px 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  grid-row: 1;
  line-height: 17px;
}

.private-tip p {
  line-height: 17px;
  margin: 0;
  font-size: 14px;
}

.icon {
  margin-right: 10px;
  line-height: 17px;
}

.tip-success {
  color: #67c23a;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
}

.tip-success .tip-success-content {
  color: #67c23a;
}

.tip-danger {
  color: #f56c6c;
  background-color: #fef0f0;
  border-color: #fde2e2;
}

.tip-danger .tip-danger-content {
  color: #f56c6c;
}

.tip-info {
  background-color: #edf2fc;
  border-color: #ebeef5;
}

.tip-info .tip-info-content {
  color: #909399;
}

.tip-warning {
  color: #e6a23c;
  background-color: #fdf6ec;
  border-color: #faecd8;
}

.tip-warning .tip-warning-content {
  margin: 0;
  color: #e6a23c;
  line-height: 21px;
  font-size: 14px;
}
</style>