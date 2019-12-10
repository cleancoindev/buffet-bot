import React, { useEffect } from 'react'

// Routing
import { Link } from 'react-router-dom'

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


const defaultWhitelistData = {
    id: 0,
    app: "",
    title: "",
    address: "",
    inputs: []

}

interface WhitelistData {
    id: number;
    app: string;
    title: string;
    address: string;
    inputs: Array<string>;
}

interface UserSelection {
    conditionApp: string;
    actionApp: string;
    conditionType: Array<WhitelistData>;
    actionType: Array<WhitelistData>;
}

interface CreateData {
    condition: WhitelistData;
    action: WhitelistData;
}

enum Part {
    Condition,
    Action,
}

export default function AppSelection() {

    // Run every time
    // useEffect( () => {
    //     test()
    // })
    const [userSelection, setUserSelection] = React.useState<UserSelection> ({
        conditionApp: "",
        actionApp: "",
        conditionType: [],
        actionType: []
    })

    const [data, setData] = React.useState<CreateData>({
        condition: defaultWhitelistData,
        action: defaultWhitelistData
    })

    function updateDataSelection(varName: string, chosenData: WhitelistData) {
        setData({...data, [varName]: chosenData})
    }

    function updateTypes(part: Part, app: string) {
        const result: Array<WhitelistData> = []
        const conditionOrAction = {app: "", type: ""};
        if (part === Part.Condition)
        {
            CTYPES.forEach(type => {
                if (type.app === app)
                {
                    result.push(type)
                }
            })
            conditionOrAction.app = "conditionApp"
            conditionOrAction.type = "conditionType"
        }
        else if (part === Part.Action)
        {
            ATYPES.forEach(type => {
                if (type.app === app)
                {
                    result.push(type)
                }
            })
            conditionOrAction.app = "actionApp"
            conditionOrAction.type = "actionType"
        }
        setUserSelection({...userSelection, [conditionOrAction.app]: app, [conditionOrAction.type]: result})
    }

    function updateTypes2(part: Part, id: string) {
        let varName = ""
        let updatedData: WhitelistData = defaultWhitelistData
        if (part === Part.Condition)
        {
            userSelection.conditionType.map(type => {
                if (type.id === parseInt(id)) {updatedData = type}
            })
            varName="condition"

        }
        else if (part === Part.Action)
        {
            userSelection.actionType.forEach(type => {
                if (type.id === parseInt(id)) {updatedData = type}
            })
            varName="action"

        }
        setData({...data, [varName]: updatedData})
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
                    <Dropdown app userSelection={userSelection} selectedMetric={Part.Condition} updateTypes={updateTypes} data={CTYPES}/>
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
                    <Dropdown app userSelection={userSelection} selectedMetric={Part.Action} updateTypes={updateTypes} data={ATYPES}/>
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
                        <Dropdown app={false} userSelection={userSelection} selectedMetric={Part.Condition} updateTypes={updateTypes2} data={userSelection.conditionType}/>
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
                        <Dropdown app={false} userSelection={userSelection} selectedMetric={Part.Action} updateTypes={updateTypes2} data={userSelection.actionType}/>
                    </Grid>
                </Grid>
                    { (userSelection.conditionApp !== "" && userSelection.actionApp !== "" && userSelection.conditionType !== [] && userSelection.actionType !== [] &&

                    <Grid
                        container
                        item
                        xs={12}
                        direction="row"
                        justify="space-evenly"
                        alignItems="stretch"
                        style={{background: "pink", height: "50px", marginTop: "16px"}}
                    >
                        <Link to={`create/if-${userSelection.conditionType}-on-${userSelection.conditionApp}/${userSelection.actionType}-on-${userSelection.actionApp}`}>
                            <Button style={{background: "white", minWidth: "100px"}}>Create</Button>
                        </Link>
                    </Grid>
                    )}
            </Grid>
        )}

    </div>
    )
}