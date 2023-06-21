import React from 'react';
import PropTypes from 'prop-types';
import { Space, Typography, Rate } from 'antd';

import { MovieConsumer } from '../../context/MovieContext.js';
import { getCorrectDate, getShortTitle, defineRateColor, getGenresName } from '../../utils/utils.js';

import './MovieInfo.css';

const MovieInfo = ({
  id,
  title,
  release_date: releaseDate,
  genre_ids: genreIds,
  overview,
  vote_average: vote,
  rating,
  postRate,
}) => {
  const { Text, Paragraph } = Typography;

  const _defaultOverview = 'Seems like for this movie do not add overview yet.';

  return (
    <div className="movie__info">
      <MovieConsumer>
        {({ state: { currentTabKey }, genres }) => {
          const genresName = getGenresName(genreIds, genres);
          const shortTitle = getShortTitle(title);
          const correctDate = getCorrectDate(releaseDate);

          const isRate = currentTabKey === 'search' ? vote : rating;

          return (
            <Space size={8} direction="vertical">
              <h3 className="movie__title">{shortTitle}</h3>
              <Text className="movie__release-date" type="secondary">
                {correctDate}
              </Text>
              <ul className="movie__genre">
                {genresName.map((obj) => {
                  return <span key={obj.id}>{obj.name}</span>;
                })}
              </ul>
              <Paragraph className="movie__overview" ellipsis={{ rows: 3 }}>
                {overview || _defaultOverview}
              </Paragraph>
              <Rate
                className="movie__rate"
                allowHalf
                count={10}
                value={isRate}
                onChange={(value) => postRate(id, value)}
              />
              <div className="movie__rate-round" style={defineRateColor(isRate)}>
                <span>{isRate?.toFixed(1)}</span>
              </div>
            </Space>
          );
        }}
      </MovieConsumer>
    </div>
  );
};

MovieInfo.defaultProps = {
  id: 0,
  title: '',
  release_date: '',
  genre_ids: [],
  overview: '',
  vote_average: 0,
  rating: 0,
  postRate: () => {},
};

MovieInfo.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  release_date: PropTypes.string.isRequired,
  genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  overview: PropTypes.string.isRequired,
  vote_average: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  postRate: PropTypes.func.isRequired,
};

export default MovieInfo;
