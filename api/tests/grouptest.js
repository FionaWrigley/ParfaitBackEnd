const { getGroups } = require('../model/group');
const group = require('../model/group');

//createGroup: function (groupName, groupDescription, groupPic, userList, cb) {
const users = [
    {
        memberID : "8",
        activeFlag : true,
        adminFlag : false
    },
    {
    
        memberID : "22",
        activeFlag : true,
        adminFlag : false
    },
    {
    
        memberID : "19",
        activeFlag : true,
        adminFlag : true
    }];

//group.getGroups(8, logresult)
//group.createGroup("Pub pals", "Anyone fancy a beer?", null, users, logresult)
//group.deleteGroup(67, logresult);
//deleteGroupMember(memberID, groupID, cb);
//acceptGroup(memberID, groupID, cb);
//getGroupSchedule(groupID, cb);

function logresult(result){
    console.log(result);
}