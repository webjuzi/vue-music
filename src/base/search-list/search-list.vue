<template>
  <!-- 搜索列表 -->
  <div class="search-list"
       v-show="searches.length">
    <transition-group name="list"
                      tag="ul">
      <li :key="item"
          class="search-item"
          @click="selectItem(item)"
          v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon"
              @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 点击的时候吧数据传出去
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.search-list
  .search-item
    display flex
    align-items center
    height 40px
    overflow hidden
    &.list-enter-active, &.list-leave-active
      transition all 0.1s
    &.list-enter, &.list-leave-to
      height 0
    .text
      margin-left 20px
      font-size 14px
      flex 1
      color #999999
    .icon
      margin-right 20px
      extend-click()
      .icon-delete
        font-size $font-size-small
        color $color-text-d
</style>