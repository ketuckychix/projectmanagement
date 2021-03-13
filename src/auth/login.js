import React from 'react';
import './auth.scss';
import {Link} from 'react-router-dom';

export default class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",
        }
    };
    onChange(e) {
        e.preventDefault();
        this.setState({[e.target.id]: e.target.value})
    };

    onSubmit(e) {
        e.preventDefault();
          this.props.loginUser(this.state)
    }

    render() {
      const { errors } = this.props;
        return(
        <div className="base-wrapper">
            <div className="auth-header">Sign In</div>
            <form className="auth-form" noValidate onSubmit={(e) => {this.onSubmit(e)}}>
            <div className="auth-group">
            <label>
              <div className="auth-label">Email address</div>
              <input
                onChange={(e) => this.onChange(e)}
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                className="auth-input"
                autoComplete="username"
              />
              <div className="auth-error">
                {errors.email}
                {errors.emailnotfound}
              </div>
            </label>
          </div>

          <div className="auth-group">
            <label>
              <div className="auth-label">Password</div>
              <input
                onChange={(e) => this.onChange(e)}
                value={this.state.password}
                error={errors.password}
                id="password"
                type="password"
                className="auth-input"
                autoComplete="current-password"
              />
              <div className="auth-error">
                {errors.password}
                {errors.passwordincorrect}
              </div>
            </label>
          </div>

          <div>
            <button type="submit" className="auth-button">
              Login
            </button>
          </div>
          <div className="bottom-group">  
            <Link to="/register" className="link">
              Don't have an account? Sign up
            </Link>
          </div>
            </form>
        </div>
        )
    }
}