<template>
  <div class="my-book-list">
    <div class="book-classification">
      <div class="book-classification-title">
        <span>
          📖 {{ bookData[0].classification }}
        </span>
      </div>
      <div class="book-content">
        <div
          v-for="(item, index) in bookData[0].children"
          :key="index"
          class="book-content__body"
        >

          <div>
            <img
              v-if="item.bookImgUrl && item.bookImgUrl != ''"
              :src="item.bookImgUrl"
              alt="正在加载 ..."
            >

            <p class="book-name">{{ item.bookName }}</p>

            <p class="recent-read">最近阅读：{{ item.lastRead }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: "MyBookList",

  components: {},

  props: {
    bookData: {
      type: Array,
      // default: []
      default: () => {
        [
          {
            'sort': '前端'
          }
        ]
      }
    },
    classification: {
      type: String
    }
  },

  data () {
    return {}
  },

  created () {
  },

  mounted () {
  },

  methods: {},

  computed: {},

  watch: {}
}
</script>

<style scoped>
.book-classification-title {
  text-align: center;
  padding: 20px 20px 40px 20px;
}

.book-classification-title > span {
  background: #039be5;
  color: #fff;
  font-size: 1.5rem;
  padding: 10px;
  border-radius: 20px 0px 20px 0px;
}

.book-content {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
}

.book-content__body {
  width: 120px;
  margin: 0 15px 20px 15px;
  display: inline-block;
  vertical-align: top;
}

.book-name {
  display: block;
  cursor: pointer;
  margin: 12px 0 8px;
  font-size: 13px;
  line-height: 20px;
  color: #383D40;
  font-weight: bold;
}

/* 最近阅读 */
.recent-read {
  color: #8B9B9E;
  line-height: 16px;
  font-size: 12px;
}
</style>
