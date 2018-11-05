import {
  videoMeetingList,
  add,
  userList
} from '../apis/index'
import Vue from 'vue'
export async function getVideoMeetingList (isHistory, page, limit, appkey, accountId) {
  let result = await videoMeetingList(isHistory, page, limit, appkey, accountId)
  for (let item of result) {
    item.isOpen = false
  }
  return result
}

export async function addVideoMeeting (
  title,
  participator,
  type,
  day,
  startTime,
  endTime,
  introduction,
  appkey,
  accountId
) {
  let result = await add(
    title,
    participator,
    type,
    day,
    startTime,
    endTime,
    introduction,
    appkey,
    accountId
  )
  return result
}

export async function getUserList (postUrl, serviceKey, postData) {
  let result = await userList(postUrl, serviceKey, postData)
  return result
}

export function stampToDate (stampstr) {
  if (stampstr && stampstr !== '') {
    let date = new Date(stampstr)
    let Y = date.getFullYear() + '-'
    let M = date.getMonth() + 1
    M = M < 10 ? '0' + M + '-' : M + '-'
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y + M + D
  }
}

export function setVMEnv (apidomain) {
  Vue.prototype.$vmApiDomain = apidomain
}

export function setVMChannelID (channelID) {
  Vue.prototype.$vmchannelid = channelID
}
