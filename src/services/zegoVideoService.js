import { ZegoClient } from 'webrtc-zego'
export default class zegoVideoService {
  constructor () {
    this.zg = {}
    this._config = {}
  }

  config (option) {
    this.zg = new ZegoClient()
    this._config.appid = 78622116
    this._config.server = 'wss://test2-wsliveroom-api.zego.im:8282/ws'
    this._config.idName = option.idName
    this._config.nickName = option.nickName

    this._config.logLevel = option.logLevel
    this._config.logUrl = option.logUrl
    this._config.audienceCreateRoom = option.audienceCreateRoom

    this.zg.config(this._config)
  }

  login (roomId, role, token, success, error) {
    this.zg.login(roomId, role, token, success, error)
  }

  logout () {
    this.zg.logout()
  }

  // 发送自定义命令
  sendCustomCommand (dstMembers, customContent, success, error) {
    this.zg.sendCustomCommand(dstMembers, customContent, success, error)
  }
  // 获取媒体设备信息
  enumDevices (deviceInfoCallback, errorCallback) {
    this.zg.enumDevices(deviceInfoCallback, errorCallback)
  }
  // 启动预览
  startPreview (localVideo, mediaStreamConstraints, success, error) {
    return this.zg.startPreview(localVideo, mediaStreamConstraints, success, error)
  }
  // 停止预览
  stopPreview (localVideo) {
    this.zg.stopPreview(localVideo)
  }
  // 启用/关闭 摄像头
  enableCamera (localVideo, enable) {
    this.zg.enableCamera(localVideo, enable)
  }
  // 启用/关闭 麦克风
  enableMicrophone (localVideo, enable) {
    this.zg.enableMicrophone(localVideo, enable)
  }
  // 设置本地预览video的音频输出设备
  setLocalAudioOutput (localVideo, audioOutput) {
    this.zg.setLocalAudioOutput(localVideo, audioOutput)
  }
  // 开始推流
  startPublishingStream (streamid, localVideo, extraInfo) {
    this.zg.startPublishingStream(streamid, localVideo, extraInfo)
  }
  // 结束推流
  stopPublishingStream (streamid) {
    this.zg.stopPublishingStream(streamid)
  }
  // 更新流信息
  updateStreamExtraInfo (streamid, extraInfo) {
    this.zg.updateStreamExtraInfo(streamid, extraInfo)
  }
  // 开始播放流
  startPlayingStream (
    streamid,
    remoteVideo,
    audioOutput,
    playOption
  ) {
    return this.zg.startPlayingStream(
      streamid,
      remoteVideo,
      audioOutput,
      playOption
    )
  }
  // 停止播放流
  stopPlayingStream (streamid, audioOutput) {
    this.zg.stopPlayingStream(streamid, audioOutput)
  }
  // 设置拉流音频输出设备
  setPlayAudioOutput (streamid, audioOutput) {
    this.zg.setPlayAudioOutput(streamid, audioOutput)
  }
  // 设置推拉流质量回调间隔
  setQualityMonitorCycle (timeInMS) {
    this.zg.setQualityMonitorCycle(timeInMS)
  }
  // 请求连麦
  requestJoinLive (destIdName, success, error, resultCallback) {
    this.zg.requestJoinLive(destIdName, success, error, resultCallback)
  }
  // 邀请连麦
  inviteJoinLive (destIdName, success, error, resultCallback) {
    this.zg.inviteJoinLive(destIdName, success, error, resultCallback)
  }
  // 响应连麦结果
  respondJoinLive (requestId, respondResult, success, error) {
    this.zg.respondJoinLive(requestId, respondResult, success, error)
  }
  // 结束连麦
  endJoinLive (destIdName, success, error) {
    this.zg.endJoinLive(destIdName, success, error)
  }
  // 发送房间消息
  sendRoomMsg (msgCategory, msgType, msgContent, success, error) {
    this.zg.sendRoomMsg(msgCategory, msgType, msgContent, success, error)
  }
  // 释放流资源
  release () {
    this.zg.release()
  }
  // 设置是否关注房间成员变化
  setUserStateUpdate (update) {
    this.zg.setUserStateUpdate(update)
  }
  // 发送可靠消息
  sendReliableMessage (type, data, success, error) {
    this.zg.sendReliableMessage(type, data, success, error)
  }
  // 向业务服务器转发消息
  sendRelayMessage (type, data, success, error) {
    this.zg.sendRelayMessage(type, data, success, error)
  }
  // 发送大房间的IM消息
  sendBigRoomMessage (
    msgType,
    msgCategory,
    msgContent,
    success,
    error
  ) {
    this.zg.sendBigRoomMessage(msgCategory, msgType, msgContent, success, error)
  }
  // 更新混流信息
  updateMixStream (mixStreamConfig, success, error) {
    this.zg.updateMixStream(mixStreamConfig, success, error)
  }
  // 结束混流
  stopMixStream (mixStreamConfig, success, error) {
    this.zg.stopMixStream(mixStreamConfig, success, error)
  }

