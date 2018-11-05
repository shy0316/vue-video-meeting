<template>
  <div id="app">
    <button @click="videoPaneShow=!videoPaneShow">show pane</button>
    <transition name="vm-transition">
      <div v-show="videoPaneShow">
        <VideoMeetingPane
        class="custom-video"
        ref="video"
        :appkey="oneitfarmAppkey"
        :token="oneitfarmToken"
        :user-info="curUserInfo"
        :display="videoPaneShow"
        @on-pane-show-change="handleChangePaneShow"
        @on-meeting-number-change="handleMeetingNumberCount"/>
      </div>
    </transition>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      /* vg07ympsqc2jow8punz469xmhedabfit */
      oneitfarmAppkey: 'vg07ympsqc2jow8punz469xmhedabfit',
      oneitfarmToken: '6nGhcHBJiz9ebNoQ.zGVdK0fsPZFH4J7O.97fcaffc62127f924e47a9f0538c9a47',
      curUserInfo: {
        accountId: '1cfe21a6c1ee402e8fa9a9d9f083c850',
        nickName: '沈海亚'
      },
      videoPaneShow: false,
    }
  },
  methods: {
    handleChangePaneShow (val) {
      console.log(val)
      /*
        val的name 有3个值 
        “meetingListBarPane” 侧边栏会议列表pane 
        videoMeetingModal 会议视频pane
        addVideoModal  添加视频pane
       */
      if( val.name == "meetingListBarPane") {
        this.videoPaneShow = false
      }
    },
    handleMeetingNumberCount(count) {
      /* 需要统计会议数量的回调 */
    }
  },
  created () {
    let vm = this
    let MEETING_URL = "https://w0f1723faa5fbd56-dev.oneitfarm.com"
    this.$vmconfigure.setVMEnv(MEETING_URL)
    this.$vmconfigure.setVMChannelID('6')
    window.onresize = function () {
      if(vm.$refs.video) {
        vm.$refs.video.handleWindowResize()
      }
    }
  }
}
</script>
<style scoped>
  .custom-video {
    height: calc(100vh - 50px);
    top: 0px;
    position: absolute;
    right:0px;
  }

  .vm-transition-enter-active {
    transition: all 0.5s ease;
  }

  .vm-transition-leave-active {
    transition: all 0.5s ease;
  }

  .vm-transition-enter,
  .vm-transition-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>


