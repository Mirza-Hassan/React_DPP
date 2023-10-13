import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DisplayDpp.css';

function DisplayDpp({ dppId }) {
  const [dppData, setDppData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/dpp/${dppId}`)
      .then((response) => {
        setDppData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching DPP data:', error);
      });
  }, [dppId]);

  return (
    <div className="display-dpp-container">
      {dppData ? (
        <div>
          <h2 className="dpp-heading">Digital Product Passports Details</h2>
          <p className="dpp-text">Start Time: {dppData.startTime}</p>
          <p className="dpp-text">End Time: {dppData.endTime}</p>
          <p className="dpp-text">Hydrogen Volume (kg): {dppData.hydrogenVolume}</p>
          <p className="dpp-text">Client Name: {dppData.clientName}</p>
        </div>
      ) : (
        <p className="loading-text">Loading Product data...</p>
      )}
    </div>
  );
}

export default DisplayDpp;
