
const util = require('../src/utils');
import echarts from 'echarts';

describe('Test for filterDataAsUnique function', () => {
    const testArray = [1, 1, 2, 3, 3, 4, 6, 6];
    const filterArray = [1, 2, 3, 4, 6];
    
    test('Filter Data as Unique', () => {
        const result =  util.filterDataAsUnique(testArray);
        expect(result).toEqual(filterArray);
    });

    test('Only received array argument', () => {
        const spy = jest.spyOn(util, 'filterDataAsUnique');
        util.filterDataAsUnique(filterArray);
        expect(spy).toHaveBeenCalledWith(expect.any(Array));
        expect(spy).not.toHaveBeenCalledWith(expect.any(String));
        expect(spy).not.toHaveBeenCalledWith(expect.any(Number));
    });

    test('Return empty array if received a number as argument', () => {
        const numberResult = util.filterDataAsUnique(366);
        expect(numberResult).toEqual([]);
    });

    test('Return empty array if received a string as argument', () => {
        const stringResult = util.filterDataAsUnique('string');
        expect(stringResult).toEqual([]);
    });

    test('Return empty array if received an Object as argument', () => {
        const objectResult = util.filterDataAsUnique({});
        expect(objectResult).toEqual([]);
    });

    test('Return empty array if received an emptya rray', () => {
        const result = util.filterDataAsUnique([]);
        expect(result).toEqual([]);
    });

    test('Return any array', () => {
        const spy = jest.spyOn(util, 'filterDataAsUnique');
        util.filterDataAsUnique(filterArray);
        expect(spy).toReturnWith(expect.any(Array));
    });
});

describe('Test for getData function', () => {
    const data = [
        {"group":["London","United Kingdom"],"current":{"count":19,"metrics":null,"na":false}},
        {"group":["Calgary","Canada"],"current":{"count":11,"metrics":null,"na":false}},
        {"group":["New York","United States"],"current":{"count":9,"metrics":null,"na":false}}];
    const correctResult = ["London", "Calgary", "New York"];

    test('Call with two arguments', () => {
        const spy = jest.spyOn(util, 'getData');
        util.getData(data, 0);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Array), expect.any(Number));
    });

    test('Should response correctly', () => {
        const result = util.getData(data, 0);
        expect(result).toEqual(correctResult);
    })

    test('Call with one argument', () => {
        const compareResult = ["London", "Calgary", "New York"];
        const spy = jest.spyOn(util, 'getData');
        const result = util.getData(data);
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    test('Call with not arguments', () => {
        const compareResult = ["London", "Calgary", "New York"];
        const spy = jest.spyOn(util, 'getData');
        const result = util.getData();
        expect(spy).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    test('Call with empty array', () => {
        const result = util.getData([{}], 0);
        expect(result).toEqual([]);
    });

    test('Call with group not an array', () => {
        const result = util.getData([{group: {}}], 0);
        expect(result).toEqual([]);
    });

    test('Call with wrong index', () => {
        const testData = [data[0]];
        const result = util.getData(testData, 5);
        expect(result).toEqual([]);
    });

    test('Should return any array', () => {
        const spy = jest.spyOn(util, 'getData');
        util.getData(data, 0);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Array));
    });

});

