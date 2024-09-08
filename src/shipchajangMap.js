import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Redux 상태 가져오기
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
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [id, setId] = useState(null); // 서버에서 받아올 id 값
  const token = useSelector((state) => state.auth.token); // Redux에서 토큰 가져오기

  // 서버에서 id 값을 받아오는 함수 (예시)
  useEffect(() => {
    axios.get('/api/get-parking-lot-id') // 실제 API 경로로 변경 필요
      .then((response) => {
        setId(response.data.id); // 서버에서 받은 id 값을 상태에 저장
      })
      .catch((error) => {
        console.error('ID를 가져오는 중 오류 발생:', error);
      });
  }, []); // 첫 렌더링 시 id 가져오기

  // id가 있을 때에만 API 호출
  useEffect(() => {
    if (!id) return; // id가 없으면 API 호출을 하지 않음

    const apiUrl = `https://dev-api.simpleparking.co.kr/${id}/seats`;

    axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`, // 필요 시 토큰을 헤더에 추가
      },
    })
    .then(response => {
      const fetchedParkingLots = [];
      const list = response.data.list;
    
      list.forEach((row, y) => {
        row.forEach((item, x) => {
          fetchedParkingLots.push({
            id: `${x}-${y}`,
            status: item.status === 'WAITING' ? 'available' : 'booked', 
            type: item.type,
            x: item.x,
            y: item.y
          });
        });
      });
      setParkingLots(fetchedParkingLots);
    })
    .catch(error => {
      console.error("주차장 정보를 불러오는 중 오류 발생:", error);
    });
  }, [token, id]); // id와 token이 있을 때에만 실행

  const handleSelect = (lot) => {
    console.log(lot);
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
      <div className={`main-content ${selectedLot ? 'shrinked' : ''}`}>
        <div className="parking-lots-container">
          {parkingLots.map((lot) => (
            <ParkingLot key={lot.id} lot={lot} onSelect={handleSelect} />
          ))}
        </div>
        {selectedLot && (
          <div className={`detail-panel ${selectedLot ? 'visible' : ''}`}>
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
