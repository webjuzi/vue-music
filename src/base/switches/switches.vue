<template>
  <div>
    <ul class="switches">
      <li class="switch-item" v-for="(item, index) in switches" :key="index"
        :class="{'active': currentIndex === index}" @click="switchItem(index)">
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default: () => [
        {name: '最近播放'},
        {name: '搜索历史'}
      ]
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('switch', index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.switches
  display flex
  align-items center
  width 240px
  margin 20px auto
  border 1px solid $color-highlight-background
  border-radius 5px
  .switch-item
    flex 1
    padding 8px
    text-align center
    font-size $font-size-medium
    color $color-text-d
    &.active
      background $color-highlight-background
      color $color-text
</style>