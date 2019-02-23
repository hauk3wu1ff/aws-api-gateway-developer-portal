// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

// content-fragments (import here to start this ASAP)
import 'services/get-fragments'

// semantic-ui
import 'semantic-ui-css/semantic.css'

// pages
import Home from 'pages/Home'
import GettingStarted from 'pages/GettingStarted'
import Dashboard from 'pages/Dashboard'
import Apis from 'pages/Apis'

// components
import AlertPopup from 'components/AlertPopup'
import NavBar from 'components/NavBar'

import { init, login, logout } from 'services/self'
import { oauth2Redirect } from 'services/oauth2-client';
import './index.css';

class App extends React.Component {
  constructor() {
    super()
    init()

    // We are using an S3 redirect rule to prefix the url path with #!
    // This then converts it back to a URL path for React routing
    if (window.location.hash && window.location.hash[1] === '!') {
      const hashRoute = window.location.hash.substring(2)
      window.history.pushState({}, 'home page', hashRoute)
    }
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <NavBar />
          <AlertPopup />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/getting-started" component={GettingStarted} />
            <Route path="/dashboard" component={Dashboard} />
            <Route exact path="/apis" component={Apis} />
            <Route path="/apis/:apiId" component={Apis} />
            <Route path="/login" render={() => (login(), <Redirect to="/" />)}/>
            <Route path="/logout" render={() => (logout(), <Redirect to="/" />)}/>
            <Route path="/oauth2-redirect.html" render={() => (oauth2Redirect(), <Redirect to="/" />)}/>
            <Route component={() => <h2>Page not found</h2>} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
