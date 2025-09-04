export default {
	async ssoLogout() {
		try {
			// Step 1: Get the JWT token first to check if user is logged in
			const jwtToken = await getAppsmithJwt();

			if (!jwtToken) {
				showAlert("No session found, redirecting to login", 'info');
				navigateTo('Login Page');
				return;
			}

			console.log("JWT token retrieved for logout");

			// Step 2: Call the Appsmith API (which includes the JWT automatically)
			const response = await LogoutApi.run();

			if (response) {
				console.log("Server-side session cleared successfully");

				// Step 3: Clear client-side JWT after successful server logout
				await clearAppsmithJwt();
				console.log("Client-side JWT cleared");

				showAlert("Successfully logged out", 'success');
				navigateTo('Login Page');

			} else {
				console.error("Server logout failed");
				showAlert("Logout failed on server", 'error');
			}

		} catch (error) {
			console.error("Logout error:", error);
			showAlert("Logout error occurred", 'error');
		}
	}
}