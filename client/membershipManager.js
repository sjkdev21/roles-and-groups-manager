/**
 * Created by stevenkehoe on 4/14/16.
 */

var MemberManagerSearchSource = {};

Template.membershipManager.onCreated(function() {
    var data = Template.instance().data;
    Session.set("managerConfig", null);

    Meteor.call("getUpdatedMembershipManagerConfig", function(error,result){
        if(error){
            console.log("unable to update MembershipManager")
        }
        else{
            MembershipManager = result;
        }

        let managerConfig = MembershipManager.defaultConfig;
        if(data.managerName){
            let managerName = data.managerName;
            managerConfig = _.extend(managerConfig, MembershipManager.config[managerName]);
            Meteor.subscribe("memberManagerServiceUsers", {managerName: managerName, userId: Meteor.userId()});
        }

        Session.set("managerConfig", managerConfig);

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
    })

});

Template.membershipManager.onRendered(function(){
    $("#memberSearchBox").keyup(_.throttle(function(e){
        var text = $(e.target).val().trim();
        MemberManagerSearchSource.search(text, {});
    }, 200));
});

Template.membershipManager.helpers({
    getTitle: function(){
        if(Session.get("managerConfig")){
            return Session.get("managerConfig").title;
        }
    },
    getResults: function() {
        var self = this;
        if(Session.get("memberSearchReady")) {
            return MemberManagerSearchSource.getData();
        }
    },
    getFieldDisplayNames: function() {
        if(Session.get("managerConfig")) {
            let displayNames = _.map(Session.get("managerConfig").searchFields, (field) => field.displayName);
            return displayNames;
        }
    },
    getFieldNames: function() {
        if(Session.get("managerConfig")) {
            let fieldNames = _.map(Session.get("managerConfig").searchFields, (field) => field.fieldName);
            return fieldNames;
        }
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
        if(Session.get("managerConfig")) {
            let managerConfig = Session.get("managerConfig");
            let group = "roles." + managerConfig.group;
            let defaultRole = managerConfig.defaultRole;
            let selector = {};
            selector[group] = defaultRole;
            return Meteor.users.find(selector).fetch();
        }
    },
    getAdditionalRoles: function(){
        if(Session.get("managerConfig")) {
            let managerName = Template.instance().data.managerName;
            let additionalRoles = Session.get("managerConfig").additionalRoles;
            return _.map(additionalRoles, (role) => role.name);
        }
    },
    getDefaultRole: function(){
        if(Session.get("managerConfig")) {
            return Session.get("managerConfig").defaultRole;
        }
    },
    getGroup: function(){
        if(Session.get("managerConfig")) {
            return Session.get("managerConfig").group;
        }
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
            role: Session.get("managerConfig").defaultRole
        };
        Meteor.call('addUserToGroupRole', params, function(error, result) {
            if (error) {
            } else {
            }
        });
    },
    "click a.removeUser": function (e) {
        var self = this;
        var params = {
            userId: Meteor.userId(),
            targetUser: this,
            managerName: Template.instance().data.managerName,
            role: Session.get("managerConfig").defaultRole
        };
        Meteor.call('removeUserFromGroupRole', params, function(error, result) {
            if (error) {
            } else {
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
            } else {
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
            } else {
            }
        });
    }
})