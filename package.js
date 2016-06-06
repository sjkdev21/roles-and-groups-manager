Package.describe({
  name: 'skehoe1989:roles-and-groups-manager',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Flexible, secure UI for alanning:roles to manage group/role membership.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('twbs:bootstrap');
  api.use('blaze-html-templates');
  api.use('underscore@1.0.4');
  api.use('aldeed:autoform@5.7.1');
  api.use('meteorhacks:search-source@1.4.2');
  api.use('fortawesome:fontawesome@4.5.0');
  api.addFiles('client/membershipManager.html', 'client');
  api.addFiles('client/membershipManager.css', 'client');
  api.addFiles('client/membershipManager.js', 'client');
  api.addFiles('lib/config.js');
  api.addFiles('server/methods.js', 'server');
  api.export('MembershipManager');
});

