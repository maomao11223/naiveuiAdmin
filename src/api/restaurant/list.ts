import { http } from '@/utils/http/axios';

//获取主控台信息
export function getList() {
  // return http.request({
  //   url: '/dashboard/console',
  //   method: 'get',
  // });
  return {
    data: [{ id: 1, name: '50嵐' }],
  };
}
