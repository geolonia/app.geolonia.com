import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Bar } from 'react-chartjs-2';
import { externalTooltipHandler } from '../../../lib/billing-tooltip';
import { useGetApiKeysQuery, useGetTeamPlanQuery } from '../../../redux/apis/app-api';
import { colorScheme } from '../../../lib/colorscheme';
import moment from 'moment';
import { ChartOptions } from 'chart.js';
import { useSelectedTeam } from '../../../redux/hooks';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Box from '@material-ui/core/Box';
import { DatePicker } from '../../custom/date-picker';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const CHARTJS_OPTIONS: ChartOptions<'bar'> = {
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
    legend: {
      display: false,
    },
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
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = currentDate.clone().add(1, 'days');
  }
  return dates;
};

type UsageChartProps = {
  planDetails: Geolonia.TeamPlanDetails;
  team: Geolonia.Team;
};

type ChartDataset = {
  label?: string,
  keyName: string,
  data: number[],
  fill: boolean,
  backgroundColor: string,
};
type ChartData = {
  labels: string[],
  datasets: ChartDataset[],
} | undefined;

const UsageChart: React.FC<UsageChartProps> = (props) => {
  const { team, planDetails } = props;
  const { data: mapKeys } = useGetApiKeysQuery(team.teamId);

  const [subQueryDateRange, setSubQueryDateRange] = useState<{ usageStart: string, usageEnd: string } | undefined>(undefined);
  const { selectedTeam } = useSelectedTeam();
  const teamId = selectedTeam?.teamId;

  const { data: planDetailsSub, isFetching } = useGetTeamPlanQuery(
    { teamId: teamId || '', duration: subQueryDateRange },
    { skip: !teamId || !subQueryDateRange },
  );

  const coalescedPlanDetails = planDetailsSub || planDetails;
  const subOrFreePlan = coalescedPlanDetails.subscription || coalescedPlanDetails.freePlanDetails;
  const { usage } = coalescedPlanDetails;

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // download menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = !!anchorEl;
  const handleToggleDownloadMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseDownloadMenu = useCallback(() => setAnchorEl(null), []);

  useEffect(() => {
    if (subOrFreePlan) {
      setStart(moment(subOrFreePlan.current_period_start).format('YYYY-MM-DD'));
      setEnd(moment(subOrFreePlan.current_period_end).format('YYYY-MM-DD'));
    }
  }, [subOrFreePlan]);

  const chartData = useMemo<ChartData>(() => {
    if (!subOrFreePlan) return undefined;
    if (
      (typeof mapKeys === 'undefined') ||
      !usage.details
    ) return undefined;
    const labelList = getRangeDate(
      moment(subOrFreePlan.current_period_start), moment(subOrFreePlan.current_period_end),
    );
    const ymdList = labelList.map((d) => d.format('YYYYMMDD'));

    const mapKeyNames: { [key: string]: string } = {};
    for (const key of (mapKeys || [])) {
      const keyName = sprintf(key.isDeleted ? __('%s (deleted)') : '%s', key.name);
      mapKeyNames[key.userKey] = keyName;
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
          label: `${apiKeyName} : ${totalCount.toLocaleString()}`,
          keyName: apiKeyName,
          data: countData,
          fill: false,
          backgroundColor: colorScheme[colorIndex],
        },
      );
    }

    const labels = labelList.map((x) => x.format('M/D'));

    return { labels, datasets };
  }, [mapKeys, subOrFreePlan, usage.details]);

  const onPrevClick = useCallback(() => {
    if (subOrFreePlan) {
      const prevDuration = {
        usageStart: moment(subOrFreePlan.current_period_start).add(-1, 'month').format('YYYY-MM-DD'),
        usageEnd: moment(subOrFreePlan.current_period_end).add(-1, 'month').format('YYYY-MM-DD'),
      };
      setSubQueryDateRange(prevDuration);
    }
  }, [subOrFreePlan]);

  const onNextClick = useCallback(() => {
    if (subOrFreePlan) {
      const nextDuration = {
        usageStart: moment(subOrFreePlan.current_period_start).add(1, 'month').format('YYYY-MM-DD'),
        usageEnd: moment(subOrFreePlan.current_period_end).add(1, 'month').format('YYYY-MM-DD'),
      };
      setSubQueryDateRange(nextDuration);
    }

  }, [subOrFreePlan]);

  const setCustomRange = useCallback(() => {
    setSubQueryDateRange({ usageStart: start, usageEnd: end });
  }, [end, start]);

  const statisticsData = useMemo(() => {
    if (subOrFreePlan && chartData) {
      const headerItems = [__('date'), ...chartData.datasets.map((dataset) => dataset.keyName)];
      const rows = getRangeDate(
        moment(subOrFreePlan.current_period_start),
        moment(subOrFreePlan.current_period_end),
      )
        .map((date, index) => [date.format('YYYY-MM-DD'), ...chartData.datasets.map((dataset) => dataset.data[index])]);


      const csvHeader = headerItems.map((val) => `"${val}"`).join(',');
      const csv: string = [csvHeader, ...rows.map((row) => row.join(','))].join('\n');

      let html: string;
      const summary: (string | number)[] = [];

      html = `<html>
          <head>
            <meta charset="utf-8">
            <style>
              table { border-collapse: collapse; }
              td, th { border: 1px solid black; padding: 3px 5px 2px; }
              td { text-align: right; }
            </style>
          </head>
          <body>
            <table>`;
      html += `<thead><tr>${headerItems.map((item) => `<th>${item}</th>`).join('')}</tr></thead>`;
      html += '<tbody>';
      for (let index1 = 0; index1 < rows.length; index1++) {
        html += '<tr>';
        for (let index2 = 0; index2 < rows[index1].length; index2++) {
          const value = rows[index1][index2];
          if (index2 === 0) {
            summary[index2] = __('sub total');
            html += `<th>${value}</th>`;
          } else {
            if (summary[index2] === undefined) {
              summary[index2] = 0;
            }
            (summary[index2] as number) += (value as number);
            html += `<td>${value}</td>`;
          }
        }
        html += '</tr>';
      }
      html += '</tbody>';
      html += '<tfoot>';
      html += '<tr>';
      for (let index = 0; index < summary.length; index++) {
        const value = summary[index];
        if (index === 0) {
          html += `<th>${value}</th>`;
        } else {
          html += `<td>${value}</td>`;
        }
      }
      html += '</tr>';

      const total = summary.reduce<number>((prev, value) => prev + (typeof value === 'number' ? value : 0), 0);
      if (summary.length > 1) {
        html += `<tr><th>${__('total')}</th>`;
        for (let index = 0; index < summary.length - 2; index++) {
          html += '<td></td>';
        }
        html += `<td>${total}</td></tr>`;
      }
      html += '</tfoot>';
      html += '</table></body></html>';

      const legendItems = headerItems.reduce<{ [keyName: string]: { value: number, color: string } }>((prev, keyName, index) => {
        if (index > 0) {
          prev[keyName] = {
            value: summary[index] as number,
            color: chartData.datasets[index - 1].backgroundColor,
          };
        }
        return prev;
      }, {});

      return { csv, html, total, legendItems };
    }
    return null;
  }, [chartData, subOrFreePlan]);


  const onDownloadClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (subOrFreePlan && statisticsData) {
      let data: string;
      const anchor = document.createElement('a');
      const { format } = e.currentTarget.dataset;
      if (format === 'csv') {
        data = statisticsData.csv;
        const usageStart = moment(subOrFreePlan.current_period_start).format('YYYY-MM-DD');
        const usageEnd = moment(subOrFreePlan.current_period_end).format('YYYY-MM-DD');
        anchor.download = `${usageStart}_${usageEnd}.${format}`;
      } else if (format === 'html') {
        data = statisticsData.html;
        anchor.target = '_blank';
      } else {
        throw new Error(`Invalid format ${format}.`);
      }

      const file = new Blob([data], { type: `text/${format}` });
      const blobUrl = URL.createObjectURL(file);
      anchor.href = blobUrl;
      document.body.appendChild(anchor); // Required for this to work in FireFox
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    }
  }, [statisticsData, subOrFreePlan]);

  if (typeof chartData === 'undefined') {
    return null;
  }

  const rangeDisabled = subOrFreePlan &&
  moment(subOrFreePlan.current_period_start).format('YYYY-MM-DD') === start &&
  moment(subOrFreePlan.current_period_end).format('YYYY-MM-DD') === end;

  const noKeys = chartData.datasets.length === 0;

  return <Paper className="usage-details-info">

    <Typography component="h2" className="module-title">
      {__('Map loads details by API key')}
    </Typography>
    <Box position={'relative'}>
      <Box style={{
        paddingTop: 32,
        paddingLeft: 52,
        paddingRight: 52,
      }}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gridColumnGap={5}>
          <DatePicker disabled={!subOrFreePlan || isFetching} label={__('Start date')} value={start} onChange={ (date) => setStart(date) }></DatePicker>
          <DatePicker disabled={!subOrFreePlan || isFetching} label={__('End date')} value={end} onChange={ (date) => setEnd(date) }></DatePicker>
          <Button
            variant="contained"
            color="primary"
            onClick={setCustomRange}
            disabled={!subOrFreePlan || isFetching || rangeDisabled}
            type={'button'}
          >
            {__('Update')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleToggleDownloadMenu}
            disabled={!subOrFreePlan || isFetching || noKeys}
            endIcon={<KeyboardArrowDown />}
          >
            {__('Download')}
          </Button>
          <Menu
            className={'downloadFormatMenu'}
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleCloseDownloadMenu}
          >
            <MenuItem onClick={onDownloadClick} disabled={!subOrFreePlan || isFetching || noKeys} data-format={'html'}>{__('HTML format')}</MenuItem>
            <MenuItem onClick={onDownloadClick} disabled={!subOrFreePlan || isFetching || noKeys} data-format={'csv'}>{__('CSV format')}</MenuItem>
          </Menu>
        </Box>
        <div>
          <Bar data={chartData} options={CHARTJS_OPTIONS} id={'chart-usage-api-key'} height={100} />
        </div>
        { statisticsData && <>
          <p style={{display: 'flex', justifyContent: 'center' }}>
            {
              Object.keys(statisticsData.legendItems).map((keyName) => {
                const { value, color } = statisticsData.legendItems[keyName];
                return <div style={ { display: 'inline', margin: '0 10px' } } key={keyName}>
                  <i style={{
                    display: 'inline-block',
                    width: 40,
                    height: 12,
                    background: color,
                    marginRight: 10,
                  }} />
                  {`${keyName}: ${value.toLocaleString()}`}
                </div>;
              })
            }
          </p>
          <p style={{display: 'flex', justifyContent: 'center' }}>
            <em style={ { fontWeight: 'bold', fontStyle: 'normal', textTransform: 'uppercase' } }>{sprintf(__('total: %s'), statisticsData.total.toLocaleString())}</em>
          </p>
        </>
        }
        <p className="chart-helper-text">
          {__('API keys with no map loads will not be shown in the graph.')}
        </p>
      </Box>
      <Box position={'absolute'} left={-10} bottom={'50%'}>
        <IconButton onClick={onPrevClick} disabled={!subOrFreePlan || isFetching}>
          <ChevronLeft fontSize={'large'} />
        </IconButton>
      </Box>
      <Box position={'absolute'} right={-10} bottom={'50%'}>
        <IconButton onClick={onNextClick} disabled={!subOrFreePlan || isFetching}>
          <ChevronRight fontSize={'large'} />
        </IconButton>
      </Box>
    </Box>
  </Paper>;
};

export default UsageChart;
