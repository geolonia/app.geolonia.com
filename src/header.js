import React from 'react'
import { Link } from 'react-router-dom'
import { primary } from './colors'

const signoutRoutes = [
  { key: 1, label: 'Sign up', path: '/sign-up/' },
  { key: 2, label: 'Sign in', path: '/sign-in/' }
]

const signinRoutes = [
  { key: 1, label: 'Dashboard', path: '/dashboard/' },
  { key: 1.5, label: 'Next Dashboard', path: '/next-dashboard/' },
  {
    key: 2,
    label: 'Sign out',
    handler: ({ auth, history }) => {
      auth.signout()
      history.replace('/sign-in/')
    }
  },
  {
    key: 3,
    label: ({ auth }) => auth.userData.username,
    path: '/profile/'
  }
]

const renderItem = props => ({ key, label, path, handler }) => {
  return (
    <li key={key}>
      <Link
        to={path || '#'}
        onClick={'function' === typeof handler ? () => handler(props) : void 0}
        style={{ color: 'white' }}
      >
        {'function' === typeof label ? label(props) : label}
      </Link>
    </li>
  )
}

export const Header = props => {
  const {
    auth: { userData }
  } = props

  const isSignIn = !!userData
  const routes = isSignIn ? signinRoutes : signoutRoutes
  return (
    <nav
      className={'uk-navbar-container'}
      uk-navbar={'true'}
      style={{ background: primary }}
    >
      <div className={'uk-navbar-left'}>
        <ul className={'uk-navbar-nav'}>{routes.map(renderItem(props))}</ul>
      </div>
    </nav>
  )
}

export default Header
