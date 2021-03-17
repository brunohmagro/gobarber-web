import React from 'react'
import { Switch } from 'react-router-dom'

import Route from './Route'

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'

import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/cadastrar" component={SignUp} />
    <Route path="/esqueci-senha" component={ForgotPassword} />
    <Route path="/resetar-senha" component={ResetPassword} />

    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route path="/perfil" exact component={Profile} isPrivate />
  </Switch>
)

export default Routes
