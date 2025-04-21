// export default User;
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Header from "./Header";
import "./UserStyle.css";
import Footer from "./Footer";

import UserRating from "./components/UserRating";

import UserWatchlist from "./components/UserWatchlist";
import UserReview from "./components/UserReviews";


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
          <UserWatchlist />

          <UserRating />

          <UserReview />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default User;
