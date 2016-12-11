import React from 'react';
import * as firebase from 'firebase';

class App extends React.Component {
  componentWillMount() {
    this.setState({
      username: localStorage.username,
      results: [
      ],
      favourites: []
    });
    this.initializeFirebase();

    // https://firebase.google.com/docs/database/web/read-and-write
    this.database.child('favourites').on('value', function(snapshot) {
      // data = object with results (also objects)
      const data = snapshot.val();
      // Transform data into array
      const favourites = Object.values(data);
      this.setState({
        favourites: favourites
      });
    }.bind(this));
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

        <section>
          {this.renderResults()}
        </section>

        <section>
          {this.renderFavourites()}
        </section>
      </div>
    )
  }

  renderHeader() {
    return(
      <header>
        <h2>GitLog</h2>
        <form onSubmit={this.search.bind(this)}>
          <input type="text" ref={(input) => {this.searchInput = input}} />
          <button type="submit">Search</button>
        </form>
        <div>{this.state.username}</div>
      </header>
    )
  }

  renderResults() {
    // I have an array of objects but I want to show an array of HTML
    return this.state.results.map((repo) => {
      return(
        <div className="repo" key={repo.id}>
          <h3>{repo.name}</h3>
          <p>{repo.language} | by {repo.owner}</p>
          <p>{repo.description}</p>
          <p><a href={repo.html_url}>VISIT REPO</a></p>
          <p>Stars {repo.stars}</p>
          <p><a href="#" onClick={(e) => {e.preventDefault(); this.star(repo)}}>STAR</a></p>
        </div>
      )
    });
  }

  renderFavourites() {
    return this.state.favourites.map(function(fav) {
      return(
        <a className="fav" key={fav.id} href={fav.html_url}>
          <h3>{fav.added_by} has faved {fav.name}</h3>
          <p>{fav.language}</p>
        </a>
      )
    });
  }

  star(repo) {
    repo['added_by'] = this.state.username;
    // console.log(repo);
    this.database.child('favourites').push(repo);
  }

  search(e) {
    e.preventDefault();
    let term = this.searchInput.value;
    let url = `https://api.github.com/search/repositories?q=${term}&sort=stars&order=desc`;

    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {

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

      this.setState({
        results: repos
      });
    }.bind(this));
  }
}

export default App;
