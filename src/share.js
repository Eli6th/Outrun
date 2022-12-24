function shareScore() {
    if (localStorage.getItem('last_run_score')) var current_level = parseInt(localStorage.getItem('last_run_score'));
    else var current_level = document.getElementById("level_counter").innerHTML;

    navigator.clipboard.writeText("Outrun \nJust got to level: " + current_level + "\nhttps://outrun.eliolcott.com");

    var x = document.getElementById("notification_box");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}