import React, { useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { externalTooltipHandler } from '../../../lib/billing-tooltip';
import { useGetApiKeysQuery } from '../../../redux/apis/app-api';
import { colorScheme } from '../../../lib/colorscheme';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const CHARTJS_OPTIONS = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  plugins: {
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: externalTooltipHandler,
    },
  },
};

const getRangeDate = (startDate: moment.Moment, endDate: moment.Moment) => {
  const dates: moment.Moment[] = [];
  let currentDate: moment.Moment = startDate;
  while (currentDate < endDate) {
    dates.push(currentDate);
    currentDate = currentDate.clone().add(1, 'days');
  }
  return dates;
};

type UsageChartProps = {
  planDetails: Geolonia.TeamPlanDetails;
  team: Geolonia.Team;
}

type ChartDataset = {
  label?: string,
  data: number[],
  fill: boolean,
  backgroundColor: string,
}

const UsageChart: React.FC<UsageChartProps> = (props) => {
  const { team, planDetails } = props;
  const { usage } = planDetails;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const { data: mapKeys } = useGetApiKeysQuery(searchParams.get('teamId') || team.teamId);

  const chartData = useMemo(() => {
    const subOrFreePlan = planDetails.subscription || planDetails.freePlanDetails;
    if (!subOrFreePlan) return undefined;
    const labelList = getRangeDate(
      moment(subOrFreePlan.current_period_start), moment(subOrFreePlan.current_period_end),
    );
    const ymdList = labelList.map((d) => d.format('YYYYMMDD'));

    const mapKeyNames: { [key: string]: string } = {};
    for (const key of (mapKeys || [])) {
      mapKeyNames[key.userKey] = key.name;
    }

    const datasets: ChartDataset[] = [];

    for (const apiKey in usage.details) {
      const detailObj = usage.details[apiKey];
      const apiKeyName = mapKeyNames[apiKey];
      const countData = ymdList.map((ymd) => detailObj.find((d) => d.date === ymd)?.count || 0);
      const isCountData = countData.filter((count) => count > 0);

      if (isCountData.length === 0) continue;

      // チャートの配色
      const colorsMaxIndex = colorScheme.length -1;
      let colorIndex:number = datasets.length;

      // 用意している色数を以上にデータがあった場合
      if (colorIndex > colorsMaxIndex) {
        colorIndex = Math.random() * colorsMaxIndex;
      }

      const totalCount = countData.reduce((accumulator, currentValue) => accumulator + currentValue);

      datasets.push(
        {
          label: `${apiKeyName} : ${totalCount}`,
          data: countData,
          fill: false,
          backgroundColor: colorScheme[colorIndex],
        },
      );
    }

    const labels = labelList.map((x) => x.format('M/D'));

    return { labels, datasets };
  }, [mapKeys, planDetails.freePlanDetails, planDetails.subscription, usage.details]);

  if (typeof chartData === 'undefined') {
    return null;
  }

  return <Paper className="usage-details-info">
    <Typography component="h2" className="module-title">
      {__('Map loads by API key')}
    </Typography>
    <Bar data={chartData} options={CHARTJS_OPTIONS} id={'chart-usage-api-key'} height={100}/>
    <p className="chart-helper-text">{__('API keys with no map loads will not be shown in the graph.')}</p>
  </Paper>;
};

export default UsageChart;
