/**
 * Created by stevenkehoe on 4/14/16.
 */

var MemberManagerSearchSource = {};
managerConfig = {};

Template.membershipManager.onCreated(function() {
    managerConfig = MembershipManager.defaultConfig;
    if(Template.instance().data.managerName){
        let managerName = Template.instance().data.managerName;
        managerConfig = _.extend(managerConfig, MembershipManager.config[managerName]);
        Meteor.subscribe("memberManagerServiceUsers", {managerName: managerName, userId: Meteor.userId()});
    }

    let fields = _.map(managerConfig.searchFields, (field) => {
        return field.fieldName;
    });

    Session.set("memberSearchReady", false);
    Meteor.call('setupMemberManagerSearchSource', fields, function(error, result) {
        if (error) {
            console.log("Error setting up search source for MemberManagerSearchSource");
        } else {
            MemberManagerSearchSource = new SearchSource("MemberManagerSearchSource", fields, {});
            Session.set("memberSearchReady", true);
        }
    });
});

Template.membershipManager.onRendered(function(){
    $("#memberSearchBox").keyup(_.throttle(function(e){
        var text = $(e.target).val().trim();
        MemberManagerSearchSource.search(text, {});
    }, 200));
});

Template.membershipManager.helpers({
    getTitle: function(){
        return managerConfig.title;
    },
    getResults: function() {
        var self = this;
        if(Session.get("memberSearchReady")) {
            return MemberManagerSearchSource.getData();
        }
    },
    getFieldDisplayNames: function() {
        let displayNames = _.map(managerConfig.searchFields, (field) => field.displayName);
        return displayNames;
    },
    getFieldNames: function() {
        let fieldNames = _.map(managerConfig.searchFields, (field) => field.fieldName);
        return fieldNames;
    },
    getProp: function(poco, prop){
        if(prop.indexOf(".") > -1){
            let names = prop.split(".");
            return poco[names[0]][names[1]];
        }else{
            return poco[prop];
        }
    },
    getCurrentMembers: function(){
        let managerName = Template.instance().data.managerName;
        let group = "roles." + MembershipManager.config[managerName].group;
        let defaultRole = MembershipManager.config[managerName].defaultRole;
        let selector = {};
        selector[group] = defaultRole;
        return Meteor.users.find(selector).fetch();
    },
    getAdditionalRoles: function(){
        let managerName = Template.instance().data.managerName;
        let additionalRoles = MembershipManager.config[managerName].additionalRoles;
        return _.map(additionalRoles, (role) => role.name);
    },
    getDefaultRole: function(){
        return managerConfig.defaultRole;
    },
    getGroup: function(){
        return managerConfig.group;
    },
    isUserInRole: function(roles, group, user) {
        return Roles.userIsInRole(user._id, roles, group);
    }
});

Template.membershipManager.events({
    "click a.addUser": function (e) {
        var self = this;
        var params = {
            userId: Meteor.userId(),
            targetUser: this,
            managerName: Template.instance().data.managerName,
            role: managerConfig.defaultRole
        };
        Meteor.call('addUserToGroupRole', params, function(error, result) {
            if (error) {
                console.log("Error adding new blog contributor.");
            } else {
                console.log("Added new blog contributor.");
            }
        });
    },
    "click a.removeUser": function (e) {
        var self = this;
        var params = {
            userId: Meteor.userId(),
            targetUser: this,
            managerName: Template.instance().data.managerName,
            role: managerConfig.defaultRole
        };
        Meteor.call('removeUserFromGroupRole', params, function(error, result) {
            if (error) {
                console.log("Error adding new blog contributor.");
            } else {
                console.log("Added new blog contributor.");
            }
        });
    },
    "click button.removeRole": function (e) {
        var self = this;
        var targetUserId = $(e.target).attr("data-user");
        var params = {
            userId: Meteor.userId(),
            targetUser: {_id: targetUserId},
            managerName: Template.instance().data.managerName,
            role: String(this)
        };
        Meteor.call('removeUserFromGroupRole', params, function(error, result) {
            if (error) {
                console.log("Error adding new blog contributor.");
            } else {
                console.log("Added new blog contributor.");
            }
        });

    },
    "click button.addRole": function (e) {
        var self = this;
        var targetUserId = $(e.target).attr("data-user");
        var params = {
            userId: Meteor.userId(),
            targetUser: {_id: targetUserId},
            managerName: Template.instance().data.managerName,
            role: String(this)
        };
        Meteor.call('addUserToGroupRole', params, function(error, result) {
            if (error) {
                console.log("Error adding new blog contributor.");
            } else {
                console.log("Added new blog contributor.");
            }
        });
    }
})