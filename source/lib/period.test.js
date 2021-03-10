'use strict';

const expect = require('chai').expect;

describe('period', () => {
  const { guessRequestParamsFromPeriod } = require('./period');

  // match for 2013-10-12
  const DATE_STR_REGEXP = /^20\d\d-[012]\d-[0123]\d$/;

  describe('guessRequestParamsFromPeriod', () => {
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
