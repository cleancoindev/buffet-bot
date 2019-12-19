import React from 'react';
import { Link, useHistory } from 'react-router-dom';

// Material UI
import {
	createStyles,
	lighten,
	makeStyles,
	Theme,
	withStyles
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';

import TableRow from '@material-ui/core/TableRow';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { useIcedTxContext } from '../state/GlobalState';
import {
	findConditionByAddress,
	findActionByAddress,
	decodePayload,
	stringifyTimestamp
} from '../helpers/helpers';
import {
	ActionWhitelistData,
	ConditionWhitelistData
} from '../constants/interfaces';
import {
	DEFAULT_PAST_TRANSACTIONS,
	UPDATE_PAST_TRANSACTIONS
} from '../constants/constants';

/*
Event from SC

 // =============
	emit LogExecutionClaimMinted(
		_selectedExecutor,
		executionClaimId,
		userProxy,
		_trigger,
		_triggerPayloadWithSelector,
		_action,
		_actionPayloadWithSelector,
		triggerGasActionTotalGasMinExecutionGas,
		executionClaimExpiryDate,
		msg.value
);

What is needed:
- executionClaimId
- userProxy (used to filter, should be done by GraphQL)
- trigger address => identifier for condition
- action address => idendifier for action
- trigger payload, value to decode
- action payload, same
- Block number => to get creation date
- Expiry Date - maybe
- Prepayment - maybe
*/

const rows: Array<Data> = [];

// FETCH DATA FROM API => Using dummy data for now

// iterate over fetched DEFAULT_PAST_TRANSACTIONS
DEFAULT_PAST_TRANSACTIONS.forEach((executionClaim, index) => {
	// With address, find condition and action
	const condition = findConditionByAddress(executionClaim.conditionAddress);
	const action = findActionByAddress(executionClaim.actionAddress);

	// æDEV USE THIS Decoding when the view button is being clicked

	const newData = createData(
		executionClaim.id,
		`${condition.title} on ${condition.app}`,
		`${action.title} on ${action.app}`,
		stringifyTimestamp(executionClaim.timestamp),
		executionClaim.status,
		index,
		'CANCEL'
	);
	rows.push(newData);

	// Date when the claim was created
});

// const rows = [
// 	createData(
// 		'1',
// 		'Price on Kyber',
// 		'Sell on Kyber',
// 		'11.12.2019 - 12:00',
// 		'waiting',
// 		'VIEW',
// 		'CANCEL'
// 	),
// 	createData(
// 		'2',
// 		'Increase in Tokens on your Wallet',
// 		'Sell on Kyber',
// 		'11.12.2019 - 12:00',
// 		'waiting',
// 		'VIEW',
// 		'CANCEL'
// 	)
// ];

function desc<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

type Order = 'asc' | 'desc';

function getSorting<K extends keyof any>(
	order: Order,
	orderBy: K
): (
	a: { [key in K]: number | string },
	b: { [key in K]: number | string }
) => number {
	return order === 'desc'
		? (a, b) => desc(a, b, orderBy)
		: (a, b) => -desc(a, b, orderBy);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

// interface IcedTxStateTable {
// 	condition: ConditionWhitelistData;
// 	action: ActionWhitelistData;
// }

interface Data {
	id: string;
	condition: string;
	action: string;
	date: string;
	status: string;
	view: number;
	cancel: string;
}

function createData(
	id: string,
	condition: string,
	action: string,
	date: string,
	status: string,
	view: number,
	cancel: string
): Data {
	return { id, condition, action, date, status, view, cancel };
}

const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'id'
	},
	{
		id: 'condition',
		numeric: true,
		disablePadding: false,
		label: 'Condition'
	},
	{ id: 'action', numeric: true, disablePadding: false, label: 'Action' },
	{ id: 'date', numeric: true, disablePadding: false, label: 'Created at' },
	{
		id: 'status',
		numeric: true,
		disablePadding: false,
		label: 'Status'
	},
	{
		id: 'view',
		numeric: false,
		disablePadding: false,
		label: 'Details'
	},
	{
		id: 'cancel',
		numeric: true,
		disablePadding: false,
		label: 'Cancel & Refund'
	}
];

interface EnhancedTableProps {
	classes: ReturnType<typeof useStyles>;
	numSelected: number;
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: keyof Data
	) => void;
	onSelectAllClick: (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

// Table Row Styling:
const StyledTableCell = withStyles((theme: Theme) =>
	createStyles({
		head: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white
		},
		body: {
			fontSize: 14
		}
	})
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
	createStyles({
		root: {
			'&:nth-of-type(odd)': {
				backgroundColor: theme.palette.background.default
			}
		}
	})
)(TableRow);

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, onRequestSort } = props;

	const createSortHandler = (property: keyof Data) => (
		event: React.MouseEvent<unknown>
	) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<StyledTableRow>
				{headCells.map(headCell => (
					<StyledTableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						{headCell.label}
					</StyledTableCell>
				))}
			</StyledTableRow>
		</TableHead>
	);
}

const useToolbarStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingLeft: theme.spacing(2),
			paddingleft: theme.spacing(1)
		},
		paper: {},
		highlight:
			theme.palette.type === 'light'
				? {
						color: 'theme.palette.secondary.main',
						backgroundColor: lighten(
							theme.palette.secondary.light,
							0.85
						)
				  }
				: {
						color: 'theme.palette.text.primary',
						backgroundColor: theme.palette.secondary.dark
				  },
		title: {
			flex: '1 1 100%'
		}
	})
);

interface EnhancedTableToolbarProps {
	numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const classes = useToolbarStyles();
	const { numSelected } = props;

	return (
		<Toolbar>
			<Typography className={classes.title} variant="h6" id="tableTitle">
				Your Iced Transactions
			</Typography>
		</Toolbar>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%'

			// background: 'transparent',
			// color: 'white'
		},
		paper: {
			width: '100%',
			marginBottom: theme.spacing(2),
			overflowX: 'auto',
			// minWidth: 750,
			background: 'transparent'
			// color: 'white'
		},
		table: {
			// background: 'transparent',
			// color: 'white'
		},
		visuallyHidden: {
			border: 0,
			clip: 'rect(0 0 0 0)',
			height: 1,
			margin: -1,
			overflow: 'hidden',
			padding: 0,
			position: 'absolute',
			top: 20,
			width: 1,
			color: 'pink'
		}
	})
);

export default function EnhancedTable() {
	const { icedTxState, dispatch } = useIcedTxContext();

	// Router Context
	let history = useHistory();

	const classes = useStyles();
	const [order, setOrder] = React.useState<Order>('asc');
	// @ DEV CHANGED TO ID FROM CALORIES
	const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
	const [selected, setSelected] = React.useState<string[]>([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const showDetails = (event: React.MouseEvent<unknown>, row: Data) => {
		console.log('show details');
		console.log(row);
		console.log(DEFAULT_PAST_TRANSACTIONS[row.view]);
		dispatch({
			type: UPDATE_PAST_TRANSACTIONS,
			pastTransactions: DEFAULT_PAST_TRANSACTIONS
		});
		history.push(`/dashboard/${DEFAULT_PAST_TRANSACTIONS[row.view].id}`);
		// Route to new page
	};

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof Data
	) => {
		const isDesc = orderBy === property && order === 'desc';
		setOrder(isDesc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.checked) {
			// @DEV CHANGED NAME TO ID
			const newSelecteds = rows.map(n => n.id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected: string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<React.Fragment>
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<EnhancedTableToolbar numSelected={selected.length} />

					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={dense ? 'small' : 'medium'}
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{stableSort(rows, getSorting(order, orderBy))
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, index) => {
									const isItemSelected = isSelected(row.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<StyledTableRow
											hover
											onClick={event =>
												handleClick(event, row.id)
											}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.id}
											selected={isItemSelected}
										>
											<StyledTableCell align="left">
												{row.id}
											</StyledTableCell>
											<StyledTableCell align="left">
												{row.condition}
											</StyledTableCell>
											<StyledTableCell align="left">
												{row.action}
											</StyledTableCell>
											<StyledTableCell align="left">
												{row.date}
											</StyledTableCell>
											<StyledTableCell align="left">
												{row.status}
											</StyledTableCell>
											<StyledTableCell align="left">
												<div
													onClick={e =>
														showDetails(e, row)
													}
													style={{
														display: 'flex',
														justifyContent:
															'center',
														alignItems: 'center',
														marginRight: '8px',
														cursor: 'pointer'
													}}
												>
													{/* <Button
														onClick={showDetails}
														value={'test'}
													> */}
													<VisibilityIcon
														// color="primary"
														fontSize={'small'}
													></VisibilityIcon>
													{/* </Button> */}
													{/* {row.view} */}
												</div>
											</StyledTableCell>
											<StyledTableCell align="left">
												{/* {row.cancel} */}
												<div
													onClick={(): void =>
														console.log('Cancel')
													}
													style={{
														display: 'flex',
														justifyContent:
															'center',
														alignItems: 'center',
														marginRight: '20px',
														cursor: 'pointer'
													}}
												>
													<CancelIcon
														// color="primary"
														fontSize={'small'}
													></CancelIcon>
												</div>
											</StyledTableCell>
										</StyledTableRow>
									);
								})}
							{emptyRows > 0 && (
								<StyledTableRow
									style={{
										height: (dense ? 33 : 53) * emptyRows
									}}
								>
									<StyledTableCell
										colSpan={headCells.length}
									/>
								</StyledTableRow>
							)}
						</TableBody>
					</Table>
				</Paper>
			</div>
		</React.Fragment>
	);
}
