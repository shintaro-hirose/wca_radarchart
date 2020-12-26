import { ColorResult } from 'react-color'

export interface ResultDetail {
  best: number
  world_rank: number
  continent_rank: number
  country_rank: number
}

export interface Profile {
  wca_id: string
  name: string
  url: string
  avatar: {
    url: string
    thumb_url: string
    is_default: boolean
  }
}

export interface FetchedUserData {
  person: Profile
  personal_records: {
    [param: string]: {
      single: ResultDetail
      average?: ResultDetail
    }
  }
}

export interface SearchedUserData {
  name: string
  wca_id: string
}

export interface RadarChartData {
  eventName: string
  myPoint: number
  rivalPoint: number
}

export interface SearchOption {
  label: string
  value: string
}

export interface UserData {
  profile: Profile | null
  points: number[]
  color: ColorResult
  searchOptions: SearchOption[]
}
