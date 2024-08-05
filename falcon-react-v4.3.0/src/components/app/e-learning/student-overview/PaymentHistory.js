import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import { Link } from 'react-router-dom';
import AdvanceTableFooter from 'components/common/advance-table/AdvanceTableFooter';
import IconButton from 'components/common/IconButton';

const columns = [
    {
        accessor: 'courseId',
        Header: 'Course',
        headerProps: { className: 'text-900' },
        Cell: rowData => (
            <Link to="#!" className="text-primary fw-semi-bold">
                Course#{rowData.row.original.courseId}
            </Link>
        )
    },
    {
        accessor: 'invoice',
        Header: 'Invoice no.',
        headerProps: {
            className: 'fw-medium text-900'
        },
        cellProps: {
            className: 'pe-6 py-3'
        },
        Cell: rowData => `#${rowData.row.original.invoice}`
    },
    {
        accessor: 'date',
        Header: 'Date',
        headerProps: {
            className: 'text-end fw-medium text-900'
        },
        cellProps: {
            className: 'text-end py-3'
        }
    },
    {
        accessor: 'amount',
        Header: 'Amount',
        headerProps: {
            className: 'text-end fw-medium text-900 white-space-nowrap'
        },
        cellProps: {
            className: 'text-end py-3'
        }
    },
    {
        accessor: 'status',
        Header: 'Payment Status',
        headerProps: {
            className: 'text-end fw-medium text-900 white-space-nowrap'
        },
        cellProps: {
            className: 'text-end py-3 font-sans-serif fw-medium'
        },
        Cell: rowData => (
            <span className={`text-${rowData.row.original.color}`}>
                {rowData.row.original.status}
            </span>
        )
    }
];

const PaymentHistory = ({ tableData, perPage = 5 }) => {
    return (
        <AdvanceTableWrapper
            columns={columns}
            data={tableData}
            sortable
            pagination
            perPage={perPage}
        >
            <Card className="h-100">
                <Card.Header className="d-flex flex-between-center">
                    <h5 className="mb-0 text-nowrap py-2 py-xl-0">
                        Payment History
                    </h5>
                    <div>
                        <IconButton
                            variant="falcon-default"
                            size="sm"
                            icon="filter"
                            iconClassName="me-sm-1"
                            className="me-2"
                        >
                            <span className="d-none d-sm-inline-block">
                                Filter
                            </span>
                        </IconButton>
                        <IconButton
                            variant="falcon-default"
                            size="sm"
                            icon="external-link-alt"
                            iconClassName="me-sm-1"
                        >
                            <span className="d-none d-sm-inline-block">
                                Export
                            </span>
                        </IconButton>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <AdvanceTable
                        table
                        headerClassName="bg-body-tertiary fw-medium font-sans-serif"
                        rowClassName="align-middle white-space-nowrap"
                        tableProps={{
                            className: 'fs--1 mb-0 overflow-hidden fw-semi-bold'
                        }}
                    />
                </Card.Body>
                <Card.Footer className="bg-body-tertiary d-flex align-items-center justify-content-end py-2">
                    <AdvanceTableFooter
                        rowCount={tableData.length}
                        table
                        rowInfo
                        perPage={perPage}
                        viewAllBtn
                    />
                </Card.Footer>
            </Card>
        </AdvanceTableWrapper>
    );
};

PaymentHistory.propTypes = {
    tableData: PropTypes.arrayOf(
        PropTypes.shape({
            courseId: PropTypes.string.isRequired,
            invoice: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired
        })
    ).isRequired,
    perPage: PropTypes.number
};

export default PaymentHistory;
