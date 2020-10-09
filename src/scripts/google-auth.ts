declare const gapi: any;

const googleAuthSignInURL = "api/google/tokensignin";
const googleAuthSignOutURL = "api/google/tokensignout";

if (document.getElementById("google-sign-out") !== null) {
    const googleSignOut = document.getElementById("google-sign-out");
    googleSignOut?.addEventListener("click", signOut, false);
}

if (document.getElementById("get-profile") !== null) {
    const getProfile = document.getElementById("get-profile");
    getProfile?.addEventListener("click", getGoogleProfile, false);
}

function getGoogleProfile(): void {
    const auth2 = gapi.auth2.getAuthInstance();

    if (auth2.isSignedIn.get()) {
        const profile = auth2.currentUser.get().getBasicProfile();

        console.log("ID: " + profile.getId());
        console.log("Full Name: " + profile.getName());
        console.log("Given Name: " + profile.getGivenName());
        console.log("Family Name: " + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
    }
}

function onSignIn(googleUser: any): void {
    /** Google user profile
     *
     * const profile = googleUser.getBasicProfile();
     * console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
     * console.log("Name: " + profile.getName());
     * console.log("Image URL: " + profile.getImageUrl());
     * console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
     * console.log("Token: " + googleUser.getAuthResponse().id_token);
     */
    sendTokenToAPI(
        googleUser.getAuthResponse().id_token,
        googleAuthSignInURL
    ).then((redirect) => {
        if (redirect) {
            location.href = "/";
        }
    });
}

function signOut(): void {
    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = auth2.currentUser.get();

    auth2
        .signOut()
        .then(() => {
            sendTokenToAPI(
                googleUser.getAuthResponse().id_token,
                googleAuthSignOutURL
            );
            auth2.disconnect();
        })
        .then(() => {
            location.href = "/";
        });
}

async function sendTokenToAPI(id_token: string, url: string): Promise<any> {
    const result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: id_token,
        },
    })
        .then((response: Response) => response.json())
        .then((redirect: Boolean) => {
            return redirect;
        });

    return result;
}
