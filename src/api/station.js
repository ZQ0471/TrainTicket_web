import request from '@/utils/request'

export function getStationName() {
  return request({
    url: '/station/stationName',
    method: 'get'
  })
}

export function getStationList(trainNo) {
  return request({
    url: '/station/list',
    method: 'get',
    params: { trainNo }
  })
}

export function searchStation(start_station, end_station) {
  return request({
    url: '/station/search',
    method: 'get',
    params: { start_station, end_station }
  })
}
export function findStation(start_station, end_station) {
  return request({
    url: '/station/find',
    method: 'get',
    params: { start_station, end_station }
  })
}
