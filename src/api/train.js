import request from '@/utils/request'

export function getTrainName() {
  return request({
    url: '/train/trainName',
    method: 'get'
  })
}
