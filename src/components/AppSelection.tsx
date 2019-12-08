import React from 'react'

import Grid from '@material-ui/core/Grid';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

// Local components
import AppDropdown from './AppDropdown'

export default function AppSelection() {
    return (
        <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            style={{background: "brown", height: "400px"}}
        >
            <Grid
                container
                item
                xs={4}
                direction="column"
                justify="space-evenly"
                alignItems="stretch"
                style={{background: "pink", height: "200px"}}
            >
                <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <p style={{marginLeft: "10px", color: "black"}}>Listen to this dApp</p>
                    <AppDropdown/>
                </Grid>
                {/* <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <AppDropdown/>
                </Grid> */}
            </Grid>
            <Grid
                container
                item
                xs={2}
                direction="column"
                justify="center"
                alignItems="center"
                style={{background: "pink", height: "200px"}}
            >

                <PlayArrowIcon fontSize="large" />


            </Grid>
            <Grid
                container
                item
                xs={4}
                direction="column"
                justify="space-evenly"
                alignItems="stretch"
                style={{background: "pink", height: "200px"}}
            >
                <Grid item style={{background: "yellow"}}>
                    <p>Test</p>
                </Grid>
                <Grid item style={{background: "yellow"}}>
                    <p>Hallo</p>
                </Grid>
            </Grid>

        </Grid>

    )
}