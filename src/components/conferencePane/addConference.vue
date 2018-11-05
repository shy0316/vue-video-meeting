<template>
  <div>
    <Modal
      class="videoModal"
      v-model="videoModal"
      @on-cancel = "handleCancle('form')"
      width="580">
      <p slot="header">
        <span>{{ $t('videoMeeting.createVideoMeeting') }} </span>
      </p>
      <div>
        <Form
          :model="form"
          ref="form"
          :label-width="100"
          :rules="ruleValidate">
          <FormItem :label="$t('videoMeeting.title')" prop="title">
            <i-input v-model="form.title"/>
          </FormItem>
          <FormItem
            :label="$t('videoMeeting.date')"
            class="ivu-form-item-required"
            :class="[dateTip ? 'ivu-form-item-error': '']"
            prop="day">
            <DatePicker
              @on-change="handleDateChange"
              type="date"
              format="yyyy-MM-dd"
              v-model="form.day"/>
            <div class="ivu-form-item-error-tip" v-if="dateTip">{{ $t('videoMeeting.dateTip') }}</div>
          </FormItem>
          <FormItem
            :label="$t('videoMeeting.startTime')"
            class="ivu-form-item-required"
            :class="[startTimeTip ? 'ivu-form-item-error': '']"
            prop="startTime">
            <TimePicker
              @on-change="handleStartTimeChange"
              :value="form.startTime"
              format="HH:mm"/>
            <div class="ivu-form-item-error-tip" v-if="startTimeTip">{{ $t('videoMeeting.startTimeTip') }}</div>
          </FormItem>
          <FormItem
            :label="$t('videoMeeting.endTime')"
            class="ivu-form-item-required"
            prop="endTime"
            :class="[endTimeTip ? 'ivu-form-item-error': '']">
            <TimePicker
              @on-change="handleEndTimeChange"
              :value="form.endTime"
              format="HH:mm"/>
            <div class="ivu-form-item-error-tip" v-if="endTimeTip">{{ $t('videoMeeting.endTimeTip') }}</div>
          </FormItem>
          <FormItem :label="$t('videoMeeting.selectPerson')" class="ivu-form-item-required" prop="participator" :show-message="form.participator.length == 0">
            <Transfer
              ref="transfer"
              class="modal-transfer"
              :render-format="formRender"
              :data="allUser"
              filterable
              :list-style ='transferObj'
              :filter-method="filterUser"
              :target-keys="form.participator"
              :titles ="transferTabs"
              @on-change="handleUserChange"/>
            <div class="ivu-form-item-error-tip" v-if="transferTip">{{ $t('videoMeeting.personTip') }}</div>
          </FormItem>

          <FormItem :label="$t('videoMeeting.introduction')" prop="introduction">
            <i-input
              v-model="form.introduction"
              type="textarea"
              :rows="5"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleCancle">{{ $t('videoMeeting.cancel') }}</Button>
        <Button @click="handleSubmit('form')" type="primary" :loading= "loading">{{ $t('videoMeeting.save') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { Message } from '../../common'
  import store from '../../common/store'
  import { stampToDate, addVideoMeeting, getUserList } from '../../services'
  export default {
    props: {
      show: {
        type: Boolean,
        default () {
          return false
        }
      },
      channel: {
        type: String,
        default () {
          return '999'
        }
      }
    },
    computed: {
      loginInfo () {
        return store.store('loginInfo')
      },
    },
    data (){
      return {
        videoModal: false,
        loading: false,
        transferTabs: [this.$t('videoMeeting.optionalPerson'), this.$t('videoMeeting.currentPerson') ],
        allUser: [],
        form: {
          title: '',
          participator: [],
          type: 2,
          day: '',
          startTime: '',
          endTime: '',
          introduction: '',
        },
        ruleValidate: {
          title: [{ required: true, message: this.$t('videoMeeting.titleTip'), trigger: 'blur' }],
        },
        transferTip: false,
        startTimeTip: false,
        endTimeTip: false,
        dateTip: false,
        transferObj: {
          width: '190px'
        },
      }
    },
    async created () {
      await this.getUserLists()
    },
    watch : {
      show () {
        this.videoModal = this.show
        if(this.show) {
          this.reset()
        }
      }
    },
    methods: {
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
          for (let item of data.items) {
            item.key = item.account_id
          }
          this.allUser = data.items
        } catch (e) {
          Message.error(e.msg)
        }
      },
      formRender (item) {
        return item.name
      },
      filterUser (data, query) {
        return data.name.indexOf(query) > -1
      },
      handleUserChange (newTargetKeys, direction, moveKeys) {
        this.form.participator = newTargetKeys
        this.checkProps()
      },
      checkProps () {
        if (this.form.participator.length == 0) {
          this.transferTip = true
        } else {
          this.transferTip = false
        }

        if (!this.form.startTime) {
          this.startTimeTip = true
        } else {
          this.startTimeTip = false
        }

        if (!this.form.endTime) {
          this.endTimeTip = true
        } else {
          this.endTimeTip = false
        }

        if (!this.form.day) {
          this.dateTip = true
        } else {
          this.dateTip = false
        }

        if (
          !this.transferTip &&
          !this.endTimeTip &&
          !this.dateTip &&
          !this.startTimeTip
        ) {
          return true
        } else {
          return false
        }
      },
      handleStartTimeChange (value) {
        this.form.startTime = value
        if (value) {
          this.startTimeTip = false
        } else {
          this.startTimeTip = true
        }
      },
      handleEndTimeChange (value) {
        this.form.endTime = value
        if (value) {
          this.endTimeTip = false
        } else {
          this.endTimeTip = true
        }
      },
      handleDateChange (value) {
        if (value) {
          this.dateTip = false
        } else {
          this.dateTip = true
        }
        this.$set(this.form, 'day',value)
      },
      handleSubmit (name) {
        let vm = this
        let check = this.checkProps()
        this.$refs[name].validate(valid => {
          if (valid && check) {
            vm.saveVideoMeeting()
          }
        })
      },
      async saveVideoMeeting () {
        let vm = this
        vm.$set(vm,'loading', true)
        let form = vm._.cloneDeep(this.form)
        form.day =  stampToDate(form.day)
        let params = vm._.map(form)
        try {
          let res = await addVideoMeeting(...params,this.loginInfo.appkey,vm.loginInfo.account_id)
          if(res) {
            vm.reset ()
            this.$emit('emitModal',false)
            this.$emit('saveCallback')
          }
        }catch (e) {
          Message.error(vm.$t('videoMeeting.saveFail')+','+e.msg)
          vm.$set(vm, 'loading', false)
        }
      },
      reset () {
        if(this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
        this.form =  {
          title: '',
          participator: [],
          type: 2,
          day: '',
          startTime: '',
          endTime: '',
          introduction: '',
        }
        this.startTimeTip = false
        this.endTimeTip = false
        this.dateTip = false
        this.loading = false
        this.transferTip = false
        this.$refs.transfer.$children[0].query = ''
        this.$refs.transfer.$children[2].query = ''
        this.$refs.transfer.$children[0].toggleSelectAll()
        this.$refs.transfer.$children[2].toggleSelectAll()
      },
      handleCancle () {
        this.$emit('emitModal',false)
      },
    }
  }
</script>
<style scoped>
</style>