describe('Test for getSerieData function', () => {
    const data = [
        {"group":["London","United Kingdom"],"current":{"count":19,"metrics":null,"na":false}},
        {"group":["Calgary","Canada"],"current":{"count":11,"metrics":null,"na":false}},
        {"group":["New York","United States"],"current":{"count":9,"metrics":null,"na":false}}];
    const firstGroup = ["London", "Calgary", "New York"];
    const secondGroup = ["United Kingdom", "Canada", "United States"];
    const wrongResult = [];
    const wrongResultWithEmptyArgumetns = [{ "itemStyle": { "color": "#0096b6", }, 
                                            "label": { "color": "#FFF", }, "value": [-1, -1, null, {}] }]

    test('Call with three arguments', () => {
        global.controller = { getColorAccessor: () => ({ color: color => '#0096b6' }) }
        const spy = jest.spyOn(util, 'getSerieData');
        util.getSerieData(data, firstGroup, secondGroup);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Array), expect.any(Array), expect.any(Array));
    });

    it('Should return Array values', () => {
        const result = util.getSerieData(data, firstGroup, secondGroup);
        expect(result).toMatchSnapshot();
    });

    test('Call without arguments', () => {
        const result = util.getSerieData();
        expect(result).toEqual(wrongResult);
    });

    test('Call with wrong arguments', () => {
        const result = util.getSerieData(123, 'abc', {});
        expect(result).toEqual(wrongResult);
    });

    test('Call with only one argument', () => {
        const result = util.getSerieData(data);
        expect(result).toEqual(wrongResult);
    });

    test('Call with two arguments', () => {
        const result = util.getSerieData(data, firstGroup);
        expect(result).toEqual(wrongResult);
    });

    test('Call with empty arguments', () => {
        const result = util.getSerieData([{}], [], []);
        expect(result).toEqual(wrongResultWithEmptyArgumetns);
    });

    test('Should return Array', () => {
        const spy = jest.spyOn(util, 'getSerieData');
        util.getSerieData(data, firstGroup, secondGroup);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Array));
    });
});

describe('Test for getMetricTooltip function', () => {
    const params = { data: { value: [0, 0, 3, {"group":["London","United Kingdom"],"current":{"count":19,"metrics":null,"na":false}}] },
                     color: '#FFFFFF', name: 'City' };
    const secondGroupValue = "Canada";
    const wrongResult = '';

    it('Call with two arguments', () => {
        global.controller = { query: { groups: { toJSON: () => [
            { "name": "city", "limit": 50, "sort": { "name": "count", "dir": "desc", "label": "Volume", "type": "COUNT" }, "type": "ATTRIBUTE", "label": "City" }, 
            { "name": "country", "limit": 20, "sort": { "name": "count", "dir": "desc", "label": "Volume", "type": "COUNT"}, "type": "ATTRIBUTE", "label": "Country"}]},
            getMetrics: () => [{ "type": "COUNT", "label": "Volume" }],
        } }
        const spy = jest.spyOn(util, 'getMetricTooltip');
        const result = util.getMetricTooltip(params, secondGroupValue);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Object), expect.any(String));
        expect(result).toMatchSnapshot()
    });

    it('Should response string html component', () => {
        const result = util.getMetricTooltip(params, secondGroupValue);
        expect(result).toMatchSnapshot();
    });

    test('Call without arguments', () => {
        const result = util.getMetricTooltip();
        expect(result).toEqual(wrongResult);
    });

    test('Call with one argument', () => {
        const result = util.getMetricTooltip(params);
        expect(result).toEqual(wrongResult);
    });

    test('Call with wrong arguments', () => {
        const result = util.getMetricTooltip([], {});
        expect(result).toEqual(wrongResult);
    });

    test('Always should return string', () => {
        const spy = jest.spyOn(util, 'getMetricTooltip');
        util.getMetricTooltip(params, secondGroupValue);
        expect(spy).toReturnWith(expect.any(String));
    });
});

describe('Test for checkMetrics function', () => {
    const testData = { current: { metrics: { field: { price: 1200 }, funtion: 'SUM' } } }

    test('Call with two arguments', () => {
        const spy = jest.spyOn(util, 'checkMetrics');
        util.checkMetrics(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Object));
    });

    test('Should return true', () => {
        const result = util.checkMetrics(testData);
        expect(result).toBeTruthy();
    });

    test('Should return false', () => {
        const result = util.checkMetrics({ current: [] });
        expect(result).toBeFalsy();
    });

    test('Should return boolean', () => {
        const spy = jest.spyOn(util, 'checkMetrics');
        util.checkMetrics(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Boolean));
    });
});

