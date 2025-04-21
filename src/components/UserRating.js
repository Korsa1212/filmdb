import { supabase } from "../supabaseClient";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from "react-rating-stars-component";

const MovieCard = ({ movie, rating, create }) => {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleMovieClick}
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        margin: "10px",
        width: "250px",
        height: "350px",
        textAlign: "center",
        cursor: "pointer",
      }}
      className="movie_card"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ width: "200px", height: "200px" }}
      />
      <h3 style={{ fontSize: "20px", margin: "10px auto" }}>{movie.title}</h3>
      {/* <p>{rating}</p> */}
      <Rating
        count={5}
        value={rating}
        size={24}
        activeColor="#ffd700"
        isHalf={true}
        edit={false}
      />
    </div>
  );
};

const UserRating = () => {
  const [session, setSession] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rating, setRating] = useState([]);
  const [moviesrating, setMoviesRating] = useState([]);

  useEffect(() => {
    // Fetch user on mount
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setSession(data.user ? { user: data.user } : null);
      }
    };
    fetchUserData();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRatingData = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("ratings")
          .select("movie_id,rating")
          .eq("user_id", session.user.id)
          .order("created_at", {
            ascending: false,
          }); // Tri par date (du plus récent au plus ancien)
        // .limit(1); // Récupère uniquement la première entrée (la plus récente)

        if (error) {
          console.error(
            "Erreur lors de la récupération des notations :",
            error.message
          );
        } else {
          console.log(data);
          setRating(data);
          // console.log(setRating);
        }
      }
    };
    fetchRatingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  const fetchMovieDetails = async (movieId) => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${movieId}`,
      params: {
        api_key: "b2efe9b0108d8645f514bc9b0363d199",
      },
    };

    try {
      const response = await axios.request(options);
      // setMovies((prevMovies) => [...prevMovies, response.data]);
      return response.data;

      // console.log(movies);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     for (const item of rating) {
  //       await fetchMovieDetails(item.movie_id);
  //       setMoviesRating(item.rating);
  //     }
  //   };

  //   fetchMovies();

  //   setMovies([]);
  // }, [rating]);

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = [];
      for (const item of rating) {
        const movie = await fetchMovieDetails(item.movie_id);
        if (movie) {
          fetchedMovies.push({
            ...movie,
            review: item.review,
          });
        }
      }
      setMovies(fetchedMovies);
    };

    fetchMovies();
  }, [rating]);
  return (
    <div className="watchlist">
      <div className="lists">
        <div>
          <div className="rating">
            <h2
              style={{
                color: "gold",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            >
              Your Rating
            </h2>
            <p style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
              Most Recently Rated
            </p>
            <div>
              <Slider
                dots={true}
                infinite={false}
                slidesToShow={4}
                slidesToScroll={1}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 2,
                    },
                  },
                  {
                    breakpoint: 768,
                    settings: {
                      slidesToShow: 1,
                    },
                  },
                ]}
              >
                {movies.length > 0 ? (
                  movies.map((movie, index) => {
                    return (
                      <div key={`${movie.id}-${index}`}>
                        <MovieCard
                          movie={movie}
                          rating={rating[index]?.rating}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>No movies you had rated </div>
                )}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRating;
