import { useState } from "react";
import { createEvents } from "ics";
import "./App.css";
import "./index.css";

function App() {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    try{
    // Split the input into lines
    var lines = inputText.split("\n");
    console.log(lines);
    // Filter out empty lines
    lines = lines.filter((line) => line.length > 0);
    console.log(lines);
    //console.log(lines);
    // Filter out empty lines
    // Parse the events from the input
    //if first line has "UV", then slice the first line
    if (lines[0].includes("UV")) {
      lines = lines.slice(1);
    }
    const events = lines
      .map((line) => {
        // Split the line into columns
        const [
          UV,
          Groupe,
          GroupeNum,
          Jour,
          Début,
          Fin,
          Fréquence,
          Mode,
          Salles,
        ] = line.split(/\s+/);
        
        //console.log(UV, Groupe, GroupeNum, Jour, Début, Fin, Fréquence, Mode, Salles);
        //console.log(UV);
        // Split the Salle(s) column into an array of room numbers
        const sallesArray = Salles.split(", ");
        //console.log(sallesArray);
        // Set the recurrence rule based on the frequency
        let rrule = "";
        if (Fréquence === "1") {
          rrule = `FREQ=WEEKLY;INTERVAL=${Fréquence};BYDAY=${dayrrule(Jour)};COUNT=${getWeeksLeft()}`;
        } else if (Fréquence === "2") {
            rrule = `FREQ=WEEKLY;INTERVAL=${Fréquence};BYDAY=${dayrrule(Jour)};COUNT=${getWeeksLeft()}`;
        }
        console.log(rrule);
        console.log(getWeeksLeft());
        console.log(getHour(Début));
        return {
          title: `${UV} - ${Groupe} - ${GroupeNum}`,
          start: [2023, getMonth(), getDay(Jour), getHour(Début), getMinute(Début)],
          startInputType: 'local',
          startOutputType: 'local',
          end: [2023, getMonth(), getDay(Jour), getHour(Fin), getMinute(Fin)],
          endInputType: 'local',
          endOutputType: 'local',
          description: `Fréquence: ${Fréquence}\nMode: ${Mode}\nSalles: ${Salles}`,
          location: Salles,
          recurrenceRule: `${rrule}`,
          productId : "yann.works damn you should hire me",
        };
      });
    
    /*console.log(events);
    for (var i = 0; i < events.length; i++) {
      console.log(events[i]);
    }*/   
    
    //console.log(value);
  
    const { error, value } = createEvents(events);
    if (error) {
      console.error(error);
      return;
    }
    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  }catch (e) {
    console.log("ERREUR=====");
    const firstHoveredLogo = document.querySelector('.logo');
    firstHoveredLogo.style = "filter: drop-shadow(0 0 2em #cd712037);"
    setTimeout(() => {
      firstHoveredLogo.style = "filter: none);"
    }, 1000);
  }

  };

  // Helper functions to convert day and time strings to Date values
  const whichday = (day) => {
    switch (day) {
      case "lundi":
        return 1;
      case "mardi":
        return 2;
      case "mercredi":
        return 3;
      case "jeudi":
        return 4;
      case "vendredi":
        return 5;
      default:
        return 0;
    }
  };

  const dayrrule = (day) => {
    switch (day) {
      case "lundi":
        return "MO";
      case "mardi":
        return "TU";
      case "mercredi":
        return "WE";
      case "jeudi":
        return "TH";
      case "vendredi":
        return "FR";
      default:
        return 0;
    }
  };

  // Get the month number from the current day
  const getMonth = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // add 1 to get month number from 1 to 12
    return month >= 1 && month <= 6 ? 1 : 9; // return 1 for first semester, 9 for second semester
  };

  const getDay = (day) => {
    const now = new Date();
    const semesterStart = new Date(now.getFullYear(), getMonth() === 1 ? 0 : 8, 1); // get start date of current semester
    const dayOfWeek = semesterStart.getDay(); // get day of the week of the start date
    const daysUntil = dayOfWeek < whichday(day) ? whichday(day) - dayOfWeek : 7 - (dayOfWeek - whichday(day));
    let date = semesterStart.getDate() + daysUntil;
    
    if (daysUntil === 0 || whichday(day)-1 >= dayOfWeek) {
      date += 7;
    }
    
    return date;
  };
  

  const getHour = (time) => {
    let hour = parseInt(time.split(":")[0]);
    // add 1 hour for GMT+1
    if (hour >= 24) {
      hour -= 24;
    }
    return hour;
  };
  const getMinute = (time) => parseInt(time.split(":")[1]);

  const getWeeksLeft = () => {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const sixMonthsLater = new Date(yearStart);
    sixMonthsLater.setMonth(yearStart.getMonth() + 6);
  
    // Calculate the number of milliseconds between the start of the year and the current date
    const diff = now.getTime() - yearStart.getTime();
  
    // Calculate the number of milliseconds in 6 months
    const sixMonthDiff = sixMonthsLater.getTime() - yearStart.getTime();
  
    // Calculate the number of weeks left in the current semester
    const weeksLeft = Math.floor((sixMonthDiff) / (1000 * 60 * 60 * 24 * 7));
  
    return weeksLeft;
  };

  return (
    <div className="App">
      <div className="top-bar">
        <a href="https://yann.works" target="_blank" rel="noreferrer">yann derré</a>
      </div>
      <div className="silly">
      <p><b>v1.1 ChangeLog</b></p>
      <p>-Fixed Timezones for daylight savings</p>
      <p>-Slight UI changes</p>

      </div>
      <h1>UTBM Calendar Export</h1>
      <form onSubmit={handleSubmit}>
        <div className="logo">
          <textarea
            className="input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        <div className="card">
          <button type="submit">Submit</button>
        </div>
        </div>
      </form>
    </div>
  );
}




export default App;
