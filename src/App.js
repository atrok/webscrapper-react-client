import React, { Component } from 'react';

import DataTable from "react-data-table-component";
import { JobNotifications } from './sock';
import ExpendableComponent from './components/expendablecomponent';

import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify from 'aws-amplify';
// Get the aws resources configuration parameters
import awsconfig from './aws-exports'; // if you are using Amplify CLI

Amplify.configure(awsconfig);



const data = [];
const columns = [
  {
    name: 'JOB ID',
    selector: 'jobid',
    sortable: true,
  },
  {
    name: 'Next Run',
    selector: 'next-run',
    sortable: false,
  },
  {
    name: 'Invocations',
    selector: 'invocations',
    sortable: false,
  },
  {
    name: 'Start url',
    selector: 'url',
    sortable: false,
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: false,
  },
  {
    name: 'Progress',
    selector: 'progress',
    sortable: false,
  },
];

class App extends Component {
  constructor() {
    super();
    this.id = Date.now();
    this.state = {
      response: 0,
      endpoint: "http://192.168.14.91:3030",
      columns: columns,
      data: data,
      id: "Application_" + Date.now()
    };

    this.notification = new JobNotifications();

    console.log("Instantiating ", this.state.id)
  }

  componentDidMount() {

    console.log("componentDidMount ", this.state.id)

    this.notification.subscribe(this);
  }

  //Report helper function
  getReport(msgdata) {

    this.setState({
      data: msgdata
    })
  }

  componentWillUnmount() {
    this.notification.unsubscribe(this);
  }
  render() {
    const { columns, data } = this.state;
    console.log("Rendering " + this.state.id)
    return (
      <div className='m-2'>
        <h1>Genesys Release notes webscrapper service</h1>
        <DataTable
          title="List of available scrapper jobs"
          columns={columns}
          data={data}
          expandableRows
          expandableRowsComponent={<ExpendableComponent />}
        />
        <div>
          <button key="startJob" onClick={() => this.notification.startJob()}>Start immediate job</button>
        </div>
      </div>
    )
  }
};

export default withAuthenticator(App, {
  // Render a sign out button once logged in
  includeGreetings: true
});
