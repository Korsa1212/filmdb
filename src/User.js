// export default User;
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "./Header";
import "./UserStyle.css";
import Footer from "./Footer";

import UserRating from "./components/UserRating";

import UserWatchist from "./components/UserWatchlist";
import UserReview from "./components/UserReviews";

// Initialize Supabase client outside of the component
const supabaseUrl = "https://vvacfhireitcofqbtxnv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2YWNmaGlyZWl0Y29mcWJ0eG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjE0NTYsImV4cCI6MjA1ODQ5NzQ1Nn0.8zGhQOqH-MyUm8qWsqkbMACiNOzx7SVpddct5mmhr8A";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function User() {
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setSession(data.session);
        setUserData(data.session.user);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Header />

      <main>
        <section className="section-one">
          {session && session.user && (
            <div className="Credentials">
              <div className="user-info">
                <img src={session.user.user_metadata.picture} alt="profile" />
                <div className="user-details">
                  <h1 style={{ color: "white" }}>
                    {session.user.user_metadata.name}
                  </h1>
                  <p style={{ color: "white" }}>
                    FilmDB member since{" "}
                    {new Date(session.user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="user-actions">
                <ul>
                  <li>
                    <a href="/update-Password">Update Password</a>
                  </li>
                  <li>
                    <a href="/delete-account">Delete Account</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <UserWatchist />

          <UserRating />

          <UserReview />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default User;
