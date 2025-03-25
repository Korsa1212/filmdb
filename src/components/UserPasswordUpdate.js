import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import styles from "./UserUpdatePassword.module.css";

const supabaseUrl = "https://vvacfhireitcofqbtxnv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2YWNmaGlyZWl0Y29mcWJ0eG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjE0NTYsImV4cCI6MjA1ODQ5NzQ1Nn0.8zGhQOqH-MyUm8qWsqkbMACiNOzx7SVpddct5mmhr8A"; // Replace with your actual Supabase anonymous key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
