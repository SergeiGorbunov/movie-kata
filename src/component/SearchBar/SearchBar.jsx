import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import './SearchBar.css';

const SearchBar = ({ query, getQueryDebounced }) => {
  return (
    <Input
      className="search-bar"
      placeholder="Type to search..."
      value={query}
      onChange={(event) => {
        getQueryDebounced(event);
      }}
      aria-label="Search bar"
    />
  );
};

SearchBar.defaultProps = {
  query: '',
  getQueryDebounced: () => {},
};

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  getQueryDebounced: PropTypes.func.isRequired,
};

export default SearchBar;
