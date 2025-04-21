import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom'; 

import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './Watchlist.css'; 
import Header from './Header';



const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [movieData, setMovieData] = useState([]);
  const [sortedMovieData, setSortedMovieData] = useState([]);
  const [sortOption, setSortOption] = useState('date');
  const [view, setView] = useState('design1'); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else {
          setUser(userData.user || null);
        }

        
        const { data: watchlistData, error: watchlistError } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', userData.user?.id);

        if (watchlistError) {
          console.error('Error fetching watchlist data:', watchlistError);
        } else {
          setWatchlist(watchlistData || []);
        }

        
        const movieDataPromises = watchlistData.map(async (item) => {
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8',
            },
          };

          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${item.movie_id}?language=en-US`,
              options
            );
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Error fetching movie data:', error);
            return null;
          }
        });

        const resolvedMovieData = await Promise.all(movieDataPromises);
        setMovieData(resolvedMovieData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sortMovies = () => {
      let sortedMovies = [...movieData];
      if (sortOption === 'date') {
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else if (sortOption === 'rating') {
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      } else if (sortOption === 'alphabetical') {
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      }
      setSortedMovieData(sortedMovies);
    };

    sortMovies();
  }, [sortOption, movieData]);

  const handleImageClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <Header />
      <div className="my-watchlist-container">
        <h1 className="my-watchlist-title">
          <span className="my-watchlist-title-text">Your</span>{' '}
          <span className="my-watchlist-title-highlight">Watchlist</span>
        </h1>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-white">{sortedMovieData.length} movies</h4>
          <div>
            <button
              className={`btn btn-${view === 'design1' ? 'primary' : 'secondary'} me-2`}
              onClick={() => setView('design1')}
            >
              <i className="bi bi-list-ul"></i>
            </button>
            <button
              className={`btn btn-${view === 'design2' ? 'primary' : 'secondary'}`}
              onClick={() => setView('design2')}
            >
              <i className="bi bi-grid-3x3-gap"></i>
            </button>
          </div>
        </div>
        {view === 'design1' ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <label className="me-2 text-white" htmlFor="sortSelect">Sort by:</label>
                <select
                  id="sortSelect"
                  className="form-select d-inline-block w-auto"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
            {sortedMovieData.map((movie, index) =>
              movie ? (
                <div className="my-watchlist-movie-item mb-4" key={watchlist[index].id}>
                  <div className="d-flex align-items-start">
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                      className="my-watchlist-img-thumbnail me-3"
                      alt={movie.title}
                      onClick={() => handleImageClick(movie.id)} 
                      style={{ cursor: 'pointer' }} 
                    />
                    <div className="flex-grow-1">
                      <h5 className="mb-1 text-white">{movie.title}</h5>
                      <p className="mb-1 text-white">{movie.release_date.substr(0, 4)}</p>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-star-fill text-warning me-2"></i>
                        <span className='text-white'>{movie.vote_average.toFixed(2)}</span>
                      </div>
                      <p className="my-watchlist-movie-overview text-white">{movie.overview}</p>
                      <div className="my-watchlist-movie-genres">
                        {movie.genres.map((genre) => (
                          <span key={genre.id} className="badge bg-secondary me-1">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ) : null
            )}
          </>
        ) : (
          <div className="row">
            {movieData.map((movie, index) =>
              movie ? (
                <div className="col-md-3 col-sm-6 mb-4" key={watchlist[index].id}>
                  
                  <div className="my-watchlist-movie-card" onClick={() => handleImageClick(movie.id)} style={{ cursor: 'pointer' }}>
                    <div className="my-watchlist-movie-image-wrapper">
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        className="my-watchlist-movie-image"
                        alt={movie.title}
                      />
                      <div className="my-watchlist-movie-overlay">
                        <div className="my-watchlist-movie-details">
                          <h5 className="my-watchlist-movie-title">{movie.title}</h5>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-star-fill text-warning me-2"></i>
                            <span>{movie.vote_average.toFixed(2)}</span>
                            <span className="ms-2">
                              {movie.release_date.substr(0, 4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Watchlist;
