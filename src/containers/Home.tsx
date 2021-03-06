import React, { useState, useEffect } from 'react'
import { CustomRadarChart } from '../components/CustomRadarChart'
import axios from 'axios'
import { TwitterPicker, ColorResult } from 'react-color'
import { AutoComplete, Col, Row, Input } from 'antd'
import { eventInfos } from '../utils/eventInfo'
import { mbldPoint } from '../utils/decodeMbld'
import 'antd/dist/antd.css'
import { Description } from '../components/Description'
import { UserProfileBlock } from '../components/UserProfileBlock'
import {
  RadarChartData,
  UserData,
  FetchedUserData,
  SearchedUserData,
  SearchOption,
} from '../interfaces/interfaces'

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
      <Row align="top">
        <Col
          xs={{ span: 12, order: 1 }}
          sm={{ span: 12, order: 1 }}
          md={{ span: 4, order: 1 }}
        >
          <UserProfileBlock userdata={myData} />
        </Col>
        <Col
          xs={{ span: 24, order: 3 }}
          sm={{ span: 24, order: 3 }}
          md={{ span: 16, order: 2 }}
        >
          {radarChartData.length === 0 ? (
            ''
          ) : (
            <CustomRadarChart
              userRecords={radarChartData}
              myColor={myData.color}
              rivalColor={rivalData.color}
            />
          )}
        </Col>
        <Col
          xs={{ span: 12, order: 2 }}
          sm={{ span: 12, order: 2 }}
          md={{ span: 4, order: 3 }}
        >
          <UserProfileBlock userdata={rivalData} />
        </Col>
      </Row>
      <Row className="inputs" justify="space-around" align="middle">
        <Col xs={24} sm={24} md={12}>
          <TwitterPicker
            className="picker"
            onChange={handleMyColorChange}
            color={myData.color.hex}
            triangle="hide"
          />
          <AutoComplete
            style={{ width: '276px' }}
            onSearch={handleMySearch}
            onSelect={handleMySelect}
            options={myData.searchOptions}
            disabled={uiState.isFetching}
            defaultValue={''}
          >
            <Input size="large" placeholder="input your name or wca_id" />
          </AutoComplete>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <TwitterPicker
            className="picker"
            onChange={handleRivalColorChange}
            color={rivalData.color.hex}
            triangle="hide"
          />
          <AutoComplete
            style={{ width: '276px' }}
            onSearch={handleRivalSearch}
            onSelect={handleRivalSelect}
            options={rivalData.searchOptions}
            disabled={uiState.isFetching}
            defaultValue={''}
          >
            <Input size="large" placeholder="input rivals name or wca_id" />
          </AutoComplete>
        </Col>
      </Row>
      <Description />
    </>
  )
}
export default Home
