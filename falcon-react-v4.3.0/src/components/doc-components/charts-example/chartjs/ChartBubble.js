import FalconComponentCard from 'components/common/FalconComponentCard';
import { getColor, rgbaColor } from 'helpers/utils';
import { chartJsDefaultTooltip, getBubbleDataset } from 'helpers/chartjs-utils';
import React from 'react';
import { Bubble } from 'react-chartjs-2';

const chartCode = `function ChartOptions() {
 
  const data = {
    datasets: [
      {
        label: 'Dataset 1',
        data: getBubbleDataset(5, 5, 15, 0, 100),
        backgroundColor: getColor('primary-bg-subtle'),
        hoverBackgroundColor: getColor('primary')
      },
      {
        label: 'Dataset 2',
        data: getBubbleDataset(5, 5, 15, 0, 100),
        backgroundColor: getColor('success-bg-subtle'),
        hoverBackgroundColor: getColor('success')
      },
      {
        label: 'Dataset 3',
        data: getBubbleDataset(5, 5, 15, 0, 100),
        backgroundColor: getColor('danger-bg-subtle'),
        hoverBackgroundColor: getColor('danger')
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: chartJsDefaultTooltip(),
      legend: {
        labels: {
          color: getColor('gray-500')
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: getColor('gray-500')
        },
        grid: {
          color: getColor('gray-300'),
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: getColor('gray-500')
        },
        grid: {
          color: getColor('gray-300'),
          drawBorder: false,
        }
      }
    }
  };

  return (
    <Bubble data={data} options={options}  width={200}/>
  );

}`;

const ChartBubble = () => {
  return (
    <FalconComponentCard>
      <FalconComponentCard.Header title="Bubble Chart" light={false} />

      <FalconComponentCard.Body
        code={chartCode}
        language="jsx"
        scope={{
          Bubble,
          getColor,
          rgbaColor,
          getBubbleDataset,
          chartJsDefaultTooltip
        }}
      />
    </FalconComponentCard>
  );
};

export default ChartBubble;
