import React from 'react';
import DateSlider from "./components/dateSlider";

function App() {
  return (
    <div className="container">
      <DateSlider
          minDate={new Date(2022, 0)}
          maxDate={new Date(2023, 11)}
          selectedStartDate={new Date(2022, 1)}
          selectedEndDate={new Date(2023, 11)}
      />
    </div>
  );
}

export default App;
