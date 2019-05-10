import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export class SignUpRoute extends React.PureComponent {
  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    auth: PropTypes.shape({
      error: PropTypes.any,
      signUp: PropTypes.func.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    username: '',
    email: '',
    password: '',
    error: false
  };

  _onChange = (key, value) => this.setState({ [key]: value });
  onUsernameChange = (e) => this._onChange('username', e.target.value);
  onEmailChange = (e) => this._onChange('email', e.target.value);
  onPasswordChange = (e) => this._onChange('password', e.target.value);

  onSignupClick = () => {
    const { username, email, password } = this.state;
    this.props.auth
      .signUp(username, email, password)
      .then(
        ({ successed }) =>
          successed && this.props.history.push(`/verify?username=${username}`)
      )
      .catch((error) => this.setState({ error }));
  };

  render() {
    const { username, email, password, error } = this.state;

    return (
      <main className={'uk-margin uk-padding-small'}>
        <h3 className="uk-card-title">{'Sign Up'}</h3>
        <form action="" className={'uk-form-horizontal'}>
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="username">
              {'username'}
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input"
                id="username"
                type="username"
                value={username}
                onChange={this.onUsernameChange}
                placeholder="username"
              />
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="email">
              {'email'}
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input"
                id="email"
                type="email"
                value={email}
                onChange={this.onEmailChange}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="password">
              {'password'}
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input"
                id="password"
                type="password"
                value={password}
                onChange={this.onPasswordChange}
              />
            </div>
          </div>

          <div className="uk-margin uk-flex uk-flex-right">
            <div className="uk-flex uk-flex-column">
              <button
                className="uk-button uk-button-default"
                type={'button'}
                onClick={this.onSignupClick}
                disabled={!email || !password}
              >
                {'sign up'}
              </button>
            </div>
          </div>
          {error && (
            <div className="uk-margin uk-flex uk-flex-right">
              <div className="uk-flex uk-flex-column">
                <span className={'uk-text-warning'}>
                  {error.code || '不明なエラーです'}
                </span>
              </div>
            </div>
          )}
          <div className="uk-margin uk-flex uk-flex-right">
            <div className="uk-flex uk-flex-column">
              <Link to="/verify/">{'I have verification code.'}</Link>
            </div>
          </div>
        </form>
      </main>
    );
  }
}

export default SignUpRoute;
