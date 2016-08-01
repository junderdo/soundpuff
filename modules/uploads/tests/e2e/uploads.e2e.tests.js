'use strict';

describe('Uploads E2E Tests:', function () {
  describe('Test Uploads page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/uploads');
      expect(element.all(by.repeater('upload in uploads')).count()).toEqual(0);
    });
  });
});