describe('Test for formatterSeriesData function', () => {
    const params = { data: { value: [0, 0, 3, {"group":["London","United Kingdom"],"current":{"count":19,"metrics":null,"na":false}}] },
                     color: '#FFFFFF', name: 'City' };
    const heatMap = { id: 'ec_3768472768274', getModel: () => ({ getComponent: component => ({ coordinateSystem: { getAxis: axis => ({ getBandWidth: () => 30 }) }, getTextRect: text => ({ height: 12,  width: text.length }) }) }) }; 
    const wrongResult = '';

    test('Call with one arguments', () => {
        const spy = jest.spyOn(util, 'formatterSeriesData');
        util.formatterSeriesData(params, heatMap);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    test('Should return value', () => {
        const result = util.formatterSeriesData(params, heatMap);
        expect(result).toEqual(3);
    });

    test('Call without arguments', () => {
        const result = util.formatterSeriesData();
        expect(result).toEqual(wrongResult);
    });

    test('Call with first argument', () => {
        const result = util.formatterSeriesData(params);
        expect(result).toEqual(wrongResult);
    });

    test('Call with second argument', () => {
        const result = util.formatterSeriesData(heatMap);
        expect(result).toEqual(wrongResult);
    });

    test('Call with wrong arguments', () => {
        const result = util.formatterSeriesData([], 'jdhfhg');
        expect(result).toEqual(wrongResult);
    });

    test('Should always return string', () => {
        const spy = jest.spyOn(util, 'formatterSeriesData');
        util.formatterSeriesData(params, heatMap);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(String));
    });
});

describe('Test for filterIntervalAxisCategory function', () => {
    const data = ["United Kingdom", "Canada", "United States", "Netherlands", "France", "Australia", "Norway", 
                  "Ireland", "United Arab Emirates", "Belgium", "Austria", "Germany", "Spain", "Italy"];
    const skipStep = 2;
    const wrongResult = [];

    test('Call with one arguments', () => {
        const spy = jest.spyOn(util, 'filterIntervalAxisCategory');
        util.filterIntervalAxisCategory(data, skipStep);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Array), expect.any(Number));
    });

    test('Call without arguments', () => {
        const result = util.filterIntervalAxisCategory();
        expect(result).toEqual(wrongResult);
    });

    test('Call with first argument', () => {
        const result = util.filterIntervalAxisCategory(data);
        expect(result).toEqual(wrongResult);
    });

    test('Call with second argument', () => {
        const result = util.filterIntervalAxisCategory(skipStep);
        expect(result).toEqual(wrongResult);
    });

    test('Call with string number argument', () => {
        const result = util.filterIntervalAxisCategory([1, 2, 3], skipStep);
        expect(result).toEqual(wrongResult);
    });

    test('Call with string and number array argument', () => {
        const result = util.filterIntervalAxisCategory(['a', 2, 'c'], skipStep);
        expect(result).toEqual(wrongResult);
    });

    test('Call with distinct kind of values array argument', () => {
        const result = util.filterIntervalAxisCategory(['a', 2, [], {}], skipStep);
        expect(result).toEqual(wrongResult);
    });

    test('Have to return any Array', () => {
        const spy = jest.spyOn(util, 'filterIntervalAxisCategory');
        util.filterIntervalAxisCategory(data, skipStep);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Array));
    });
});

describe('Test for getxAxisBandWidth function', () => {
    const [width, left, margin, size] = [500, 20, 8, 5];
    test('Call with one arguments', () => {
        const spy = jest.spyOn(util, 'getxAxisBandWidth');
        util.getxAxisBandWidth(width, left, margin, size);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), 
                                         expect.any(Number), expect.any(Number));
    });

    test('Call with empty arguments', () => {
        const result = util.getxAxisBandWidth();
        expect(result).toBeNaN();
    });

    test('Call with wrong arguments', () => {
        const result = util.getxAxisBandWidth({}, [], 'dbfbfj', 5);
        expect(result).toBeNaN();
    });

    test('Should return any number', () => {
        const spy = jest.spyOn(util, 'getxAxisBandWidth');
        util.getxAxisBandWidth(width, left, margin, size);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Number));
    });

});
