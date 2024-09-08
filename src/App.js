import React from 'react';
import './App.css';
import ShipchajangMap from './shipchajangMap'; // 컴포넌트 이름을 대문자로 시작

function App() {
  return (
    <div className="App">
      <ShipchajangMap />  {/* 대문자로 시작하는 컴포넌트 사용 */}
    </div>
  );
}

export default App;
