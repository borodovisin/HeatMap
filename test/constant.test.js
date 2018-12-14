
const util = require('../src/utils');

describe('Test for limitNumberSize constant', () => {
    test('Should be a number', () => {
        const type = typeof util.limitNumberSize;
        expect(type).toBe('number');
    });

    test('Should be greater than cero', () => {
        expect(util.limitNumberSize).toBeGreaterThan(0);
    });
});

describe('Test for getAxisOption function', () => {

    test('getAxisOption always return object', () => {
        const spy = jest.spyOn(util, 'getAxisOption');
        util.getAxisOption();
        expect(spy).toHaveReturned();
        expect(spy).toHaveReturnedWith(expect.any(Object));
    });

    it('Should return correct result', () => {
        const result = util.getAxisOption();
        expect(result).toMatchSnapshot();
    });
});
