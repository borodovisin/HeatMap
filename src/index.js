import echarts from 'echarts';
import {
    map,
    maxBy,
    compose
  } from 'lodash/fp';
import { 
    getData, 
    filterDataAsUnique, 
    getAxisOption,
    getSerieData,
    getMetricTooltip,
    formatterSeriesData, 
    formatterAxisLabel,
    filterIntervalAxisCategory,
    getxAxisBandWidth,
} from './utils';

import './index.css';

/**
 * Global controller object is described on Zoomdata knowledge base
 * @see https://www.zoomdata.com/developers/docs/custom-chart-api/controller/
 */

/* global controller */

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/creating-chart-container/
 */
const chartContainer = document.createElement('div');
chartContainer.classList.add('chart-container');
chartContainer.id = 'idDivHeatMap';
controller.element.appendChild(chartContainer);

const margin = {
    top: 0,
    left: 5,
    right: 0,
    bottom: 5,
  };

const option = {
    grid: {
        containLabel: false,
        ...margin,
    },
    xAxis: getAxisOption(),
    yAxis: getAxisOption(),
    visualMap: {
        show: false,
        inRange: { color: controller.getColorAccessor().getColorRange() },
        dimension: 2,
    },
    series: [
        {
            name: 'Heat Map',
            type: 'heatmap',
            label: {
                show: true,
                formatter: (params) => formatterSeriesData(params, heatMap),
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                borderColor: '#FFF',
            }
        }
    ]
};
option.xAxis.position = 'top';
option.yAxis.splitArea.areaStyle.color = '#F1F1F1';

echarts.registerProcessor(ecModel => {
    const gridComponent = ecModel.getComponent('grid');
    const xAxisComponent = ecModel.getComponent('xAxis');
    const yAxisComponent = ecModel.getComponent('yAxis');
    const xAxisMargin = xAxisComponent.get('axisLabel.margin');
    const yAxisMargin = yAxisComponent.get('axisLabel.margin');
    const seriesComponent = ecModel.getComponent('series');
    const xAxisData = xAxisComponent.getCategories();
    const yAxisData = yAxisComponent.getCategories();
  
    const getXLabelRect = str => xAxisComponent.getTextRect(formatterAxisLabel(str));
    const getYLabelRect = str => yAxisComponent.getTextRect(formatterAxisLabel(str));
    
    const getLabelWidth = (labelRect) => labelRect.width;
    const widestX = _.flow(map(getXLabelRect), maxBy(getLabelWidth));
    const widestY = _.flow(map(getYLabelRect), maxBy(getLabelWidth));
    const labelRectX = widestX(xAxisData);
    const labelRectY = widestY(yAxisData);
  
    gridComponent.option.top = margin.top + labelRectX.height + xAxisMargin;
    gridComponent.option.left = margin.left + labelRectY.width + yAxisMargin;
    // Start always with rotate 0 in xAxis
    xAxisComponent.option.axisLabel.rotate = 0;
    
    if (getxAxisBandWidth(heatMap.getWidth(), gridComponent.option.left, margin.right,  xAxisData.length) <= labelRectX.width) {
        const textBandWidthRatio = labelRectX.height / getxAxisBandWidth(heatMap.getWidth(), gridComponent.option.left, margin.right,  xAxisData.length);
        xAxisComponent.option.axisLabel.rotate = -90;
        gridComponent.option.top = margin.top + labelRectX.width + xAxisMargin;
        xAxisComponent.option.axisLabel.interval = textBandWidthRatio <= 1 ? textBandWidthRatio < 0 ? xAxisData.length : 0 : Math.floor(textBandWidthRatio);
    
        if (xAxisComponent.option.axisLabel.interval > 0) {
          const skipStep = xAxisComponent.option.axisLabel.interval + 1;
          gridComponent.option.top = margin.top + widestX(filterIntervalAxisCategory(xAxisData, skipStep)).width + xAxisMargin;
        }
    }

    const yBandWidth = (heatMap.getHeight() - gridComponent.option.top - margin.bottom) / yAxisData.length;
    const textBandWidthRatioY = labelRectY.height / yBandWidth;
    yAxisComponent.option.axisLabel.interval = textBandWidthRatioY <= 1 ? textBandWidthRatioY < 0 ? yAxisData.length : 0 : Math.floor(textBandWidthRatioY);

    if (yAxisComponent.option.axisLabel.interval > 0) {
      const skipStep = yAxisComponent.option.axisLabel.interval + 1;
      gridComponent.option.left = margin.left + widestY(filterIntervalAxisCategory(yAxisData, skipStep)).width + yAxisMargin;
    }
  
    const minBandWidth = _.min([getxAxisBandWidth(heatMap.getWidth(), gridComponent.option.left, margin.right,  xAxisData.length), yBandWidth]);
    if (minBandWidth <= 5) {
        seriesComponent.option.itemStyle.borderWidth = 0;
        xAxisComponent.option.splitLine.show = false;
        yAxisComponent.option.splitLine.show = false;

    } else {
        seriesComponent.option.itemStyle.borderWidth = 1;
        xAxisComponent.option.splitLine.show = true;
        yAxisComponent.option.splitLine.show = true;
    }
});

const heatMap = echarts.init(document.querySelector('#idDivHeatMap'));

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/updating-queries-axis-labels/
 */
controller.createAxisLabel({
    picks: 'Multi Group By',
    orientation: 'horizontal',
    position: 'bottom',
    popoverTitle: 'Group'
});

controller.createAxisLabel({
    picks: 'Color Metric',
    orientation: 'horizontal',
    position: 'bottom'
});

/**
 * @see http://www.zoomdata.com/developers/docs/custom-chart-api/receiving-chart-data/
 */
controller.update = data => {
    const [min, max] = controller.getColorAccessor().getDomain();
    const firstGruop = compose(filterDataAsUnique, getData)(data, 0);
    const secondGroup = compose(filterDataAsUnique, getData)(data, 1);
    option.visualMap.min = min;
    option.visualMap.max = max;
    option.xAxis.data = firstGruop;
    option.yAxis.data = secondGroup;
    option.series[0].data = getSerieData(data, firstGruop, secondGroup);
    heatMap.setOption(option);
};

controller.resize = () => heatMap.resize();


// EVENTS FROM ECHARTS
heatMap.on('mousemove', params => {
    controller.tooltip.show({
        x: params.event.event.clientX,
        y: params.event.event.clientY,
        data: () => _.last(params.data),
        content: () => {
            return getMetricTooltip(params, _.last(_.last(params.data.value).group));
        }
    });
});

heatMap.on('mouseout', () => {
    controller.tooltip.hide();
});

heatMap.on('click', params => {
    controller.tooltip.hide();
    controller.menu.show({
        x: params.event.event.clientX,
        y: params.event.event.clientY,
        data: () => _.last(params.data.value),
    });
});
