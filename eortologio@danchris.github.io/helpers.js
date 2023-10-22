import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export function getNameDays(currentDateTime){

    let nameDays = [];
    let date = getCurrentDate(currentDateTime);
    let [easterDay, easterMonth, easterYear] = calcOrthEaster(currentDateTime.get_year());
    
    return nameDays.concat(getRecurringNameDays(date), getRelativeToEasterNameDays(easterDay, easterMonth, easterYear, currentDateTime));
   
}

export function getRecurringNameDays(date, subdir){
    const file = Gio.File.new_for_uri(import.meta.url).get_parent().get_child('recurring_namedays.json'); 
    const [, contents] = file.load_contents(null);

    let recurringNameDays = [];
    if (contents) {
        const decoder = new TextDecoder();
        const namedaysFile = decoder.decode(contents);
        const jsonData = JSON.parse(namedaysFile);
        jsonData.data.forEach(function(element) {
            if (element.date === date) {
                recurringNameDays = recurringNameDays.concat(element.names);
            }
        });
    }
    return recurringNameDays;
}

export function getRelativeToEasterNameDays(easterDay, easterMonth, easterYear, currentDateTime, subdir){
    
    let easterDateTime = GLib.DateTime.new(GLib.TimeZone.new_local(),easterYear, easterMonth, easterDay, 0,0,0);
    const file = Gio.File.new_for_uri(import.meta.url).get_parent().get_child('relative_to_easter.json'); 
    const [, contents] = file.load_contents(null);
    
    let relativeNameDays = [];
    let tmpDateTime;

    if (contents) {
        const decoder = new TextDecoder();
        const namedaysFile = decoder.decode(contents);
        const jsonData = JSON.parse(namedaysFile);

        // Assuming easterDateTime and currentDateTime are properly defined
        jsonData.special.forEach(function (element) {
            tmpDateTime = easterDateTime.add_days(parseInt(element.toEaster));

            if (
                tmpDateTime.get_day_of_month() === currentDateTime.get_day_of_month() &&
                tmpDateTime.get_month() === currentDateTime.get_month() &&
                tmpDateTime.get_year() === currentDateTime.get_year()
            ) {
                relativeNameDays = relativeNameDays.concat(element.main, element.variations);
            }
        });
    }
    return relativeNameDays;
}


export function getCurrentDate(currentDateTime){

    let currentDay = currentDateTime.get_day_of_month();
    if (currentDay < 10) 
        currentDay ="0".concat(currentDay.toString());

    let currentMonth = currentDateTime.get_month();
    if (currentMonth < 10 )
        currentMonth = "0".concat(currentMonth.toString());

    let currentDate = currentDay.toString().concat("/",currentMonth.toString());

    return currentDate;
}

export function calcOrthEaster(year) {
    let a = year % 19;
    let b = year % 4;
    let c = year % 7;
    let d = (19 * a + 15) % 30;
    let e = (2 * b + 4 * c +6*d + 6) % 7;
    let f = d + e;

    let day, month;  // Declare day and month variables

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
        if (day > 31){
            day = day - 31;
            month = month + 1;
        }
    }
    else {
        if (day > 30) {
            day = day - 30;
            month = month + 1;
        }
    }

    return [day, month, year];
}
