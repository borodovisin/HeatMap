const util = require('../src/utils');

describe('Test for luminosity', () => {
    const internalFunction = { luminosity: util.__get__('luminosity') };
    
    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'luminosity');
        const result = internalFunction.luminosity('#FFF');
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(String));
    });

    test('Expect result to be any number', () => {
        const result = internalFunction.luminosity('#000');
        expect(result).toEqual(expect.any(Number));
    });

    test('Expect result to be greater or equal to zero', () => {
        const result = internalFunction.luminosity('#000');
        expect(result).toBeGreaterThanOrEqual(0);
    });

    test('Expect result to be less or equal to 255', () => {
        const result = internalFunction.luminosity('#FFF');
        expect(result).toBeLessThanOrEqual(255);
    });

    test('Expect that not return a Nan value', () => {
        const result = internalFunction.luminosity('#FFF');
        expect(result).not.toEqual(NaN);
    });

    test('Expect that not return a Nan value when pass string array', () => {
        const result = internalFunction.luminosity(['a', 'n', 'j', 'd']); 
        expect(result).toEqual(0);
    });

    test('Expect that not return a Nan value when pass object array', () => {
        const result = internalFunction.luminosity([{}, {}, {}, {}]); 
        expect(result).toEqual(0);
    });
});

describe('Test for contrastingColor', () => {
    const internalFunction = { contrastingColor: util.__get__('contrastingColor') };

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'contrastingColor');
        const result = internalFunction.contrastingColor(30);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Number));
        expect(result).toEqual('#FFF');
    });

    test('Call with not argument', () => {
        const result = internalFunction.contrastingColor();
        expect(result).toEqual('#FFF');
    });

    test('Value grater or equal to 165', () => {
        const result = internalFunction.contrastingColor(165);
        expect(result).toEqual('#000');
    });

    test('Value grater or equal to 1000', () => {
        const result = internalFunction.contrastingColor(1000);
        expect(result).toEqual('#000');
    });
});

describe('Test for getSerieDataValue', () => {
    const internalFunction = { getSerieDataValue: util.__get__('getSerieDataValue') };
    const testData = { count:  10, metrics: null, na: false }

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'getSerieDataValue');
        const result = internalFunction.getSerieDataValue(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Object));
        expect(result).toEqual(10);
    });

    test('Call with not argument', () => {
        const result = internalFunction.getSerieDataValue();
        expect(result).toEqual(0);
    });

    test('Call with empty object argument', () => {
        const result = internalFunction.getSerieDataValue({});
        expect(result).toEqual(0);
    });

    test('Call with only count argument', () => {
        const result = internalFunction.getSerieDataValue({ count: 10, na: false});
        expect(result).toEqual(0);
    });

    test('Call with only metrics argument', () => {
        const result = internalFunction.getSerieDataValue({ metrics: { price: 1200 }, na: false});
        expect(result).toEqual(0);
    });

    test('Call with only metrics distinct of null argument', () => {
        const result = internalFunction.getSerieDataValue({ count: 50, metrics: { price: { sum: 1200 }}, na: false});
        expect(result).toEqual(1200);
    });

    test('Call with wrong metrics object argument', () => {
        const result = internalFunction.getSerieDataValue({ count: 50, metrics: { price: { }}, na: false});
        expect(result).toEqual(0);
    });

    test('Call with wrong metrics object argument', () => {
        const result = internalFunction.getSerieDataValue({ count: 50, metrics: { }, na: false});
        expect(result).toEqual(0);
    });

    test('Call with string argument', () => {
        const result = internalFunction.getSerieDataValue('kdjfjfj');
        expect(result).toEqual(0);
    });

    test('Call with number argument', () => {
        const result = internalFunction.getSerieDataValue(500);
        expect(result).toEqual(0);
    });

    test('Call with array argument', () => {
        const result = internalFunction.getSerieDataValue([1, 2, 3]);
        expect(result).toEqual(0);
    });

    test('Should return any number', () => {
        const spy = jest.spyOn(internalFunction, 'getSerieDataValue');
        internalFunction.getSerieDataValue(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Number));
    });
});

