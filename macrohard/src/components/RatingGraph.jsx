import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

const mockRatings = [
  { name: "1 star", count: 500 },
  { name: "2 star", count: 800 },
  { name: "3 star", count: 2000 },
  { name: "4 star", count: 4000 },
  { name: "5 star", count: 4734 },
];

function RatingGraph({ ratings }) {
  const data = ratings
    ? ratings
        .map((rating) => ({
          name: rating.name,
          ratings: rating.count,
        }))
        .sort((a, b) => b.ratings - a.ratings)
    : mockRatings
        .map((rating) => ({
          name: rating.name,
          ratings: rating.count,
        }))
        .sort((a, b) => b.ratings - a.ratings);
  return (
    <BarChart
      className="w-full max-x-[700px] max-h-[70vh] aspect-[1.68] md:w-350 md:aspect-[4.35] "
      layout="vertical"
      responsive
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 40,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="ratings"
        fill="#8884d8"
        activeBar={{ fill: "purple", stroke: "blue" }}
        radius={[0, 10, 10, 0]}
      />

      <RechartsDevtools />
    </BarChart>
  );
}

export default RatingGraph;
