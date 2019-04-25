'use strict';

const expect = require('chai').expect;
const miteApi = require('./mite-api');
const config = require('./../mite-config');

describe('mite-api wrapper', () => {

  const mite = new miteApi(config);

  describe('sort', () => {
    it('throws an error when items is not an array', () => {
      expect(() => {
        mite.sort(true, false);
      }).to.throw(Error);
    });
    it('throws an error when attribute is not a string', () => {
      expect(() => {
        mite.sort([{a: 'b'}], false);
      }).to.throw(Error);
    });

    describe('multiple attributes', () => {
      const items = [
        { archived: true, name: 'Beta' },
        { archived: false, name: 'xanibe' },
        { archived: true, name: 'Alpha' },
        { archived: true, name: 'Ceta' },
        { archived: false, name: 'Ceta' },
        { archived: false, name: 'Custom' },
        { archived: false, name: 'Freebie' },
      ];
      it('can handle multiple also descending attribute', () => {
        const result = mite.sort(items, ['archived', 'name']);
        expect(result).to.deep.equal([
          { archived: true, name: 'Alpha' },
          { archived: true, name: 'Beta' },
          { archived: true, name: 'Ceta' },
          { archived: false, name: 'Ceta' },
          { archived: false, name: 'Custom' },
          { archived: false, name: 'Freebie' },
          { archived: false, name: 'xanibe' },
        ]);
      });
      it('returns the items ordered correctly', () => {
        const result = mite.sort(items, ['-archived', 'name']);
        expect(result).to.deep.equal([
          { archived: false, name: 'Ceta' },
          { archived: false, name: 'Custom' },
          { archived: false, name: 'Freebie' },
          { archived: false, name: 'xanibe' },
          { archived: true, name: 'Alpha' },
          { archived: true, name: 'Beta' },
          { archived: true, name: 'Ceta' },
        ]);
      });
    });

    describe('string values', () => {
      it('returns the array sorted case-insensitive by the given attribute using string comparison', () => {
        const items = [
          { name: 'Xavier' },
          { name: 'Magneto' },
          { name: 'MYstique' },
        ];
        const result = mite.sort(items, 'name');
        expect(result.map(v => v.name)).to.deep.equal(['Magneto', 'MYstique', 'Xavier']);
      });
    }); // string comparison

    describe('numeric comparison', () => {
      it('returns the array ordered by numeric value in ascending order', () => {
        const items = [
          { value: 198.18 },
          { value: -1.21 },
          { value: 2 }
        ];
        const result = mite.sort(items, 'value');
        expect(result.map(v => v.value)).to.deep.equal([-1.21, 2, 198.18]);
      });
    }); // string comparison

    describe('boolean comparison', () => {
      it('returns the array ordered by numeric value in ascending order', () => {
        const items = [
          { value: false },
          { value: true },
          { value: false }
        ];
        const result = mite.sort(items, 'value');
        expect(result.map(v => v.value)).to.deep.equal([true, false, false]);
      });
    }); // string comparison
  });

});
