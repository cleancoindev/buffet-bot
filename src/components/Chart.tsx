import React, { Props, useEffect } from "react";
import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip
} from "recharts";

const data = [
	{ name: "02/02", fg_index: 20, pv: 2400, amt: 2400 },
	{ name: "03/02", fg_index: 40, pv: 2400, amt: 2400 },
	{ name: "04/02", fg_index: 10, pv: 2400, amt: 2400 },
	{ name: "05/02", fg_index: 80, pv: 2400, amt: 2400 }
];

const Chart = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<LineChart
				width={600}
				height={300}
				data={data}
				margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
			>
				<Line type="monotone" dataKey="fg_index" stroke="#000000" />
				<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
			</LineChart>
		</div>
	);
};

export default Chart;
