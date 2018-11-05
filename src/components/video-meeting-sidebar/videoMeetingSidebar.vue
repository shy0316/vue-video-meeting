<template>
  <div class="sidebar-content">
    <div class="sidebar-content-top">
      <div class="sidebar-content-title">{{ $t('videoMeeting.meetingInfo') }}</div>
      <div class="sidebar-content-info">
        {{ info ? info : $t('videoMeeting.noMeetingInfo') }}
      </div>
    </div>
    <div class="sidebar-content-bottom">
      <div class="sidebar-content-title">
        {{ $t('videoMeeting.participants') }} {{ onlineNumber }} / {{ participator.length }}
      </div>
      <div class="participator-lists">
        <div
          v-for="(item,index) of stateParticipator"
          :key="index"
          class="participator-item">
          <span class="onlineState" :class="[ item.online? 'online':'']"/>
          <span class="participator-avatar">
            <img :src="item.head_photo">
          </span>
          <span class="participator-name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      participator: {
        type: Array,
        default () {
          return []
        }
      },
      stateParticipator: {
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
      onlineNumber : {
        type: Number,
        default () {
          return 0
        }
      }
    },
  }
</script>
<style scoped>
.sidebar-content {
  width: 200px;
  background: #171717;
  padding: 10px 10px 20px 10px;
  height: 100%;
}

.sidebar-content-top {
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  margin-bottom: 10px;
}

.sidebar-content-title {
  color: #fff;
  height: 28px;
  opacity: 0.65;
  font-size:14px;
  font-weight:500;
}

.sidebar-content-info {
  height: 72px;
  overflow: hidden auto;
  word-break: break-all;
  color: #fff;
}

.sidebar-content-bottom {
  height: calc( 100% - 119px );
}

.participator-lists {
  overflow:  hidden auto;
  height: calc( 100% - 28px);
}

.participator-item {
  display: flex;
  align-items: center;
  margin: 5px 0px;
}

.onlineState {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  margin-right: 10px;
}

.online {
  background: #19be6b;
}

.participator-avatar {
  border-radius: 50%;
  width: 26px;
  height: 26px;
  margin-right: 10px;
  overflow: hidden;
}

.participator-avatar img {
  width: 100%;
  height: 100%;
}
</style>
