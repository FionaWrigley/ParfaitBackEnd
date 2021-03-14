 const e = require('express');
const group = require('../model/group');

 module.exports = {

// createGroup: function (groupArray, cb) {

//     console.log("group services new group");

//     groupArray[member.map((Element, index) => {
        
//     })

//     member
//         .updateMember(user, function (results) {

//            return cb(results);             
//                 }
//         )
//     }

////////////////////////////////////////////////////////////////////////////////
//Change the format of the data from a flat file to an object with nested arrays 
// group->group members->group member events
///////////////////////////////////////////////////////////////////////////////
   getGroupSchedules: function (gID, cb){
    group.getGroupSchedule(gID, (result) => {
        
        let groupSched = {}; 

       if(result.length > 1){ //some results were returned from db so create a new group object
           groupSched = {groupID: gID, groupName: result[0].groupName, groupDescripton: result[0].groupDescription, groupPic: result[0].groupPic, members: []}
       }

        for(i=0; i < result.length; i++){ //foreach db record, insert into group schedule object

            //check if the member already exists as a group member
            let index = groupSched.members.findIndex(ind => ind.memberID == (result[i].memberID));
          
            //if member already exists in schedule, add current event record to existing member
            if(index > -1){
                let newEvent = {eventID: result[i].eventID, eventName: result[i].eventName, eventDescription: result[i].eventDescription, startDate: result[i].startDate, endDate: result[i].endDate, startTime: result[i].startTime, endTime: result[i].endTime, repeatFrequency: result[i].repeatFrequency, repeatUntil: result[i].repeatUntil}
                groupSched.members[index].memberEvents.push(newEvent);

            //else member doesn't exist so add a new member to group schedule, and give them the current event record
            }else{
                let newEvent = {eventID: result[i].eventID, eventName: result[i].eventName, eventDescription: result[i].eventDescription, startDate: result[i].startDate, endDate: result[i].endDate, startTime: result[i].startTime, endTime: result[i].endTime, repeatFrequency: result[i].repeatFrequency, repeatUntil: result[i].repeatUntil}
                let newGroupMember = {memberID: result[i].memberID, fname: result[i].fname, lname: result[i].lname, profilePic: result[i].profilePic, adminFlag: result[i].adminFlag, acceptedFlag: result[i].acceptedFlag, memberEvents: []}
                newGroupMember.memberEvents.push(newEvent);
                groupSched.members.push(newGroupMember);
            }
        }
    cb(groupSched);
    })

   }


 }