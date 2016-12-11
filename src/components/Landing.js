import React from 'react';

class Landing extends React.Component {
  componentWillMount() {
    if (localStorage.getItem('username')) {
      this.context.router.transitionTo('/app');
    }
  }

  render() {
    return(
      <div id="landing">
        <div id="images">
          <img src={require('../css/images/heisencat.png')}/>
        </div>
        <div id="inputContainer">
          <div className="inputWrapper">
            <h1>GitLog</h1>
            <form onSubmit={this.login.bind(this)} className="user">
              <input type="text" placeholder="Username" ref={(input) => {this.usernameInput = input}} />
              <button type="submit">It's me</button>
            </form>
          </div>
        </div>
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
