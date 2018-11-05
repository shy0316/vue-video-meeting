# vue-video-meeting

> A video meetinng project based on Vue.js

## Installation
----
``` bash
npm install vue-video-meeting


```

## Import
-------

``` bash
import 'vue-video-meeting/dist/vue-video-meeting.min.css'

import VideoMeeting  from 'vue-video-meeting'

Vue.use(VideoMeeting)

```

## Usage
 ---------
#### props
| 名称 | 类型 | 默认 | 说明 |
| :---:|:---:| :---:|:---:|
|appkey|String| '' |项目的appkey|
|token|String| ''|项目的token|
|display| Boolean | '' | 需要传值pane显示状态|
|user-info|  Obeject | {accountId:'',nickName:''} | 当前用户信息|

#### event
| 名称 |  说明 | 返回值
| :---:|:---:|:---:|
|on-pane-show-change| 返回某个pane的显示隐藏值,格式为对象{name:'',value:}| val.name有3个值：    1、"meetingListBarPane" 侧边栏会议列表pane 2、"videoMeetingModal" 进入会议视频pane  3、 "addVideoModal"  创建视频会议pane|
|on-meeting-number-change|当前会议数量的回调| * val 当前用户所在会议数量|

## demo
---------
``` bash
app.vue
 <VideoMeetingPane
    ref="video"
    :appkey="oneitfarmAppkey"
    :token="oneitfarmToken"
    :user-info="curUserInfo"
    :display="videoPaneShow"
    @on-pane-show-change="emitChangePaneShow"
    @on-meeting-number-change="emitMeetingNumberCoun/>

    mounted () {
      //视频会议面板随窗口大小自适应
      window.onresize = function () {
        if(vm.$refs.video) {
          vm.$refs.video.handleWindowResize()
        }
      }
    }

    created () {
      this.$vmconfigure.setVMEnv(env.MEETING_URL) //设置视频会议后台地址
      this.$vmconfigure.setVMChannelID(Global.channel) //设置机构channel
    }

```
## 更新日志
--------
@1.1.1 
* README更新

@1.1.2
* 整体服务化

@1.1.3
* 组件名修改

@1.1.4
* 插件注册方式修改

@1.1.5 ~ 1.2.0
* 代码bug修改
* 后端api逻辑修改
* token修改 代码优化
* 改统一后台接口 代码调整修改

@1.2.1 ~ 1.2.9 
* 视频纯服务化

@1.3.2 ~ 1.3.9
* 打包js分离
* 3~6人视频会议时的格局bug
* 会议列表pane显示隐藏外部处理 
* 美化滚动条样式
* 滚动条改auto
* 提示bug
