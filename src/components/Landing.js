import React from 'react';

class Landing extends React.Component {
  componentWillMount() {
    if (localStorage.getItem('username')) {
      this.context.router.transitionTo('/app');
    }
  }

  render() {
    return(
      <div>
        <h1>GitLog</h1>
        <form onSubmit={this.login.bind(this)}>
          <input type="text" placeholder="Enter your GitHub username" ref={(input) => {this.usernameInput = input}} />
          <button type="submit">It's me</button>
        </form>
      </div>
    )
  }

  login(e) {
    e.preventDefault();
    // Store username in localStorage
    localStorage.setItem('username', this.usernameInput.value);
    // redirect to main
    this.context.router.transitionTo('/app');
  }
}

Landing.contextTypes = {
  router: React.PropTypes.object
}

export default Landing;
