import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./page/login";
import Control from "./page/control";
import Building from "./page/building";
import Gateway from "./page/gateway";
import Building_management from "./page/building_management";
import Plan_Management from "./page/plan_management";
import Group_Management from "./page/group_management";
import AC_Management from "./page/ac_management";
import AC_Position from "./page/ac_position";
import Report from "./page/report";
import Maintenance_indoor from "./page/maintenance_indoor";
import Maintenance_outdoor from "./page/maintenance_outdoor";
import Schedule from "./page/schedule";

import "./css/App.css";
import "./css/fontawesome/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

class App extends Component {
  render() {
    const App = () => (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/control" component={Control} />
        <Route path="/building" component={Building} />
        <Route path="/gateway" component={Gateway} />
        <Route path="/group_management" component={Group_Management} />
        <Route path="/building_management" component={Building_management} />
        <Route path="/plan_management" component={Plan_Management} />
        <Route path="/ac_management" component={AC_Management} />
        <Route path="/ac_position" component={AC_Position} />
        <Route path="/report" component={Report} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/maintenance_indoor" component={Maintenance_indoor} />
        <Route path="/maintenance_outdoor" component={Maintenance_outdoor} />
      </Switch>
    );

    return (
      <Router>
        <App />
      </Router>
    );
  }
}

export default App;
