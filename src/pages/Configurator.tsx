import React from 'react'

import AppSelection from '../components/AppSelection'
import Container from '@material-ui/core/Container';


export default function Configurator() {
    return (
        <Container style={{background: "white"}} maxWidth="lg">
            <AppSelection/>
        </Container>



    )
}