'use strict';

const expect = require('chai').expect;
const colors = require('ansi-colors');

const formater = require('./formater');
const BUDGET_TYPE = require('./formater').BUDGET_TYPE;

describe('formater', () => {

  describe('booleanToHuman', () => {
    it('returns "yes" for tru-ish values', () => {
      expect(formater.booleanToHuman(true)).to.equal('yes');
      expect(formater.booleanToHuman('X')).to.equal('yes');
      expect(formater.booleanToHuman(1)).to.equal('yes');
    });
    it('returns "no" for tru-ish values', () => {
      expect(formater.booleanToHuman(false)).to.equal('no');
      expect(formater.booleanToHuman(null)).to.equal('no');
    });
  });

  describe('note', () => {
    it('strips line breaks by default', () => {
      expect(formater.note("a\r\nb")).to.equal("a b");
    });
    it('doesn’t do anything when there’s no JIRA identifier', () => {
      expect(formater.note('nothing here man!')).to.equal('nothing here man!');
    });
    it('uses the specified highlight color and bold for jira identifiers', () => {
      expect(formater.note(
        'ABC-1234 this is a note'
      )).to.equal(
        colors.bold(colors.blue('ABC-1234')) + ' this is a note'
      );
    });
    it('highlights multiple occurrences', () => {
      expect(formater.note(
        'BF-1234 this is a note and BLABLUB-0002 is cool'
      )).to.equal(
        colors.bold(colors.blue('BF-1234')) + ' this is a note' +
        ' and ' + colors.bold(colors.blue('BLABLUB-0002')) + ' is cool'
      );
    });
    it('highlights time durations', () => {
      expect(formater.note(
        '(8:00 to 21:00) this is a note'
      )).to.equal(
        colors.bold(colors.blue('(8:00 to 21:00)')) + ' this is a note'
      );
    });
  });

  describe('number', () => {
    it('returns the number with default precision of 2', () => {
      expect(formater.number(2.128391)).to.equal('2.13');
    });
    it('can have a differenct precision', () => {
      expect(formater.number(2.128391, 4)).to.equal('2.1284');
    });
    it('adds thousand seperator', () => {
      expect(formater.number(29828172.21)).to.equal('29,828,172.21');
    });
    it('throws an exception when the first argument is not a number', () => {
      expect(() => formater.number(null)).to.throw(TypeError);
      expect(() => formater.number(8/0)).to.throw(Error);
      expect(() => formater.number(parseInt('a'))).to.throw(Error);
      expect(() => formater.number(Infinity)).to.throw(Error);
    });
  }); // number

  describe('minutesToWorkDays', () => {
    [
      [0, '0.00'],
      [1, '0.00'],
      [5, '0.01'],
      [8 * 60, '1.00'],
      [8 * 60 + 1, '1.00'],
      [8 * 60 + 8, '1.02'],
      [365 * 8 * 60 - 123, '364.74'],
      [false, '0.00']
    ].forEach((row) => {
      it(`formats ${row[0]} to ${row[1]}`, () => {
        expect(formater.minutesToWorkDays(row[0])).to.equal(row[1]);
      });
    });
  }); // minutesToWorkDays

  describe('durationToMinutes', () => {
    [
      ['0:00', 0],
      ['0:01', 1],
      ['0:10', 10],
      ['0:20', 20],
      ['1:00', 60],
      ['1:01', 61],
      ['1:02', 62],
      ['2:00', 120],
      ['2:61', 181],
      ['38:20', 2300],
    ].forEach((row) => {
      it(`formats ${row[0]} to ${row[1]}`, () => {
        expect(formater.durationToMinutes(row[0])).to.equal(row[1]);
      });
    });
    it('just returns integer values assuming they are minutes', () => {
      expect(formater.durationToMinutes(827)).to.equal(827);
    });
  });

  describe('minutesToDuration', () => {
    [
      [0, '0:00'],
      [0.09, '0:00'],
      [0.015, '0:00'],
      [0.1, '0:00'],
      [0.9, '0:01'],
      [1, '0:01'],
      [1.05, '0:01'],
      [9.99, '0:10'],
      [20, '0:20'],
      [60, '1:00'],
      [60.5, '1:01'],
      [61, '1:01'],
      [120, '2:00'],
      [2300, '38:20'],
    ].forEach((row) => {
      it(`formats ${row[0]} to ${row[1]}`, () => {
        expect(formater.minutesToDuration(row[0])).to.equal(row[1]);
      });
    });
  }); // minutesToDuration

  describe('budget', () => {
    describe('invalid types', () => {
      it('throws an Error', () => {
        expect(() => {
          formater.format('something', 1238);
        }).to.throw(Error);
      });
    });
    describe('minutes & minutes_per_month', () => {
      it('returns durations', () => {
        expect(formater.budget(BUDGET_TYPE.MINUTES, 60)).to.equal('1:00h');
      });
    });
    describe('cents per month', () => {
      it('adds €/m', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS_PER_MONTH, 100);
        expect(result).to.equal('1.00€/m');
      });
    });
    describe('cents', () => {
      it('rounds correctly', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 9.985);
        expect(result).to.equal('0.10€');
      });
      it('can format big values', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 2912.21121);
        expect(result).to.equal('29.12€');
      });
      it('can format very big values', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 98726134.91928);
        expect(result).to.equal('987,261.35€');
      });
      it('formats the value to 2 number diget', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 0.01);
        expect(result).to.equal('0.00€');
      });
    });
  }); // budget

  describe('percentChart', () => {
    const data = [
      [-1, '░░░░░░░░░░'],
      [0, '░░░░░░░░░░'],
      [0.1, '█░░░░░░░░░'],
      [1.2, '██████████'],
    ];
    data.forEach(row => {
      it(`displays $row[0] as ${row[1]}`, () => {
        expect(formater.percentChart(row[0])).to.equal(row[1]);
      });
    });
    it('accepts different characters', () => {
      expect(formater.percentChart(0.2, 10, { on: '_'}))
        .to.equal('__░░░░░░░░');
    });
  }); // percentChart

}); // test suite
