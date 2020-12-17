import React, {useState} from 'react'
import MyRadarChart from '../components/MyRadarChart'
import axios from 'axios'
// import { UserRecord } from 'firebase-functions/lib/providers/auth'

interface ResultDetail {
    "best": number,
    "world_rank": number,
    "continent_rank": number,
    "country_rank": number
}

interface FetchedUserData {
    "person": {
        "personal_records": string,
        "name": string,
        "url": string,
        "avatar":{
            "url": string,
            "thumb_url": string,
            "is_default": boolean
        },
        [param: string]: any
    },
    "personal_records": {
        [param: string]: {
            "single": ResultDetail,
            "average"?: ResultDetail
        }
    },
    [param: string]: any
    
}

interface RadarChartData{
    eventName: string
    point: number
}

const mbldSolved = (value: number) => {
    const missed = value % 100;
    const points = 99 - (Math.floor(value / 1e7) % 100);
    const solved = points + missed;
    return solved;
}

// const eventInfos: [string, [number,number]][] = [
//     ["333", [347,2000]],
//     ["222", [49,750]],
//     ["444", [1742,8000]],
//     ["555", [3492,14000]],
//     ["666", [6951,24000]],
//     ["777", [10089,36000]],
//     ["333bf", [1550,10000]],
//     ["333fm", [16,40]],
//     ["333oh", [682,4500]],
//     ["clock", [329,1500]],
//     ["minx", [2722,16000]],
//     ["pyram", [91,1200]],
//     ["skewb", [93,1200]],
//     ["sq1", [459,5000]],
//     ["444bf", [6251,90000]],
//     ["555bf", [14162,150000]],
//     ["333mbf", [mbldSolved(410358601), 6]]
// ]

const eventInfos: [string, [number,number]][] = [
    ["333", [347,2000]],
    ["222", [49,750]],
    ["444", [1742,8000]],
    ["555", [3492,14000]],
    ["666", [6951,24000]],
    ["777", [10089,36000]],
    ["333bf", [1550,10000]],
    ["333fm", [16,40]],
    ["333oh", [682,4500]],
    ["clock", [329,1500]],
    ["minx", [2722,16000]],
    ["pyram", [91,1200]],
    ["skewb", [93,1200]],
    ["sq1", [459,5000]],
    ["444bf", [6251,90000]],
    ["555bf", [14162,150000]],
    ["333mbf", [mbldSolved(410358601), 6]]
]

const makeRadarChartData = (data: FetchedUserData) => {
    const radarChartData: RadarChartData[] = [];
    eventInfos.forEach(eventInfo => {
        let point:number = 0;
        if(data.personal_records[eventInfo[0]] !== undefined){
            let value = data.personal_records[eventInfo[0]].single.best;
            if(eventInfo[0] === "333mbf"){
                // point = Math.floor(100 * (50 + (mbldSolved(value) - eventInfo[1][1]) / 2) / (50 + (eventInfo[1][0] - eventInfo[1][1])/2))
                point = Math.floor(100 * (mbldSolved(value) / eventInfo[1][0]) * (mbldSolved(value) / eventInfo[1][0]));
            } else {
                // point = Math.floor(100 * (50 - (value - eventInfo[1][1])/ 2) / (50 - (eventInfo[1][0] - eventInfo[1][1])/2))
                point = Math.floor(100 * (eventInfo[1][0] / value) * (eventInfo[1][0] / value));
            }
            radarChartData.push({
                "eventName": eventInfo[0],
                "point":point
            })
        }
        console.log(eventInfo[0])
        console.log(point)
    })
    return radarChartData;
}

const Home = () => {
    const [rawData, setRawData] = useState<FetchedUserData | null>(null)
    const [radarChartData, setRadarChartData] = useState<RadarChartData[]>([])
    const [hadError, setHadError] = useState(false)
    const [wid, setWid] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = async() => {
        setLoading(true);
        await axios.get(`https://www.worldcubeassociation.org/api/v0/persons/${wid}`)
        .then(res => {
            setRawData(res.data)
            setHadError(false);
            return res;
        })
        .then(res => {
            if(res.data){
                setRadarChartData(makeRadarChartData(res.data));
            }
        })
        .catch(error => {
            setHadError(true);
            console.log(error)
        });
        setLoading(false);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWid(e.target.value);
    } 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchData();
        
    }

    return (
        <div>
            <MyRadarChart userRecords={radarChartData}/>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={handleInputChange} value={wid}/>
                <button type="submit" disabled={loading}>fetch data</button>
            </form>
            <p>
                {hadError ? 'fetch data error: please input valid id' : ''}
            </p>
            <p>
                {loading ? 'loading' : ''}
            </p>
            <p>
                {rawData ? rawData.person.name : ''}
            </p>
            <p>
                {/* {rawData ? rawData.personal_records["333"].single.world_rank : ''} */}
            </p>
            <img
            alt="avatar"
            src={rawData ? rawData.person.avatar.thumb_url : 'https://www.worldcubeassociation.org/assets/missing_avatar_thumb-f0ea801c804765a22892b57636af829edbef25260a65d90aaffbd7873bde74fc.png'}
            />
            
        </div>
    )
}
export default Home;