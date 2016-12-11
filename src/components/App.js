import React from 'react';
import * as firebase from 'firebase';
// included in package.json: Animations on elements newly added to DOM
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class App extends React.Component {
  componentWillMount() {
    let results = [];
    if (localStorage.getItem('results')) {
      results = JSON.parse(localStorage.results);
    }

    this.setState({
      username: localStorage.username,
      results: results,
      favourites: [],
      visible_section: 'favourites'
    });
    this.initializeFirebase();

    // Based on https://firebase.google.com/docs/database/web/read-and-write & https://firebase.google.com/docs/database/admin/retrieve-data#limit-queries
    this.database.child('favourites').orderByChild("added_at").limitToLast(12).on('child_added', (snapshot) => {
      // data = object with results (also objects)
      const fav = snapshot.val();
      this.setState({
        // Didn't use unshift to add fav to favourites array because of mutability of data
        favourites: [fav].concat(this.state.favourites.slice(0,11))
      });
    });
  }

  // Firebase initialization (Code from firebase.com + sweet installation tutorial: http://blog.tylerbuchea.com/create-react-app-firebase-for-prototyping/)
  initializeFirebase() {
    const config = {
      apiKey: "AIzaSyBvZjmp8k0n1IF-R7cyp6snpFIPI1PENxA",
      authDomain: "gitlog-13c88.firebaseapp.com",
      databaseURL: "https://gitlog-13c88.firebaseio.com",
      storageBucket: "gitlog-13c88.appspot.com",
      messagingSenderId: "200533762278"
    };
    this.database = firebase
      .initializeApp(config)
      .database()
      .ref();
  }

  render() {
    return (
      <div>
        {this.renderHeader()}

        <main className={this.state.visible_section}>
          {this.renderSegmentedControl()}

          <section id="results">
            {this.renderResults()}
          </section>

          <section id="faved">
            <ReactCSSTransitionGroup
              transitionName="favourite"
              transitionEnterTimeout={3000}
              transitionLeaveTimeout={100}>
              {this.renderFavourites()}
            </ReactCSSTransitionGroup>
          </section>
        </main>
      </div>
    )
  }

  renderHeader() {
    return(
      <header>
        <h2>GitLog</h2>

        <form onSubmit={this.search.bind(this)}>
          <input type="text" placeholder="Search on GitHub" ref={(input) => {this.searchInput = input}} />

          <select ref={(input) => {this.languageInput = input}}>
            <option value="">Language</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="javascript">JavaScript</option>
            <option value="elixir">Elixir</option>
          </select>
          <button type="submit">Search</button>
        </form>

        <div id="displayName">{this.state.username}</div>
      </header>
    )
  }

  renderSegmentedControl() {
    return(
      <div className="segmentWrapper">
        <div id="segment">
          <a href="#" id="segmentResults" onClick={(e) => {e.preventDefault(); this.changeVisibility('results')}}>Results</a>
          <a href="#" id="segmentFav" onClick={(e) => {e.preventDefault(); this.changeVisibility('favourites')}}>Favourited</a>
        </div>
      </div>
    )
  }

  changeVisibility(value) {
    this.setState({
      visible_section: value
    });
  }

  renderResults() {
    // I have an array of objects but I want to show an array of HTML
    return this.state.results.map((repo) => {
      return(
        <div className="repo" key={repo.id}>
          <h3>{repo.name}</h3>
          <p className="language">{repo.language} | by {repo.owner}</p>
          <p>{repo.description}</p>
          <p className="stars">Stars {repo.stars}</p>
          <div id="links">
            <p id="visit"><a href={repo.html_url}>VISIT REPO</a></p>
            <a id="favourite_this" href="#" onClick={(e) => {e.preventDefault(); this.star(repo)}}>
              <i className="fa fa-star-o" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      )
    });
  }

  renderFavourites() {
    return this.state.favourites.map(function(fav) {
      return(
        <a className="fav" key={fav.added_at} href={fav.html_url}>
          <h3>{fav.added_by} has faved <span>{fav.name}</span></h3>
          <p>{fav.language}</p>
        </a>
      )
    });
  }

  star(repo) {
    repo['added_by'] = this.state.username;
    repo['added_at'] = Date.now();
    this.database.child('favourites').push(repo);
  }

  search(e) {
    e.preventDefault();
    let language = this.languageInput.value;
    let term = this.searchInput.value;

    if (language) {
      term += `+language:${language}`;
    }

    let url = `https://api.github.com/search/repositories?q=${term}&sort=stars&order=desc`;

    fetch(url).then(function(response) {
      return response.json();
    }).then((json) => {

      let repos = json.items.map(function(repo) {
        return {
          id: repo.id,
          name: repo.name,
          owner: repo.owner.login,
          html_url: repo.html_url,
          description: repo.description,
          stars: repo.watchers,
          language: repo.language
        };
      });

      localStorage.setItem('results', JSON.stringify(repos));

      this.setState({
        results: repos,
        visible_section: 'results'
      });
    });
  }
}

export default App;
