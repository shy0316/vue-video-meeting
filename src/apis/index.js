import { Api } from '../common/index'

export function videoMeetingList (isHistory, page, limit, appkey, accountId) {
  return Api.call('admin.video.videoMeetingList', {
    isHistory,
    page,
    limit,
    appkey,
    accountId
  })
}

export function add (
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
  return Api.call('admin.video.addVideoMeeting', {
    title,
    participator,
    type,
    day,
    startTime,
    endTime,
    introduction,
    appkey,
    accountId
  })
}

export function userList (postUrl, serviceKey, postData) {
  return Api.call('admin.video.proxy', {
    postUrl,
    serviceKey,
    postData
  })
}
