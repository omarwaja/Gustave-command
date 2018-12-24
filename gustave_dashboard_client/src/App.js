import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Form from './components/formComponent';
import Commands from './components/commandsComponent';
import logo from './Gustave.png';

class App extends Component {
 
  render() {  
    return (  
      <Router>
        <React-Fragment>
          <nav className="navbar navbar-light bg-light p-1">            
            <i className="navbar-brand">
              <img src={logo} width="50px" className="d-inline-block mx-2" alt=""></img>  
            </i>
          </nav>
          <Route exact path="/" component={List} />
          <Route path="/addcommand" component={Formulaire} />
        </React-Fragment>
      </Router>
    );
  }
}
// A function that will render our addcommand form 
function Formulaire() {
  return (
    <Form />
  );
}
// A function that will render our commands list 
function List() {
  return (
    <Commands />
  );
}

export default App;

