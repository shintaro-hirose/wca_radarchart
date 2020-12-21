import { mbldPoint } from './decodeMbld'

interface EventInfo {
  eventName: string
  worldPoint: number
  averagePoint: number
}

export const eventInfos: EventInfo[] = [
  { eventName: '333', worldPoint: 347, averagePoint: 2500 },
  { eventName: '222', worldPoint: 49, averagePoint: 800 },
  { eventName: '444', worldPoint: 1742, averagePoint: 8000 },
  { eventName: '555', worldPoint: 3492, averagePoint: 14000 },
  { eventName: '666', worldPoint: 6951, averagePoint: 24000 },
  { eventName: '777', worldPoint: 10089, averagePoint: 36000 },
  { eventName: '333fm', worldPoint: 16, averagePoint: 40 },
  { eventName: '333oh', worldPoint: 682, averagePoint: 4500 },
  { eventName: 'clock', worldPoint: 329, averagePoint: 1500 },
  { eventName: 'minx', worldPoint: 2722, averagePoint: 16000 },
  { eventName: 'pyram', worldPoint: 91, averagePoint: 1200 },
  { eventName: 'skewb', worldPoint: 93, averagePoint: 1200 },
  { eventName: 'sq1', worldPoint: 459, averagePoint: 5000 },
  { eventName: '333bf', worldPoint: 1550, averagePoint: 10000 },
  { eventName: '444bf', worldPoint: 6251, averagePoint: 90000 },
  { eventName: '555bf', worldPoint: 14162, averagePoint: 150000 },
  { eventName: '333mbf', worldPoint: mbldPoint(410358601), averagePoint: 5 },
]
