const GLib = imports.gi.GLib;


function getNamesByDay(date){

    let homePath = GLib.get_home_dir();
    let filePath = homePath+'/.local/share/gnome-shell/extensions/eortologio@danchris.github.io/recurring_namedays.json';
    let returnArray = [];
    if (filePath){
        let namedaysFile = GLib.file_get_contents(filePath)[1];
        let jsonData = JSON.parse(namedaysFile);
        jsonData.data.forEach(function(element){
            if (element.date === date) {
                returnArray = returnArray.concat(element.names);
            }
        });
    }
    
    return returnArray;
}


function getCurrentDate(){

    let currentDatetime = GLib.DateTime.new_now_local();

    let currentDay = currentDatetime.get_day_of_month();
    if (currentDay < 10) 
        currentDay ="0".concat(currentDay.toString());

    let currentMonth = currentDatetime.get_month();
    if (currentMonth < 10 )
        currentMonth = "0".concat(currentMonth.toString());

    let currentDate = currentDay.toString().concat("/",currentMonth.toString());

    return currentDate;
}