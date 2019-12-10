import React, { useContext, useEffect } from 'react'

// Routing
import { Link } from 'react-router-dom'

// Context API
import { useIcedTxContext } from '../state/GlobalState'

// Material UI components
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import { ATYPES, CTYPES, APPS } from '../constants/whitelist'

// Local components
import Dropdown from './Dropdown'
import { string } from 'prop-types';

// Import Interfaces
import { ConditionOrAction, IcedTx, WhitelistData, UserSelection } from '../constants/interfaces';


const defaultWhitelistData = {
    id: 0,
    app: "",
    title: "",
    address: "",
    inputs: []

}

export default function AppSelection() {
    const { updateIcedTx, icedTxState } = useIcedTxContext()
    // Run every time
    // useEffect( () => {
    //     test()
    // })
    const [userSelection, setUserSelection] = React.useState<UserSelection> ({
        conditionApp: "",
        actionApp: "",
        conditionAppFunctions: [],
        actionAppFunctions: []
    })

    const [data, setData] = React.useState<IcedTx>({
        condition: defaultWhitelistData,
        action: defaultWhitelistData
    })

    function updateTypes(selectedConditionOrAction: ConditionOrAction, app: string) {
        const result: Array<WhitelistData> = []
        const conditionOrAction = {app: "", type: ""};
        if (selectedConditionOrAction === ConditionOrAction.Condition)
        {
            CTYPES.forEach(type => {
                if (type.app === app)
                {
                    result.push(type)
                }
            })
            conditionOrAction.app = "conditionApp"
            conditionOrAction.type = "conditionAppFunctions"
        }
        else if (selectedConditionOrAction === ConditionOrAction.Action)
        {
            ATYPES.forEach(type => {
                if (type.app === app)
                {
                    result.push(type)
                }
            })
            conditionOrAction.app = "actionApp"
            conditionOrAction.type = "actionAppFunctions"
        }
        setUserSelection({...userSelection, [conditionOrAction.app]: app, [conditionOrAction.type]: result})
    }

    function updateTypes2(selectedConditionOrAction: ConditionOrAction, id: string) {
        updateIcedTx(id, selectedConditionOrAction)
        // let varName = ""
        // let updatedData: WhitelistData = defaultWhitelistData
        // if (selectedConditionOrAction === ConditionOrAction.Condition)
        // {
        //     userSelection.conditionAppFunctions.map(type => {
        //         if (type.id === parseInt(id)) {updatedData = type}
        //     })
        //     varName="condition"

        // }
        // else if (selectedConditionOrAction === ConditionOrAction.Action)
        // {
        //     userSelection.actionAppFunctions.forEach(type => {
        //         if (type.id === parseInt(id)) {updatedData = type}
        //     })
        //     varName="action"

        // }
        // setData({...data, [varName]: updatedData})
    }

    return (
        <div>
        <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            style={{background: "brown", padding: "10px"}}
        >
            <Grid
                container
                item
                sm={4}
                xs={12}
                direction="column"
                justify="space-evenly"
                alignItems="stretch"
                style={{background: "pink", height: "200px"}}
            >
                <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <p style={{marginLeft: "10px", color: "black"}}>Listen to this dApp</p>
                    <Dropdown app userSelection={userSelection} selectedMetric={ConditionOrAction.Condition} updateTypes={updateTypes} data={CTYPES}/>
                </Grid>
                {/* <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <Dropdown/>
                </Grid> */}
            </Grid>
            <Grid
                container
                item
                sm={2}
                xs={12}
                direction="column"
                justify="center"
                alignItems="center"
                style={{background: "pink"}}
            >
                <Hidden xsDown>
                    <ArrowForwardIcon fontSize="large" />
                </Hidden>
                <Hidden smUp>
                    <ArrowDownwardIcon fontSize="large" />
                </Hidden>


            </Grid>
            <Grid
                container
                item
                sm={4}
                xs={12}
                direction="column"
                justify="space-evenly"
                alignItems="stretch"
                style={{background: "pink", height: "200px"}}
            >
                <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <p style={{marginLeft: "10px", color: "black"}}>Send Transactions to this dApp</p>
                    <Dropdown app userSelection={userSelection} selectedMetric={ConditionOrAction.Action} updateTypes={updateTypes} data={ATYPES}/>
                </Grid>
            </Grid>
        </Grid>
        <Divider variant="middle" />
        { (userSelection.conditionApp !== "" && userSelection.actionApp !== "" &&
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
                style={{background: "brown", padding: "10px"}}
            >
                <Grid
                    container
                    item
                    sm={4}
                    xs={12}
                    direction="column"
                    justify="space-evenly"
                    alignItems="stretch"
                    style={{background: "pink", height: "200px"}}
                >
                    <Grid container item justify="flex-start" style={{background: "yellow"}}>
                        <p style={{marginLeft: "10px", color: "black"}}>Select Condition</p>
                        <Dropdown app={false} userSelection={userSelection} selectedMetric={ConditionOrAction.Condition} updateTypes={updateTypes2} data={userSelection.conditionAppFunctions}/>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    sm={2}
                    xs={12}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{background: "pink"}}
                >
                    <Hidden xsDown>
                        <ArrowForwardIcon fontSize="large" />
                    </Hidden>
                    <Hidden smUp>
                        <ArrowDownwardIcon fontSize="large" />
                    </Hidden>


                </Grid>
                <Grid
                    container
                    item
                    sm={4}
                    xs={12}
                    direction="column"
                    justify="space-evenly"
                    alignItems="stretch"
                    style={{background: "pink", height: "200px"}}
                >
                    <Grid container item justify="flex-start" style={{background: "yellow"}}>
                        <p style={{marginLeft: "10px", color: "black"}}>Select Action</p>
                        <Dropdown app={false} userSelection={userSelection} selectedMetric={ConditionOrAction.Action} updateTypes={updateTypes2} data={userSelection.actionAppFunctions}/>
                    </Grid>
                </Grid>
                    { (userSelection.conditionApp !== "" && userSelection.actionApp !== "" && icedTxState.condition.id !== 0 && icedTxState.action.id !== 0 &&

                    <Grid
                        container
                        item
                        xs={12}
                        direction="row"
                        justify="space-evenly"
                        alignItems="stretch"
                        style={{background: "pink", height: "50px", marginTop: "16px"}}
                    >
                        <Link to={`create/condition-${icedTxState.condition.id}/action-${icedTxState.action.id}`}>
                            <Button style={{background: "white", minWidth: "100px"}}>Create</Button>
                        </Link>
                    </Grid>
                    )}
            </Grid>
        )}

    </div>
    )
}