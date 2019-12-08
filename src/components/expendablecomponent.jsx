import React, { Component } from 'react';
import DataTable from "react-data-table-component";
import { Report } from '../sock';
import makeCancellable from '../lib/cancellable';

const dt_errors_columns = [
    {
        name: 'Solution',
        selector: 'search.solution_name',
        sortable: false,
    },
    {
        name: 'Component',
        selector: 'search["component"]',
        cell: row => <a href={row.search["component-href"]}>{row.search.component}</a>,
        sortable: false,
    },
    {
        name: 'Release',
        selector: 'search["release-link-href"]',
        sortable: false,
        cell: row => <a href={row.search["release-link-href"]}>{row.search.release}</a>
    },
    {
        name: 'Error',
        selector: 'error',
        sortable: false,
    }
];
const dt_report_columns = [
    {
        name: 'Family',
        selector: 'family',
        sortable: true,
    },
    {
        name: 'Solution',
        selector: 'solution_name',
        sortable: false,
    },
    {
        name: 'Component',
        selector: 'component',
        cell: row => <a href={row["component-href"]}>{row.component}</a>,
        sortable: false,
    },
    {
        name: 'Release',
        selector: 'release-link-href',
        sortable: false,
        cell: row => <a href={row["release-link-href"]}>{row.release}</a>
    },
    {
        name: 'Date',
        selector: 'release_date',
        sortable: false,
    },
    {
        name: 'Type',
        selector: 'release_type',
        sortable: false,
    },
    {
        name: 'execution time, ms',
        selector: 'executiontime',
        sortable: false,
    }
]
// The row data is composed into your custom expandable component via the data prop
class ExpendableComponent extends Component {
    constructor(props) {
        super(props);
        console.log("init instance of ExpendableComponent", this);
        var id = 'ExpendableComponent_' + Date.now();
        this.state = {
            'id': id,
            data:
            {
                report:
                {
                    invocations: 0,
                    execution_duration: 0,
                    errors: [],
                    execution_report: [],
                    msg: null
                }
            },
        }
    }

    componentDidMount() {
        console.log("Subscribe for report notifications, ", this.state.id);
        Report.subscribe(this);

    }

    //Report helper function
    getReport(msgdata) {

        if (msgdata.jobid === this.props.data.jobid)
            this.setState({
                data: msgdata
            })
        // we don't need reports populated more than once so unsubscribing after getting the state updated
        //Report.unsubscribe(this)
    }


    componentWillUnmount() {
        Report.unsubscribe(this)
    }

    renderReport() {
        const { data } = this.state;

        if (data.report.msg) return <p>{data.report.msg}</p>;
        return (
            <React.Fragment>
                <p><span>Last executed at </span><span>{data.report.last_execution_time}</span></p>
                <p><span>Duration </span><span>{data.report.execution_duration}</span></p>
                <DataTable title="New records" columns={dt_report_columns} data={data.report.execution_report} />
                <DataTable title="Errors" columns={dt_errors_columns} data={data.report.errors} />
            </React.Fragment>
        );
    }

    render() {

        const { data } = this.state;

        console.log('Data: ', data)
        return (
            <div className='m-3' name={"report-" + this.props.data.jobid}>
                {this.renderReport()}

            </div>
        )
    }
} export default ExpendableComponent
