// 判断一个数是否在给定的数组区间
export const isArrayDomain = (arr, array) => {
  let flag = true;
  array.map((item) => {
    const arrItem = item.split(',');
    if (arr[0] >= arrItem[1] || arr[1] <= arrItem[0]) {
    } else {
      flag = false
    }
  })
  return flag
}
