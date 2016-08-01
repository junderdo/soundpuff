(function () {
  'use strict';

  angular
    .module('uploads')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Uploads',
      state: 'uploads',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'uploads', {
      title: 'List Uploads',
      state: 'uploads.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'uploads', {
      title: 'Create Upload',
      state: 'uploads.create',
      roles: ['user']
    });
  }
})();
