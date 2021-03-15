import React from 'react'
import { Switch } from 'react-router-dom'

import Route from './Route'

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import ForgotPassword from '../pages/ForgotPassword'

import Dashboard from '../pages/Dashboard'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/cadastrar" exact component={SignUp} />
    <Route path="/esqueci-senha" exact component={ForgotPassword} />

    <Route path="/dashboard" exact component={Dashboard} isPrivate />
  </Switch>
)

export default Routes