describe('Test for getTooltipLabel', () => {
    const internalFunction = { getTooltipLabel: util.__get__('getTooltipLabel') };
    const testData = [
        { "name": "city", "limit": 50,
        "sort": { "name": "count", "dir": "desc", "label": "Volume", "type": "COUNT" },
        "type": "ATTRIBUTE", "label": "City"},
        { "name": "country", "limit": 20, 
        "sort": { "name": "count", "dir": "desc", "label": "Volume", "type": "COUNT" },
        "type": "ATTRIBUTE", "label": "Country" }];
        const correctResult = ['City', 'Country'];
        const wrongResult = ['', ''];

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'getTooltipLabel');
        const result = internalFunction.getTooltipLabel(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Array));
        expect(result).toEqual(correctResult);
    });

    test('Call without argument', () => {
        const result = internalFunction.getTooltipLabel();
        expect(result).toEqual(wrongResult);
    });
    
    test('Call with string as argument', () => {
        const result = internalFunction.getTooltipLabel('dnfjdbfhjb');
        expect(result).toEqual(wrongResult);
    });

    test('Call with number as argument', () => {
        const result = internalFunction.getTooltipLabel(123);
        expect(result).toEqual(wrongResult);
    });

    test('Call with object as argument', () => {
        const result = internalFunction.getTooltipLabel({});
        expect(result).toEqual(wrongResult);
    });

    test('Call with empty array as argument', () => {
        const result = internalFunction.getTooltipLabel([]);
        expect(result).toEqual(wrongResult);
    });

    test('Call without label key inside argument object', () => {
        const result = internalFunction.getTooltipLabel([{ type: "Country" }, { type: "Country" }]);
        expect(result).toEqual(wrongResult);
    });

    test('Call with second object inside list without label key', () => {
        const result = internalFunction.getTooltipLabel([{ label: "City" }, { type: "Country" }]);
        expect(result).toEqual(wrongResult);
    });

    test('Call with first object inside list without label key', () => {
        const result = internalFunction.getTooltipLabel([{ type: "Country" }, { label: "City" }]);
        expect(result).toEqual(wrongResult);
    });

    test('Expect return string', () => {
        const spy = jest.spyOn(internalFunction, 'getTooltipLabel');
        internalFunction.getTooltipLabel(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(Array));
    });
});

describe('Test for getMetricLabel', () => {
    const internalFunction = { getMetricLabel: util.__get__('getMetricLabel') };
    const testData = [{ "type":"COUNT", "label":"Volume" }];
    const wrongResult = '';

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'getMetricLabel');
        const result = internalFunction.getMetricLabel(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Array));
        expect(result).toEqual("Volume");
    });

    test('Call without argument', () => {
        const result = internalFunction.getMetricLabel();
        expect(result).toEqual(wrongResult);
    });
    
    test('Call with string as argument', () => {
        const result = internalFunction.getMetricLabel('dnfjdbfhjb');
        expect(result).toEqual(wrongResult);
    });

    test('Call with number as argument', () => {
        const result = internalFunction.getMetricLabel(123);
        expect(result).toEqual(wrongResult);
    });

    test('Call with object as argument', () => {
        const result = internalFunction.getMetricLabel({});
        expect(result).toEqual(wrongResult);
    });

    test('Call with empty array as argument', () => {
        const result = internalFunction.getMetricLabel([]);
        expect(result).toEqual(wrongResult);
    });

    test('Call without label key inside argument object', () => {
        const result = internalFunction.getMetricLabel([{ type: "COUNT" }]);
        expect(result).toEqual(wrongResult);
    });

    test('Expect return string', () => {
        const spy = jest.spyOn(internalFunction, 'getMetricLabel');
        internalFunction.getMetricLabel(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(String));
    });
});

describe('Test for getComplexMetricLabel', () => {
    const internalFunction = { getComplexMetricLabel: util.__get__('getComplexMetricLabel') };
    const testData = [{ "type": "FIELD", "field": { "name": "price", "label" :"Price", "type": "NUMBER"},
                      "function": "SUM" }];
    const correctResult = 'Price (SUM)';
    const wrongResult = '';

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'getComplexMetricLabel');
        const result = internalFunction.getComplexMetricLabel(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Array));
        expect(result).toEqual(correctResult);
    });

    test('Call without argument', () => {
        const result = internalFunction.getComplexMetricLabel();
        expect(result).toEqual(wrongResult);
    });
    
    test('Call with string as argument', () => {
        const result = internalFunction.getComplexMetricLabel('dnfjdbfhjb');
        expect(result).toEqual(wrongResult);
    });

    test('Call with number as argument', () => {
        const result = internalFunction.getComplexMetricLabel(123);
        expect(result).toEqual(wrongResult);
    });

    test('Call with object as argument', () => {
        const result = internalFunction.getComplexMetricLabel({});
        expect(result).toEqual(wrongResult);
    });

    test('Call with empty array as argument', () => {
        const result = internalFunction.getComplexMetricLabel([]);
        expect(result).toEqual(wrongResult);
    });

    test('Call without function key inside argument object', () => {
        const result = internalFunction.getComplexMetricLabel([{ field: { label: "Price" } }]);
        expect(result).toEqual(wrongResult);
    });

    test('Call without label key inside argument object', () => {
        const result = internalFunction.getComplexMetricLabel([{ field: {  }, function: "SUM" }]);
        expect(result).toEqual(wrongResult);
    });

    test('Call without field key inside argument object', () => {
        const result = internalFunction.getComplexMetricLabel([{ function: "SUM" }]);
        expect(result).toEqual(wrongResult);
    });

    test('Expect return string', () => {
        const spy = jest.spyOn(internalFunction, 'getComplexMetricLabel');
        internalFunction.getComplexMetricLabel(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(String));
    });
});

