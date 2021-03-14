const event = require('../model/event');

//createEvent(startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, groupID, memberID, acceptedFlag, cb) {
// //events for Fiona - PASSED
// event.createEvent('2021-03-08', '08:00:00', '2021-03-08', '14:00:00',"TAFE", "Project with John", 'weekly', '2021-06-21', 0, 21, true, logresult);
// event.createEvent('2021-03-09', '08:30:00', '2021-03-09', '14:30:00',"TAFE", "UX with John", 'weekly', '2021-06-21', 0, 21, true, logresult);
// event.createEvent('2021-03-09', '16:30:00', '2021-03-09', '18:00:00',"Cricket", "training for Eli", 'weekly', '2021-06-21', 0, 21, true, logresult);
// event.createEvent('2021-03-10', '09:00:00', '2021-03-10', '15:30:00',"TAFE", "Manuela's class", 'weekly', '2021-06-21', 0, 21, true, logresult);
// event.createEvent('2021-03-10', '16:30:00', '2021-03-10', '17:30:00',"Footy", "Junior training", 'weekly', '2021-06-21', 0, 21, true, logresult);
// event.createEvent('2021-03-12', '17:00:00', '2021-03-12', '19:30:00',"Cricket", "Ashton's game", 'weekly', '2021-06-21', 0, 21, true, logresult);
// //events for Bob - PASSED
// event.createEvent('2021-03-09', '11:00:00', '2021-03-09', '21:00:00',"Work", "Double shift", 'weekly', '2021-06-21', 0, 19, true, logresult);
// event.createEvent('2021-03-10', '11:00:00', '2021-03-10', '21:00:00',"Work", "Double shift", 'weekly', '2021-06-21', 0, 19, true, logresult);
// event.createEvent('2021-03-11', '09:00:00', '2021-03-11', '14:30:00',"Work", "Day shift", 'weekly', '2021-06-21', 0, 19, true, logresult);
// event.createEvent('2021-03-12', '09:30:00', '2021-03-12', '16:30:00',"Work", "Day shift", 'weekly', '2021-06-21', 0, 19, true, logresult);
// event.createEvent('2021-03-14', '17:00:00', '2021-03-12', '19:30:00',"Cricket", "Ashton's game", 'weekly', '2021-06-21', 0, 19, true, logresult);
// //events for Suzie - PASSED
// event.createEvent('2021-03-08', '10:00:00', '2021-03-08', '14:00:00',"Naptime", "Sleep is life", null, null, 0, 8, false, logresult);
// event.createEvent('2021-03-09', '10:00:00', '2021-03-09', '14:00:00',"Naptime", "Sleep is life", null, null, 0, 8, false, logresult);
// event.createEvent('2021-03-10', '10:00:00', '2021-03-10', '14:00:00',"Naptime", "Sleep is life", null, null, 0, 8, false, logresult);
// event.createEvent('2021-03-11', '10:00:00', '2021-03-11', '14:00:00',"Naptime", "Sleep is life", null, null, 0, 8, false, logresult);
// event.createEvent('2021-03-12', '19:30:00', '2021-03-12', '22:30:00',"Date night", "Date with Desmond", 'weekly', '2021-06-21', 0, 8, true, logresult);



//acceptEvent(eventID, memberID, cb) - PASSED
//event.acceptEvent(20, 8, logresult);



//PASSED
//event.deleteEvent(23, logresult);


//Multiple user event - PASSED
//Single user event - PASSED

let userList = [
    { 
        memberID : 8, 
        acceptedFlag : true 
    }
    // { 
    //     memberID : 21, 
    //     acceptedFlag : true
    // }
]

//event.createGroupEvent('2021-03-08', '19:00:00', '2021-03-08', '22:00:00', 'Dinner date', 'Sushi train', null, null, 0, userList, logresult);
//editEvent(eventID, startDate, startTime, endDate, endTime, eventName, eventDesc, repeatFrequency, repeatUntil, cb);

//event.deleteMemberEvent(5, 8, logresult);
//getMemberEvents(memberID, dateSelected, cb);
event.getMemberEvents(21, '2021-03-13', logresult);

function logresult(result){
    console.log(result);
}