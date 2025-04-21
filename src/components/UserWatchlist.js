import React, { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';

const UserWatchlist = () => {
  const [session, setSession] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setSession(data.user ? { user: data.user } : null);
        if (data.user) {
          fetchWatchlist(data.user.id);
        }
      }
    };
    fetchUser();
  }, []);

  const fetchWatchlist = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("watchlist")
      .select("*, movies(*), reviews(*)")
      .eq("user_id", userId);
    if (error) {
      console.error("Error fetching watchlist:", error.message);
    } else {
      setWatchlist(data || []);
    }
    setLoading(false);
  };

  const handleAddReview = async (movieId) => {
    if (!reviewText.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("reviews").insert([
      {
        user_id: session.user.id,
        movie_id: movieId,
        review: reviewText,
      },
    ]);
    if (error) {
      alert("Error adding review: " + error.message);
    } else {
      alert("Review added!");
      setReviewText("");
      setSelectedMovie(null);
      fetchWatchlist(session.user.id);
    }
    setLoading(false);
  };

  if (!session) return <div>Please log in to view your watchlist.</div>;

  console.log("Session:", session);

  return (
    <section className="user-watchlist-section">
      {session && session.user ? (
        <div style={{ color: "lime" }}>Logged in as: {session.user.email}</div>
      ) : (
        <div style={{ color: "red" }}>Not authenticated</div>
      )}
      <h2 style={{ color: "#ffd700" }}>My Watchlist</h2>
      {loading && <div>Loading...</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {watchlist.map((item) => (
          <li key={item.id} style={{ marginBottom: "2rem", background: "#222", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://image.tmdb.org/t/p/w200/${item.movies?.poster_path}`}
                alt={item.movies?.title}
                style={{ width: "100px", borderRadius: "8px", marginRight: "1rem" }}
              />
              <div>
                <h3 style={{ color: "#fff" }}>{item.movies?.title}</h3>
                <button
                  onClick={() => setSelectedMovie(item.movies?.id)}
                  style={{ marginTop: "0.5rem", background: "#ffd700", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                >
                  Leave a Review
                </button>
                {selectedMovie === item.movies?.id && (
                  <div style={{ marginTop: "1rem" }}>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review here..."
                      rows={3}
                      style={{ width: "100%", borderRadius: "4px", padding: "0.5rem" }}
                    />
                    <button
                      onClick={() => handleAddReview(item.movies?.id)}
                      style={{ marginTop: "0.5rem", background: "#28a745", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Submit Review
                    </button>
                  </div>
                )}
                {item.reviews && item.reviews.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <h4 style={{ color: "#ffd700" }}>Your Review:</h4>
                    <p style={{ color: "#fff" }}>{item.reviews[0].review}</p>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {watchlist.length === 0 && !loading && <div style={{ color: "#fff" }}>No films in your watchlist yet.</div>}
    </section>
  );
};

export default UserWatchlist;
