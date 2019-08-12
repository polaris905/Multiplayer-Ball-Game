import React, { Component } from "react";
import { connect } from "react-redux";
import '../styles/styles.css';
import Login from "../components/login/Login";
import Lobby from "../components/lobby/Lobby";
import Game from "../components/game/Game";
import ActionMenu from "../components/lobby/ActionMenu";
import { PAGE } from "../constants";

const mapStateToProps = state => {
  const page = state.lobby.page;
  return { page };
}

class App extends Component {
  display = () => {
    switch (this.props.page) {
      case PAGE.LOBBY:
        return <Lobby />;
      case PAGE.GAME:
        return <Game />;
      default:
      case PAGE.LOGIN:
        return <Login />;
    }
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2 className="align-center">Final Project - Multiplayer Ball Game</h2>
          {this.props.page === PAGE.LOBBY ? <ActionMenu /> : ""}
        </div>
        {this.display()}
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(App);
