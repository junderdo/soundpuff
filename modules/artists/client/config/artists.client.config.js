(function () {
  'use strict';

  angular
    .module('artists')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Artists',
      state: 'artists',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'artists', {
      title: 'List Artists',
      state: 'artists.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'artists', {
      title: 'Create Artist',
      state: 'artists.create',
      roles: ['user']
    });
  }
})();
