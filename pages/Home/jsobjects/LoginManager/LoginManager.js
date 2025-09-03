export default {
	async ssoLogout() {
		try {
			// Step 1: Get the JWT token first (before clearing it)
			const jwtToken = await getAppsmithJwt();

			if (!jwtToken) {
				showAlert("No session found, redirecting to login", 'info');
				navigateTo('Login');
				return;
			}

			console.log("JWT token retrieved for logout");

			// Step 2: Call server-side logout API with the token
			const response = await fetch('/api/v1/zuora/users/sso_logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${jwtToken}` // Send JWT token with request
				},
				credentials: 'include' // Include cookies for session identification
			});

			if (response.ok) {
				console.log("Server-side session cleared successfully");

				// Step 3: Only clear client-side JWT AFTER server logout succeeds
				await clearAppsmithJwt();
				console.log("Client-side JWT cleared");

				showAlert("Successfully logged out", 'success');
				navigateTo('Login');

			} else {
				console.error("Server logout failed:", response.status);
				showAlert("Logout failed on server", 'error');
				// Don't clear client JWT if server logout failed
			}

		} catch (error) {
			console.error("Logout error:", error);
			showAlert("Logout error occurred", 'error');
			// Don't clear client JWT if there was an error
		}
	}
}