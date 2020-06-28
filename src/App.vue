<template>
  <div id="app">
    <!-- 头部导航 -->
    <m-header></m-header>
    <!-- tab栏 -->
    <tab></tab>
    <!-- 主体 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
</style>
