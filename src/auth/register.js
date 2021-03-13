import React from 'react';
import './auth.scss';
import {Link} from 'react-router-dom';

export default class RegisterUser extends React.Component {
    constructor(props){ 
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            errors: {}
        }
    };

    onChange = e => {
      this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
      e.preventDefault();
      this.props.registerUser(this.state);
    };

    render() {
      const {errors} = this.props;
        return (
            <div className="base-wrapper">
        <div className="auth-header">Register Below</div>
        <form className="auth-form" noValidate onSubmit={(e) => this.onSubmit(e)}>
          <div className="auth-group">
            <label>
              <div className="auth-label">Name</div>
              <input
                onChange={this.onChange}
                value={this.state.name}
                error={errors.name}
                id="name"
                type="text"
                className="auth-input"
              />
              <div className="auth-error">{errors.name}</div>
            </label>
          </div>

          <div className="auth-group">
            <label>
              <div className="auth-label">Email address</div>
              <input
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                className="auth-input"
              />
              <div className="auth-error">{errors.email}</div>
            </label>
          </div>

          <div className="auth-group">
            <label>
              <div className="auth-label">Password</div>
              <input
                onChange={this.onChange}
                value={this.state.password}
                error={errors.password}
                id="password"
                type="password"
                className="auth-input"
              />
              <div className="auth-error">{errors.password}</div>
            </label>
          </div>

          <div>
            <button type="submit" className="auth-button">
              Sign up
            </button>
          </div>
          <div className="bottom-group">
            <Link to="/" className="link">
              Have an account? Sign in here
            </Link>
          </div>
        </form>
      </div>
        )
    }

};