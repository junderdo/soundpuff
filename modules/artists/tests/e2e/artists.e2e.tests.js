'use strict';

describe('Artists E2E Tests:', function () {
  describe('Test Artists page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/artists');
      expect(element.all(by.repeater('artist in artists')).count()).toEqual(0);
    });
  });
});
