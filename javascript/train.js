
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBt1GMRwGR17VqPFrK0MiQCnXahXxX6zko",
    authDomain: "train-9d96f.firebaseapp.com",
    databaseURL: "https://train-9d96f.firebaseio.com",
    projectId: "train-9d96f",
    storageBucket: "",
    messagingSenderId: "837483352743"
};

firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function() {

    $("#train_schedule").html("");
});

$("#submit_entry").click(function() {
    var train_name = $("#train_name").val();
    var train_dest = $("#train_dest").val();
    var train_first = $("#train_first").val();
    var train_freq = $("#train_freq").val();
    
    //check for errors



    database.ref().push({
        train_name: train_name,
        train_dest: train_dest,
        train_first: train_first,
        train_freq: train_freq
    });

});


database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();
    console.log("sv", sv);

    //$("#employeeName").text(sv.name);
    //$("#employeeRole").text(sv.role);
    //$("#employeestartDate").text(sv.startDate);
    //$("#employeeRate").text(sv.rate);

    console.log("adding table rows");

    var train_first = parseInt(sv['train_first']);
    var train_freq = parseInt(sv['train_freq']);
    
    var train_next = train_first;
    
    //using military time as an integer
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var right_now = hours*100 + minutes; //get the actual time

    //if the train runs every 20 minutes starting at 1100, and right_now minus train_next is more than 20 minutes, 
    //then the prior train was more than 20 minutes ago, which means more than 1 train has come since the trains started
    //keep adding 20 minutes until the next train is AFTER right now
    console.log(right_now);
    console.log(train_next);
    // right now: 856
    // train_next: 1100
    // next train must be AFTER now, and also less than 20 minutes from now
    while(train_next - right_now < train_freq)
    {
        console.log(right_now);
        console.log(train_next);
            // if right now it's 12:35, then 1235-1100 is 135
        // adding 20 minues at a time to 1100:
        // 1235-1120, 1235-1140, 1235-1200, 1235-1220, 1235-1240 (less than 0)
        train_next = train_next + train_freq;
        if(train_next%100 >= 60) //if the "minutes" is greater than 60...
        {
            //subtract 60 minutes:
            train_next = train_next - 60;
            //add 1 hour:
            train_next = train_next + 100;
        }
        if(train_next > 2359)
        {
            train_next = train_next - 2400;
        }

        break; //remove later.
    }

    if(train_next > 1259)
    {
        train_next = train_next - 1200;
        train_next = train_next + " pm";
    }

    var tableRow = '<tr>'
    +'<td>'+sv['train_name']
    +'</td><td>'+sv['train_dest']
    +'</td><td>'+train_freq
    +'</td><td>'+train_next
    +'</td></tr>';

    $("#train_schedule").html( $("#train_schedule").html() + tableRow );

});

