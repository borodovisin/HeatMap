import echarts from 'echarts';
import _ from 'lodash';

/**
 * Get the value from raw element
 * @param {object} current Information of the one raw element
 * @returns {integer} Value of the metric
 */
const getSerieDataValue = current => {
    if (_.has(current, 'count') && _.has(current, 'metrics')) {
        if (current.metrics) {
            if (_.findKey(current.metrics)){
                const metricValue = current.metrics[_.findKey(current.metrics)];
                return metricValue[_.findKey(metricValue)] ? metricValue[_.findKey(metricValue)] : 0;
            }
        } else {
            return current.count;
        }
    }
    return 0;
};

/**
 * Get Group labels
 * @param {array} data 
 * @returns {array} An array with the Group labels
 */
const getTooltipLabel = data => {
    if (Array.isArray(data) && data.length === 2 && _.has(_.first(data), 'label') && _.has(_.last(data), 'label'))
        return [_.first(data).label, _.last(data).label];
    return ['', ''];
}

/**
 * Get the Metric label
 * @param {array} data 
 * @returns {string} The label value for selected metric
 */
const getMetricLabel = data => Array.isArray(data) && _.first(data) && _.has(_.first(data), 'label') ? _.first(data).label : '';

/**
 * Get metric label and function
 * @param {array} data 
 * @returns {array} Two values the label metric and function name
 */
const getComplexMetricLabel = data => {
    const metric = _.first(data);
    if (_.has(metric, 'field') && _.has(metric, 'function') && _.has(metric.field, 'label'))
        return `${metric.field.label} (${metric.function})`;
    return '';
};

/**
 * Get table row for tooltip
 * @param {string} label 
 * @param {string} value 
 */
const getTableRow = (label, value) => `<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">${label}</div><div class="zd_tooltip_info_table_row_value">${value}</div></div>`;

/**
 * Get the lastest metric with color box
 * @param {string} label 
 * @param {string} value 
 * @param {string} color 
 */
const getLastMetric = (label, value, color) => `<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">${label}</div><div class="zd_tooltip_info_table_row_value"><div class="color_icon active" style="background-color: ${color};"></div>${controller.getColorAccessor().formatted(value)}</div></div>`;

/**
 * Get the metric definition for the tooltip
 * @param {object} params 
 */
const getFinalMetric = params => {
    if (_.has(params, 'color') && _.has(params, 'data') && _.has(params.data, 'value') && 
        Array.isArray(params.data.value) && params.data.value.length === 4) {
        const datum = _.last(params.data.value);
        if (datum.current.metrics) {
            const label = getComplexMetricLabel(controller.query.getMetrics());
            const lastMetric = getLastMetric(label, params.data.value[3], params.color);
            return `<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">Volumen</div><div class="zd_tooltip_info_table_row_value">${datum.current.count}</div></div>${lastMetric}`;
        }
        return getLastMetric(getMetricLabel(controller.query.getMetrics()), params.data.value[3], params.color);
    }
    return '';
}

/**
 * 
 * @param {object} d object datum from zoomdata 
 */
const getColor = d => controller.getColorAccessor().color(d);

const luminosity = color => {
    const rgb = typeof color === 'string' && color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        ? echarts.color.parse(color) : color;
    const rgbSum = _.sum(rgb);
    if (Array.isArray(rgb) && rgb.length === 4 && rgbSum <= 766 && rgbSum >= 0)
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // SMPTE C, Rec. 709 weightings
    return 0;
};

const contrastingColor = luma => (luma >= 165 ? '#000' : '#FFF');

const blackOrWhiteText = _.flow(getColor, luminosity, contrastingColor);

/**
 * Max number admited inside a heat fragment, if is higher it will be truncated
 */
export const limitNumberSize = 999;

/**
 * Filter array for unique values
 * @param {array} data An array with possible repeated values
 * @returns {array} Unique array without repeated values
 */
export const filterDataAsUnique = data => (Array.isArray(data)) ? _.uniq(data) : [];

/**
 * Get information at specific index
 * @param {array} data An array with the data
 * @returns {array} Array with possible repeated values
 */
