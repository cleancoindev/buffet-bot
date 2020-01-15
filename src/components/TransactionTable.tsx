import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Material UI
import {
	createStyles,
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
import TablePagination from '@material-ui/core/TablePagination';

import TableRow from '@material-ui/core/TableRow';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { useIcedTxContext } from '../state/GlobalState';
import {
	findTriggerByAddress,
	findActionByAddress,
	stringifyTimestamp
} from '../helpers/helpers';

import {
	UPDATE_PAST_TRANSACTIONS,
	COLOURS,
	CANCEL_EXECUTION_CLAIM,
	BOX
} from '../constants/constants';
import { useWeb3React } from '@web3-react/core';
import { useGelatoCore } from '../hooks/hooks';

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
// 	trigger: TriggerWhitelistData;
// 	action: ActionWhitelistData;
// }

interface Data {
	id: string;
	trigger: string;
	action: string;
	date: string;
	status: string;
	view: number;
	cancel: string;
}

function createData(
	id: string,
	trigger: string,
	action: string,
	date: string,
	status: string,
	view: number,
	cancel: string
): Data {
	return { id, trigger, action, date, status, view, cancel };
}

const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: '#'
	},
	{
		id: 'trigger',
		numeric: true,
		disablePadding: false,
		label: 'Trigger'
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
		label: 'Cancel'
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
			// backgroundColor: theme.palette.common.white,
			background: 'none',
			color: 'white',
			fontWeight: 'bold',
			borderBottom: `1.5px solid ${COLOURS.salmon}`
			// borderRight: `1.5px solid ${COLOURS.salmon}`
			// ...BOX
		},
		body: {
			fontSize: 14,
			color: 'white',
			borderBottom: `1.5px solid ${COLOURS.salmon}`
			// borderRadius: '1px 1px 1px 1px'
		}
	})
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
	createStyles({
		root: {
			'&:nth-of-type(odd)': {
				// backgroundColor: theme.palette.background.default,
				// ...BOX
			}
		}
	})
)(TableRow);

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy } = props;

	// const createSortHandler = (property: keyof Data) => (
	// 	event: React.MouseEvent<unknown>
	// ) => {
	// 	onRequestSort(event, property);
	// };

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
		highlight: {
			color: 'theme.palette.secondary.main',
			// backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			backgroundColor: 'none'
		},
		title: {
			flex: '1 1 100%',
			color: 'white'
		}
	})
);

