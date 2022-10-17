const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const iconsArr= [
  'ylgy_img/apple.gif',
  'ylgy_img/cai.gif',
  'ylgy_img/cao.gif',
  'ylgy_img/cha.gif',
  'ylgy_img/fan.gif',
  'ylgy_img/huo.gif',
  'ylgy_img/jiu.gif',
  'ylgy_img/kun.gif',
  'ylgy_img/ling.gif',
  'ylgy_img/luobo.gif',
  'ylgy_img/mudun_s.gif',
  'ylgy_img/mudun.gif',
  'ylgy_img/shi.gif',
  'ylgy_img/shu.gif',
  'ylgy_img/shuli.gif',
  'ylgy_img/suan.gif',
  'ylgy_img/tong.png',
  'ylgy_img/yangmao.gif',
  'ylgy_img/yumi.gif',
]

module.exports = {
  formatTime,
  iconsArr
}
