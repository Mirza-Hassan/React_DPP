import React, { useState } from 'react';
import Papa from 'papaparse';
import '../styles/ElectricityConsumption.css';

function ElectricityConsumption() {
  const [csvData, setCsvData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setCsvData(result.data);
      },
      error: (error) => {
        console.error('CSV Parsing Error:', error.message);
      },
    });
  };

  const calculateRenewablePercentage = () => {
    if (csvData.length === 0) return 'Data is empty';
    let totalElectricityConsumption = 0;
    let renewableElectricityConsumption = 0;
    csvData.forEach((row, index) => {
      const totalElectricity = parseFloat(row.total_elec_cons_kw);
      const renewableElectricity = parseFloat(row.solar_elec_cons_kw);
      const gridElectricity = parseFloat(row.grid_elec_cons_kw);
      if (!isNaN(totalElectricity) && !isNaN(renewableElectricity) && !isNaN(gridElectricity)) {
        totalElectricityConsumption += totalElectricity;
        renewableElectricityConsumption += renewableElectricity;
      } else {
        console.error(`Error at row ${index + 2}: Invalid data in CSV`);
      }
    });
    if (totalElectricityConsumption === 0) return 'Total consumption is 0';
    const percentageRenewable = (renewableElectricityConsumption / totalElectricityConsumption) * 100;
    return `${percentageRenewable.toFixed(2)}%`;
  };

  const paginateData = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return csvData.slice(startIndex, endIndex);
  };

  return (
    <div className="electricity-container">
      <h2>Hydrogen Production & Electricity Consumption Analysis</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <hr />
      <table className="electricity-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Hydrogen Production (h2_prod_kg)</th>
          <th>Total Electricity Consumption (total_elec_cons_kw)</th>
          <th>Grid Electricity Consumption (not renewable) (grid_elec_cons_kw)</th>
          <th>Renewable Electricity Consumption (solar_elec_cons_kw)</th>
        </tr>
      </thead>
      <tbody>
        {paginateData().map((row, index) => (
          <tr key={index}>
            <td>{row.time}</td>
            <td>{parseFloat(row.h2_prod_kg).toFixed(2)} kg</td>
            <td>{parseFloat(row.total_elec_cons_kw).toFixed(2)} kW</td>
            <td>{parseFloat(row.grid_elec_cons_kw).toFixed(2)} kW</td>
            <td>{parseFloat(row.solar_elec_cons_kw).toFixed(2)} kW</td>
          </tr>
        ))}
      </tbody>
      </table>
      <div className="pagination-buttons">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage * recordsPerPage >= csvData.length}
        >
          Next Page
        </button>
      </div>
      <hr />
      <h3>Percentage of Renewable Electricity Consumption:</h3>
      <p className="percentage">{calculateRenewablePercentage()}</p>
    </div>
  );
}

export default ElectricityConsumption;
