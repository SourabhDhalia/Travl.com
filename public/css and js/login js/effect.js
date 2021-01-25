const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

// function onSignIn(googleUser) {
// 	var profile = googleUser.getBasicProfile();
// 	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
// 	console.log('Name: ' + profile.getName());
// 	console.log('Image URL: ' + profile.getImageUrl());
// 	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//   }