export const  getData = (data, index) => {
    try {
        return data.map(d => {
            if (Array.isArray(d.group) && d.group[index]) return d.group[index];
            throw new Error(`Index out of range: ${index}`);
        });
    } catch (e) {
        console.error(e.message);
        return [];
    }
};

/**
 * Get object for the axis in the chart
 * @param {array} data An array with the data
 * @returns {object} Object with the axis information
 */
export const getAxisOption = () => ({
    type: 'category',
    axisLine: { show: false },
    axisTick: { show: false },
    show: true,
    splitArea: {
        show: true,
        areaStyle: {
            color: 'transparent',
        }
    },
    splitLine: {
        show: true,
        lineStyle: {
            width: 1,
            color: '#FFF',
        }
    },
    axisLabel: {
        interval: 0,
    }
});

/**
 * Process the raw data information
 * @param {array} data Raw object information
 * @param {array} firstGroup Array of strings with Group 1 information
 * @param {array} secondGroup Array of strings with Group 2 information
 * @returns {array} Array with the data for echarts series
 */
export const getSerieData = (data, firstGroup, secondGroup) => {
    if (Array.isArray(data) && Array.isArray(firstGroup) && Array.isArray(secondGroup)) {
        return data.map(d => {
            const firstIndex = _.has(d, 'group') && Array.isArray(d.group) && d.group[0] ? _.indexOf(firstGroup, d.group[0]) : -1;
            const secondIndex = _.has(d, 'group') && Array.isArray(d.group) && d.group[1] ? _.indexOf(secondGroup, d.group[1]) : -1;
            const value = _.has(d, 'current') && Array.isArray(firstGroup) ? getSerieDataValue(d.current, firstGroup) : null;
            return { 
                value: [firstIndex, secondIndex, value, d], 
                label: {
                    color: blackOrWhiteText(d),
                }, 
                itemStyle: {
                    color: getColor(d),
                }
            };
        });   
    }
    return [];
}

/**
 * Get content metric for tooltip, if have another metric than count is added
 * @param {object} params 
 * @returns {string} A string with the content 
 */
export const getMetricTooltip = (params, secondGroupValue) => {
    if (params && _.has(params, 'name') && _.has(params, 'color') && _.has(params, 'data.value') && 
        Array.isArray(params.data.value) && typeof secondGroupValue === 'string') {
        const [firstLabel, secondLabel] = getTooltipLabel(controller.query.groups.toJSON());
        const finalMetric = getFinalMetric(params);
        return `<div class="zd_tooltip_info_group customized"><div class="zd_tooltip_info_table"><div class="zd_tooltip_info_table_row">${getTableRow(firstLabel, params.name)}</div><div class="zd_tooltip_info_table_row">${getTableRow(secondLabel, secondGroupValue)}</div>${finalMetric}</div></div>`;
    }
    return '';
}

/**
 * Check if exists selected metric
 * @param {object} data 
 * @returns boolean
 */
export const checkMetrics = data => _.has(data, 'current.metrics') && data.current.metrics;

export const formatterSeriesData = (params, heatMap) => {
    if (_.has(params, 'data.value') && Array.isArray(params.data.value) && 
        params.data.value.length === 4 && _.has(heatMap, 'id') && heatMap.id) {
        const textValue = params.data.value[2];
        const seriesComponent = heatMap.getModel().getComponent(params.componentType);
        const labelRect = seriesComponent.getTextRect(textValue);
        const containerWidth =  seriesComponent.coordinateSystem.getAxis('x').getBandWidth();
        const containerHeight = seriesComponent.coordinateSystem.getAxis('y').getBandWidth();
        return (labelRect.width > containerWidth || labelRect.height > containerHeight) ? '' : textValue;
    }
    return '';
}

export const formatterAxisLabel = _.flow(_.trimEnd, _.partialRight(_.truncate, { length: 20 }));

export const filterIntervalAxisCategory = (data, skipStep) => {
    if (Array.isArray(data) && Number.isInteger(skipStep) && data.every(value => typeof value === 'string'))
        return data.filter((d, i) => i % skipStep === 0);
    return [];
}

export const getxAxisBandWidth = (chartWidth, left, margin, size) => (chartWidth - left - margin) / size;