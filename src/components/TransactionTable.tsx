import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useEagerConnect } from '../hooks/hooks';

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
	findConditionByAddress,
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
import { ChainIds } from '../constants/interfaces';
import { getStatusText } from '../constants/summaryTest';

import { injected } from '../constants/connectors';

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
	date: number;
	status: string;
	view: number;
	cancel: string;
}

function createData(
	id: string,
	condition: string,
	action: string,
	date: number,
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
		label: '#'
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
			borderBottom: `1.5px solid ${COLOURS.salmon}`,
			fontSize: 16
			// borderRight: `1.5px solid ${COLOURS.salmon}`
			// ...BOX
		},
		body: {
			fontSize: 16,
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

export async function callGraphApi(graphName: string, account: string) {
	try {
		const response = await fetch(
			`https://api.thegraph.com/subgraphs/name/gelatodigital/${graphName}`,
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
							condition
							conditionPayload
							action
							actionPayload
							expiryDate
							prepayment
							mintingDate
							executionDate
							executionHash
							status
							conditionGasActionTotalGasMinExecutionGas
						  }
						}
					  }
					  `
				})
			}
		);
		const json = await response.json();
		return json;
	} catch (error) {
		// console.log('No data returned');
	}
}

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
			color: 'white',
			fontSize: 20
		}
	})
);

interface EnhancedTableToolbarProps {
	numSelected: number;
	renderCounter: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const classes = useToolbarStyles();
	const web3 = useWeb3React();

	const { numSelected, renderCounter } = props;

	return (
		<Toolbar style={{ alignItems: 'center', flexDirection: 'column' }}>
			<Typography className={classes.title} variant="h6" id="tableTitle">
				Your Bot Activity
			</Typography>
			{!web3.active && numSelected === 0 && (
				<div
					className={classes.title}
					style={{
						fontSize: '16px',
						marginTop: '8px',
						marginBottom: '8px'
					}}
					id="tableSubTitle"
				>
					(Please connect to Metamask)
				</div>
			)}
			{numSelected === 0 && web3.active && renderCounter === 5 && (
				<div
					className={classes.title}
					style={{
						fontSize: '16px',
						marginTop: '8px',
						marginBottom: '8px'
					}}
					id="tableSubTitle"
				>
					(No bot instructions found)
				</div>
			)}
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

	// Router Context
	let history = useHistory();

	// Eager Connect
	// const triedEager = useEagerConnect();
	const [tried, setTried] = React.useState(false);

	// Stalionator code
	useEffect(() => {
		if (!web3.active) {
			injected.isAuthorized().then((isAuthorized: boolean) => {
				if (isAuthorized) {
					web3.activate(injected, undefined, true).catch(() => {
						setTried(true);
					});
				} else {
					setTried(true);
				}
			});
		}
	}, []); // intentionally only running on mount (make sure it's only mounted once :))

	// if the connection worked, wait until we get confirmation of that to flip the flag
	useEffect(() => {
		if (!tried && web3.active) {
			setTried(true);
		}
	}, [tried, web3.active]);

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

	let graphName: string = '';
	switch (web3.chainId) {
		case 1:
			graphName = 'gelato';

			break;
		case 3:
			graphName = 'gelato-ropsten';

			break;
		case 4:
			graphName = 'gelato-rinkeby';

			break;
		case 42:
			graphName = 'gelato-kovan';

			break;
		default:
			graphName = 'gelato';
			break;
	}

	async function fetchPastExecutionClaims() {
		try {
			const json = await callGraphApi(graphName, account);
			const executionClaims = json.data.users[0].executionClaims;

			let newRows: Array<Data> = [];

			// Change global state
			dispatch({
				type: UPDATE_PAST_TRANSACTIONS,
				pastTransactions: executionClaims
			});

			let counter = 0;
			executionClaims.forEach((executionClaim: any, index: any) => {
				// With address, find condition and action
				const condition = findConditionByAddress(
					executionClaim.condition,
					web3.chainId as ChainIds
				);

				const action = findActionByAddress(
					executionClaim.action,
					web3.chainId as ChainIds
				);

				let statusString = getStatusText(executionClaim.status);

				// @DEV USE THIS Decoding when the view button is being clicked
				// console.log(condition);
				// console.log(action);
				const newData = createData(
					counter.toString(),
					condition.title,
					action.title,
					executionClaim.mintingDate,
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
			// console.log(err);
			// console.log('Could not fetch past execution claims');

			// Do UseEffect 5 times, if it API request still fails, stop
			if (renderCounter < 5) setRenderCounter(renderCounter + 1);
		}
	}

	useEffect(() => {
		console.log('FETCHING TABLE');
		let requestCancelled = false;
		if (!requestCancelled) {
			fetchPastExecutionClaims();
		}

		const intervalId = setInterval(() => {
			fetchPastExecutionClaims();
		}, 20000);

		// this will clear Timeout when component unmont like in willComponentUnmount

		return () => {
			clearInterval(intervalId);
			requestCancelled = true;
		};
		// Clean up function
	}, [renderCounter, web3.active, web3.account]);

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
					<EnhancedTableToolbar
						numSelected={displayedRows.length}
						renderCounter={renderCounter}
					/>

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
												{row.condition}
											</StyledTableCell>
											<StyledTableCell align="left">
												{row.action}
											</StyledTableCell>
											<StyledTableCell align="left">
												{stringifyTimestamp(
													row.date.toString()
												)}
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
														'succesfully executed' &&
													row.status !==
														'failed to execute - please contact us' && (
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
