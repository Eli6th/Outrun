function shareScore() {
    if (localStorage.getItem('last_run_score')) var current_level = parseInt(localStorage.getItem('last_run_score'));
    else var current_level = document.getElementById("level_counter").innerHTML;

    navigator.clipboard.writeText("Outrun \nLevel: " + current_level);
}