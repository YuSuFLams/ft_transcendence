'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LineChart,
  Line,
} from "recharts";

// getDataMonth(1)
// getDataMonth(14)
const Months = [
    {
      day: "1",
      win: 1,
      lose: 3,
      //amt: 10
    },
    {
      day: "2",
      win: 10,
      lose: 10,
      // amt: 2290
    },
    {
      day: "3",
      win: 12,
      lose: 7,
      //amt: 20
    },
    {
      day: "4",
      win: 8,
      lose: 8,
      //amt: 21
    },
    {
      day: "5",
      win: 14,
      lose: 3,
      //amt: 2
    },
    {
      day: "6",
      win: 0,
      lose: 0,
      //amt: 21
    },
    {
      day: "7",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "8",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "9",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "10",
      win: 14,
      lose: 7,
      //amt: 2210
    },
    {
      day: "11",
      win: 14,
      lose: 7,
      //amt: 2210
    },
    {
      day: "12",
      win: 10,
      lose: 10,
      // amt: 2290
    },
    {
      day: "13",
      win: 12,
      lose: 7,
      //amt: 20
    },
    {
      day: "14",
      win: 8,
      lose: 8,
      //amt: 21
    },
    {
      day: "15",
      win: 14,
      lose: 3,
      //amt: 2
    },
    {
      day: "16",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "17",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "18",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "19",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "20",
      win: 14,
      lose: 7,
      //amt: 2210
    },
    {
      day: "21",
      win: 14,
      lose: 7,
      //amt: 2210
    },
    {
      day: "22",
      win: 10,
      lose: 10,
      // amt: 2290
    },
    {
      day: "23",
      win: 12,
      lose: 7,
      //amt: 20
    },
    {
      day: "24",
      win: 8,
      lose: 8,
      //amt: 21
    },
    {
      day: "25",
      win: 14,
      lose: 3,
      //amt: 2
    },
    {
      day: "26",
      win: 80,
      lose: 3,
      //amt: 21
    },
    {
      day: "27",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "28",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "29",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "30",
      win: 17,
      lose: 3,
      //amt: 21
    },
];

const Weeks = [
    {
      day: "1",
      win: 1,
      lose: 3,
      //amt: 10
    },
    {
      day: "2",
      win: 10,
      lose: 10,
      // amt: 2290
    },
    {
      day: "3",
      win: 12,
      lose: 7,
      //amt: 20
    },
    {
      day: "4",
      win: 8,
      lose: 8,
      //amt: 21
    },
    {
      day: "5",
      win: 14,
      lose: 3,
      //amt: 2
    },
    {
      day: "6",
      win: 17,
      lose: 3,
      //amt: 21
    },
    {
      day: "7",
      win: 17,
      lose: 3,
      //amt: 21
    }
];


export default function StatsGame({width,height,type,time}: any ) {
    let data = Months;
    if (time === "Weeks")
        data = Weeks;
    return (
    <div className="bg-[#1E2934]" id="stats">
    {type==="BarChart" && (<BarChart
        width={width}
        height={height}
        data={data}
        stackOffset="sign"
        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 20,
        }}
        >
        <CartesianGrid  stroke="#020D1A"/>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="win" fill="#0BF4C8" stackId="stack" />
        <Bar dataKey="lose" fill="#FAD85D" stackId="stack" />
      </BarChart>)
    }
    {type==="LineChart" && (<LineChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 5, right: 30, left: 30, bottom: 20 }}
        >
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Line type="monotone" dataKey="win" stroke="#845ED7" />
        <Line
          type="monotone"
          dataKey="lose"
          stroke="#73FFCC"
          strokeDasharray="3 4 5 2"
        />
        </LineChart>)
    }
    </div>
  );
}