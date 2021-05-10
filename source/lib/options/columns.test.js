'use strict';

const expect = require('chai').expect;

const columns = require('./columns');

describe('options columns', () => {
  describe('parse', () => {
    it('normalizes the string', () => {
      expect(columns.parse(',')).to.equal('');
      expect(columns.parse('')).to.equal('');
      expect(columns.parse('   a')).to.equal('a');
      expect(columns.parse(' a, B , b,c')).to.equal('a,b,b,c');
      expect(columns.parse('a, B ')).to.equal('a,b');
    });
  }); // parse

  describe('resolve', () => {
    const columnDefinitions = {
      column: 1,
      example: 2,
    };
    it('returns an empty array', () => {
      expect(columns.resolve('', [])).to.deep.equal([]);
    });
    it('returns the values of the matching columns', () => {
      expect(columns.resolve('column,example', columnDefinitions)).to.deep.equal([1, 2]);
    });
    it('throws an error when a not defined column name is used', () => {
      expect(() => columns.resolve('column', [])).to.throw(Error, 'Invalid column');
    });
  }); // resolve
}); // suite
