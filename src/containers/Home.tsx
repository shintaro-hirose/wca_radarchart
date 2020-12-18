import React, { useState, useEffect } from "react";
import MyRadarChart from "../components/MyRadarChart";
import axios from "axios";
import { ChromePicker, ColorResult } from "react-color";
import { AutoComplete, Col, Row } from "antd";
import { eventInfos } from "../utils/eventInfo";
import { mbldSolved } from "../utils/decodeMbld";
import "antd/dist/antd.css";

interface ResultDetail {
  best: number;
  world_rank: number;
  continent_rank: number;
  country_rank: number;
}

interface Profile {
  wca_id: string;
  name: string;
  url: string;
  avatar: {
    url: string;
    thumb_url: string;
    is_default: boolean;
  };
}

interface FetchedUserData {
  person: Profile;
  personal_records: {
    [param: string]: {
      single: ResultDetail;
      average?: ResultDetail;
    };
  };
}

interface SearchedUserData {
  name: string;
  wca_id: string;
}

interface RadarChartData {
  eventName: string;
  myPoint: number;
  rivalPoint: number;
}

const getPointData = (data: FetchedUserData) => {
  const points: number[] = [];
  eventInfos.forEach((eventInfo) => {
    let point: number = 10;
    if (data.personal_records[eventInfo.eventName] !== undefined) {
      let value = data.personal_records[eventInfo.eventName].single.best;
      if (eventInfo.eventName === "333mbf") {
        point = Math.floor(
          50 +
            ((mbldSolved(value) - eventInfo.averagePoint) * 50) /
              (eventInfo.worldPoint - eventInfo.averagePoint)
        );
      } else {
        point = Math.floor(
          50 +
            ((eventInfo.averagePoint - value) * 50) /
              (eventInfo.averagePoint - eventInfo.worldPoint)
        );
      }
    }
    point = Math.max(point, 10);
    points.push(point);
  });
  return points;
};

const fetchData = async (wcaId: string) => {
  const url = `${process.env.REACT_APP_API_URL}/persons/${wcaId}`;
  const response = await axios.get(url);
  return response.data;
};

const searchData = async (searchKey: string) => {
  const url = `${process.env.REACT_APP_API_URL}/search/users?q=${searchKey}&persons_table=true`;
  const options: SearchOption[] = [];
  await axios.get(url).then((response) => {
    const results: SearchedUserData[] = response.data.result;
    for (let i = 0; i < results.length && i < 3; i++) {
      options.push({
        value: results[i].wca_id,
        label: `${results[i].name}[${results[i].wca_id}]`,
      });
    }
  });
  return options;
};

interface SearchOption {
  label: string;
  value: string;
}

interface UserData {
  profile: Profile | null;
  points: number[];
  color: ColorResult;
  searchOptions: SearchOption[];
}

