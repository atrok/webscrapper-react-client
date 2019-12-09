import openSocket from "socket.io-client";


var socket = null;
var getsocket = function () {

    console.log(socket);
    if (socket === null) {
        socket = openSocket('http://localhost:3030');
        console.log("Opening socketio socket, connection: ", socket.connected);
    }
    return socket
}


class NotificationsIO {
    constructor() {
        this.id = "NotificationsIO_" + Date.now()
        this.socket = getsocket();
        console.log("Obtained socketio socket, connection: ", this.socket.connected);
        this.toConsole("Instantiating base class NotificationsIO");

    }

    subscribe(that) {
        this.toConsole('Subscribing to report ', that.state.id)

    }
    unsubscribe(that) {
        this.toConsole("Unsubscribing from getting report " + that.state.id);

    }

    toConsole(...args) {
        var msgflat = args.join(' ');
        console.log("[" + this.id + "]", msgflat)
    }

}
class CreateReport extends NotificationsIO {

    constructor() {
        super();

        var that = this;

        this.toConsole("Instantiating");
        that.id = "Report_" + Date.now();

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

}

class JobNotifications extends NotificationsIO {
    constructor() {
        super()
        var that = this;

        that.id = "Report_" + Date.now();

        this.toConsole("Instantiating");
        that.subscribers = [];

        that.socket.on('client data', data => {
            that.toConsole('client data arrived: ', JSON.stringify(data));
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
        //this.socket.emit('getReport', that.props.data.jobid);
    }
    unsubscribe(that) {
        this.toConsole("Unsubscribing from getting report " + that.state.id);
        this.subscribers = this.subscribers.filter(el => el !== that);
    }

    startJob() {

        this.socket.emit('start job', null);
    }
}

/*
console.log("Instantiating notifications");
var Report = new CreateReport();
var JobNotification = new JobNotifications();
*/

//socket.emit('getJobNotifications', jobid);
export { CreateReport, JobNotifications }