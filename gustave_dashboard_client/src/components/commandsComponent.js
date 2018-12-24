import React, { Component } from 'react';
import axios from "axios";
class Commands extends Component {
    // initialize our state 
    state = {
        data: [],
        intervalIsSet: false,
    };


    // when component mounts, first thing it does is fetch all existing data in our db
    // then we incorporate a polling logic so that we can easily see if our db has 
    // changed and implement those changes into our UI
    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 5000);
            this.setState({ intervalIsSet: interval });
        }
    }

    // never let a process live forever 
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    // just a note, here, in the front end, we use the id key of our data object 
    // in order to identify which we want to Update or delete.
    // for our back end, we use the object id assigned by MongoDB to modify 
    // data base entries

    // our first get method that uses our backend api to 
    // fetch data from our data base
    getDataFromDb = () => {
        fetch("/api/getData")
            .then(data => data.json())
            .then(res => this.setState({ data: res.data }));
        console.log(this.state.data);
    };
// this function  make a call to the api to delete a command from the database. we give the command id in the input
    delDataFromDB = (id) => {
        axios.delete("/api/deleteData", {
            _id: id
        }).then((res) => {
            this.getDataFromDb();
            console.log("commande supprimée");
        }).catch(res => console.log("erreur de supprission"));
    }
// in order to accept a command we make a call to our api with the cammand to accept in the intput
    acceptCommand = (command) => {
        axios.post("/api/acceptcommand", {
            command: command
        }).then(res => {
            console.log("commande validée");
            this.getDataFromDb();
        }).catch(res => console.log("erreur de validation"));
    }

// in order to reject a command we make a call to our api with the cammand to reject in the intput
    rejectCommand = (command) => {
        axios.post("/api/rejectcommand", {
            command: command
        }).then(res => {
            console.log("commande réfusée");
            this.getDataFromDb();
        }).catch(res => console.log("erreur de invalidation"));
    }



  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  // we used the sort function to return not accepted or rejected items in the first place

    render() {
        let data = this.state.data;      
        return ( 
            <div className="container-fluid">
                    <div className="d-flex align-content-start flex-wrap m-3">           
                    {data.sort((a, b) => Math.pow(a.valid, 2) - Math.pow(b.valid, 2)).map((command, i) => {
                            return (
                                <div className="card h-100 bg-light m-3" style={{width: '285px'}} key={i}>
                                    <button type="button" onClick={() => this.delDataFromDB(command._id)} className="close align-self-end mr-1 text-danger" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <div className="card-body pb-0">
                                        <span className="text-muted">
                                            <span className="mb-0">
                                                <div classname="d-inline-block">
                                                    <i className="fa fa-user-circle-o fa-3x text-info " aria-hidden="true"></i>
                                                    <p className="text-right mb-0 h6">{command.nom} {command.prenom}</p>
                                                </div>
                                            </span>
                                            <hr className="mt-1" />
                                            <p className="text-right mb-0"><i className="fa fa-phone-square fa-lg text-info mb-0 mr-2" aria-hidden="true"></i>{command.tel}</p>
                                            <i className="fa fa-envelope-o fa-lg text-info my-2 mr-2" aria-hidden="true"></i> {command.email}<br/>
                                            <i className="fa fa-map-marker fa-2x text-info my-0 mr-2" aria-hidden="true"></i> {command.adresse}<br/>
                                            <i className="fa fa-calendar-o fa-lg text-info my-2 mr-2" aria-hidden="true"></i> {command.date.substring(0, 10)}
                                            <i className="fa fa-clock-o fa-lg ml-5 text-info mr-2 mb-4" aria-hidden="true"></i> {command.date.substring(11, 16)}<br/>
                                        </span>
                                        {(() => {
                                            switch (command.valid) {
                                                case 0:
                                                    return (
                                                        <div className="mb-5">
                                                            <button onClick={() => this.acceptCommand(command)} className="btn btn-outline-success btn-sm mt-2 float-left px-4">Accepter</button>
                                                            <button onClick={() => this.rejectCommand(command)} className="btn btn-outline-danger btn-sm ml-2 mt-2 float-right px-4">Réfuser</button>
                                                        </div>
                                                    );
                                                case 1:
                                                    return <p className="float-right text-success mb-2 mr-0 mt-4 h6">Commande acceptée</p>;
                                                default:
                                                    return <p className="float-right text-danger mb-2 mr-0 mt-4 h6">Commande réfusée</p>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
            </div>
        );
    }
}

export default Commands;
