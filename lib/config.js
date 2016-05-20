/**
 * Created by stevenkehoe on 5/19/16.
 */

MembershipManager = {}
MembershipManager.defaultConfig = {
  title: "Membership & Role Manager",
  group: "defaultGroup",
  defaultRole: "member",
  defaultAdminRole: "group-admin",
  additionalRoles: [{
    name: "defaultRole",
    hasPermission: function(userId){
      return false;
    }
  }],
  searchFields: [{
    fieldName: "_id",
    displayName: "ID"
  }]
};

MembershipManager.config = {};

//If you need to add new manager configurations at runtime, for example when a new group is created at runtime
MembershipManager.addNewManager = function(newManagerName, configuration){
  MembershipManager.config[newManagerName] = configuration;
}