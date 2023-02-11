import { atom } from 'recoil'


export const timeZone = atom<string>({
  key: 'timeZone',
  default: 'Asia/Seoul',
})
