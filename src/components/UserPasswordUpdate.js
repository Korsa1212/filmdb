import { supabase } from "../supabaseClient";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import styles from "./UserUpdatePassword.module.css";

const supabaseUrl = "https://doydeobkijbxnbvklnrc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRveWRlb2JraWpieG5idmtsbnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MjU0MDksImV4cCI6MjA1ODMwMTQwOX0.Mieyx9jS9dhtXWj60DXLdz3qujTS8c2A4pcV-FK4so4"; // Replace with your actual Supabase anonymous key


const UserUpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the user's password with email verification
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error("Error updating password:", error.message);
      } else {
        console.log("Password updated successfully!");
        console.log(password);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error updating password:", error.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isFormValid = password === confirmPassword && password !== "";

  return (
    <>
      <Header />
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password" className={styles.formLabel}>
            Nouveau Mot de passe:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className={styles.formInput}
          />
          <label htmlFor="confirmPassword" className={styles.formLabel}>
            Confirmer le Mot de passe:
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={styles.formInput}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isFormValid}
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UserUpdatePassword;
