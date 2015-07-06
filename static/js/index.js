

var router = new Grapnel();

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// date for comparison
function compDate(d) {
    return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
}

function init() {

    console.log("init");
    router.get('', function(req) {
        
        $.getJSON('events', function(val) {

            var now = new Date();

            var events = val.events;
            var i;
            for(i=0; i < events.length; i++) {
                events[i].start = new Date(events[i].start);
                events[i].end = new Date(events[i].end);
                
                if(compDate(events[i].start) <= compDate(now)) {
                    events[i].day = "Today";
                } else if(compDate(events[i].start) == (compDate(now) + 1)) {
                    events[i].day = "Tomorrow";
                } else {
                    events[i].day = days[events[i].start.getDay()];
                }

                if(events[i].description) {
                    if(events[i].description.length > 140) {
                        events[i].short_description = events[i].description.substring(0, 140).replace(/\s+$/, '') + '...'; 
                    } else {
                        events[i].short_description = events[i].description;
                    }
                }
            }
            var tmpl = _.template($('#events-template').html());

            $('#container').html(tmpl({events: events}));
        });

    });

}


$(document).ready(init);
