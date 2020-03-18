import React, { Component } from "react";
import Loader from "./loader.jsx";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      users: [],
      person: [],
      visible: 3,
      error: null,
      listLoading: false
    };
  }

  //User data
  fetchUsers() {
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then(response => response.json())
      .then(data =>
        this.setState({
          users: data,
          isLoading: false
        })
      )
      .catch(error => this.setState({ error, isLoading: false }));
  }

  //On Click show comment
  userLink(e) {
    let currntEle = e.currentTarget,
      userId = currntEle.dataset["id"],
      url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

    this.setState({
      visible: 3,
      listLoading: true
    });

    fetch(url)
      .then(response => response.json())
      .then(data =>
        this.setState({
          person: data,
          isLoading: false,
          listLoading: false
        })
      )
      .catch(error => this.setState({ error, isLoading: false }));
  }

  loadMore(e) {
    let currntEle = e.currentTarget,
      userId = currntEle.dataset["leng"];
    this.setState({
      visible: userId
    });
  }

  componentDidMount() {
    this.fetchUsers();
  }

  render() {
    const { isLoading, users, person, visible, listLoading, error } = this.state;

    return (
      <>
        <h1>Please select a user to find their comments:</h1>
        {error ? <p>{error.message}</p> : null}
        
        {/*Navigation*/}
        <ul className="topNav">
          {!isLoading &&
            users.map(user => {
              //adding global regex
              let regex = /(Mr|MR|Ms|Miss|Mrs|Dr|Sir)(\.?)\s/,
                userName = user.name,
                match = regex.exec(userName);

              let filterName =
                match !== null ? userName.replace(match[0], "") : userName;
              const firstName = filterName.split(" ")[0];

              return (
                <li className="nav" key={user.id}>
                  <a href="#"
                    data-id={user.id}
                    onClick={this.userLink.bind(this)}>
                    {firstName}
                  </a>
                </li>
              );
            })}
        </ul>
        {/*Loader*/}
        {isLoading && <Loader />}

        <section>
         {listLoading && <Loader />}

          {person.slice(0, visible).map((item, index) => {
            return (
              <div className="comments" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            );
          })}

          {visible < person.length && (
            <a href="#"
              onClick={this.loadMore.bind(this)}
              data-leng={person.length}
              type="button"
              className="btn">
              Load all
            </a>
          )}
        </section>
      </>
    );
  }
}
