import Axios from 'axios';
import React, { useState } from 'react';
import '../styles/DppForm.css';

function DppForm({ onDppCreated }) {
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    hydrogenVolume: '',
    clientName: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.startTime.trim()) {
      newErrors.startTime = 'Start Time is required.';
    }
    if (!formData.endTime.trim()) {
      newErrors.endTime = 'End Time is required.';
    }
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        newErrors.endTime = 'End Time must be greater than Start Time.';
      }
    }
    if (!formData.hydrogenVolume.trim()) {
      newErrors.hydrogenVolume = 'Hydrogen Volume is required.';
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client Name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await Axios.post('http://localhost:3001/api/dpp/create', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = response.data;
        setSuccessMessage('DPP successfully created.');
        onDppCreated(result.createdDppId);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="dpp-form-container">
    <form className="dpp-form" onSubmit={handleSubmit}>
    <h1>Digital Product Passports (DPP)</h1>
    <label>
      Start Time:
      <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleInputChange} />
      {errors.startTime && <p className="error">{errors.startTime}</p>}
    </label>
    <label>
      End Time:
      <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleInputChange} />
      {errors.endTime && <p className="error">{errors.endTime}</p>}
    </label>
    <label>
      Hydrogen Volume (kg):
      <input type="number" name="hydrogenVolume" value={formData.hydrogenVolume} onChange={handleInputChange} placeholder='Enter Hydrogen Volume'/>
      {errors.hydrogenVolume && <p className="error">{errors.hydrogenVolume}</p>}
    </label>
    <label>
      Client Name:
      <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder='Enter Client Name'/>
      {errors.clientName && <p className="error">{errors.clientName}</p>}
    </label>
    <button type="submit">Create DPP</button>
    {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  </div>
  );
}

export default DppForm;
