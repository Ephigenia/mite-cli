'use strict';

const expect = require('chai').expect;
const chalk = require('chalk');

const formater = require('./formater');
const BUDGET_TYPE = require('./formater').BUDGET_TYPE;

describe('formater', () => {

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
        chalk.bold(chalk.blue('ABC-1234')) + ' this is a note'
      );
    });
    it('highlights multiple occurrences', () => {
      expect(formater.note(
        'BF-1234 this is a note and BLABLUB-0002 is cool'
      )).to.equal(
        chalk.bold(chalk.blue('BF-1234')) + ' this is a note' +
        ' and ' + chalk.bold(chalk.blue('BLABLUB-0002')) + ' is cool'
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
        expect(formater.budget(BUDGET_TYPE.MINUTES, 60)).to.equal('1:00 h');
      });
    });
    describe('cents per month', () => {
      it('adds €/m', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS_PER_MONTH, 100);
        expect(result).to.equal('1.00 €/m');
      });
    });
    describe('cents', () => {
      it('rounds correctly', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 9.985);
        expect(result).to.equal('0.10 €');
      });
      it('can format big values', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 2912.21121);
        expect(result).to.equal('29.12 €');
      });
      it('can format very big values', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 98726134.91928);
        expect(result).to.equal('987261.35 €');
      });
      it('formats the value to 2 number diget', () => {
        const result = formater.budget(BUDGET_TYPE.CENTS, 0.01);
        expect(result).to.equal('0.00 €');
      });
    });
  }); // budget

}); // test suite
