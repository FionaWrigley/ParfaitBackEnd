const event = require('../model/event');
const datefns = require('date-fns');


 module.exports = {
    createEvents: function (eventData, cb){

        let repeatEventArr = [];
        let day = new Date(eventData.startDate);
        let endDay = new Date(eventData.endDate);
        let repEnd = (datefns.add(new Date(eventData.repeatUntil),  {days: 1}));
        let key=eventData.eventName + new Date().getTime();
               
                while(datefns.isBefore(day, repEnd)){ 
                    console.log(true);
                    let tempEvent = { 
                        eventName: eventData.eventName,
                        eventDescription: eventData.eventDescription,
                        startDate: datefns.format(day,'yyyy-MM-dd'),
                        startTime: eventData.startTime,
                        endDate: datefns.format(endDay,'yyyy-MM-dd'),
                        endTime: eventData.endTime,
                        frequency: eventData.frequency,
                        repeatUntil: eventData.repeatUntil,
                        repeatEventKey: key
                    }

                    repeatEventArr.push(tempEvent);

                    switch (eventData.frequency){
                        case 'Daily':
                            day = datefns.add(day, {days: 1});
                            endDay = datefns.add(endDay, {days: 1}) 
                            this.break;
                        break;
                        case 'Weekly':
                            day = datefns.add(day, {days: 7});
                            endDay = datefns.add(endDay, {days: 7})
                            this.break;
                        break;
                        case 'Monthly':
                            day = datefns.add(day, {months: 1});
                            endDay = datefns.add(endDay, {months: 1})
                            this.break;
                        break;
                        case 'Annually':
                            day = datefns.add(day, {years: 1});
                            endDay = datefns.add(endDay, {years: 1})
                            this.break;
                    } 
                    console.log(repeatEventArr);
            
        }
        
        
        //if repeatFrequency == daily
        //loop from start date to end repeat date, push repeat record to array, day++

        //else if repeatFrequency = weekly
        //loop from start date to end repeat date push repeat record, day+=7

        //else if repeat = Monthly 
        //loop from start to end repeat, month++

        //else if annual
        //loop from start to end, year++

        //pass single event


        //thow to event.createEvents
    },

    editEvents: function (eventData, singleEvent, cb){

        console.log('we are the champions')
        console.log(eventData);
        cb(eventData);

        this.createEvents(eventData, cb);

        if(singleEvent){

        }else{


            
        }
        //edit a repeat event 
        //prompt user. If just one record - update one record
        // else select all related events - delete. create new events.
        //add a eventID_timestamp field for repeat ID

        
        
        //else create all records

        //if repeatFrequency == daily
        //loop from start date to end repeat date, push repeat record to array, day++

        //else if repeatFrequency = weekly
        //loop from start date to end repeat date push repeat record, day+=7

        //else if repeat = Monthly 
        //loop from start to end repeat, month++

        //else if annual
        //loop from start to end, year++

        
        //Delete all events where eventID IN (select repeatEventID from repeateventtable where event id = eventid
        //if eventID exists - update event)
        //Delete all events where eventID IN (select repeatEventID from repeateventtable where event id = eventid
        //if eventID exists - update event)

    },
    deleteEvents: function (eventData, cb){




    }
 }