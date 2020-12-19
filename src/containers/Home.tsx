import React, { useState, useEffect } from 'react'
import MyRadarChart from '../components/MyRadarChart'
import axios from 'axios'
import { ChromePicker, ColorResult } from 'react-color'
import { AutoComplete, Col, Row, Input, Avatar } from 'antd'
import { eventInfos } from '../utils/eventInfo'
import { mbldSolved } from '../utils/decodeMbld'
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
      hex: 'red',
      rgb: { r: 255, g: 10, b: 10, a: 0.5 },
      hsl: { h: 0, s: 0, l: 0 },
    },
    searchOptions: [],
  })
  const [rivalData, setRivalData] = useState<UserData>({
    profile: null,
    points: [],
    color: {
      hex: 'green',
      rgb: { r: 10, g: 255, b: 10, a: 0.5 },
      hsl: { h: 0, s: 0, l: 0 },
    },
    searchOptions: [],
  })
  const [fetchedToggle, setFetchedToggle] = useState(false) // useEffect発動するため

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
  }, [fetchedToggle])

  const getPointData = (data: FetchedUserData) => {
    const points: number[] = []
    eventInfos.forEach((eventInfo) => {
      let point = 10
      if (data.personal_records[eventInfo.eventName] !== undefined) {
        const value = data.personal_records[eventInfo.eventName].single.best
        if (eventInfo.eventName === '333mbf') {
          point = Math.floor(
            50 +
              ((mbldSolved(value) - eventInfo.averagePoint) * 50) /
                (eventInfo.worldPoint - eventInfo.averagePoint)
          )
        } else {
          point = Math.floor(
            50 +
              ((eventInfo.averagePoint - value) * 50) /
                (eventInfo.averagePoint - eventInfo.worldPoint)
          )
        }
      }
      point = Math.max(point, 10)
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
        setFetchedToggle(!fetchedToggle)
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
        setFetchedToggle(!fetchedToggle)
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
            style={{ border: `solid ${myData.color.hex}` }}
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
            style={{ border: `solid ${rivalData.color.hex}` }}
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
          <ChromePicker
            className="picker"
            onChange={handleMyColorChange}
            color={myData.color.rgb}
          />
        </Col>
        <Col span={12}>
          <ChromePicker
            className="picker"
            onChange={handleRivalColorChange}
            color={rivalData.color.rgb}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <AutoComplete
            style={{ width: '80%' }}
            onSearch={handleMySearch}
            onSelect={handleMySelect}
            options={myData.searchOptions}
          >
            <Input size="large" placeholder="input here" />
          </AutoComplete>
        </Col>
        <Col span={12}>
          <AutoComplete
            style={{ width: '80%' }}
            onSearch={handleRivalSearch}
            onSelect={handleRivalSelect}
            options={rivalData.searchOptions}
          >
            <Input size="large" placeholder="input here" />
          </AutoComplete>
        </Col>
      </Row>
      <p>{uiState.hadFetchError ? 'Error! Something Went Wrong!' : ''}</p>
      <p>{uiState.isFetching ? 'Data Fetching...' : ''}</p>
    </>
  )
}
export default Home
