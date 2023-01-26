import { atom } from 'recoil'

const country = atom<string>({
  key: 'country',
  default: 'korea',
})
