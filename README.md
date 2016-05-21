# roles-and-groups-manager #

### Description ###
Adds templates and meteor methods to securely implement a full stack solution on top of [alanning:roles](https://github.com/alanning/meteor-roles/)

### Install ###
From the terminal in your Meteor project directory:
```
meteor add skehoe1989:roles-and-groups-manager
```

### Membership Manager Configuration ###
Each unique membership manager will need a configuration declared in the lib folder.


```javascript
MembershipManager.config = {
  "exampleManager1": {
    title: "Test Member Manager",  //Title to be displayed at the top of the membership manager UI (optional)
    group: "2132312312",  //Name/ID of the group this instance will manage
    defaultRole: "member",  //Default role for new members of this group
    defaultAdminRole: "group-admin", //Default admin role for adding and removing users to the defaultRole
    additionalRoles: [{  //array of objects declaring all the additional roles other than the defaultRole
      name: "group-admin",
      hasPermission: function(userId){ //an optional hasPermission function to validate the credentials of the user trying to add/remove this role
          return true;
      }
    }],
    searchFields: [ //An array of objects describing fields on the Meteor.user object that will be searched and also published to the UI
      {
        fieldName: "username", //Name of the field on the Meteor.user object
        displayName: "Username" //Display name for the results table in the UI
      }
    ]
  },
  "exampleManager2": {
      title: "Test Member Manager",  //Title to be displayed at the top of the membership manager UI (optional)
      group: "7987112937",  //Name/ID of the group this instance will manage
      defaultRole: "member",  //Default role for new members of this group
      defaultAdminRole: "moderator", //Default admin role for adding and removing users to the defaultRole
      additionalRoles: [{  //array of objects declaring all the additional roles other than the defaultRole
        name: "moderator",
        hasPermission: function(userId){ //an optional hasPermission function to validate the credentials of the user trying to add/remove this role
            return true;
        }
      },
      {
        name: "admin",
        hasPermission: function(userId){
            return true;
        }
      }
      ],
      searchFields: [ //An array of objects describing fields on the Meteor.user object that will be searched and also published to the UI
        {
          fieldName: "username", //Name of the field on the Meteor.user object
          displayName: "Username" //Display name for the results table in the UI
        }
      ]
    }
};
```

### TODO - Settings Explained ###
-
-
-

### Using the Template ###
TODO - I plan to break the template into parts in the future and let the end user override any templates they like.  However for now, it is all bundled in one template.

```{{> membershipManager managerName="exampleManager1"}}```

The managerName must be equal to one of the keys of the MembershipManager.config object described above.


Maintained by [BitTiger](http://bittiger.io)


![BitTiger Logo](https://raw.githubusercontent.com/oohaysmlm/autoform-relations/master/readme/small_logo.png)
