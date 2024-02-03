// Auth.js

import React from "react";
import { auth, googleProvider } from "./config/FirebaseConfig"; // Import auth correctly
import { signOut, signInWithRedirect } from "firebase/auth";
import { context } from "./ThemeContext";
import { useContext } from "react";
function Auth() {
  const { theme, setTheme } = useContext(context);
  const style = {
    backgroundColor: theme ? 'hsl(0, 0%, 98%)' : 'hsl(235, 24%, 19%)',
    color: theme ? 'hsl(235, 19%, 35%)' : 'hsl(234, 39%, 85%)'
};
  const signInWithGoogle = async () => {

    // Set custom parameters for the Google authentication provider
    googleProvider.setCustomParameters({
      prompt: "select_account" // Prompt the user to select an account each time
    });
    // Sign in with Google using redirect
    await signInWithRedirect(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };
  
  return (
    <div style={{display:"flex", gap:'1px',}} >
      <button className="dd" style={{...style,border:"0"}} onClick={signInWithGoogle}>Sign in</button>
      <button className="dd" style={{...style,border:"0"}} onClick={signOutUser}>Log out</button>
    </div>
  );
}

export default Auth;
