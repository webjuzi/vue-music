<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box"
           ref="query"
           :placeholder="placeholder"
           v-model="query" />
    <i class="icon-dismiss"
       v-show="query"
       @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌手、歌曲'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  created() {
    // 监听搜索框的内容传递给父元素
    this.$watch(
      'query',
      debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 300)
    )
  },
  methods: {
    // 清除
    clear() {
      this.query = ''
    },
    // 定义一个接口，可以让外部来改变query值
    setQuery(query) {
      this.query = query
    },
    // 联系外部
    blur() {
      this.$refs.query.blur()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.search-box
  display flex
  align-items center
  box-sizing border-box
  width 90%
  margin 0 auto
  padding 0 6px
  height 40px
  background $color-highlight-background
  border-radius 6px
  .icon-search
    font-size 24px
    color $color-background
  .box
    flex 1
    margin 0 5px
    line-height 30px
    background $color-highlight-background
    color $color-text
    font-size $font-size-medium
    &::placeholder
      color $color-text-d
  .icon-dismiss
    font-size 16px
    color #666
</style>