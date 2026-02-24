import React, { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import html2canvas from "html2canvas"; // npm i html2canvas

// --- Helpers for mock data ---
function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

function generateData(type, startYear = 2023, endYear = 2025) {
  const data = [];
  let current = new Date(`${startYear}-01-01`);
  const end = new Date(`${endYear}-12-31`);

  while (current <= end) {
    let value = 0;

    switch (type) {
      case "sales":
        value = Math.floor(Math.random() * 5000) + 1000;
        break;
      case "orders":
        value = Math.floor(Math.random() * 50) + 5;
        break;
      case "customers":
        value = Math.floor(Math.random() * 20) + 1;
        break;
      case "products":
        value = Math.floor(Math.random() * 30) + 5;
        break;
      default:
        value = 0;
    }

    data.push({
      date: formatDate(current),
      value,
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
}

const MOCK_REPORTS = {
  sales: { day: generateData("sales") },
  orders: { day: generateData("orders") },
  customers: { day: generateData("customers") },
  products: { day: generateData("products") },
};

function aggregateData(dayData, type) {
  const buckets = [];
  let bucket = null;

  const pushBucket = () => {
    if (bucket) {
      buckets.push({
        date: bucket.start,
        label: type === "day" ? bucket.start : `${bucket.start} → ${bucket.end}`,
        value: bucket.total,
      });
    }
  };

  for (let i = 0; i < dayData.length; i++) {
    const d = new Date(dayData[i].date);

    if (type === "week") {
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const startStr = formatDate(weekStart);
      const endStr = formatDate(weekEnd);

      if (!bucket || bucket.key !== startStr) {
        pushBucket();
        bucket = { key: startStr, start: startStr, end: endStr, total: 0 };
      }
      bucket.total += dayData[i].value;
    }

    if (type === "month") {
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const startStr = formatDate(start);
      const endStr = formatDate(end);

      if (!bucket || bucket.key !== startStr) {
        pushBucket();
        bucket = { key: startStr, start: startStr, end: endStr, total: 0 };
      }
      bucket.total += dayData[i].value;
    }

    if (type === "year") {
      const start = new Date(d.getFullYear(), 0, 1);
      const end = new Date(d.getFullYear(), 11, 31);

      const startStr = formatDate(start);
      const endStr = formatDate(end);

      if (!bucket || bucket.key !== startStr) {
        pushBucket();
        bucket = { key: startStr, start: startStr, end: endStr, total: 0 };
      }
      bucket.total += dayData[i].value;
    }

    if (type === "day") {
      buckets.push({
        date: dayData[i].date,
        label: dayData[i].date,
        value: dayData[i].value,
      });
    }
  }

  pushBucket();
  return buckets;
}

// CSV download
function downloadCSV(data, name) {
  const csv = [["Date", "Value"], ...data.map((d) => [d.label, d.value])]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
}

// Chart download
async function downloadChartImage(chartRef, name) {
  if (!chartRef.current) return;
  const canvas = await html2canvas(chartRef.current, {
    backgroundColor: "#ffffff",
    useCORS: true,
    scale: 2,
  });
  const link = document.createElement("a");
  link.download = `${name}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// --- Custom label: bottom-center of bar, 45°, bold, with small bg block ---
const CustomDateLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (x == null || y == null || width == null || height == null) return null;

  const padding = 8; // keeps label slightly inside bar (above axis)
  const posX = x + width / 2;        // <-- center horizontally
  const posY = y + height - padding; // <-- bottom position

  const textPx = Math.max(20, value.length * 7); // rough text width
  const rectX = posX - textPx / 2 - 2;
  const rectY = posY - 12;

  return (
    <g pointerEvents="none">
      <rect
        x={rectX}
        y={rectY}
        width={textPx + 4}
        height={16}
        fill="rgba(255,255,255,0.7)"
        rx={8} // <-- circular style background
        transform={`rotate(-45, ${posX}, ${posY})`}
      />
      <text
        x={posX}
        y={posY}
        fontSize={11}
        fontWeight="bold"
        fill="#000000"
        textAnchor="middle"
        transform={`rotate(-45, ${posX}, ${posY})`}
      >
        {value}
      </text>
    </g>
  );
};

function ReportsSection() {
  const [reportType, setReportType] = useState("sales");
  const [timeRange, setTimeRange] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const chartRef = useRef(null);

  const rawDayData = MOCK_REPORTS[reportType].day;
  let rawData =
    timeRange !== "day"
      ? aggregateData(rawDayData, timeRange)
      : aggregateData(rawDayData, "day");

  let filteredData = rawData;
  if (startDate && endDate) {
    filteredData = rawData.filter(
      (d) =>
        new Date(d.date) >= new Date(startDate) &&
        new Date(d.date) <= new Date(endDate)
    );
  }

  const visibleData = filteredData.slice(-7);

  return (
    <div className="p-4 space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="sales">Sales</option>
          <option value="orders">Orders</option>
          <option value="customers">Customers</option>
          <option value="products">Products</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="day">Day Wise</option>
          <option value="week">Week Wise</option>
          <option value="month">Month Wise</option>
          <option value="year">Year Wise</option>
        </select>

        <label className="flex items-center gap-2">
          From:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>
        <label className="flex items-center gap-2">
          To:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow h-96" ref={chartRef}>
        <h3 className="font-semibold mb-2 capitalize">
          {reportType} Report ({timeRange}){" "}
          {startDate && endDate ? `(Filtered)` : ""}
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            margin={{ top: 24, right: 16, left: 50, bottom: 28 }} // <-- more left margin
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={false}
              tickLine={false}
              axisLine={true}
            />
            <YAxis
              tickFormatter={(val) => val.toLocaleString()} // formatted numbers
              tick={{ fontSize: 12, fill: "#333" }}
              domain={[0, (dataMax) => (dataMax ? dataMax * 1.1 : 10)]}
              axisLine={true}
              tickLine={true}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#f97316"
              label={{
                position: "top",
                fontSize: 12,
                fill: "#333",
                fontWeight: "bold",
              }}
            >
              <LabelList dataKey="label" content={<CustomDateLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => downloadCSV(filteredData, `${reportType}_report`)}
        >
          Download CSV
        </button>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => downloadChartImage(chartRef, `${reportType}_chart`)}
        >
          Download Chart
        </button>
      </div>
    </div>
  );
}

export default ReportsSection;
