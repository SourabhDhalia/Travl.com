function onSifnIn(googleUser)
{
	var profile=gooogleUser.getBasicProfile();
	$("g-signin2").css("display","none");
	$(".data").css("display","block");
	$("#pic").attr('src',profileImageUrl());
	$("#email").text(profile.getEmail());

}