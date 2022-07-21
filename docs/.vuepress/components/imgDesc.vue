<template>
  <div class="img-desc">
    <p style="color: #999;" align="center"> {{ num !== undefined ? `图${num}.` : '' }}   {{title}} ▲</p>
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
      type: null
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
