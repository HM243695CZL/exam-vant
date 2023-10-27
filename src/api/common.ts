import request from '@/utils/request';
import other from '@/utils/other';


export function postAction(url: string, data: any) {
  return request({
    url,
    method: 'post',
    data
  })
}

export function getAction(urlStr: string, data: any) {
  const url = data ? urlStr + '?' + other.getParams(data) : urlStr;
  return request({
    url,
    method: 'get',
  })
}