const Home = () => {
  const [radarChartData, setRadarChartData] = useState<RadarChartData[]>([]);
  const [uiState, setUiState] = useState({
    hadFetchError: false,
    isFetching: false,
    isSearching: false,
  });
  const [myData, setMyData] = useState<UserData>({
    profile: null,
    points: [],
    color: {
      hex: "red",
      rgb: { r: 255, g: 10, b: 10, a: 0.5 },
      hsl: { h: 0, s: 0, l: 0 },
    },
    searchOptions: [],
  });
  const [rivalData, setRivalData] = useState<UserData>({
    profile: null,
    points: [],
    color: {
      hex: "green",
      rgb: { r: 10, g: 255, b: 10, a: 0.5 },
      hsl: { h: 0, s: 0, l: 0 },
    },
    searchOptions: [],
  });
  const [fetchedToggle, setFetchedToggle] = useState(false); // useEffect発動するため

  useEffect(() => {
    console.log("useEfect invoked");
    console.log("rivalData.points.length: " + rivalData.points.length);
    const newRadarChartData: RadarChartData[] = [];
    eventInfos.forEach((eventInfo, idx) => {
      let myPoint: number = 10;
      let rivalPoint: number = 10;
      if (idx < myData.points.length) myPoint = myData.points[idx];
      if (idx < rivalData.points.length) rivalPoint = rivalData.points[idx];
      newRadarChartData.push({
        eventName: eventInfo.eventName,
        myPoint: myPoint,
        rivalPoint: rivalPoint,
      });
    });
    setRadarChartData(newRadarChartData);
  }, [fetchedToggle]);

  const handleMyColorChange = (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMyData({ ...myData, color });
  };

  const handleRivalColorChange = (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRivalData({ ...rivalData, color });
  };

  // 自動補完用
  const handleMyInputChange = (value: string) => {
    if (uiState.isFetching) return;
    console.log("handleMyInputChange invoked");
    setUiState({ ...uiState, isSearching: true });
    searchData(value)
      .then((options: SearchOption[]) => {
        setMyData({ ...myData, searchOptions: options });
      })
      .catch((err) => {
        console.log(err);
      });
    setUiState({ ...uiState, isSearching: false });
  };

  // データ取得用
  const handleMySelect = (value: string) => {
    if (uiState.isSearching) return;
    console.log("handleMySelect invoked");
    setUiState({ ...uiState, isFetching: true });
    fetchData(value)
      .then((data: FetchedUserData) => {
        setMyData({
          ...myData,
          profile: data.person,
          points: getPointData(data),
          searchOptions: [],
        });
        setUiState({ ...uiState, hadFetchError: false });
        setFetchedToggle(!fetchedToggle);
      })
      .catch((err) => {
        console.log(err);
        setUiState({ ...uiState, hadFetchError: true });
      });
    setUiState({ ...uiState, isFetching: false });
  };

  // 自動補完用
  const handleRivalInputChange = (value: string) => {
    setUiState({ ...uiState, isSearching: true });
    searchData(value)
      .then((options: SearchOption[]) => {
        setRivalData({ ...rivalData, searchOptions: options });
      })
      .catch((err) => {
        console.log(err);
      });
    setUiState({ ...uiState, isSearching: false });
  };

  // データ取得用
  const handleRivalSelect = (value: string) => {
    setUiState({ ...uiState, isFetching: true });
    fetchData(value)
      .then((data: FetchedUserData) => {
        setRivalData({
          ...rivalData,
          profile: data.person,
          points: getPointData(data),
          searchOptions: [],
        });
        setFetchedToggle(!fetchedToggle);
        setUiState({ ...uiState, hadFetchError: false });
      })
      .catch((err) => {
        console.log(err);
        setUiState({ ...uiState, hadFetchError: true });
      });
    setUiState({ ...uiState, isFetching: false });
  };

  return (
    <>
      <p>{uiState.hadFetchError ? "Error! Something Went Wrong!" : ""}</p>
      <p>{uiState.isFetching ? "Data Fetching..." : ""}</p>
      <Row>
        <Col span={8}>
          <p>{myData.profile ? myData.profile.name : ""}</p>
          <img
            width={200}
            height={200}
            alt="avatar"
            src={
              myData.profile
                ? myData.profile.avatar.url
                : process.env.REACT_APP_NOUSER_PNG_URL
            }
          />
        </Col>
        <Col span={8}>
          {radarChartData.length === 0 ? (
            ""
          ) : (
            <MyRadarChart
              userRecords={radarChartData}
              myColor={myData.color}
              rivalColor={rivalData.color}
            />
          )}
        </Col>
        <Col span={8}>
          <p>{rivalData.profile ? rivalData.profile.name : ""}</p>
          <img
            width={200}
            height={200}
            alt="avatar"
            src={
              rivalData.profile
                ? rivalData.profile.avatar.url
                : process.env.REACT_APP_NOUSER_PNG_URL
            }
          />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <AutoComplete
            style={{ width: 300 }}
            onSelect={handleMySelect}
            onChange={handleMyInputChange}
            placeholder="input here"
            options={myData.searchOptions}
          />
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <AutoComplete
            style={{ width: 300 }}
            onSelect={handleRivalSelect}
            onChange={handleRivalInputChange}
            placeholder="input here"
            options={rivalData.searchOptions}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <ChromePicker
            onChange={handleMyColorChange}
            color={myData.color.rgb}
          />
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <ChromePicker
            onChange={handleRivalColorChange}
            color={rivalData.color.rgb}
          />
        </Col>
      </Row>
    </>
  );
};
export default Home;
