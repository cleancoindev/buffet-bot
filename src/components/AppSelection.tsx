import React from 'react'

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';



// Local components
import AppDropdown from './AppDropdown'

export default function AppSelection() {
    console.log("rerender")

    const [userSelection, setUserSelection] = React.useState({
        conditionApp: "",
        actionApp: "",
        conditionType: "",
        actionType: ""
    })

    console.log(userSelection)
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
                    <AppDropdown userSelection={userSelection} selectedMetric={'conditionApp'} setUserSelection={setUserSelection} data={["Wallet", "Calendar", "Kyber Network"]}/>
                </Grid>
                {/* <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <AppDropdown/>
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
                    <AppDropdown userSelection={userSelection} selectedMetric={'actionApp'} setUserSelection={setUserSelection} data={["Wallet", "Kyber Network"]}/>
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
                        <AppDropdown userSelection={userSelection} selectedMetric={'conditionType'} setUserSelection={setUserSelection} data={["Token Balance", "Ether Balance"]}/>
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
                        <AppDropdown userSelection={userSelection} selectedMetric={'actionType'} setUserSelection={setUserSelection} data={["Trade Token"]}/>
                    </Grid>
                </Grid>
                    { (userSelection.conditionApp !== "" && userSelection.actionApp !== "" && userSelection.conditionType !== "" && userSelection.actionType !== "" &&
                    <Grid
                        container
                        item
                        xs={12}
                        direction="row"
                        justify="center"
                        alignItems="stretch"
                        style={{background: "pink", height: "50px", marginTop: "16px"}}
                    >
                        <Button style={{background: "white", minWidth: "100px"}}>Create</Button>
                    </Grid>
                    )}
            </Grid>
        )}

    </div>
    )
}