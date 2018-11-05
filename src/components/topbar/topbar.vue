<template>
  <div class="video-meeting-top">
    <div class="video-header-title">{{ title }}</div>
    <div>
      <img
        class="video-meeting-top-btn"
        @click.stop="handleTopbarBtn(topBtns.close)"
        :src="closeIcon">
      <img
        class="video-meeting-top-btn"
        @click.stop="handleTopbarBtn(topBtns.normalAndMax)"
        :src="isMax ? normalIcon: maxIcon">
      <img
        class="video-meeting-top-btn"
        @click.stop="handleTopbarBtn(topBtns.min)"
        :src="minIcon">
    </div>
  </div>    
</template>

<script>
  import {
    TOPBAR_CLOSE,
    TOPBAR_MIN,
    TOPBAR_NORMAL_MAX
  } from '../../const'
  export default {
    props: {
      isMax: {
        type: Boolean,
        default () {
          return false
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      }
    },
    data () {
      const topBtns = {
        close: TOPBAR_CLOSE,
        normalAndMax: TOPBAR_NORMAL_MAX,
        min: TOPBAR_MIN
      }
      return {
        normalIcon: require('../../assets/normal.svg'),
        closeIcon: require('../../assets/close.svg'),
        minIcon: require('../../assets/min.svg'),
        maxIcon: require('../../assets/max.svg'),
        topBtns
      }
    },
    methods: {
      handleTopbarBtn (value) {
        this.$emit('on-window-operation-click',value)
      }
    }
  }
</script>

<style scoped>
.video-meeting-top {
  height: 50px;
  justify-content: space-between;
  background: #1c1c1c;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.video-meeting-top-btn {
  width: 22px;
  height: 22px;
  float: right;
  margin-right: 10px;
  cursor: pointer;
}

.video-header-title {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}
</style>


