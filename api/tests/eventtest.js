const event = require('../model/event');

//event.createEvent('2021-06-21', '01:00:00', '2021-06-21', '22:00:00',"Fiona's birthday", "Turning 40", null, null, 0, 8, true, logresult );
event.deleteEvent(5, logresult);
//event.deleteMemberEvent(5, 8, logresult);

function logresult(result){
    console.log(result);
}