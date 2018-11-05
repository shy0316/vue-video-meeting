<template>
  <div
    class="video-list-container"
    @mouseenter="normalState = false"
    @mouseleave="normalState = true">
    <div class="video-list-item">
      <div class="item-header">
        <div
          class="item-type"
          :class="currentClass">
          <span> [ {{ content.day }} {{ content.startTime }} - {{ content.endTime }} ] </span>
        </div>
        <div v-if="type == 'current'">
          <button
            class="time-btn"
            :class="currentClass"
            size="small" 
            v-if="!normalState || open == true" 
            @click="goToVideo">{{ $t('videoMeeting.goToMeeting') }}</button>
        </div>
      </div>
      <div class="content-info" @click="openDetail" v-if="open == false">
        <Icon type="chevron-right"/>
        <span
          class="video-content-txt"
          :class="[ type == 'current' ? 'dark-3c': 'dark-2c']">{{ content.title }}</span>
      </div>
      <div class="content-open-info" v-else @click="openDetail">
        <div>
          <Icon type="chevron-down"/>
        </div>
        <div class="content-detail" :class="[ type == 'current' ? 'dark-3c': 'dark-2c']">
          <div>{{ content.title }}</div>
          <div :class="currentClass" v-if="content.type == '2'">{{ $t('videoMeeting.meetingTime') }}</div>
          <div v-if="content.type == '2'">{{ content.day }} {{ content.startTime }} - {{ content.endTime }}</div>
          <div :class="currentClass">{{ $t('videoMeeting.compere') }}</div>
          <div>{{ content.masterName }}</div>
          <div :class="currentClass">{{ $t('videoMeeting.conventioneer') }}</div>
          <div>{{ participator.toString() }}</div>
          <div :class="currentClass">{{ $t('videoMeeting.introduction') }}</div>
          <div>{{ content.introduction ? content.introduction : $t('videoMeeting.noIntroduction') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      content: {
        type: Object,
        default () {
          return {}
        }
      },
      ind: {
        type: Number,
        default () {
          return 999
        }
      },
      type: {
        type: String,
        default () {
          return 'current'
        }
      },
      open: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        normalState: true
      }
    },
    computed : {
      participator () {
        return this._.map(this.content.participator,'name')
      },
      currentClass () {
        if (this.type == 'current') {
          return  'dark-2c'
        }
        return 'dark-1c'
      }
    },
    methods: {
      async goToVideo () {
        this.$emit('goToConference', this.ind)
      },
      openDetail () {
        this.$emit('changeOpenState', this.ind)
      }
    }
  }
</script>
<style scoped>
.video-list-container {
  display: flex;
  flex-direction: column;
}

.video-list-container:hover {
  background: #ebf7ff;
}

.video-list-item {
  padding: 10px 5px;
  border-bottom: 1px solid #e8ebee;
}

.item-header {
  display: flex;
  height: 24px;
  justify-content: space-between;
}

.content-info {
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.content-open-info {
  display: flex;
  cursor: pointer;
  font-size: 12px;
}

.item-type {
  font-size: 12px;
  min-width: 185px
}

.time-btn {
  border: 1px solid #999;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  padding: 1px 7px;
  font-size: 12px;
  margin-top: -5px;
  background: #fff;
}

.time-btn:hover {
  color: #108cee;
  border: 1px solid #108cee;
  margin-top: -3px;
}

.video-content-txt {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 10px;
}

.content-detail {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.dark-3c {
  color: rgba(0, 0, 0, .85)
}

.dark-2c {
  color: rgba(0, 0, 0, .65)
}

.dark-1c {
  color: rgba(0, 0, 0, .45)
}
</style>


