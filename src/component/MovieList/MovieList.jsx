import React from 'react';
import { List, Pagination } from 'antd';
import PropTypes from 'prop-types';

import Movie from '../Movie';

const MovieList = ({ items, currentWidth, totalItems, getPage, currentPage, postRate }) => {
  const rowSize = currentWidth <= 768 || items.length === 1 ? 1 : 2;

  const pagination = items.toString() ? (
    <Pagination
      showSizeChanger={false}
      defaultCurrent={currentPage}
      pageSize={20}
      total={totalItems}
      onChange={getPage}
    />
  ) : null;

  return (
    <>
      <List
        className="movie__list"
        grid={{ gutter: [16, 18], column: rowSize }}
        dataSource={items}
        renderItem={(item) => {
          return (
            <List.Item key={item.id}>
              <Movie {...item} postRate={postRate} />
            </List.Item>
          );
        }}
      />
      {pagination}
    </>
  );
};

MovieList.defaultProps = {
  items: [],
  currentWidth: 0,
  totalItems: 0,
  currentPage: 1,
  getPage: () => {},
  postRate: () => {},
};

MovieList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentWidth: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  getPage: PropTypes.func.isRequired,
  postRate: PropTypes.func.isRequired,
};

export default MovieList;
