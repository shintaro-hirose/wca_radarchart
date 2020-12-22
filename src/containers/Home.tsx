import React, { useState, useEffect } from 'react'
import MyRadarChart from '../components/MyRadarChart'
import axios from 'axios'
import { TwitterPicker, ColorResult } from 'react-color'
import { AutoComplete, Col, Row, Input, Avatar } from 'antd'
import { eventInfos } from '../utils/eventInfo'
import { mbldPoint } from '../utils/decodeMbld'
import 'antd/dist/antd.css'

interface ResultDetail {
  best: number
  world_rank: number
  continent_rank: number
  country_rank: number
}

interface Profile {
  wca_id: string
  name: string
  url: string
  avatar: {
    url: string
    thumb_url: string
    is_default: boolean
  }
}

interface FetchedUserData {
  person: Profile
  personal_records: {
    [param: string]: {
      single: ResultDetail
      average?: ResultDetail
    }
  }
}

interface SearchedUserData {
  name: string
  wca_id: string
}

export interface RadarChartData {
  eventName: string
  myPoint: number
  rivalPoint: number
}

interface SearchOption {
  label: string
  value: string
}

interface UserData {
  profile: Profile | null
  points: number[]
  color: ColorResult
  searchOptions: SearchOption[]
}

const Home: React.FC = () => {
  const [radarChartData, setRadarChartData] = useState<RadarChartData[]>([])
  const [uiState, setUiState] = useState({
    hadFetchError: false,
    isFetching: false,
    isSearching: false,
  })
  const [myData, setMyData] = useState<UserData>({
    profile: null,
    points: [],
    color: {
      hex: '#8ED1FC',
      rgb: { r: 0, g: 0, b: 0, a: 0 },
      hsl: { h: 0, s: 0, l: 0 },
    },
    searchOptions: [],
  })
  const [rivalData, setRivalData] = useState<UserData>({
    profile: null,
    points: [],
    color: {
      hex: '#F78DA7',
      rgb: { r: 0, g: 0, b: 0, a: 0 },
      hsl: { h: 0, s: 0, l: 0 },
    },
    searchOptions: [],
  })
  // const [fetchedToggle, setFetchedToggle] = useState(false) // useEffect発動するため

  useEffect(() => {
    const newRadarChartData: RadarChartData[] = []
    eventInfos.forEach((eventInfo, idx) => {
      let myPoint = 10
      let rivalPoint = 10
      if (idx < myData.points.length) myPoint = myData.points[idx]
      if (idx < rivalData.points.length) rivalPoint = rivalData.points[idx]
      newRadarChartData.push({
        eventName: eventInfo.eventName,
        myPoint: myPoint,
        rivalPoint: rivalPoint,
      })
    })
    setRadarChartData(newRadarChartData)
  }, [myData.points, rivalData.points])

  const getPointData = (data: FetchedUserData) => {
    const points: number[] = []
    eventInfos.forEach((eventInfo) => {
      let point = 10
      if (data.personal_records[eventInfo.eventName] !== undefined) {
        const value = data.personal_records[eventInfo.eventName].single.best
        if (eventInfo.eventName === '333mbf') {
          if (mbldPoint(value) > eventInfo.averagePoint) {
            point =
              50 +
              (50 * (mbldPoint(value) - eventInfo.averagePoint)) /
                (eventInfo.worldPoint - eventInfo.averagePoint)
          } else {
            point = 10 + (40 * mbldPoint(value)) / eventInfo.averagePoint
          }
        } else {
          if (value < eventInfo.averagePoint) {
            point =
              50 +
              (50 * (eventInfo.averagePoint - value)) /
                (eventInfo.averagePoint - eventInfo.worldPoint)
          } else {
            point = 10 + (40 * eventInfo.averagePoint) / value
          }
        }
      }
      point = Number(point.toFixed(2))
      points.push(point)
    })
    return points
  }

  const fetchData = async (wcaId: string) => {
    const url = `${process.env.REACT_APP_API_URL}/persons/${wcaId}`
    const response = await axios.get(url)
    return response.data
  }

  const searchData = async (searchKey: string) => {
    const url = `${process.env.REACT_APP_API_URL}/search/users?q=${searchKey}&persons_table=true`
    const response = await axios.get(url)
    return response.data.result
  }

  const handleMyColorChange = (color: ColorResult) => {
    setMyData({ ...myData, color })
  }

  const handleRivalColorChange = (color: ColorResult) => {
    setRivalData({ ...rivalData, color })
  }

  // 自動補完用
  const handleMySearch = (value: string) => {
    setUiState({ ...uiState, isSearching: true })
    searchData(value)
      .then((results: SearchedUserData[]) => {
        const options: SearchOption[] = []
        for (let i = 0; i < results.length && i < 3; i++) {
          options.push({
            value: results[i].wca_id,
            label: `${results[i].name}[${results[i].wca_id}]`,
          })
        }
        setMyData({ ...myData, searchOptions: options })
        setUiState({ ...uiState, isSearching: false })
      })
      .catch((err) => {
        console.log(err)
        setUiState({ ...uiState, isSearching: false })
      })
  }

  // データ取得用
  const handleMySelect = (value: string) => {
    setUiState({ ...uiState, isFetching: true })
    fetchData(value)
      .then((data: FetchedUserData) => {
        setMyData({
          ...myData,
          profile: data.person,
          points: getPointData(data),
          searchOptions: [],
        })
      })
      .then(() => {
        setUiState({ ...uiState, hadFetchError: false, isFetching: false })
      })
      .catch((err) => {
        console.log(err)
        setUiState({ ...uiState, hadFetchError: true, isFetching: false })
      })
  }

  // 自動補完用
  const handleRivalSearch = (value: string) => {
    setUiState({ ...uiState, isSearching: true })
    searchData(value)
      .then((results: SearchedUserData[]) => {
        const options: SearchOption[] = []
        for (let i = 0; i < results.length && i < 3; i++) {
          options.push({
            value: results[i].wca_id,
            label: `${results[i].name}[${results[i].wca_id}]`,
          })
        }
        setRivalData({ ...rivalData, searchOptions: options })
        setUiState({ ...uiState, isSearching: false })
      })
      .catch((err) => {
        console.log(err)
        setUiState({ ...uiState, isSearching: false })
      })
  }

  // データ取得用
  const handleRivalSelect = (value: string) => {
    setUiState({ ...uiState, isFetching: true })
    fetchData(value)
      .then((data: FetchedUserData) => {
        setRivalData({
          ...rivalData,
          profile: data.person,
          points: getPointData(data),
          searchOptions: [],
        })
      })
      .then(() => {
        setUiState({ ...uiState, hadFetchError: false, isFetching: false })
      })
      .catch((err) => {
        console.log(err)
        setUiState({ ...uiState, hadFetchError: true, isFetching: false })
      })
  }

  return (
    <>
      <Row>
        <Col span={8}>
          <Avatar
            alt="avatar"
            className="avatar"
            size={150}
            style={{
              border: `solid ${myData.color.hex}`,
            }}
            src={
              myData.profile
                ? myData.profile.avatar.thumb_url
                : process.env.REACT_APP_NOUSER_PNG_URL
            }
          />
          <p>{myData.profile ? myData.profile.name : ''}</p>
          <p>{myData.profile ? myData.profile.wca_id : ''}</p>
        </Col>
        <Col span={8}>
          {radarChartData.length === 0 ? (
            ''
          ) : (
            <MyRadarChart
              userRecords={radarChartData}
              myColor={myData.color}
              rivalColor={rivalData.color}
            />
          )}
        </Col>
        <Col span={8}>
          <Avatar
            alt="avatar"
            size={150}
            className="avatar"
            style={{
              border: `solid ${rivalData.color.hex}`,
            }}
            src={
              rivalData.profile
                ? rivalData.profile.avatar.thumb_url
                : process.env.REACT_APP_NOUSER_PNG_URL
            }
          />
          <p>{rivalData.profile ? rivalData.profile.name : ''}</p>
          <p>{rivalData.profile ? rivalData.profile.wca_id : ''}</p>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <TwitterPicker
            className="picker"
            onChange={handleMyColorChange}
            color={myData.color.hex}
            triangle="hide"
          />
        </Col>
        <Col span={12}>
          <TwitterPicker
            className="picker"
            onChange={handleRivalColorChange}
            color={rivalData.color.hex}
            triangle="hide"
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <AutoComplete
            style={{ width: '276px' }}
            onSearch={handleMySearch}
            onSelect={handleMySelect}
            options={myData.searchOptions}
            disabled={uiState.isFetching}
            defaultValue={''}
          >
            <Input size="large" placeholder="name or wca_id" />
          </AutoComplete>
        </Col>
        <Col span={12}>
          <AutoComplete
            style={{ width: '276px' }}
            onSearch={handleRivalSearch}
            onSelect={handleRivalSelect}
            options={rivalData.searchOptions}
            disabled={uiState.isFetching}
            defaultValue={''}
          >
            <Input size="large" placeholder="name or wca_id" />
          </AutoComplete>
        </Col>
      </Row>
      <p>{uiState.hadFetchError ? 'Error! Something Went Wrong!' : ''}</p>
      <p>{uiState.isFetching ? 'Data Fetching...' : ''}</p>
      <p>{uiState.isSearching ? 'Data Searching...' : ''}</p>
    </>
  )
}
export default Home
