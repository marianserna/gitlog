import React from 'react';

class App extends React.Component {
  componentWillMount() {
    this.setState({
      username: localStorage.username,
      results: [
        {"id":123,"name":"Perrito","owner":"Joroman","html_url":"https://github.com/Joroman/Perrito","description":"Identificacion de colores","stars":1,"language":"Java"},
        {"id":555,"name":"Perrito","owner":"Joroman","html_url":"https://github.com/Joroman/Perrito","description":"Identificacion de colores","stars":1,"language":"Java"},
        {"id":908,"name":"Perrito","owner":"Joroman","html_url":"https://github.com/Joroman/Perrito","description":"Identificacion de colores","stars":1,"language":"Java"}
      ]
    });
  }

  render() {
    return (
      <div>
        {this.renderHeader()}

        <section>
          {this.renderResults()}
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
    return this.state.results.map(function(repo) {
      return(
        <div className="repo" key={repo.id}>
          <h3>{repo.name}</h3>
          <p>{repo.language} | by {repo.owner}</p>
          <p>{repo.description}</p>
          <p><a href={repo.html_url}>VISIT REPO</a></p>
          <p>Stars {repo.stars}</p>
        </div>
      )
    });
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
