/**
 * 将对象转为url地址参数
 * @param params
 */
export function getParams(params: any) {
  let str = '';
  if (typeof params !== 'object') {
    return str;
  }
  Object.keys(params).forEach(item => {
    if (str === '') {
      str = `${item}=${params[item]}`
    } else {
      str = `${str}&${item}=${params[item]}`;
    }
  });
  return str;
}

const other = {
  getParams
};
export default other;
