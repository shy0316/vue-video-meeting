<template>
  <div
    id="content"
    class="can-draggable-content normal-content"
    :class="{ 'mini-content': isMinize, 'max-content': isMaxize}"
    @mousedown="mousedown">
    <div v-show="!isMinize" class="normal-layout">
      <topbar
        :is-max="isMaxize"
        :title="title"
        @on-window-operation-click="handleWindowOperationClick"/>
      <div class="flex-container meeting-wrap-content">
        <video-meeting-content
          :show="show"
          :i-live-client="ILiveClient"
          :participator="participator"
          :is-show-sidebar="isShowSidebar"
          :use-local-stream-list="useLocalStreamList"
          @on-sidebar-show-change='openSideBar'/>
        <video-meeting-sidebar
          v-if="isShowSidebar"
          :participator="participator"
          :state-participator="stateParticipator"
          :info="info"
          :online-number="onlineNumber"/>
      </div>
    </div>
    <min-meeting-modal 
      v-show="isMinize" 
      @on-window-operation-click="handleWindowOperationClick"/>
  </div>
</template>
<script>
  import minMeetingModal from '../min-meeting-modal/minMeetingModal'
  import topbar from '../topbar/topbar'
  import videoMeetingSidebar from '../video-meeting-sidebar/videoMeetingSidebar'
  import videoMeetingContent from '../video-meeting-content/videoMeetingContent'
  import zegoVideoService from '../../services/ZegoVideoService'
  import {
    TOPBAR_CLOSE,
    TOPBAR_MIN,
    TOPBAR_NORMAL_MAX,
  } from '../../const'
  export default {
    name: 'video-meeting',
    components: { minMeetingModal, topbar, videoMeetingSidebar, videoMeetingContent},
    props: {
      idName: {
        type: String,
        default () {
          return ''
        }
      },
      nickName: {
        type: String,
        default () {
          return ''
        }
      },
      role : {
        type: Number,
        default () {
          return 2
        }
      },
      participator: {
        type: Array,
        default () {
          return []
        }
      },
      info: {
        type: String,
        default () {
          return ''
        }
      },
      title: {
        type: String,
        default () {
          return ''
        }
      },
      roomid: {
        type: String,
        default () {
          return '999'
        }
      },
      show: {
        type: Boolean,
        default () {
          return false
        }
      },
      draggable: {
        type: Boolean,
        default () {
          return false
        }
      },
    },
    data () {
      return {
        videoToken: '',
        option: {
          idName: '',
          nickName: '',
          audienceCreateRoom: true
        },
        useLocalStreamList: [],
        stateParticipator: [],
        previewVideo: '',
        isPreviewed: false,
        stream_id: '',
        isShowSidebar: true,
        isMinize: false,
        isMaxize: false,
        loginMark: false,
        ILiveClient: '',
      }
    },
    mounted () {
      this.previewVideo = document.getElementById('previewVideo')
    },
    created () {
      let vm = this
      this.ILiveClient = new zegoVideoService()
      //防止暴力退出（关闭或者刷新页面）
      window.addEventListener('beforeunload', function (event) {
        if(vm.loginMark) {
          vm.leaveRoom()
        }
      })
    },
    computed: {
      onlineNumber () {
        let own = this.isPreviewed ? 1: 0
        return this.useLocalStreamList.length + own
      },
    },
    watch: {
      isPreviewed () {
        let vm = this
        for(let j=0;j<vm.stateParticipator.length;j++) {
          if (vm.idName === vm.stateParticipator[j].account_id) {
            if(vm.isPreviewed) {
              vm.$set(vm.stateParticipator[j], 'online', true)
            }else {
              vm.$set(vm.stateParticipator[j], 'online', false)
            }
            break
          }
        }
        vm.stateParticipator.sort(vm.compare('online'))
      },
      useLocalStreamList () {
        let vm = this
        for(let j=0;j<this.stateParticipator.length;j++) {
          if (this.idName === this.stateParticipator[j].account_id && vm.isPreviewed) {
            vm.$set(vm.stateParticipator[j], 'online', true)
          }else {
            vm.$set(vm.stateParticipator[j], 'online', false)
          }
          for(let i=0;i<this.useLocalStreamList.length;i++) {
            if(this.useLocalStreamList[i].anchor_id_name === this.stateParticipator[j].account_id) {
              vm.$set(vm.stateParticipator[j], 'online', true)
            }
          }
        }
        if(vm.stateParticipator.length > 0) {
          vm.stateParticipator.sort(vm.compare('online'))
        }
      },
      show () {
        if (!this.isSupports()) {
          this.$emit('emitBackMessage','浏览器不支持webrtc,换一个浏览器试试吧','success')
          this.$emit('hideVideoMeetingModal')
          return
        }
        if(this.show){
          this.changeModalPosition()
          this.resetData ()
          this.ILiveClient.config(this.option)
          if(this.roomid) {
            this.toRoom(this.roomid, this.role)
          }
        }else {
          this.isMaxize = false
          this.isMinize = false
          if(this.loginMark) {
            this.leaveRoom()
          }
        }
      },
    },
    methods: {
      handleWindowResize () {
        let vm = this
        vm.changeModalPosition()
      },
      resetData () {
        this.option.idName = this.idName
        this.option.nickName = this.nickName
        this.stateParticipator = this.participator
        this.previewVideo = document.getElementById('previewVideo')
        this.isPreviewed= false
        this.stream_id= ''
        this.isShowSidebar = true
        this.isMinize = false
        this.isMaxize = false
        this.loginMark = false
      },
      getStyle (el) {
        if(window.getComputedStyle) {
          return window.getComputedStyle(el, null)
        }else{
          return el.currentStyle
        }
      },
      compare (key) {
        return function (x,y) {
          if( x[key] && !y[key]) {
            return -1
          }else if(y[key] && !x[key]) {
            return 1
          }else {
            return 0
          }
        }
      },
      openSideBar () {
        let vm = this
        vm.isShowSidebar = !vm.isShowSidebar
      },
      changeModalPosition () {
        let ele = this.getEleById('content')
        if( this.isMinize) {
          ele.style.left = (document.documentElement.clientWidth - 230) + 'px'
          ele.style.top = (document.documentElement.clientHeight - 50) + 'px'
        }else {
          ele.style.left = '20%'
          ele.style.top =  '50px'
        }
        if(this.isMaxize) {
          ele.style.left = '0px'
          ele.style.top =  '0px'
        }
      },
      getEleById (id) {
        return typeof id === 'string' ? document.getElementById(id) : ''
      },
      getEleByClass (className) {
        return typeof className === 'string' ? document.getElementsByClassName(className): []
      },
      mousedown (event) {
        if(this.draggable) {
          let selectElement = this.getEleById('content')
          selectElement.style.cursor = 'move'
          var distanceX = event.clientX - selectElement.offsetLeft
          var distanceY = event.clientY - selectElement.offsetTop
          document.onmousemove = function (ev) {
            var oevent = ev || window.event
            var iL = oevent.clientX - distanceX
            var iT = oevent.clientY - distanceY
            var maxL = document.documentElement.clientWidth - selectElement.offsetWidth
            var maxT = document.documentElement.clientHeight - selectElement.offsetHeight
            iL <=0 && (iL = 0)
            iT <=0 && (iT = 0)
            iL >=maxL && (iL = maxL)
            iT >= maxT && (iT = maxT)
            selectElement.style.left = iL + 'px'
            selectElement.style.top = iT + 'px'
            return false
          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
            selectElement.style.cursor = 'default'
          }
        }
        return false
      },
      isSupports () {
        var e =
          window.RTCPeerConnection ||
          window.mozRTCPeerConnection ||
          window.webkitRTCPeerConnection
        var t =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.msGetUserMedia ||
          navigator.mozGetUserMedia ||
          (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        var n = window.WebSocket
        return !!e && !!t && !!n
      },
      async getZegoToken () {
        let vm = this
        return vm.axios.post(
          'https://mama-weiketang-wyeth.woaap.com/wyeth/zego/getToken',
          vm.qs.stringify({ idname: vm.ILiveClient._config.idName })
        ).then(response => {
          if (response.data && response.status == '200') {
            vm.$set(vm, 'videoToken',response.data)
          } else {
            vm.videoToken = ''
            vm.$emit('emitBackMessage','获取zego token失败','error')
          }
        })
      },
      async toRoom (roomid, roleType) {
        let vm = this
        await vm.getZegoToken()
        if (vm.videoToken) {
          vm.ILiveClient.login(
            roomid,
            roleType,
            vm.videoToken,
            function (streamList) {
              vm.loginSuccess(streamList)
            },
            function (err) {
              vm.loginMark = false
              vm.$emit('emitBackMessage',err.msg,'error')
            }
          )
        }
      },
      async loginSuccess (streamList) {
        let vm = this
        vm.loginMark = true
        //开始预览本地视频
        this.doPreview()
        vm.$set(vm, 'useLocalStreamList', streamList)
        vm.$nextTick(function () {
          for (var index = 0; index < vm.useLocalStreamList.length; index++) {
            vm.play(
              vm.useLocalStreamList[index].stream_id,
              vm.getEleByClass('other-video')[index].getElementsByTagName('video')[0])
          }
        })
        // 监听sdk回掉
        this.listen()
      },
      play (streamId, video) {
        var result = this.ILiveClient.startPlayingStream(streamId, video)
        if (!result) {
          this.$emit('emitBackMessage','进入会议失败','error')
          video.style = 'display:none'
        }
      },
      listen () {
        let vm = this
        this.ILiveClient.setOnPlayStateUpdate(vm.onPlayOrPublishStateUpdate)
        this.ILiveClient.setOnPublishStateUpdate(vm.onPlayOrPublishStateUpdate)
        this.ILiveClient.setUserStateUpdate(true)
        this.ILiveClient.setOnDisconnect(vm.onDisconnect)
        this.ILiveClient.setOnKickOut(vm.onKickOut)
        this.ILiveClient.setOnStreamUpdated(vm.onStreamUpdated)
        this.ILiveClient.setOnStreamExtraInfoUpdated(vm.onStreamExtraInfoUpdated)
      },
      doPreview () {
        let vm = this
        var avConstraints = {
          audio: true,
          video: true,
          videoQuality: 1,
          horizontal: true,
          externalCapture: false,
          externalMediaStream: null
        }
        //WebRTC可以共用相同设备，所以预览时必须指定开播的streamId
        this.ILiveClient.startPreview(
          vm.previewVideo,
          avConstraints,
          function () {
            vm.$set(vm, 'isPreviewed', true)
            if(vm.show) {
              vm.doPublish(vm.previewVideo)
            }else {
              vm.leaveRoom()
            }
          },
          function (error) {
            vm.$set(vm, 'isPreviewed', false)
            vm.$emit('emitBackMessage','开启设备错误，'+ error,'error')
          }
        )
      },
      doPublish (previewVideo) {
        //推流
        this.ILiveClient.startPublishingStream(
          this.ILiveClient._config.idName,
          previewVideo
        )
      },
      onStreamExtraInfoUpdated :  async function (streamList) {
        console.log('------',streamList)
      },
      onStreamUpdated: async function (type, streamList) {
        let vm = this
        if (type == 0) {
          for (var i = 0; i < streamList.length; i++) {
            vm.$set(vm,'stream_id',streamList[i].stream_id)
            vm.useLocalStreamList.push(streamList[i])
            vm.$nextTick(function () {
              let videos= vm.getEleByClass('video-meeting-container')[0].getElementsByTagName('video')
              let length = videos.length
              vm.play(vm.stream_id,videos[length-1])
            })
            vm.$emit('emitBackMessage',streamList[i].anchor_nick_name + '进入会议','success')
          }
        } else if (type == 1) {
          for (var k = 0; k < vm.useLocalStreamList.length; k++) {
            for (var j = 0; j < streamList.length; j++) {
              if (
                vm.useLocalStreamList[k].stream_id === streamList[j].stream_id
              ) {
                vm.ILiveClient.stopPlayingStream(vm.useLocalStreamList[k].stream_id)
                vm.useLocalStreamList.splice(k, 1)
              }
            }
          }
        }
      },
      leaveRoom () {
        let vm = this
        vm.loginMark = false
        for (var i = 0; i < vm.useLocalStreamList.length; i++) {
          vm.ILiveClient.stopPlayingStream(vm.useLocalStreamList[i].stream_id)
        }
        vm.useLocalStreamList = []
        if(vm.isPreviewed) {
          vm.isPreviewed = false
          vm.ILiveClient.stopPreview(this.previewVideo)
          vm.ILiveClient.stopPublishingStream(vm.ILiveClient._config.idName)
          this.$emit('emitBackMessage','退出会议','success')
        }
        if (vm.ILiveClient) {
          vm.ILiveClient.logout()
        }
      },
      confirmLeave () {
        let vm = this
        this.$emit('emitBackConfirm')
      },
      handleWindowOperationClick (value) {
        if (value == TOPBAR_NORMAL_MAX) {
          this.$set(this,'isMinize',false)
          this.$set(this,'isMaxize',!this.isMaxize)
        }else if (value == TOPBAR_CLOSE) {
          this.confirmLeave()
        }else if (value == TOPBAR_MIN){
          this.$set(this, 'isMinize', true)
          this.$set(this,'isMaxize',false)
        }else {
          this.$set(this,'isMinize',false)
          this.$set(this,'isMaxize',false)
        }
        this.changeModalPosition()
      },
      onPlayOrPublishStateUpdate (type, streamid, error) {
        let vm = this
        if (type == 0) {
          //Message.success('play  success')
        } else if (type == 2) {
          vm.$emit('emitBackMessage','退出再进入一下会议','warn')
        } else {
          var _msg = error.msg
          vm.$emit('emitBackMessage','拉流失败,' + _msg,'error')
        }
      },
      onDisconnect: function (error) {
        this.$emit('emitBackMessage','网络连接已断开,' + JSON.stringify(error),'error')
        this.leaveRoom()
      },
      onKickOut (error) {
        this.$emit('emitBackMessage','被踢下线通知,' + JSON.stringify(error),'error')
      },
    }
  }
</script>
<style scoped>
.can-draggable-content {
  position: fixed;
  z-index: 999;
  overflow: hidden;
  background: #000;
  color: #fff;
}

.normal-content {
  width: 60%;
  height: calc(100% - 100px) ;
  left: 20%;
  top: 50px;
  border-radius: 6px;
  box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow:2px 2px 5px #333333;
  -moz-box-shadow: 2px 2px 5px #333333; 
}

@media screen and (max-width: 1070px) {
  .normal-content {
    width: 80%;
    height: calc(100% - 100px) ;
    left: 10%;
    top: 50px;
    border-radius: 10px;
    box-shadow: 2px 2px 5px #333333;
    -webkit-box-shadow:2px 2px 5px #333333;
    -moz-box-shadow: 2px 2px 5px #333333; 
  }
}

.max-content {
  left: 0px;
  top: 0px;
  right:0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
}

.mini-content {
  width:200px;
  height: 40px;
  left: calc(100% - 230px);
  top: calc(100% - 50px);
  border-radius: 3px;
  -webkit-box-shadow:3px 3px 2px #888888;
  -moz-box-shadow: 3px 3px 2px #888888; 
  box-shadow: 3px 3px 2px #888888;
}

.normal-layout {
  height:100%;
  width: 100%;
}

.minimize-container {
  width: 100%;
  height: 100%;
  padding: 0px 5px 0px 10px;
  font-size: 12px;
}

.meeting-wrap-content {
  height: calc(100% - 50px);
}

.flex-container {
  display: flex;
  align-items: center;
}

</style>
