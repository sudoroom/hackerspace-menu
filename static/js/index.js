

var router = new Grapnel();


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
                
                if(events[i].start.getDate() > now.getDate()) {
                    events[i].day = "Tomorrow";
                } else {
                    events[i].day = "Today";
                }

                if(events[i].description.length > 140) {
                    events[i].short_description = events[i].description.substring(0, 140).replace(/\s+$/, '') + '...'; 
                } else {
                    events[i].short_description = events[i].description;
                }

            }
            var tmpl = _.template($('#events-template').html());

            $('#container').html(tmpl({events: events}));
        });

    });

}


$(document).ready(init);