  /** 回调接口 */

  // 房间连接断开通知
  setOnDisconnect (fun) {
    this.zg.onDisconnect = fun
  }
  // 被踢下线通知
  setOnKickOut (fun) {
    this.zg.onKickOut = fun
  }
  // 主播信息更新
  setOnGetAnchorInfo (fun) {
    this.zg.onGetAnchorInfo = fun
  }
  // 自定义命令消息通知
  setOnRecvCustomCommand (fun) {
    this.zg.onRecvCustomCommand = fun
  }
  // 流更新通知
  setOnStreamUpdated (fun) {
    this.zg.onStreamUpdated = fun
  }
  // 流状态变更通知
  setOnStreamExtraInfoUpdated (fun) {
    this.zg.onStreamExtraInfoUpdated = fun
  }
  // 房间消息通知
  setOnRecvRoomMsg (fun) {
    this.zg.onRecvRoomMsg = fun
  }
  // 拉流状态变更通知
  setOnPlayStateUpdate (fun) {
    this.zg.onPlayStateUpdate = fun
  }
  // 拉流的首帧画面通知
  setOnVideoSizeChanged (fun) {
    this.zg.onVideoSizeChanged = fun
  }
  // 拉流质量回调
  setOnPlayQualityUpdate (fun) {
    this.zg.onPlayQualityUpdate = fun
  }
  // 推流状态变更通知
  setOnPublishStateUpdate (fun) {
    this.zg.onPublishStateUpdate = fun
  }
  // 推流质量回调
  setOnPublishQualityUpdate (fun) {
    this.zg.onPublishQualityUpdate = fun
  }
  // 房间成员变化回调
  setOnUserStateUpdate (fun) {
    this.zg.onUserStateUpdate = fun
  }
  // 房间所有成员回调
  setOnGetTotalUserList (fun) {
    this.zg.onGetTotalUserList = fun
  }
  // 收到请求连麦信令
  setOnRecvJoinLiveRequest (fun) {
    this.zg.onRecvJoinLiveRequest = fun
  }
  // 收到邀请连麦信令
  setOnRecvInviteJoinLiveRequest (fun) {
    this.zg.onRecvInviteJoinLiveRequest = fun
  }
  // 收到结束连麦信令
  setOnRecvEndJoinLiveCommand (fun) {
    this.zg.onRecvEndJoinLiveCommand = fun
  }
  // 收到房间其他用户发送的可靠消息
  setOnRecvReliableMessage (fun) {
    this.zg.onRecvReliableMessage = fun
  }
  // 收到大房间的IM消息
  setOnRecvBigRoomMessage (fun) {
    this.zg.onRecvBigRoomMessage = fun
  }
  // 更新房间当前在线人数
  setOnUpdateOnlineCount (fun) {
    this.zg.onUpdateOnlineCount = fun
  }
}
