import React from 'react';
import styles from '../styles/FilterButton.module.css';

const FilterButton = ({ onClick, isActive }) => {
  return (
    <button 
      className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      Filter
    </button>
  );
};

export default FilterButton;