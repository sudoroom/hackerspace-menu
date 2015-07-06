#!/usr/bin/env node

var fs = require('fs');
var stream = require('stream');
var util = require('util');
var async = require('async');
var express     = require('express');
var path        = require('path');
var bodyParser  = require('body-parser');
var ical = require('ical');
var argv = require('minimist')(process.argv.slice(2));
var settings = require('./settings.js')

settings.recent_hours = settings.recent_hours || 8;

var port = argv.port || settings.port || 3000;

function error(res, msg) {
  res.status(500).send(JSON.stringify({
      status: 'error',
      msg: msg
  }));
}

var app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/foo', function(req, res) {
    res.send({status: 'success', data: 42});
});


app.get('/events', function(req, res) {


    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 
    var events = [];

    var nowish = new Date();
    nowish.setMinutes(nowish.getMinutes() - 30);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    ical.fromURL(settings.ical_url, {}, function(err, data) {
        if(err) return error(res, err); 
        
        var event;
        for(var k in data){
            if(!data.hasOwnProperty(k)) {
                continue;
            }
            
            event = data[k];
            if((event.start > nowish) && (event.start < tomorrow)) {
                events.push({
                    title: event.summary.replace(/ - .*/, ''),
                    start: event.start,
                    end: event.end,
                    location: event.location,
                    description: event.description
                });
                if(events.length >= settings.max_events) {
                    break;
                }
            }
        }
        events.sort(function(a, b) {
            if(a.start > b.start) {
                return 1;
            } else if(a.start < b.start) {
                return -1;
            } else {
                return 0;
            }
        });
        res.send({status: 'success', events: events});
    });


});

app.use('/grant-access/:code', function(req, res, next) {
    var code = req.params.code;

    if(!code || !req.body.password || !req.body.name || !req.body.contact_info || !req.body.collective) {
        return error(res, "Missing physical access code, password, name, contact info or collective.");
    }

    if(req.body.password != settings.admin_password) {
        return error(res, "Wrong password. Hint: The password is in the file settings.js in the doorjam-web directory on the server");
    }
});


console.log("Listening on http://localhost:" + port + "/")

app.listen(port);
