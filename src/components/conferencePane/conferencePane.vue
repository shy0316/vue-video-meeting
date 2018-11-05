<template>
  <div class="video-container" id="videoPane">
    <div class="header-container">
      <Tabs :value="videoType" @on-click="handleTabChange">
        <TabPane
          v-for= "tab of tabs"
          :label="tab.label"
          :name="tab.name"
          :key="tab.name">
          <div class="tab-pane">
            <div class="row">
              <Button type="dashed" class="full-btn" @click="handleAddVideoModalShow(true)">
                {{ $t('videoMeeting.createMeeting') }}
              </Button>
              <Button type="dashed" class="full-btn" @click="handleImmediateStartMeeting"> 
                {{ $t('videoMeeting.immediateStart') }}
              </Button>
            </div>
            <div
              class="list-conteiner"
              v-if="mark == 'list'">
              <list-item
                :type="videoType"
                v-for="(item, index) in lists"
                :content="item"
                :ind="index"
                :key="item.id"
                :open="item.isOpen"
                @changeOpenState ="changeOpenState"
                @goToConference="goToConference(item)"/>
            </div>
            <div v-else-if="mark == 'none'" class="list-conteiner no-content">
              <div>{{ $t('videoMeeting.noData') }} </div>
            </div>
            <div v-else-if="mark == 'loading'" class="list-conteiner no-content">
              <div>{{ $t('videoMeeting.loading') }}  </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <div class="icon-container">
        <Icon
          class="header-close"
          type="close-round"
          size="14"
          @click.native="emitCloseMeetingListPane"/>
      </div>
    </div>
    <div ref="addConferenceModal">
      <add-conference
        :show="addVideoModal"
        :channel="channel"
        @emitModal="handleAddVideoModalShow"
        @saveCallback="handleSaveConference"/>
    </div>
    <div v-show="videoMeetingModal">
      <video-meeting
        ref="meeting"
        :draggable="true"
        :id-name="userInfo.accountId"
        :nick-name ="userInfo.nickName"
        :show="videoMeetingModal"
        :title="title"
        :info="info"
        :roomid='roomId'
        :role="userRole"
        :participator="participator"
        @hideVideoMeetingModal="handleHideModal"
        @emitBackMessage="hanldeBackMessage"
        @emitBackConfirm="handleBackConfirm"/>
    </div>
  </div>
