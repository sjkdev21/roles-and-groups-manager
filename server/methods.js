/**
 * Created by stevenkehoe on 5/19/16.
 */

Meteor.methods({
  getUpdatedMembershipManagerConfig: function(){
    return MembershipManager;
  },
  setupMemberManagerSearchSource: function(fields) {
    function buildRegExp(searchText) {
      var words = searchText.trim().split(/[ \-\:]+/);
      var exps = _.map(words, function(word) {
        return "(?=.*" + word + ")";
      });
      var fullExp = exps.join('') + ".+";
      return new RegExp(fullExp, "i");
    }

    SearchSource.defineSource("MemberManagerSearchSource", function (searchText, options) {

      if (searchText) {
        var regExp = buildRegExp(searchText);
        var fieldArray = [];
        _.each(fields, function (field) {
          var newSearchField = {};
          newSearchField[field] = regExp;
          fieldArray.push(newSearchField);
        });

        var selector = {$or: fieldArray};

        let allowedFields = {};
        _.each(fields, (field) => allowedFields[field] = 1);
        allowedFields["roles"] = 1;

        return Meteor.users.find(selector, {fields: allowedFields}).fetch();
      } else {
        return [];
      }
    });
  },
  addUserToGroupRole: function(params){
    let config = MembershipManager.config[params.managerName];
    if(params.role === config.defaultRole){
      if(Roles.userIsInRole(params.userId, config.defaultAdminRole, config.group)) {
        Roles.addUsersToRoles(params.targetUser._id, params.role, config.group);
        console.log(`Added ${params.targetUser._id} as ${params.role} in group ${config.group}`);
      }
    }
    else {
      let roleDefinition = config.additionalRoles.filter((role) => role.name === params.role);
      if(roleDefinition[0]){
        if(roleDefinition[0].hasPermission){
          if(roleDefinition[0].hasPermission(params.userId)){
            Roles.addUsersToRoles(params.targetUser._id, params.role, config.group);
          }
        }
        else {
          Roles.addUsersToRoles(params.targetUser._id, params.role, config.group);
        }
      }
    }

  },
  removeUserFromGroupRole: function(params){
    let config = MembershipManager.config[params.managerName];
    if(params.role === config.defaultRole){
      if(Roles.userIsInRole(params.userId, config.defaultAdminRole, config.group)) {
        Roles.removeUsersFromRoles(params.targetUser._id, params.role, config.group);
        console.log(`Removed ${params.targetUser._id} as ${params.role} in group ${config.group}`);
      }
    }
    else {
      let roleDefinition = config.additionalRoles.filter((role) => role.name === params.role);
      if(roleDefinition[0]){
        if(roleDefinition[0].hasPermission){
          if(roleDefinition[0].hasPermission(params.userId)){
            Roles.removeUsersFromRoles(params.targetUser._id, params.role, config.group);
          }
        }
        else {
          Roles.removeUsersFromRoles(params.targetUser._id, params.role, config.group);
        }
      }
    }

  },

});
//Roles.userIsInRole("yznLcLJj6Jop6WvzA", "group-admin", "2132312312")
Meteor.publish("memberManagerServiceUsers", function(params){
  let config = MembershipManager.config[params.managerName];
  if(Roles.userIsInRole(params.userId, config.defaultAdminRole, config.group)){
    let group = "roles." + config.group;
    let defaultRole = config.defaultRole;
    let selector = {};
    selector[group] = defaultRole;
    let allowedFields = {};
    _.each(config.searchFields, (field) => allowedFields[field.fieldName] = 1);
    allowedFields["roles"] = 1;
    return Meteor.users.find(selector,{fields: allowedFields})
  } else{
    return [];
  }

});