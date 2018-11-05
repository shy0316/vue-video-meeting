<template>
  <div class="meeting-inleft-content" :class="[isShowSidebar? 'hasbar': '']">
    <div class="meeting-inleft-content-top">
      <div class="video-meeting-container">
        <div 
          class="video-lists" 
          :class="videoClass">
          <div 
            class="video-item" 
            :class="[participator.length <5 ? 'video-item-2col': 'video-item-3col']">
            <video id="previewVideo" muted autoplay playsinline/>
            <div class="video-name">{{ $t('videoMeeting.oneself') }}</div>  
          </div>
          <div 
            class="video-item other-video"
            :class="[participator.length <5 ? 'video-item-2col': 'video-item-3col']"
            v-for="item of useLocalStreamList" 
            :key="item.stream_id">
            <video
              autoplay
              playsinline/>
            <div class="video-name">{{ item.anchor_nick_name }}</div>  
          </div>
          <div 
            class="video-item"
            :class="[participator.length <5 ? 'video-item-2col': 'video-item-3col']"
            v-for="(item,index) in layoutNumber" 
            :key="index"/>
        </div>
        <div 
          class="sidebar-icon-area"  
          @click="handleSideBarChange">
          <div class="sidebar-icon">
            <img
              class="window-btn"
              :src="isShowSidebar ? rightIcon: leftIcon">
          </div>
        </div>
      </div>
    </div>
    <div class="video-meeting-footer flex-container">
      <div
        @click="controlCamera"
        class="btn-icon-arae">
        <img
          class="video-btn"
          :src="isNeedCamera ? cameraOnIcon: cameraOffIcon ">
      </div>
      <div
        @click="controlMicrophone"
        class="btn-icon-arae">
        <img
          class="video-btn"
          :src="isNeedMicrophone ? microphoneOnIcon: microphoneOffIcon ">
      </div>
      <div
        @click="controlVolumn"
        class="btn-icon-arae">
        <img
          style="width: 23px;"
          class="video-btn"
          :src="isNeedLocalVolumn ? voiceOnIcon: voiceOffIcon ">
      </div>
    </div>
  </div>
</template>
<script>
  import {
    TOPBAR_CLOSE,
    TOPBAR_MIN,
    TOPBAR_NORMAL_MAX,
  } from '../../const'
  export default {
    props: {
      participator: {
        type: Array,
        default () {
          return []
        }
      },
      useLocalStreamList: {
        type: Array,
        default () {
          return []
        }
      },
      isShowSidebar: {
        type: Boolean,
        default () {
          return false
        }
      },
      show: {
        type: Boolean,
        default () {
          return false
        }
      },
      ILiveClient: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        cameraOnIcon: require('../../assets/camera-on.svg'),
        cameraOffIcon: require('../../assets/camera-off.svg'),
        microphoneOnIcon: require('../../assets/microphone-on.svg'),
        microphoneOffIcon: require('../../assets/microphone-off.svg'),
        voiceOnIcon: require('../../assets/voice-on.svg'),
        voiceOffIcon: require('../../assets/voice-off.svg'),
        leftIcon: require('../../assets/arrow-left.svg'),
        rightIcon: require('../../assets/arrow-right.svg'),
        isNeedLocalVolumn: true,
        isNeedCamera: true,
        isNeedMicrophone: true
      }
    },
    computed: {
      videoClass () {
        return {
          'video-scroll': this.participator.length != 2,
          'video-lists-height': this.participator.length >6 || this.participator.length <2
        }
      },
      layoutNumber () {
        if( (this.participator.length-1) - this.useLocalStreamList.length >= 0) {
          return (this.participator.length-1) - this.useLocalStreamList.length
        }
      }
    },
    mounted () {
      this.previewVideo = document.getElementById('previewVideo')
    },
    watch: {
      show () {
        if(!this.show) {
          this.isNeedCamera = true
          this.isNeedMicrophone = true
          this.isNeedLocalVolumn = true
        }
      },
      isNeedLocalVolumn () {
        let videos = document.getElementsByTagName('video')
        if(this.isNeedLocalVolumn) {
          for(let item of videos) {
            item.muted = false
          }
        }else {
          for(let item of videos) {
            item.muted = true
          }
        }
      }
    },
    methods: {
      controlCamera () {
        this.isNeedCamera = !this.isNeedCamera
        this.ILiveClient.enableCamera(this.previewVideo, this.isNeedCamera)
      },
      controlMicrophone () {
        this.isNeedMicrophone = !this.isNeedMicrophone
        this.ILiveClient.enableMicrophone(this.previewVideo, this.isNeedMicrophone)
      },
      controlVolumn () {
        this.isNeedLocalVolumn = !this.isNeedLocalVolumn
      },
      handleSideBarChange () {
        this.$emit('on-sidebar-show-change')
      },
    }
  }
</script>
<style scoped>
.meeting-inleft-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
}

.hasbar {
  width: calc(100% - 200px);
}

.meeting-inleft-content-top {
  display: flex;
  height: calc( 100% - 50px );
  justify-content: center;
}

.video-meeting-container {
  overflow: hidden;
  padding: 10px;
  height: 100%;
  align-items: center;
  justify-content:center;
  display: flex;
}

.video-lists {
  display: flex;
  flex-wrap: wrap;
  /* flex布局： 外居中 + 里wrap+固定显示个数时的滚动条贴边显示 */
  padding-left: calc((100% - (100vh - 210px)) / 2);
  padding-right: calc((100% - (100vh - 210px)) / 2);
}

.video-scroll {
  overflow: hidden auto; 
}

.video-lists-height {
  height: 100%;
}

.video-item {
  box-sizing: border-box;
  background: rgba(220, 220, 220, 0.2);
  margin: 5px;
  border: 1px dashed rgba(220,220,220,0.2);
}

.video-item-2col {
  height: calc((100vh - 240px) / 2);
  width: calc((100vh - 240px) / 2);
}

.video-item-3col {
  height:  calc((100vh - 250px) / 3);
  width: calc((100vh - 250px) / 3);
}

video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.video-name {
  z-index: 999;
  color: #fff;
  background: #424249;
  opacity: 0.65;
  padding: 2px 5px;
  position: relative;
  top: -27px;
  display: inline-block;
}

.sidebar-icon-area {
  width: 20px;
  height: calc(100% - 50px);
  position: absolute;
  right: 0px;
}

.sidebar-icon {
  width: 20px;
  height: 29px;
  background: #171717;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.window-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.video-meeting-footer {
  height: 50px;
  width: 100%;
  background: #1c1c1c;
}

.flex-container {
  display: flex;
  align-items: center;
}

.btn-icon-arae {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 0 10px;
}

.video-btn {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

</style>
