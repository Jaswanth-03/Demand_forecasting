import React, { useState } from 'react';
import './styles/styles.css';

const DemandForm = () => {
  const [formData, setFormData] = useState({
    brand: '',
    price: '',
    screenSize: '',
    ram: '',
    storage: '',
    cameraQuality: '',
    marketingBudget: '',
    region: '',
    season: 'Spring',
  });

  const brands = ['Apple', 'Samsung', 'Google', 'Xiaomi', 'Oppo'];
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa'];
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Predicted demand:', data.predicted_demand);
      // You can update the UI or perform additional actions with the predicted demand
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="brand">Brand:</label>
      <select id="brand" name="brand" value={formData.brand} onChange={handleChange} required>
        <option value="">Select a brand</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <label htmlFor="price">Price:</label>
      <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" required />

      <label htmlFor="screenSize">Screen Size:</label>
      <input
        type="number"
        id="screenSize"
        name="screenSize"
        value={formData.screenSize}
        onChange={handleChange}
        step="0.01"
        required
      />

      <label htmlFor="ram">RAM (GB):</label>
      <input type="number" id="ram" name="ram" value={formData.ram} onChange={handleChange} min="1" required />

      <label htmlFor="storage">Storage (GB):</label>
      <input type="number" id="storage" name="storage" value={formData.storage} onChange={handleChange} min="1" required />

      <label htmlFor="cameraQuality">Camera Quality Score:</label>
      <input
        type="number"
        id="cameraQuality"
        name="cameraQuality"
        value={formData.cameraQuality}
        onChange={handleChange}
        step="0.01"
        min="0"
        max="100"
        required
      />

      <label htmlFor="marketingBudget">Marketing Budget:</label>
      <input
        type="number"
        id="marketingBudget"
        name="marketingBudget"
        value={formData.marketingBudget}
        onChange={handleChange}
        min="0"
        required
      />

      <label htmlFor="region">Region:</label>
      <select id="region" name="region" value={formData.region} onChange={handleChange} required>
        <option value="">Select a region</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <label htmlFor="season">Season:</label>
      <select id="season" name="season" value={formData.season} onChange={handleChange} required>
        {seasons.map((season) => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>

      <button type="submit">Predict Demand</button>
    </form>
  );
};

export default DemandForm;