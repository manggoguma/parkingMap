import React, { useState } from 'react';
import axios from 'axios';
import './shipchajangMap.css';
import carIcon from './img/Group 722.svg';
import noIcon from './img/Group 143726290.svg';
import selectedIcon from './img/Group 721.svg'; // 선택된 상태의 아이콘

// 주차 공간 컴포넌트
function ParkingLot({ lot, onSelect }) {
  return (
    <div className='lotDiv'>
      <button
        className={`parkingLot ${lot.status}`} // 클래스 이름 동적 설정
        onClick={() => onSelect(lot)}
        disabled={lot.status === 'booked'}
      >
        <div className="content">
          {lot.status === 'available' && <img src={carIcon} alt="CarIcon" />}
          {lot.status === 'booked' && <img src={noIcon} alt="noIcon" />}
          {lot.status === 'selected' && <img src={selectedIcon} alt="SelectedIcon" />}
          <div className="lot-id">{lot.id}</div>
        </div>
      </button>
    </div>
  );
}
function ShipchajangMap() {
  const [parkingLots, setParkingLots] = useState([
    { id: 1, status: 'available' },
    { id: 2, status: 'booked' },
    { id: 3, status: 'available' },
    { id: 4, status: 'available' },
    { id: 5, status: 'booked' },
    { id: 6, status: 'available' },
    { id: 7, status: 'available' },
    { id: 8, status: 'available' },
  ]);

  const [selectedLot, setSelectedLot] = useState(null);
  

  const handleSelect = (lot) => {
    setParkingLots((prevLots) =>
      prevLots.map((l) =>
        l.id === lot.id
          ? { ...l, status: l.status === 'selected' ? 'available' : 'selected' }
          : l
      )
    );
    setSelectedLot(lot);
  };

  const handleCloseDetailPanel = () => {
    setSelectedLot(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h4>기기 및 도면 관리</h4>
      </div>
      <div className={`main-content ${selectedLot ? 'shrinked' : ''}`}> {/* 클래스 이름 동적 설정 */}
        <div className="parking-lots-container">
          {parkingLots.map((lot) => (
            <ParkingLot key={lot.id} lot={lot} onSelect={handleSelect} />
          ))}
        </div>
        {selectedLot && (
          <div className={`detail-panel ${selectedLot ? 'visible' : ''}`}> {/* 클래스 이름 동적 설정 */}
            <button className="close-button" onClick={handleCloseDetailPanel}>
              X
            </button>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>주차장 이름</th>
                  <th>ㅇㅇ원룸 주차장</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>기기ID</td>
                  <td>(주차장이름)-{selectedLot.id}</td>
                </tr>
                <tr>
                  <td>MAC Address</td>
                  <td>{selectedLot.status}</td>
                </tr>
                <tr>
                  <td>시작시간</td>
                  <td></td>
                </tr>
                <tr>
                  <td>종료시간</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="btn-section">
              <button className="blue-btn">수정</button>
              <button className="red-btn">삭제</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShipchajangMap;
