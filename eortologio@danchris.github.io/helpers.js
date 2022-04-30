const GLib = imports.gi.GLib;


function getNameDays(currentDatetime){

    let nameDays = [];
    let date = getCurrentDate(currentDatetime);
    let [easterDay, easterMonth, easterYear] = calcOrthEaster(currentDatetime.get_year());
    
    return nameDays.concat(getRecurringNameDays(date), getRelativeToEasterNameDays(easterDay, easterMonth, easterYear, currentDatetime));
    
    
}

function getRecurringNameDays(date){

    let homePath = GLib.get_home_dir();
    let filePath = homePath+'/.local/share/gnome-shell/extensions/eortologio@danchris.github.io/recurring_namedays.json';
    let recurringNameDays = [];
    if (filePath){
        let namedaysFile = GLib.file_get_contents(filePath)[1];
        let jsonData = JSON.parse(namedaysFile);
        jsonData.data.forEach(function(element){
            if (element.date === date) {
                recurringNameDays = recurringNameDays.concat(element.names);
            }
        });
       GLib.free(namedaysFile);
    }

    
    return recurringNameDays;
}

function getRelativeToEasterNameDays(easterDay, easterMonth, easterYear, currentDatetime){
    let easterDateTime = GLib.DateTime.new(GLib.TimeZone.new_local(),easterYear, easterMonth, easterDay, 0,0,0);
    let homePath = GLib.get_home_dir();
    let filePath = homePath+'/.local/share/gnome-shell/extensions/eortologio@danchris.github.io/relative_to_easter.json';
    let relativeNameDays = [];
    let tmpDateTime;

    if (filePath){
        let namedaysFile = GLib.file_get_contents(filePath)[1];
        let jsonData = JSON.parse(namedaysFile);
        jsonData.special.forEach(function(element){
            tmpDateTime = easterDateTime.add_days(parseInt(element.toEaster));
            if (tmpDateTime.get_day_of_month() === currentDatetime.get_day_of_month() && tmpDateTime.get_month() === currentDatetime.get_month() && tmpDateTime.get_year() === currentDatetime.get_year()){
                relativeNameDays = relativeNameDays.concat(element.main, element.variations);
            }
        });
        GLib.free(namedaysFile);
    }

    return relativeNameDays;
}


function getCurrentDate(currentDatetime){

    let currentDay = currentDatetime.get_day_of_month();
    if (currentDay < 10) 
        currentDay ="0".concat(currentDay.toString());

    let currentMonth = currentDatetime.get_month();
    if (currentMonth < 10 )
        currentMonth = "0".concat(currentMonth.toString());

    let currentDate = currentDay.toString().concat("/",currentMonth.toString());

    return currentDate;
}

function calcOrthEaster(year) {
    let a = year % 19;
    let b = year % 4;
    let c = year % 7;
    let d = (19 * a + 15) % 30;
    let e = (2 * b + 4 * c +6*d + 6) % 7;
    let f = d + e;

    if (f <= 9) {
        day = 22 + f;
        month = 3;
    }
    else {
        day = f - 9;
        month = 4;
    }

    day = day + 13;

    if (month == 3) {
        if (day>31){
            day = day - 31;
            month = month + 1;
        }
    }
    else {
        if (day > 30 ) {
            day = day - 30;
            month = month + 1;
        }
    }

    return [day, month, year];

}