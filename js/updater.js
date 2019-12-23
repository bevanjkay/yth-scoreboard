    // Function to open new window - call scoreboard.html file
    function createScoreboard() {
        window.open("scoreboard/scoreboard.html", "status=no,titlebar=no,menubar=no,scrollbars=no");
    }

    // Function to get Values of Items in Local Storage    
    function getValues() {
        $('input[type="text"]').each(function() {
            var id = $(this).attr('id');
            var value = $(this).val();
            localStorage.setItem(id, value);
        });
    }


    // Function to store Div that is created for each team added
    function teamdiv(num) {
        $('.teams').append("<div class='team team" + num + "'><div class='labels'><label>Team " + num + " Name:</label> <input class='input' type='text' id='Team" + num + "Name' /><label>Team " + num + " Color:</label> <input class=\"input jscolor {required:false,hash:true}\" type='text' id='Team" + num + "Color' /><label>Team " + num + " Score:</label> <input class='input' type='text' id='Team" + num + "Score' value='0' /></div><div class='quickbutton'><div class='quickincrease'><button diff='1' class='increase' id='increase" + num + "'>+1</button><button diff='100' class='increase' id='increase" + num + "'>+100</button><button diff='1000' class='increase' id='increase" + num + "'>+1000</button></div><div class='quickdecrease'><button diff='1' class='decrease' id='decrease" + num + "'>-1</button><button diff='100' class='decrease' id='decrease" + num + "'>-100</button><button diff='1000' class='decrease' id='decrease" + num + "'>-1000</button></div></div>");
    };


    // Create a Team Section for Each Team in Local Storage and Collect Previously Entered Data
    $(document).ready(function() {

        var teams = localStorage.getItem("Teams");
        
        if (teams == undefined) {
            teams = 2;
            localStorage.setItem("Teams",teams)
            localStorage.setItem("Team1Score",0);
            localStorage.setItem("Team2Score",0);
        }

        var i = 1;
        while (i <= teams) {
            teamdiv(i);
            jscolor.installByClassName("jscolor");        
            i++;
               
            };
    
        
        

        $('input[type="text"]').each(function() {
            var id = $(this).attr('id');
            var value = localStorage.getItem(id);

            $(this).val(value);


        });

    });


    // Function to Add a New Team when Add a Team button clicked
    $('#addteam').on('click', function() {
        saveinputs();
        var teams = localStorage.getItem("Teams");
        var i = teams;
        i++;
        if (i <= 4) {

            var teamscore = localStorage.getItem("Team" + i + "Score");
            if (teamscore == undefined) {
                localStorage.setItem("Team" + i + "Score", 0)
            };

            teamdiv(i);
            jscolor.installByClassName("jscolor");



            $('.team' + i + ' input[type="text"]').each(function() {
            var id = $(this).attr('id');
            var value = localStorage.getItem(id);

            $(this).val(value);

            });

            localStorage.setItem("Teams", i);

            console.log("Successfully added team " + i);
        } else {
            alert("Maximum 4 teams allowed.");
        }
    });


    // Removes the last team.
    $('#removeteam').on('click', function() {
        
        var teams = localStorage.getItem("Teams");
        var a = teams;
        if (a > 0) {
        $('.team' + a).remove();
        a--;
        localStorage.setItem("Teams", a);
        } else {
            alert("There are no teams.");
        }

    });


    
    
    // Function to save inputs
    function saveinputs() { 
        

        $('input[type="text"]').each(function() {
            var id = $(this).attr('id');
            var value = $(this).val();
            localStorage.setItem(id, value);
        });
    };
  
    // Click listener to save inputs
    $('#save').on('click', function() {
        saveinputs();
    });


    // Refresh external window, also updates scores from inputs
    $('#refresh').on('click', function() {


        createScoreboard();

        setTimeout(getValues, 250)


    });



    // Reset stored values
    $('#reset').on('click', function() {

        if (confirm('Are you sure you wish to reset ALL data? This will automatically refresh the scoreboard.')) {
            localStorage.removeItem('Teams');
            var c = 0;
            while (c < 5) {
                localStorage.removeItem('Team' + c + 'Name');
                localStorage.removeItem('Team' + c + 'Color');
                localStorage.removeItem('Team' + c + 'Score');
                localStorage.removeItem('airhorn');
                c++;

            }

            $('input[type="text"]').each(function() {
                var id = $(this).attr('id');

                localStorage.removeItem(id);

                window.location.reload();


            });
        } else {
            alert('Your data has not been reset.');

        };
    });




    // Increase and Decrease Buttons - uses diff attribute in HTML to decide score increase/decrease
    $(document).on('click', '.increase', function() {
        var id = $(this).attr('id');
        console.log(id);
        var input = id[id.length - 1];
        var number = $("#Team" + input + "Score").val();
        var diff = $(this).attr('diff');
        $("#Team" + input + "Score").val(parseInt(number) + parseInt(diff));

        getValues();

    });


    $(document).on('click', '.decrease', function() {
        var id = $(this).attr('id');
        console.log(id);
        var input = id[id.length - 1];
        var number = $("#Team" + input + "Score").val();
        var diff = $(this).attr('diff');
        $("#Team" + input + "Score").val(parseInt(number) - parseInt(diff));

        getValues();

    });



    // Show/Hide Instructions
    $(document).on('click', '#instructions', function() {
        $('.instructions').toggle();
        $('.teams').toggle();
        $('.buttons').toggle();
        $('.topbuttons').toggle();
		$('.countdown').toggle();
        var text = $('#instructions').text();
        $('#instructions').text(text == "Click to see instructions." ? "Hide instructions." : "Click to see instructions.");
    });
    
    
    // Start Timer
    $(document).on('click', '#gocountdown', function() {
        var time = $('#countdown').val();
        localStorage.setItem("countdown", time);
        
        if ($('#airhorn').is(':checked')) {
            localStorage.setItem("airhorn", true)
            } else {
                localStorage.setItem("airhorn", false)
            }
        
        createScoreboard();

        setTimeout(getValues, 250)
    });