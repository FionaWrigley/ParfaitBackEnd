 const e = require('express');
const group = require('../model/group');
const datefns = require('date-fns');

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
   getGroupSchedule: function (gID, currDate, cb){

    group.getGroupSchedule(gID, currDate, (result) => {
        
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

   },

////////////////////////////////////////////////////////////////////////////////
//Change the format of the data from a flat file to an object with nested arrays 
// group->group members->hour->event
///////////////////////////////////////////////////////////////////////////////
getGroupSchedules: function (gID, minDateStr, numberOfDays, userID, cb){

    let minDate = new Date(minDateStr);
    let maxDate = datefns.add(minDate, {days: numberOfDays});
    let maxDateStr = datefns.format(maxDate, 'yyyy-MM-dd');
    console.log(minDate.toString());
    console.log(maxDate.toString());
    console.log(maxDateStr);

    group.getGroupSchedule(gID, minDateStr, maxDateStr, userID, (result) => {
        
        let groupSched = {};
       
        if(result.length > 1){ //some results were returned from db so create a new group object
           groupSched = {groupID: gID, groupName: result[0].groupName, groupDescripton: result[0].groupDescription, groupPic: result[0].groupPic, members: []}
       }

        for(i=0; i < result.length; i++){ //foreach db record, insert into group schedule object

            //check if the member already exists as a group member
            let memberIndex = groupSched.members.findIndex(ind => ind.memberID == (result[i].memberID));
          
            //if member hasn't already been added to the group, add member
            if(memberIndex < 0){
                let newGroupMember = {memberID: result[i].memberID, fname: result[i].fname, lname: result[i].lname, profilePic: result[i].profilePic, adminFlag: result[i].adminFlag, acceptedFlag: result[i].acceptedFlag, events: []}
                groupSched.members.push(newGroupMember);
                
                memberIndex = groupSched.members.length-1; //index of the new member record

                for(days = 0; days < numberOfDays; days++){
                    groupSched.members[memberIndex].events.push([]);
                }
            }

            let startDate = new Date(result[i].startDate);
            let endDate = new Date(result[i].endDate);
            
            //event runs over multiple days but starts before selected date.
            //Ignore anything before 00:00 on selected date
            if (datefns.isBefore(startDate, minDate)){
                    result[i].startDate = minDate.toISOString().slice(0,10);
                    result[i].startTime = '00:00:00';
            }

            //event runs over multiple days and finishes after the 30 day window.
            //Ignore anything after 11:59 30 days after current date
            if (datefns.isAfter(endDate, maxDate)){
                result[i].endDate = maxDate.toISOString().slice(0,10);
                result[i].endTime = '11:59:00';
            }

            let d = startDate;

            while(datefns.isBefore(d, endDate) || datefns.isEqual(d, endDate)){
                
                let dateIndex = datefns.differenceInDays(d, minDate);
                if(datefns.isEqual(d, startDate) && datefns.isEqual(d, endDate)){

                    let newEvent = {eventID: result[i].eventID, eventName: result[i].eventName, eventDescription: result[i].eventDescription, eventDate: result[i].startDate, startTime: result[i].startTime, endTime: result[i].endTime}
                    groupSched.members[memberIndex].events[dateIndex].push(newEvent);
                    //groupSched.members[memberIndex].events.push(newEvent);

                }else if(datefns.isEqual(d, startDate) && datefns.isBefore(d, endDate)){

                    let newEvent = {eventID: result[i].eventID, eventName: result[i].eventName, eventDescription: result[i].eventDescription, eventDate: result[i].startDate, startTime: result[i].startTime, endTime: '11:59:00'}
                    groupSched.members[memberIndex].events[dateIndex].push(newEvent);
                    //groupSched.members[memberIndex].events.push(newEvent);

                }else if(datefns.isAfter(d, startDate) && datefns.isBefore(d, endDate)){

                    let newEvent = {eventID: result[i].eventID, eventName: result[i].eventName, eventDescription: result[i].eventDescription, eventDate: d.toISOString().slice(0,10), startTime: '00:00:00', endTime: '11:59:00'}
                    groupSched.members[memberIndex].events[dateIndex].push(newEvent);
                    //groupSched.members[memberIndex].events.push(newEvent);

                }else if(datefns.isAfter(d, startDate) && datefns.isEqual(d, endDate)){

                    let newEvent = {eventID: result[i].eventID, eventName: result[i].eventName, eventDescription: result[i].eventDescription, eventDate: result[i].endDate, startTime: '00:00:00', endTime: result[i].endTime}
                    groupSched.members[memberIndex].events[dateIndex].push(newEvent);
                    //groupSched.members[memberIndex].events.push(newEvent);
                }
                //increment date
                d = datefns.add(d, {days: 1});
            }
        }
    cb(groupSched);
    })

   }

 }