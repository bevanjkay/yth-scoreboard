   // Function for when Local Storage is Updated
   var handle_storage = function () {
       var teams = localStorage.getItem("Teams");
       console.log(teams);
       var x = 1;
       while (x <= teams) {


           var color = localStorage.getItem("Team" + x + "Color");
           $(".Team" + x).css("background-color", color);

           console.log(color);

           var name = localStorage.getItem("Team" + x + "Name");
           $("#Team" + x + "Name").text(name);

           console.log(name);

           var score = localStorage.getItem("Team" + x + "Score");
           $("#Team" + x + "Score").text(score);
           setwrapper();
           x++;
       }




   };

   // Add a listener for when Local Storage is updated
   window.addEventListener("storage", handle_storage, false);


   // Adds new wrapper for when 4 teams used
   function setwrapper() {
       var teams = localStorage.getItem("Teams");
       $('.wrapperhelper').each(function () {
           if (teams == 4) {
               $('.wrapperhelper').attr('class', 'wrapper4');
           }
       })
   };



   // Creates default view when page loaded
   $(document).ready(function () {

       var countdown = localStorage.getItem("countdown");
       if (countdown) {
           timer(countdown);
           $('.countdownwrapper').show();
       } else {
           $('.countdownwrapper').hide();
       }

       var teams = localStorage.getItem("Teams");
       console.log(teams);
       var x = 1;
       while (x <= teams) {

           $('#wrapper').append("<div class='team team" + x + "'>      <div class='inner'>               <div id='Team" + x + "Name' class='teamname'></div>                <div id='Team" + x + "Score' class='teamscore'></div>           </div>       </div>");


           var color = localStorage.getItem("Team" + x + "Color");
           $(".Team" + x).css("background-color", color);

           console.log(color);

           var name = localStorage.getItem("Team" + x + "Name");
           $("#Team" + x + "Name").text(name);

           console.log(name);

           var score = localStorage.getItem("Team" + x + "Score");
           $("#Team" + x + "Score").text(score);

           setwrapper();
           x++;
       }

       var font = localStorage.getItem("font");

       function setFont(font) {
        document.getElementsByTagName("BODY")[0].style.fontFamily = font;
       }

       setFont(font);

   });


   function timer(time) {
       if (time) {
           $("#countdown").timer({
               countdown: true,
               duration: time,
               format: '%M:%S',
               callback: function () {
                   cleartimer();
                   var airhorn = localStorage.getItem("airhorn");
                   if (airhorn == "true") {
                       var audioElement = document.createElement('audio');
                       audioElement.setAttribute('src', '../js/airhorn.mp3');
                       audioElement.play();
                   }
                   localStorage.removeItem("countdown");
                   $('.countdownwrapper').fadeOut(750);
                   $('#x').animate({
                       fontSize: "36em"
                   }, 200, function () {
                       $('#x').animate({
                           fontSize: "48em"
                       }, 5000)
                   });
                   $('.xwrapper').fadeTo(4000, 100, function () {
                       $('.xwrapper').fadeTo(1000, 0);



                   });
               }
           })
       }
   };

   function cleartimer() {
       localStorage.removeItem("countdown");
   }