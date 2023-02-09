import { atom } from 'recoil'

export const country = atom<string>({
  key: 'country',
  default: 'korea',
})
