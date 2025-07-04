function greet():any{
    var calender = new Date();
    var hours = calender.getHours();
    var display:any = document.getElementById("time");
    var res:any = document.getElementById("display");
    display.innerHTML = hours;
    if (hours <= 12) {
        res.innerHTML = "Good Morning";
    }
    else if (hours <= 16) {
        res.innerHTML = "Good Afternoon";
    }
    else if (hours <=23) {
        res.innerHTML = "Good Evening";
    }
}

greet();