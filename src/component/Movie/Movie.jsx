import React from 'react';
import PropTypes from 'prop-types';

import defaultPoster from '../../assets/images/default-movie.jpg';
import MovieInfo from '../MovieInfo';

import './Movie.css';

const Movie = ({ poster_path: posterPath, postRate, ...anotherProps }) => {
  const poster = 'https://image.tmdb.org/t/p/original' + posterPath;
  let image = posterPath ? poster : defaultPoster;

  return (
    <section className="movie">
      <div className="movie__card">
        <div className="movie__cover">
          <img src={image} alt="poster" />
        </div>
        <MovieInfo {...anotherProps} postRate={postRate} />
      </div>
    </section>
  );
};

Movie.defaultProps = {
  poster_path: '',
  postRate: () => {},
};

Movie.propTypes = {
  poster_path: PropTypes.string,
  postRate: PropTypes.func.isRequired,
};

export default Movie;
