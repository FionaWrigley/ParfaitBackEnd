const { getGroups } = require('../model/group');
const group = require('../model/group');
const groupservice = require('../services/groupservices')

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

// groupservice.getGroupSchedules(65, '2021-03-19', 14, 21, logresult)

//group.getGroupImages(19, 65, logresult);
// groupservice.getGroupProfilePics(19, 65, logresult);
groupservice.getGroupSchedules2(65, '2021-03-19', 14, 21, logresult);


function logresult(result){
    console.log(result);
}