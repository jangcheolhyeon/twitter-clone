import React from 'react';
import AppRouter from 'components/AppRouter';
import { authService } from 'fbase';

function App() {
  console.log(authService.currentUser);

  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;