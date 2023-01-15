import React, { useEffect, useState } from "react";
import "./Chart.scss";
import {
  getData,
  getIds,
  getCodes,
  getDataById,
  getDataByCode,
  getSelectedData,
  getDataSets,
} from "../../services";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const yearLabels = ["2022", "2021"];

const Chart = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [idList, setIdList] = useState();
  const [selectedId, setSelectedId] = useState();
  const [codeList, setCodeList] = useState();
  const [selectedCode, setSelectedCode] = useState();
  const [labels, setLabels] = useState(monthLabels);
  const [aggregateBy, setAggregateBy] = useState("month");
  const [lastSelected, setLastSelected] = useState();

  useEffect(() => {
    setData(getData);
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedId(data[0].id);
      setLastSelected(data[0].id);
      setIdList(getIds(data));
      setCodeList(getCodes(data));
      setLabels(monthLabels);
      updateChart(monthLabels, [data[0]]);
    }
  }, [data]);

  const updateChart = (chartLabels, data, type = "month") => {
    setChartData({
      labels: chartLabels,
      datasets: getDataSets(data, type),
    });
  };

  const idChanged = (e) => {
    setSelectedId(e.target.value);
    updateChart(labels, getDataById(data, e.target.value), aggregateBy);
    setLastSelected(e.target.value);
  };

  const codeChanged = (e) => {
    setSelectedCode(e.target.value);
    updateChart(labels, getDataByCode(data, e.target.value), aggregateBy);
    setLastSelected(e.target.value);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    setAggregateBy(value);
    switch (value) {
      case "year":
        updateChart(yearLabels, getSelectedData(lastSelected, value), value);
        setLabels(yearLabels);
        break;

      default:
        updateChart(monthLabels, getSelectedData(lastSelected));
        setLabels(monthLabels);
        break;
    }
  };

  return (
    <>
      <section>
        <div className="chart">
          {chartData && data.length > 0 && idList && codeList && (
            <div className="d-flex">
              <div className="chart-container">
                <Line options={options} data={chartData} />
              </div>
              <div className="filter">
                <div>
                  <label htmlFor="ids">Choose an ID: </label>
                  <select
                    name="ids"
                    id="ids"
                    value={selectedId}
                    onChange={idChanged}
                  >
                    {idList.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-1">
                  <label htmlFor="codes">Choose a code: </label>
                  <select
                    name="codes"
                    id="codes"
                    value={selectedCode}
                    onChange={codeChanged}
                  >
                    <option>...</option>
                    {codeList.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2">
                  <h6>Data aggregation:</h6>
                  <div>
                    <input
                      type="radio"
                      id="month"
                      name="month"
                      value="month"
                      checked={aggregateBy === "month"}
                      onChange={handleChange}
                    />
                    <label htmlFor="month">Month</label>
                    <input
                      type="radio"
                      id="year"
                      name="year"
                      value="year"
                      checked={aggregateBy === "year"}
                      onChange={handleChange}
                    />
                    <label htmlFor="year">Year</label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Chart;
