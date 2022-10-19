import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'
import type { MenuProps, MenuTheme } from 'antd';
import { Menu, Layout, Button } from 'antd';
import Auth from './auth/Auth'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Orders'
import 'antd/dist/antd.css';
import { EditOrder } from './components/EditOrder';
export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState { }
const { Header } = Layout;
const { Item, SubMenu } = Menu;
export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (

      <div>
        <Header className="app-header">
          <div className="app-header__logo-search-section">
            <div className="app-header__logo">
              <Link to="/">
                Home
              </Link>
              {this.logInLogOutButton()}
            </div>
          </div>
        </Header>
        {this.props.auth.isAuthenticated() && <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        }
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Item key="/home" title="home">
          <Link to="/">Home</Link>
        </Item>

        {this.logInLogOutButton()}
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div style={{ float: 'right' }}>
          <Button onClick={this.handleLogout} type="primary">Log Out</Button>
        </div>
      )
    } else {
      return (
        <div style={{ float: 'right' }}>
          <Button onClick={this.handleLogin} type="primary">Sign In</Button>
        </div>


      )
    }
  }

  generateCurrentPage() {


    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Todos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/todos/:todoId/edit"
          exact
          render={props => {
            return <EditOrder {...props} history={this.props.history} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
