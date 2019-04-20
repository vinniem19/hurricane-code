var config = {
    apiKey: "AIzaSyCZShavrqBv1mczIBpUkG5Yj0oNeyulzec",
    authDomain: "huntsimon23-disasterdashboard.firebaseapp.com",
    databaseURL: "https://huntsimon23-disasterdashboard.firebaseio.com",
    projectId: "huntsimon23-disasterdashboard",
    storageBucket: "huntsimon23-disasterdashboard.appspot.com",
    messagingSenderId: "1021340464037"
  };
  firebase.initializeApp(config);

var database = firebase.database();

function loginShow(){
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
    $(".login-show").attr("hidden", false);
    $(".login-hide").attr("hidden", true);
  } else {
    // No user is signed in.
    $(".login-show").attr("hidden", true);
    $(".login-hide").attr("hidden", false);
  }
}

$(document).on("click", "#newacct-submit-btn", function(){
    var emailText = $(".input-email").val().trim();
    var passwordText = $(".input-password").val();

    database.ref().push({
    email: emailText,
    password: passwordText,
    });

    localStorage.clear();
    localStorage.setItem("email", emailText);
    localStorage.setItem("password", passwordText);

    firebase.auth().createUserWithEmailAndPassword(emailText, passwordText).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    $(this.form).submit();
    $("#newAcctModal").modal('hide');
    loginShow();
});

$(document).on("click", "#login-submit-btn", function(){
  var emailText = $(".input-email").val();
  console.log(emailText);
  var passwordText = $(".input-password").val();

  database.ref().push({
  email: emailText,
  password: passwordText,
  });

  localStorage.clear();
  localStorage.setItem("email", emailText);
  localStorage.setItem("password", passwordText);

  firebase.auth().signInWithEmailAndPassword(emailText, passwordText).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    
    console.log(errorCode, errorMessage);
  });
  $(this.form).submit();
  $("#loginModal").modal('hide');
  loginShow();
});

$(document).on("click", "#logout-btn", function(){
firebase.auth().signOut().then(function() {
  //Sign out successful.
}).catch(function(error) {
  // An error happened.
});
loginShow();
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    loginShow();
    $("#email-display").text(user.email);
  } else {
    // No user is signed in.
  }
});

$(document).on("click", ".heart", function(){
  $(this).removeClass("far fa-heart").addClass("fas fa-heart");
  var storyUrl = $(this).attr("url");
  var storySnippet = $(this).attr("snippet");
  var storyData = {
    url: storyUrl,
    snippet: storySnippet,
  };
  var newStoryKey = database.ref().child('user-stories').push().key;
  var updates = {};
  var user = firebase.auth().currentUser.uid;  
  updates[user + '/' + newStoryKey] = storyData;
  database.ref().update(updates);
});

$(document).on("click", "#stories", function(){
var userID = firebase.auth().currentUser.uid;  
var myStories = database.ref(userID + '/').orderByKey();
var windowHeight = $(window).height();
    var footerHeight = $("#donate").height();
    var trendingHeight = windowHeight - footerHeight;
    var contentHeight = trendingHeight / 2;
    $("#map").css('height', contentHeight);
    $("#player").css('height', contentHeight);
    $("#trending").css('height', trendingHeight);

for (i=0; i < myStories.length; i++) {
  var appArtCard = $("<div>").attr('class', 'card my-3 mx-auto').attr('style', 'width: 25rem').attr('id', 'appArtCard' + i)
  var appArtBody = $("<div>").attr('class', 'card-body').attr('id', 'appArtBody' + i)
  var appCardPic2 = $("<h5>").text(myStories[i].snippet).attr('class', 'card-img-top').attr('id', 'appCardPic' + i)
  var appArtTitle = $("<a href='" + myStories[i].url + "'>").attr('class', 'card-title mt-2').text(myStories[i].url);

  $("#trending").append(appArtCard)
  $("#appArtCard" + i).append(appArtBody)
  $("#appArtBody" + i).append(appCardPic2)
  $("#appArtBody" + i).append($("<hr>"))
  $("#appArtBody" + i).append(appArtTitle)

  loginShow();
}
});