import React from 'react';
import { SparklineComponent, Inject, SparklineTooltip } from '@syncfusion/ej2-react-charts';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';


const SparkLine = (props) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };
  const { id, data, } = props;

  const barData = {
    labels: data.map(item => item.x),
    datasets: [
      {
        label: 'Sales',
        data:  data.map(item => item.average_occupancy_rate),
        backgroundColor: '#078eca',
        borderWidth: 1,
      },
    ],
  };


  return (
    <>
      <Bar id={id} options={options} data={barData} />
    </>
  );
}

export default SparkLine;
