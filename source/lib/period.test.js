'use strict';

const expect = require('chai').expect;

describe('period', () => {
  const { guessRequestParamsFromPeriod } = require('./period');

  // match for 2013-10-12
  const DATE_STR_REGEXP = /^20\d\d-[012]\d-[0123]\d$/;

  describe('guessRequestParamsFromPeriod', () => {
    describe('YYYY-MM', () => {
      const tests = [
        '2020-01',
        '2020 01',
        '2020-01',
        '2020/01',
        '2020_01',
        '2020-1',
        '2020/1',
        '20201',
        '202001',
        '2020_1',
        '20-1',
        '20 1',
        '201',
        '20-01',
        '20/01',
        '20_01',
      ];
      tests.forEach(input => it(`returns the whole january for ${JSON.stringify(input)}`, () => {
        const result = guessRequestParamsFromPeriod(input);
        expect(result).to.deep.equal({
          from: '2020-01-01',
          to: '2020-01-31',
        });
      }));
      it('can parse two-digit months', () => {
        const result = guessRequestParamsFromPeriod('2020-12');
        expect(result).to.deep.equal({
          from: '2020-12-01',
          to: '2020-12-31',
        });
      });
      it('can parse short 1999 notations', () => {
        const result = guessRequestParamsFromPeriod('99-01');
        expect(result).to.deep.equal({
          from: '1999-01-01',
          to: '1999-01-31',
        });
      });
    }); // Date-Month Notation

    describe('YYYY-MM-DD', function() {
      [
        '2020-01-01',
        '2020/01/01',
        '2020-01-01',
        '2020_01_01',
        '20200101',
      ].forEach((period) => it(`understands ${JSON.stringify(period)}`, function() {
        const result = guessRequestParamsFromPeriod(period);
        expect(result).to.have.property('at').to.eq('2020-01-01');
      }));
    });

    describe('YYYY', () => {
      it('YYYY', () => {
        const result = guessRequestParamsFromPeriod('2021');
        expect(result).to.deep.equal({
          from: '2021-01-01',
          to: '2021-12-31',
        });
      });
    });

    describe('YYYY cwX', () => {
      it('it understands calendar week notation', () => {
        const result = guessRequestParamsFromPeriod('2022 cw2');
        expect(result).to.deep.equal({
          from: '2022-01-10',
          to: '2022-01-17',
        });
      });
    });

    describe('short notation of time periods', () => {
      [
        '1d',
        '200d',
        '23days',
        '1w',
        '2weeks',
        '3m',
        '1month',
        '99months',
        '1y',
        '1year',
        '2years',
      ].forEach(period => {
        it(`returns a time-period for ${JSON.stringify(period)}`, () => {
          const result = guessRequestParamsFromPeriod('1d');
          expect(result).to.have.property('from').to.match(DATE_STR_REGEXP);
          expect(result).to.have.property('to').to.match(DATE_STR_REGEXP);
        });
      });
    });

    describe('weekdays', () => {
      it('returns the exact date of the previous or next weekday date', () => {
        expect(guessRequestParamsFromPeriod('su')).to.have.property('at').to.match(DATE_STR_REGEXP);
      });
      it('returns the exact date of the previous or next weekday date', () => {
        expect(guessRequestParamsFromPeriod('sunday')).to.have.property('at').to.match(DATE_STR_REGEXP);
      });
    }); // weekdays

    describe('periods', () => {
      it('lowercases the input', () => {
        expect(guessRequestParamsFromPeriod('TODAY')).to.have.property('at').to.eql('today');
      });
      [
        'today',
        'yesterday',
        'this_week',
        'last_week',
        'this_month',
        'last_month',
        'this_year',
        'last_year',
      ].forEach((period) => {
        const result = guessRequestParamsFromPeriod(period);
        expect(result).to.have.property('at').to.eq(period);
      });
      it('returns the value where hyphens are replaced with underscore(s)', () => {
        expect(guessRequestParamsFromPeriod('this-month')).to.have.property('at').to.eql('this_month');
        expect(guessRequestParamsFromPeriod('this_month')).to.have.property('at').to.eql('this_month');
      });
    });
  }); // guessRequestParamsFromPeriod
}); // suite