</template>
<script>
  import { Message } from '../../common'
  import store from '../../common/store'
  import { getUserList, getVideoMeetingList} from '../../services/index.js'
  import listItem from './listItem'
  import addConference from './addConference'
  import videoMeeting from '../videoMeeting/videoMeeting'
  import { MEETING_SETINTERVAL_TIME } from '../../const/index.js'
  export default {
    name:'VideoMeetingPane',
    components: { listItem, videoMeeting, addConference},
    data () {
      return {
        channel:'999',
        mark: 'loading',
        tabs: [
          { name: 'current', label: this.$t('videoMeeting.currentMeeting'),},
          { name: 'history', label: this.$t('videoMeeting.historyMeeting'),}
        ],
        videoType: '',
        lists: [],
        currentData:[],
        historyData:[],
        addVideoModal: false,
        videoMeetingModal: false,
        participator: [],
        userRole: 1,
        roomId: '',
        title: '',
        info: '',
        immediateParticipator: [],
        interval: {}
      }
    },
    props: {
      display: {
        type: Boolean,
        default: false
      },
      userInfo: {
        type: Object,
        default () {
          return {}
        }
      },
      appkey: {
        type: String,
        default: ''
      },
      token: { // 中台账户登录token
        type: String,
        default: ''
      },
    },
    async created () {
      let vm = this
      vm.channel = vm.$vmchannelid
      await vm.init()
      vm.videoType = 'current'
      await this.initLists()
      vm.interval = setInterval(async function () {
        if(vm.videoType == 'current') {
          let data = await getVideoMeetingList(0, 1, 1000, vm.loginInfo.appkey,vm.userInfo.accountId)
          let isEqual = vm._.isEqual(vm.currentData,data)
          if(!isEqual){
            vm.$set(vm, 'currentData',data)
            vm.$set(vm, 'lists',vm._.cloneDeep(vm.currentData))
            vm.$emit('on-meeting-number-change',vm.currentData.length)
          }
        }
      }, MEETING_SETINTERVAL_TIME)
    },
    beforeDestory: function () {
      const vm = this
      clearInterval(vm.interval)
    },
    computed: {
      loginInfo () {
        return store.store('loginInfo')
      },
    },
    methods: {
      handleWindowResize () {
        if(this.$refs.meeting && this.videoMeetingModal) {
          this.$refs.meeting.handleWindowResize()
        }
      },
      async init () {
        let vm = this
        if (this.appkey && this.appkey !== '' && this.token && this.token !== '') {
        store.store('loginInfo', {
          appkey: vm.appkey,
          token: vm.token,
          account_id: vm.userInfo.accountId
        })
      }
      },
      async getUserLists () {
         let vm = this
        let postUrl = 'main.php/json/user_info/getAll'
        let serviceKey = 'sihpkp4z3rg7wvsozr5lkta9nxxiocqj'
        let postData = {
          appkey: vm.loginInfo.appkey,
          channel: vm.$vmchannelid
        }
        try {
          let data = await getUserList(postUrl, serviceKey, postData)
          this.immediateParticipator = data.items
        } catch (e) {
          Message.error(e.msg)
        }
      },
      async intoImediateMeeting () {
        this.$set(this, 'roomId', this.channel )
        this.$set(this, 'title', '立即开始的会议')
        this.$set(this, 'info', '暂无会议内容')
        this.$set(this, 'participator',this.immediateParticipator )
        this.$set(this, 'videoMeetingModal', true)
      },
      async handleImmediateStartMeeting () {
        let vm = this
        await vm.getUserLists()
        if(this.videoMeetingModal) {
          this.$Modal.confirm({
            title:vm.$t('videoMeeting.meeting'),
            content:vm.$t('videoMeeting.quitMeetingConfirm'),
            onOk: async () => {
              vm.$set(vm, 'videoMeetingModal', false)
              vm.$nextTick(function () {
                vm.intoImediateMeeting ()
              })
            },
          })
        }else {
          this.$Modal.confirm({
            title:vm.$t('videoMeeting.meeting'),
            content: vm.$t('videoMeeting.intoMeetingConfirm'),
            onOk: async () => {
              vm.$nextTick(function () {
                vm.intoImediateMeeting ()
              })
            },
          })
        }
      },
      hanldeBackMessage (val,type) {
        Message[type](val)
      },
      handleBackConfirm () {
        let vm = this
        this.$Modal.confirm({
          title:vm.$t('videoMeeting.meeting'),
          content:vm.$t('videoMeeting.quitNowMeetingConfirm'),
          onOk: async () => {
            this.$set(this, 'videoMeetingModal', false)
          },
        })
      },
      handleSaveConference () {
        this.handleTabChange('current')
      },
      handleAddVideoModalShow (val) {
        this.$set(this,'addVideoModal',val)
      },
      handleHideModal () {
        this.$set(this, 'videoMeetingModal', false)
      },
      emitCloseMeetingListPane () {
        this.$emit('on-pane-show-change',{name: 'meetingListBarPane', value: false})
      },
      intoRoom (item) {
        this.$set( this, 'roomId', item.room_id )
        this.$set(this, 'title', item.title)
        this.$set(this,'info', item.introduction)
        if (this.userInfo.accountId ==  item.master_account_id ) {
          this.$set( this, 'userRole', 1)
        }else {
          this.$set( this, 'userRole', 2)
        }
        this.$set(this, 'participator',item.participator )
        this.$set(this, 'videoMeetingModal', true)
      },
      goToConference (item) {
        let vm = this
        if(this.videoMeetingModal) {
          this.$Modal.confirm({
            title:vm.$t('videoMeeting.meeting'),
            content:vm.$t('videoMeeting.quitMeetingConfirm'),
            onOk: async () => {
              vm.$set(vm, 'videoMeetingModal', false)
              vm.$nextTick(function () {
                vm.intoRoom(item)
              })
            },
          })
        }else {
          this.$Modal.confirm({
            title:vm.$t('videoMeeting.meeting'),
            content: vm.$t('videoMeeting.intoMeetingConfirm'),
            onOk: async () => {
              vm.$nextTick(function () {
                vm.intoRoom(item)
              })
            },
          })
        }
      },
      changeOpenState (index) {
        this.$set(this.lists[index], 'isOpen', !this.lists[index].isOpen)
      },
      async handleTabChange (name) {
        this.mark = 'loading'
        this.$set(this, 'videoType', name)
        await this.initLists()
        this.lists = this.videoType == 'current'? this._.cloneDeep(this.currentData) :this._.cloneDeep(this.historyData)
        this.mark = this.lists.length > 0 ? 'list' :'none'
      },
      async initLists () {
        try {
          if(this.videoType == 'current'){
            this.currentData = await getVideoMeetingList(0, 1, 1000, this.loginInfo.appkey, this.userInfo.accountId)
            this.$emit('on-meeting-number-change',this.currentData.length)
          }else{
            let data = await getVideoMeetingList(1, 1, 1000, this.loginInfo.appkey, this.userInfo.accountId)
            this.historyData = this._.filter(data,{'type': '2'})
          }          
        }catch(e) {
          Message.error(e.msg)
          this.mark = 'none'
        }
      }
    },
    watch: {
      token () {
        this.init()
      },
      appkey () {
        this.init()
      },
      display () {
        if (this.display) {
          this.handleSaveConference()
        }
      },
      addVideoModal () {
        let vm = this
        this.$emit('on-pane-show-change',{name: 'addVideoModal',value:vm.addVideoModal})
      },
      videoMeetingModal () {
        let vm = this
        this.$emit('on-pane-show-change',{name: 'videoMeetingModal',value:vm.videoMeetingModal})
      }
    }
  }
</script>
<style scoped>
.video-container {
  width: 320px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #eee;
  box-shadow: 0 2px 3px rgba(25, 35, 60, 0.1);
  overflow-y: auto;
  overflow-x: hidden;
}

.header-container {
  height: 50px;
}

.tab-pane {
  padding: 15px 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.header-btn {
  margin-left: 20px;
}

.list-conteiner {
  display: flex;
  flex-direction: column;
}

.icon-container {
  position: absolute;
  top: 15px;
  left: 290px;
}

.header-close {
  cursor: pointer;
}

.header-close:hover {
  color: #2d8cf0;
}

.full-btn {
  width: 49%;
}

.no-content {
  height: calc(100vh - 320px);
  align-items: center;
  justify-content: center;
}

.no-content a {
  line-height: 24px;
}

.no-content a:hover {
  line-height: 24px;
  color: #2d8cf0;
}

.ivu-modal-content {
  height: 100%;
}

</style>
