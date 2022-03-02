<template>
  <div class="img-desc">
    <p style="color: #999;" align="center">图{{num}}.   {{title}} ▲</p>
  </div>
</template>

<script>

export default {
  name: 'imgDesc',

  components: {},

  props: {
    title: {
      type: null
    },

    num: {
      type: null,
      default: '0'
    }
  },

  data () {
    return {}
  },

  created () {},

  mounted () {},

  methods: {},

  computed: {},

  watch: {}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
