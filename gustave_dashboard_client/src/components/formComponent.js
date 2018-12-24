import React, { Component } from 'react';
import axios from "axios";

//expression régulière pour valider la forme de l'adresse mail entrée
const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
//expression régulière pour valider la forme du numéro téléphonique entré
const telRegex = RegExp(
    /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/
);
//vérifier la validité du formulaire
const formValid = ({ formErrors, nom, prenom, email, adresse, tel }) => {
    let valid = true;

    // vérifier si les erreurs sont vides
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // vérifier si le formulaire est rempli  
    if (Object.values(nom).length === 0) { valid = false; };
    if (Object.values(prenom).length === 0) { valid = false; };
    if (Object.values(tel).length === 0) { valid = false; };
    if (Object.values(email).length === 0) { valid = false; };
    if (Object.values(adresse).length === 0) { valid = false; };
    return valid;
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: "",
            prenom:"",
            email: "",
            tel: "",
            adresse: "",
            date: "",
            formErrors: {
                nom: "",
                prenom: "",
                email: "",
                tel: "",
                adresse: ""
            },
            send: 0
        };
    }

    //Détecter les changements au niveau des input et revalider le text entré 
    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case "nom":
                formErrors.nom =
                    value.length < 3 ? "Minimum 3 caractères requis !" : "";
                break;
            case "prenom":
                formErrors.prenom =
                    value.length < 3 ? "Minimum 3 caractères requis !" : "";
                break;
            case "tel":
                formErrors.tel = telRegex.test(value)
                    ? ""
                    : "Numéro invalide !";
                break;
            case "email":
                formErrors.email = emailRegex.test(value)
                    ? ""
                    : "Adresse mail invalide !";
                break;
            case "adresse":
                formErrors.adresse =
                    value.length < 10 ? "Minimum 10 caractères requis !" : "";
                break;
            default:
                break;
        }
        //après chaque changement, le message à envoyé reviend à l'état initiale
        this.setState({ send: 0 });
        this.setState({ formErrors, [name]: value });
    };

    // our put method that uses our backend api
    // to create new query into our data base
    putDataToDB(e) {
        e.preventDefault();
        if (formValid(this.state)) {
            console.log(`
        --SUBMITTING--
        nom: ${this.state.nom}
        prenom: ${this.state.prenom}
        Email: ${this.state.email}
        Tel: ${this.state.tel}
        Date: ${new Date()}
        Adresse: ${this.state.adresse}      
      ` );
            axios.post("/api/putData", {
                nom: this.state.nom,
                prenom: this.state.prenom,
                tel: this.state.tel,
                email: this.state.email,             
                adresse: this.state.adresse,
                date: new Date()
            }).then(response => {
                console.log(response);
                this.setState({
                    nom: "",
                    prenom: "",
                    email: "",
                    tel: "",
                    adresse: "",
                    date: "",
                    formErrors: {
                        nom: "",
                        prenom: "",
                        email: "",
                        tel: "",
                        adresse: ""
                    },
                    send: 1
                })
            }).catch(response => {
                console.log(response);
                this.setState({
                    send: -1
                })
            });
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
    };


    // here is our UI
    // it is easy to understand their functions when you 
    // see them render into our screen
    render() {
        const { formErrors } = this.state;
        const State = this.state;
        return (
            <div className="container contact-form">
                <form>
                    <h3>Passer une commande !</h3>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    className={formErrors.nom.length > 0 ? "form-control is-invalid" : "form-control"}
                                    id="inputDanger1"
                                    name="nom"
                                    placeholder="Nom"
                                    value={this.state.nom}
                                    onChange={e => this.handleChange(e)}
                                />
                                {formErrors.nom.length > 0 && (
                                    <span className="text-danger">{formErrors.nom}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    className={formErrors.prenom.length > 0 ? "form-control is-invalid" : "form-control"}
                                    id="inputDanger1"
                                    name="prenom"
                                    placeholder="Prenom"
                                    value={this.state.prenom}
                                    onChange={e => this.handleChange(e)}
                                />
                                {formErrors.prenom.length > 0 && (
                                    <span className="text-danger">{formErrors.prenom}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    className={formErrors.tel.length > 0 ? "form-control is-invalid" : "form-control"}
                                    name="tel"
                                    placeholder="Numéro Téléphonique"
                                    value={this.state.tel}
                                    onChange={e => this.handleChange(e)}
                                />

                                {formErrors.tel.length > 0 && (
                                    <span className="text-danger">{formErrors.tel}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    className={formErrors.email.length > 0 ? "form-control is-invalid" : "form-control"}
                                    name="email"
                                    placeholder="Adresse mail"
                                    value={this.state.email}
                                    onChange={e => this.handleChange(e)}
                                />
                                {formErrors.email.length > 0 && (
                                    <span className="text-danger">{formErrors.email}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    className={formErrors.adresse.length > 0 ? "form-control is-invalid" : "form-control"}
                                    name="adresse"
                                    placeholder="Votre adresse"
                                    value={this.state.adresse}
                                    onChange={e => this.handleChange(e)}
                                />
                                {formErrors.adresse.length > 0 && (
                                    <span className="text-danger">{formErrors.adresse}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <button 
                                    className="btnContactSubmit float-right form-control" 
                                    onClick={e => this.putDataToDB(e)}
                                >Envoyer
                                </button>
                                {State.send === 1 ? <p className="text-success">Demande envoyé !</p> : null}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default App;

