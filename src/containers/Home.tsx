import React, {useState, useEffect} from 'react'
import MyRadarChart from '../components/MyRadarChart'
import axios from 'axios'

interface ResultDetail {
    "best": number,
    "world_rank": number,
    "continent_rank": number,
    "country_rank": number
}

interface UserInfo {
    "personal_records": string,
    "name": string,
    "url": string,
    "avatar":{
        "url": string,
        "thumb_url": string,
        "is_default": boolean
    },
    // [param: string]: any
}

interface FetchedUserData {
    "person": UserInfo,
    "personal_records": {
        [param: string]: {
            "single": ResultDetail,
            "average"?: ResultDetail
        }
    },
    // [param: string]: any
}

interface RadarChartData{
    "eventName": string,
    "myPoint": number,
    "rivalPoint": number    
}

const mbldSolved = (value: number) => {
    const points = 99 - (Math.floor(value / 1e7) % 100);
    return points;
}

const eventInfos: [string, [number,number]][] = [
    ["333", [347,2000]],
    ["222", [49,750]],
    ["444", [1742,8000]],
    ["555", [3492,14000]],
    ["666", [6951,24000]],
    ["777", [10089,36000]],
    ["333fm", [16,40]],
    ["333oh", [682,4500]],
    ["clock", [329,1500]],
    ["minx", [2722,16000]],
    ["pyram", [91,1200]],
    ["skewb", [93,1200]],
    ["sq1", [459,5000]],
    ["333bf", [1550,10000]],
    ["444bf", [6251,90000]],
    ["555bf", [14162,150000]],
    ["333mbf", [mbldSolved(410358601), 3]]
]
const getPointData = (data: FetchedUserData) => {
    const points: number[] = [];
    eventInfos.forEach(eventInfo => {
        let point:number = 10;
        if(data.personal_records[eventInfo[0]] !== undefined){
            let value = data.personal_records[eventInfo[0]].single.best;
            if(eventInfo[0] === "333mbf"){
                // point = Math.floor(100 * (50 + (mbldSolved(value) - eventInfo[1][1]) / 2) / (50 + (eventInfo[1][0] - eventInfo[1][1])/2))
                // point = Math.floor(100 * (mbldSolved(value) / eventInfo[1][0]) * (mbldSolved(value) / eventInfo[1][0]));
                point = Math.floor(50 + (mbldSolved(value) - eventInfo[1][1]) * 50 / (eventInfo[1][0] - eventInfo[1][1]));
            } else {
                // point = Math.floor(100 * (50 - (value - eventInfo[1][1])/ 2) / (50 - (eventInfo[1][0] - eventInfo[1][1])/2))
                // point = Math.floor(100 * (eventInfo[1][0] / value) * (eventInfo[1][0] / value));
                point = Math.floor(50 + (eventInfo[1][1] - value) * 50 / (eventInfo[1][1] - eventInfo[1][0]));
            }
        }
        point = Math.max(point, 10)
        // radarChartData.push({
        //     "eventName": eventInfo[0],
        //     "point":point
        // })
        points.push(point)
    })
    return points;
}

const fetchData = async(wcaId: string) => {
    const url = `https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`
    const response = await axios.get(url)
    return response.data
}

const Home = () => {
    const [radarChartData, setRadarChartData] = useState<RadarChartData[]>([])
    const [hadError, setHadError] = useState(false)
    const [loading, setLoading] = useState(false);
    const [myUserInfo, setMyUserInfo] = useState<UserInfo | null>(null);
    const [rivalUserInfo, setRivalUserInfo] = useState<UserInfo | null>(null);
    const [myPointData, setMyPointData] = useState<number[]>([]);
    const [rivalPointData, setRivalPointData] = useState<number[]>([]);
    const [myWcaId, setMyWcaId] = useState('');
    const [rivalWcaId, setRivalWcaId] = useState('');
    const [searchedIds, setSearchedIds] = useState<string[]>([]);

    // set my radarchart
    // useEffect(() => {
    //     if(!rawData)return;
    //     setMyPointData(getPointData(rawData));
    // }, [rawData])

    useEffect(() => {
        let newRadarChartData: RadarChartData[] = [];
        eventInfos.forEach((eventInfo, idx) => {
            let myPoint: number = 0;
            let rivalPoint: number = 0;
            if(idx < myPointData.length) myPoint = myPointData[idx]
            if(idx < rivalPointData.length) rivalPoint = rivalPointData[idx]
            // newRadarChartData.push({
            //     "eventName": eventInfo[0],
            //     "myPoint":myPoint,
            //     "rivalPoint":rivalPoint
            // })
            newRadarChartData = [
                ...newRadarChartData,
                {
                    "eventName": eventInfo[0],
                    "myPoint":myPoint,
                    "rivalPoint":rivalPoint
                }
            ]
        })
        setRadarChartData(newRadarChartData)

    }, [myPointData, rivalPointData])

    const handleMyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMyWcaId(e.target.value);
    }
    const handleRivalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRivalWcaId(e.target.value);
    } 

    const handleMySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        fetchData(myWcaId)
        .then((data : FetchedUserData) => {
            setMyUserInfo(data.person);
            setMyPointData(getPointData(data));
            setSearchedIds([...searchedIds, myWcaId])
            setHadError(false)
        })
        .catch(err => {
            console.log(err)
            setHadError(true)
        })
        setLoading(false)
    }

    const handleRivalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        fetchData(rivalWcaId)
        .then((data : FetchedUserData) => {
            setRivalUserInfo(data.person);
            setRivalPointData(getPointData(data));
            setSearchedIds([...searchedIds, rivalWcaId])
            setHadError(false)
        })
        .catch(err => {
            console.log(err)
            setHadError(true)
        })
        setLoading(false)
    }

    return (
        <div>
            {
                radarChartData.length === 0 ? '' : <MyRadarChart userRecords={radarChartData}/>
            }
            <p>
                {hadError ? 'Error! Something Went Wrong!' : ''}
            </p>
            <p>
                {loading ? 'loading' : ''}
            </p>
            <p>Your WCAID</p>
            <form onSubmit={handleMySubmit}>
                <input type="text" onChange={handleMyInputChange} value={myWcaId}/>
                <button type="submit" disabled={loading}>fetch my data</button>
            </form>
            <p>Rivals WCAID</p>
            <form onSubmit={handleRivalSubmit}>
                <input type="text" onChange={handleRivalInputChange} value={rivalWcaId}/>
                <button type="submit" disabled={loading}>fetch rival data</button>
            </form>
            <p>
                {myUserInfo ? myUserInfo.name : ''}
            </p>
            <img
            width={200}
            height={200}
            alt="avatar"
            src={myUserInfo ? myUserInfo.avatar.url : 'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png'}
            />
            <p>
                {rivalUserInfo ? rivalUserInfo.name : ''}
            </p>
            <img
            width={200}
            height={200}
            alt="avatar"
            src={rivalUserInfo ? rivalUserInfo.avatar.url : 'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png'}
            />
            <ul>
                {
                    searchedIds.map((data, idx) => {
                        return(
                            <li key={idx}>
                                <p>
                                    {data}
                                </p>
                            </li>
                        )
                    })
                }
            </ul>
            
        </div>
    )
}
export default Home;