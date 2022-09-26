import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import UnauthenticatedApp from './UnauthenticatedApp';

import { useUser } from './context/user-context';
import AuthenticatedApp from './AuthenyicatedApp';

function App() {
  const { user } = useUser();

  return (
    <Router>
      <Switch>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Switch>
    </Router>
  );
}

export default App;
