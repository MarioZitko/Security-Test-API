// src/utils/auth.ts
export function getCurrentUser() {
	// This function should return the current user object if logged in or null otherwise
	// Here, we're using local storage as an example. Adjust this according to your authentication method.
    const user = localStorage.getItem("currentUser");
    console.log(user)
	return user ? JSON.parse(user) : null;
}