interface EnhancedTableToolbarProps {
	numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const classes = useToolbarStyles();
	// const { numSelected } = props;

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
			// color: 'white'
		},
		paper: {
			width: '100%',
			marginBottom: theme.spacing(1),
			overflowX: 'auto',
			// minWidth: 750,
			background: 'transparent'
			// border: `3px outset ${COLOURS.salmon}`,
			// borderRadius: '2px 2px 2px 2px'
		},
		table: {
			// color: 'white'
		},
		tablePagination: {
			color: 'white',
			marginTop: theme.spacing(1)
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
	const {
		dispatch,
		icedTxState: { pastTransactions }
	} = useIcedTxContext();
	const web3 = useWeb3React();

	const gelatoCore = useGelatoCore();
	// Router Context
	let history = useHistory();

	const classes = useStyles();
	const [order, setOrder] = React.useState<Order>('desc');
	// @ DEV CHANGED TO ID FROM CALORIES
	const [orderBy, setOrderBy] = React.useState<keyof Data>('date');
	const [selected, setSelected] = React.useState<string[]>([]);
	const [page, setPage] = React.useState(0);
	const [dense /*setDense*/] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	// THE GRAPH API Fetching

	let account: string;
	if (!web3.active) {
		account = '0x0';
	} else {
		account = web3.account as string;
	}

	const rows: Array<Data> = [];

	const [displayedRows, setDisplayedRows] = React.useState(rows);
	const [renderCounter, setRenderCounter] = React.useState(0);

	async function fetchPastExecutionClaims() {
		try {
			const response = await fetch(
				'https://api.thegraph.com/subgraphs/name/gelatodigital/gelato-ropsten',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						query: `{
							users (where: {address:"${account}"}) {
								executionClaims (orderBy:mintingDate) {
								id
								executionClaimId
								selectedExecutor
								proxyAddress
								trigger
								triggerPayload
								action
								actionPayload
								expiryDate
								prepayment
								mintingDate
								executionDate
								status
								triggerGasActionTotalGasMinExecutionGas
							  }
							}
						  }
						  `
					})
				}
			);
			const json = await response.json();
			const executionClaims = json.data.users[0].executionClaims;

			let newRows: Array<Data> = [];

			// Change global state
			dispatch({
				type: UPDATE_PAST_TRANSACTIONS,
				pastTransactions: executionClaims
			});

			let counter = 0;
			executionClaims.forEach((executionClaim: any, index: any) => {
				// With address, find trigger and action
				const trigger = findTriggerByAddress(executionClaim.trigger);

				const action = findActionByAddress(executionClaim.action);

				// Set default status string
				let statusString: string = 'open';

				switch (executionClaim.status) {
					case 'open':
						statusString = 'open';
						break;
					case 'executedSuccess':
						statusString = 'succesfully executed';
						break;
					case 'executedFailure':
						statusString = 'failed to execute - please contract us';
						break;
					case 'cancelled':
						statusString = 'cancelled';
						break;
					case 'expired':
						statusString = 'expired';
						break;
				}

				// @DEV USE THIS Decoding when the view button is being clicked
				// console.log(trigger);
				// console.log(action);
				const newData = createData(
					counter.toString(),
					trigger.title,
					action.title,
					stringifyTimestamp(executionClaim.mintingDate),
					statusString,
					index,
					'CANCEL'
				);
				newRows.push(newData);
				counter = counter + 1;

				// Date when the claim was created
			});

			setDisplayedRows(newRows);
		} catch (err) {
			// console.log('Could not fetch past execution claims');

			// Do UseEffect 5 times, if it API request still fails, stop
			renderCounter < 5
				? setRenderCounter(renderCounter + 1)
				: console.log(
						'Could not connect to users account, stop useEffect'
				  );
		}
	}

	useEffect(() => {
		fetchPastExecutionClaims();
		// this will clear Timeout when component unmont like in willComponentUnmount
	}, [renderCounter]);

	// Cancel ExecutionClaim

	const cancelExecutionClaim = async (executionClaimId: string) => {
		// Update Tx State
		// Update pastTransactionId
		// Open MOdal
		dispatch({
			type: CANCEL_EXECUTION_CLAIM,
			pastTransactionId: executionClaimId
		});
	};

	const showDetails = (event: React.MouseEvent<unknown>, row: Data) => {
		history.push(`/dashboard/${row.view}`);
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
			const newSelecteds = displayedRows.map(n => n.id);
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

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name: string) => selected.indexOf(name) !== -1;

	const emptyRows =
		rowsPerPage -
		Math.min(rowsPerPage, displayedRows.length - page * rowsPerPage);

	return (
		<React.Fragment>
			<div className={classes.root}>
				{/* <Button color={'secondary'} onClick={fetchPastExecutionClaims}>
					Fetch
				</Button> */}
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
							rowCount={displayedRows.length}
						/>
						<TableBody>
							{stableSort(
								displayedRows,
								getSorting(order, orderBy)
							)
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, index) => {
									const isItemSelected = isSelected(row.id);
									// const labelId = `enhanced-table-checkbox-${index}`;

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
												{parseInt(row.id) + 1}
											</StyledTableCell>
											<StyledTableCell align="left">
												{row.trigger}
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
														// marginRight: '8px',
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
												{row.status !== 'cancelled' &&
													row.status !== 'expired' &&
													row.status !==
														'succesfully executed' && (
														<div
															onClick={() =>
																cancelExecutionClaim(
																	row.id
																)
															}
															style={{
																display: 'flex',
																justifyContent:
																	'center',
																alignItems:
																	'center',
																// marginRight: '20px',
																cursor:
																	'pointer'
															}}
														>
															<CancelIcon
																// color="primary"
																fontSize={
																	'small'
																}
															></CancelIcon>
														</div>
													)}
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
					<TablePagination
						className={classes.tablePagination}
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={displayedRows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onChangePage={handleChangePage}
						onChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</Paper>
			</div>
		</React.Fragment>
	);
}
