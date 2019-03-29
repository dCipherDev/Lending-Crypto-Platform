import React from 'react'
import ReactDOM from 'react-dom'
import {
  HashRouter,
  Route,
  Switch
} from 'react-router-dom'
import { Provider } from 'react-redux'

import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

ReactDOM.render((
  <Provider>
    <HashRouter>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'))