describe('Test for getTableRow', () => {
    const internalFunction = { getTableRow: util.__get__('getTableRow') };
    const correctResult = '<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">City</div><div class="zd_tooltip_info_table_row_value">Miami</div></div>';
    const wrongResultWithEmptyArgument = '<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">undefined</div><div class="zd_tooltip_info_table_row_value">undefined</div></div>';

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'getTableRow');
        const result = internalFunction.getTableRow('City', 'Miami');
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(String), expect.any(String));
        expect(result).toEqual(correctResult);
    });

    test('Call with one argument', () => {
        const spy = jest.spyOn(internalFunction, 'getTableRow');
        internalFunction.getTableRow(345, 500);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
    });

    test('Call without argument', () => {
        const result = internalFunction.getTableRow();
        expect(result).toEqual(wrongResultWithEmptyArgument);
    });


    test('Expect return string', () => {
        const spy = jest.spyOn(internalFunction, 'getTableRow');
        internalFunction.getTableRow('City', 'Miami');
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(String));
    });
});

describe('Test for getLastMetric', () => {
    const internalFunction = { getLastMetric: util.__get__('getLastMetric') };
    const correctResult = '<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">Volume</div><div class="zd_tooltip_info_table_row_value"><div class="color_icon active" style="background-color: #FFFFFF;"></div>3</div></div>';
    const wrongResultWithEmptyArgument = '<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">undefined</div><div class="zd_tooltip_info_table_row_value"><div class="color_icon active" style="background-color: undefined;"></div>undefined</div></div>';
    const [label, value, color] = ['Volume', 3, '#FFFFFF'];

    test('Call with arguments', () => {
        const spy = jest.spyOn(internalFunction, 'getLastMetric');
        const result = internalFunction.getLastMetric(label, value, color);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(String), expect.any(Number), expect.any(String));
        expect(result).toEqual(correctResult);
    });

    test('Call with value argument as string', () => {
        const spy = jest.spyOn(internalFunction, 'getLastMetric');
        internalFunction.getLastMetric(label, value.toString(), color);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.any(String));
    });

    test('Call without arguments', () => {
        const result = internalFunction.getLastMetric();
        expect(result).toEqual(wrongResultWithEmptyArgument);
    });


    test('Expect return string', () => {
        const spy = jest.spyOn(internalFunction, 'getLastMetric');
        internalFunction.getLastMetric(label, value, color);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(String));
    });
});

describe('Test for getFinalMetric', () => {
    const internalFunction = { getFinalMetric: util.__get__('getFinalMetric') };
    const testData = { data: { value: [0, 0, 3, {"group":["London","United Kingdom"],"current":{"count":19,"metrics":null,"na":false}}] },
                        color: '#FFFFFF' };
    const correctResult = '<div class="zd_tooltip_info_table_row"><div class="zd_tooltip_info_table_row_label">Volume</div><div class="zd_tooltip_info_table_row_value"><div class="color_icon active" style="background-color: #FFFFFF;"></div>3</div></div>';
    const wrongResult = ''; 
    
    test('Call with arguments', () => {
        global.controller = { query: { getMetrics: () => [{ type: "COUNT", label: "Volume" }] } };
        const spy = jest.spyOn(internalFunction, 'getFinalMetric');
        const result = internalFunction.getFinalMetric(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(expect.any(Object));
        expect(result).toEqual(correctResult);
    });

    test('Call without arguments', () => {
        const result = internalFunction.getFinalMetric();
        expect(result).toEqual(wrongResult);
    });

    test('Call with number as argument', () => {
        const result = internalFunction.getFinalMetric(123);
        expect(result).toEqual(wrongResult);
    });

    test('Call with string as argument', () => {
        const result = internalFunction.getFinalMetric('djfjhgfj');
        expect(result).toEqual(wrongResult);
    });

    test('Call with empty object as argument', () => {
        const result = internalFunction.getFinalMetric({});
        expect(result).toEqual(wrongResult);
    });

    test('Call with array as argument', () => {
        const result = internalFunction.getFinalMetric([]);
        expect(result).toEqual(wrongResult);
    });

    test('Call without color argument', () => {
        const result = internalFunction.getFinalMetric({ data: test.data });
        expect(result).toEqual(wrongResult);
    });

    test('Call without color argument', () => {
        const result = internalFunction.getFinalMetric({ color: testData.color });
        expect(result).toEqual(wrongResult);
    });

    test('Expect return string', () => {
        const spy = jest.spyOn(internalFunction, 'getFinalMetric');
        internalFunction.getFinalMetric(testData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toReturnWith(expect.any(String));
    });
});
