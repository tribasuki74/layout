import Layout from "./components/Layout";
import './App.css'
import { useState, useCallback } from "react";

const uri_schema = "http://www.w3.org/2000/01/rdf-schema#";
const uri_syntax = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
const uri_flavor = "http://www.semanticweb.org/hashim/ontologies/2021/6/flavouringOntoV2#";
const uri_value = "http://www.semanticweb.org/hashim/ontologies/2021/6/flavouringOntoV2#";

const _url = 'http://127.0.0.1:8000/get_by_ingredient?ingredient=';


function App() {
  const [nameOfIngredient, setNameOfIngredient] = useState();
  
  const [synonym, setSynonym] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([]);
  const [discription, setDescription] = useState();
  const [botanicalName, setBotanicalName] = useState();
  const [naturalOccurence, setNatualOccurence] = useState();
  const [synthesis, setSynthesis] = useState();
  const [suggestedHalalStatus, setSuggestedHalalStatus] = useState();

  const emptyDisplay = () => {
    setNameOfIngredient("");
    setSynonym([]);
    setRawMaterial([]);
    setDescription("");
    setBotanicalName("");
    setNatualOccurence("");
    setSynthesis("");
    setSuggestedHalalStatus("");
  }

  const getByUriGetLabel = useCallback((syntax, flavor, val) => {
    // console.log('Running getByUriGetLabel', flavor, val);
    var _syntax = syntax;
    var _flavor = flavor;
    var _val = val;
    var _url_path = _url + val;
    var getData = false;

    return fetch(_url_path, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      },
    })
    .then((data => data.json()))
    .then((data) => {
      var _syn = [];
      var _raw = [];

      var result = data['result'];
      // console.log('RESULT:', result.length)
      if (result.length > 0){
        let i = 0;
        while (i < result.length) {
          var dt = result[i];
          var property = dt['property']['value'];
          var value = dt['value']['value']; 
          
          var schema = property.replace(uri_schema, "");
          value = value.replace(uri_value, "");

          if (schema === "label"){
            getData = true;
            if (_flavor === "hasSuggestedHalalStatus") {
              setSuggestedHalalStatus(value);
            }
            if (_flavor === "hasSynonym"){
              _syn = synonym;
              _syn.push({'link': val, 'caption': value });
              setSynonym(_syn);
            }
            if (_flavor === "hasTypeOf"){
              _raw = rawMaterial;
              _raw.push({'link': val, 'caption': value });
              setRawMaterial(_raw);
            }
            if (_syntax === "type"){
              _raw = rawMaterial;
              _raw.push({'link': val, 'caption': value });
              setRawMaterial(_raw);
            }
          }
          i++;
        }
        if (!getData){
          if (_flavor === "hasSynonym"){
            _syn = synonym;
            _syn.push({'link': _val, 'caption': _val });
            setSynonym(_syn);
          }
          if (_flavor === "hasTypeOf"){
            _raw = rawMaterial;
            _raw.push({'link': _val, 'caption': _val });
            setRawMaterial(_raw);
            getData = true;
          }
        }
      }else {
        if (_flavor === "hasSynonym"){
          _syn = synonym;
          _syn.push({'link': _val, 'caption': _val });
          setSynonym(_syn);
        }
        if (_flavor === "hasTypeOf"){
          _raw = rawMaterial;
          _raw.push({'link': _val, 'caption': _val });
          setRawMaterial(_raw);
          getData = true;
        }
      }
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation:', error);
    });
  }, [synonym, rawMaterial]);

  const reloadClick = () => {
    window.location.reload();
  }

  const submitClick = () => {
    emptyDisplay();
    var val = document.querySelector('input').value;

    // check if input not valid
    var _val = val.split(" ")
    var query = "";
    var i = 0;
    for (; i < _val.length; ) {
      
      if (i === (_val.length -1)){
        query += _val[i][0].toUpperCase() + _val[i].slice(1);
      }else{
        query += _val[i][0].toUpperCase() + _val[i].slice(1) + "_";
      }
      i++;
    }

    var _url_path = _url + query;
    // console.log('url path', _url_path);
    return fetch(_url_path, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json'
      },
    })
    .then((data => data.json()))
    .then((data) => {
      var result = data['result'];
      if (result.length > 0){
        let i = 0;
        while (i < result.length) {
          var dt = result[i];  

          var property = dt['property']['value'];     
          var type = dt['value']['type'];
          var value = dt['value']['value']; 
          
          var schema = property.replace(uri_schema, "");
          var flavor = property.replace(uri_flavor, "");
          var syntax = property.replace(uri_syntax, "");
          value = value.replace(uri_value, "");

          if (type !== "literal"){
              console.log('Calling getByUriGetLabel', syntax, flavor, value)
              getByUriGetLabel(syntax, flavor, value);
          }

          if (schema ==="label"){
            setNameOfIngredient(value);
            // console.log('NameOfIngredient', nameOfIngredient)
          }
          if (flavor === "hasDescription"){
            setDescription(value);
            // console.log('Description', value);
          }
          if (flavor === "hasBotanicalName"){
            setBotanicalName(value);
            // console.log('BotanicalName', value);
          }
          if (flavor === "hasNaturalOccurence"){
            setNatualOccurence(value);
            // console.log('NatualOccurence', value);
          }
          if (flavor === "hasSynthesis"){
            setSynthesis(value);
            // console.log('Synthesis', value);
          }
          if (flavor === "hasSuggestedHalalStatus"){
            setSuggestedHalalStatus(value);
            // console.log('SuggestedHalalStatus', value);
          }
          i++;
        }
      }else{
        // d
        emptyDisplay();
        // console.log('Result not found!');
        setNameOfIngredient("Result not found!");

      }
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation:', error);
    });
  };

  
  const ASynonym = (a) => {
    if (a.length > 0){
      return a.map((item, i) => {
        return (
            <span key={i} className="link"><a className="validate input_text active" href={`synonym=${item.link}`} >{item.caption}</a></span>
        ); 
      });
    }
  };

  const ARawMaterial = (a) => {
    if (a.length > 0){
      return a.map((item, i) => {
        return (
            <span key={i} className="link"><a className="validate input_text active" href={`rawmaterial=${item.link}`} >{item.caption}</a></span>
        ); 
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-3 nav">Hierarchy</div>
          <div className="col-9 main-form">
              <div className="row">
                {/* Search box */}
                <div className="input-field col s12">
                  <label>Name of Ingredients</label>
                  <input id="name_of_ngredients" type="text" className="validate" />
                  <button className="btn waves-effect waves-light" type="submit" name="action"
                    onClick={e => submitClick()}>Submit</button>&nbsp;&nbsp;
                    <button className="btn waves-effect waves-light" type="submit" name="action"
                    onClick={e => reloadClick()}>Reload</button>
                </div>
              </div>

              <div className="row bord">
                {/* Header */}
                <div className="row">
                  <div className="col s12 header">
                    {nameOfIngredient}
                  </div>
                </div>

                {/* Detail */}
                <div className="row">
                  <div className="col-3">
                    <label>Synonym</label>
                  </div>
                  <div className="col-9">
                    {ASynonym(synonym)}
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Raw Materials</label>
                  </div>
                  <div className="col-9">
                    <div className="col-9">
                      {ARawMaterial(rawMaterial)}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Description</label>
                  </div>
                  <div className="col-9">
                    <span className="validate input_text active" >{discription}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Botanical Name</label>
                  </div>
                  <div className="col-9">
                    <span className="validate input_text active" >{botanicalName}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Natural Occurrence</label>
                  </div>
                  <div className="col-9">
                    <span className="validate input_text active">{naturalOccurence}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Synthesis</label>
                  </div>
                  <div className="col-9">
                    <span className="validate input_text active">{synthesis}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Suggested Halal Status</label>
                  </div>
                  <div className="col-9">
                    <span className="validate input_text active">{suggestedHalalStatus}</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
