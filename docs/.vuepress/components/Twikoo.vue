<template>
  <div id="tcomment"></div>
</template>
<script>
export default {
  mounted() {
    if (this.$route.path != "/") {
      setTimeout(() => {
        this.twikooInit();
      }, 800);
    }
  },
  watch: {
    $route(to, from) {
      if (from.path == "/") {
        this.twikooInit();
      } else if (this.$route.path != "/" && this.$route.hash == "") {
        setTimeout(() => {
          this.updateComment();
        }, 800);
      }
    },
  },
  methods: {
    twikooInit() {
      twikoo
        .init({
          envId: "https://twikoo-snowy-rho.vercel.app/",
          el: "#tcomment",
          // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，如果您的环境地域不是上海，需传此参数
          // path: 'window.location.pathname', // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
          // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/dev/src/js/utils/i18n/index.js
          // onCommentLoaded: function () {
          // console.log("评论加载或评论成功");
          // },
        })
        .then(() => {
          let page = document.getElementsByClassName("page")[0];
          let comment = document.getElementById("twikoo");
          page.appendChild(comment);
        });
    },
    updateComment() {
      let tk_icon = document.getElementsByClassName("tk-icon")[0];
      tk_icon ? tk_icon.click() : undefined;
    },
  },
};
</script>

<style>
.twikoo .tk-comments {
  margin-top: 20px;
}
</style>