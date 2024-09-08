import React from 'react';
import { Provider } from 'react-redux'; // Provider 임포트
import store from './store';
import './App.css';
import ShipchajangMap from './shipchajangMap'; // 컴포넌트 이름을 대문자로 시작

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <ShipchajangMap />  
    </div>
    </Provider>
  );
}

export default App;
