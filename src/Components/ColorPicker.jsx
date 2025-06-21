import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = () => {
  const [color, setColor] = useState("#3498db");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedColors = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedColors);
  }, []);

  const handleChange = (color) => {
    setColor(color.hex);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    alert(`Copied: ${color}`);
  };

  const addToFavorites = () => {
    if (!favorites.includes(color)) {
      const updated = [...favorites, color];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  return (
    <div className="color-card">
      <h2>🎨 Color Picker Tool</h2>
      <SketchPicker color={color} onChange={handleChange} />
      
      <div className="color-preview" style={{ background: color }}>
        <p>{color}</p>
        <p>{`RGB: ${hexToRgb(color)}`}</p>
        <p>{`HSL: ${hexToHsl(color)}`}</p>
      </div>

      <div className="button-group">
        <button onClick={handleCopy}>📋 Copy</button>
        <button onClick={addToFavorites}>⭐ Save</button>
      </div>

      {favorites.length > 0 && (
        <div className="favorites">
          <h4>🎯 Favorite Colors:</h4>
          <div className="fav-list">
            {favorites.map((fav, idx) => (
              <span
                key={idx}
                style={{ background: fav }}
                title={fav}
                onClick={() => setColor(fav)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Functions
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const hexToHsl = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
};

export default ColorPicker;
