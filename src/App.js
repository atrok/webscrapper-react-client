import React, { Component } from 'react';

import DataTable from "react-data-table-component";
import { subscribeToJobNotifications, startJob, getReport } from './sock';
import ExpendableComponent from './components/expendablecomponent';





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
    this.state = {
      response: 0,
      endpoint: "http://19.168.14.91:3030",
      columns: columns,
      data: data
    };
  }

  componentDidMount() {

    var { tdata } = this.state;

    console.log(tdata)

    subscribeToJobNotifications(null, (msgdata) => {
      this.setState({
        data: msgdata
      })
    }
    );
  }

  render() {
    const { columns, data } = this.state;
    return (
      <div className='m-2'>
        <DataTable
          title="List of available scrapper jobs"
          columns={columns}
          data={data}
          expandableRows
          expandableRowsComponent={<ExpendableComponent />}
        />
        <div>
          <button key="startJob" onClick={() => startJob()}>Start immediate job</button>
        </div>
      </div>
    )
  }
};

export default App;
