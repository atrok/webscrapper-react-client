import openSocket from "socket.io-client";


const socket = openSocket('http://localhost:3030');

function startJob() {

    socket.emit('start job', null);
}

class CreateReport {

    constructor(s) {
        var that = this;

        that.id = "Report_" + Date.now();

        that.socket = s;
        that.subscribers = [];

        that.socket.on('report', data => {
            that.toConsole('report arrived: ', JSON.stringify(data));
            if (!data.error) {
                that.toConsole('Subscribers: ', this.subscribers.length);
                if (this.subscribers.length > 0)
                    that.subscribers.forEach(el => {
                        el.getReport(data)
                    });
            };
        })
    }



    subscribe(that) {
        this.toConsole('Subscribing to report ', that.state.id)
        this.subscribers.push(that);
        this.socket.emit('getReport', that.props.data.jobid);
    }
    unsubscribe(that) {
        this.toConsole("Unsubscribing from getting report " + that.state.id);
        this.subscribers = this.subscribers.filter(el => el !== that);
    }

    toConsole(...args) {
        var msgflat = args.join(' ');
        console.log("[" + this.id + "]", msgflat)
    }
    /*
    getReport(jobid, cb) {

        console.log(cb)
        this.socket.on('report', data => {
            console.log('report arrived: ' + JSON.stringify(data));
            cb(data)
        });

        socket.emit('getReport', jobid);
    }
    */
}

var Report = new CreateReport(socket);

function subscribeToJobNotifications(jobid, cb) {

    socket.on('client data', data => {
        console.log('job data arrived: ' + JSON.stringify(data));
        cb(data)
    });

    //socket.emit('getJobNotifications', jobid);
} export { subscribeToJobNotifications, startJob, Report }