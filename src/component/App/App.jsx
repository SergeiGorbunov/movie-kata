import React from 'react';
import { Space, App as AntdApp, Tabs } from 'antd';
import _ from 'lodash';

import MovieService from '../../services/MovieService';
import MovieList from '../MovieList';
import SearchBar from '../SearchBar';
import Spinner from '../Spinner';
import Error from '../Error';
import { MovieProvider } from '../../context/MovieContext.js';

import './App.css';

class App extends React.Component {
  movieService = new MovieService();

  _errMessage = 'Произошла ошибка, но мы стараемся ее исправить';
  _tabsItems = [
    {
      key: 'search',
      label: 'Search',
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ];
  _genres = [];

  state = {
    items: [],
    sessionId: '',
    totalItems: 0,
    currentTabKey: 'search',
    page: 1,
    query: '',
    queryInput: '',
    ratedMovie: [],
    errorMessage: '',
    screenWidth: window.innerWidth,
    isLoading: false,
    isError: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.setDimension);
    this.movieService
      .getGenres()
      .then((res) => (this._genres = res))
      .catch(this.onError);
    this.createSession();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentTabKey !== this.state.currentTabKey) {
      this.getMovieList();
    }
    if (prevState.query !== this.state.query) {
      this.getMovieList();
    }
    if (prevState.page !== this.state.page) {
      this.getMovieList();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setDimension);
  }

  setDimension = _.throttle(() => {
    this.setState({
      screenWidth: window.innerWidth,
    });
  }, 500);

  changeCurrentTabKey = (key) => {
    this.setState({
      currentTabKey: key,
      isLoading: true,
    });
  };

  createSession = () => {
    this.movieService
      .createGuestSession()
      .then((res) => this.setState({ sessionId: res['guest_session_id'] }))
      .catch(this.onError);
  };

  onError = () => {
    this.setState({
      isLoading: false,
      isError: true,
    });
  };

  postRate = (id, rate) => {
    this.movieService
      .addRating(id, this.state.sessionId, rate)
      .then(() => {
        this.setState(({ items }) => {
          const indx = items.findIndex((event) => event.id === id);

          const oldItem = items[indx];
          let newItem;

          newItem = { ...oldItem, vote_average: rate };

          const newItems = [...items.slice(0, indx), newItem, ...items.slice(indx + 1)];

          return {
            items: newItems,
          };
        });
      })
      .catch(this.onError);
  };

  getMovieList = () => {
    const movieList =
      this.state.currentTabKey === 'search'
        ? this.movieService.getMoviesByKeyword(this.state.query, this.state.page)
        : this.movieService.getRatedMovies(this.state.sessionId);

    movieList
      .then((res) => {
        this.setState(({ currentTabKey, ratedMovie }) => {
          let results = res['results'];
          let newRatedMovie = ratedMovie;
          const ratedMovieIds = ratedMovie.map((event) => event.id);

          if (currentTabKey === 'search') {
            results = res['results'].map((event) => {
              if (ratedMovieIds.includes(event.id)) {
                const item = newRatedMovie.find((obj) => obj.id === event.id);
                return { ...event, vote_average: item['rating'] };
              }
              return { ...event, vote_average: 0 };
            });
          } else {
            newRatedMovie = res['results'].map((obj) => {
              return {
                id: obj['id'],
                rating: obj['rating'],
              };
            });
          }

          return {
            items: results,
            ratedMovie: newRatedMovie,
            totalItems: res['total_results'],
            isLoading: false,
            isError: false,
          };
        });
      })
      .catch(this.onError);
  };

  getPage = (page, pageSize) => {
    this.setState({
      page: page,
      isLoading: true,
    });
  };

  getQueryDebounced = _.debounce((text) => {
    const keywords = text.replace(/\s\b/g, '+');

    this.setState({
      query: keywords,
      isLoading: true,
    });
  }, 400);

  handleInputChange = (event) => {
    const newValue = event.target.value;
    this.setState({
      queryInput: newValue,
    });
    this.getQueryDebounced(newValue);
  };

  render() {
    const { isLoading, isError, items, screenWidth, totalItems, page, currentTabKey } = this.state;

    const hasData = !(isError || isLoading);

    const error = isError ? <Error message={this._errMessage} /> : null;
    const loading = isLoading ? <Spinner /> : null;
    const content = hasData ? (
      <MovieList
        items={items}
        currentPage={page}
        currentWidth={screenWidth}
        getPage={this.getPage}
        totalItems={totalItems}
        postRate={this.postRate}
      />
    ) : null;

    const searchBar =
      currentTabKey === 'search' ? (
        <SearchBar query={this.state.queryInput} getQueryDebounced={this.handleInputChange} />
      ) : null;

    return (
      <AntdApp className="app">
        <Tabs
          className="navigation"
          destroyInactiveTabPane={true}
          centered
          size={'large'}
          onChange={(key) => this.changeCurrentTabKey(key)}
          defaultActiveKey={this.state.currentTabKey}
          items={this._tabsItems}
        />
        <MovieProvider
          value={{
            state: this.state,
            movieService: this.movieService,
            genres: this._genres['genres'],
          }}
        >
          <Space className="container" size={30} direction="vertical" align="center">
            {searchBar}
            {loading}
            {error}
            {content}
          </Space>
        </MovieProvider>
      </AntdApp>
    );
  }
}

export default App;
