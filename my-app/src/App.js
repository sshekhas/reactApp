import React from 'react';
import { BrowserRouter as  Router, Route } from "react-router-dom";
import './App.css';
import FormScreen from './screens/form'
import statusScreen from './screens/status'
import ResolveAuthScreen from './screens/AuthResolver'
import { Provider as DetailsProvider } from './context/DetailsContext';
const App = () => (
  <Router>
  <Route path='/' exact component={ResolveAuthScreen}/>
  <Route path='/home'  component={statusScreen}/>
  <Route path='/personalDetails' exact component={FormScreen}/>
  </Router>
  
)


export default () => {
  return (
    
    <DetailsProvider>
      <App/>
      </DetailsProvider>
    
  );
};