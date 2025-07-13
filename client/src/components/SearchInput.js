import React from 'react';
import './SearchInput.css';

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-input-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button 
            className="clear-button"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;