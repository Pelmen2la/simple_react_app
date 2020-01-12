import React from 'react';
import ReactDOM from 'react-dom';
import initApp from './init-app';
import {BrowserRouter, Route} from 'react-router-dom'
import routesStore from './stores/routes/routes-store';

import AppHeader from './components/common/app/AppHeader';
import AppBody from './components/common/app/AppBody';

import './../scss/index.scss';

ReactDOM.render(
    (<BrowserRouter>
            <Route path='/' render={({location}) => (
                <React.Fragment>
                    <AppHeader location={location}/>
                    <AppBody location={location} routesStore={routesStore}/>
                </React.Fragment>
            )}
            />
        </BrowserRouter>
    ),
    document.getElementById('App')
);