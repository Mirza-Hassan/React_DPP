import React, { useState } from 'react';
import DppForm from './component/DppForm';
import DisplayDpp from './component/DisplayDpp';
import ElectricityConsumption from './component/ElectricityConsumption';
function App() {
  const [currentDppId, setCurrentDppId] = useState(null);

  const handleDppCreated = (createdDppId) => {
    setCurrentDppId(createdDppId);
  };

  return (
    <div>
      <ElectricityConsumption/>
      <DppForm onDppCreated={handleDppCreated} />
      {currentDppId && <DisplayDpp dppId={currentDppId} />}
    </div>
  );
}

export default App;
