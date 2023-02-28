import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import ics from "ics";


function App() {
  const [count, setCount] = useState(0);
  const [inputText, setInputText] = useState("");

  // Input data
  const input = ``;

  // Split the input into lines
  const lines = input.split("\n");
    
  // Parse the events from the input
  const events = lines
  .slice(1) // Skip the header row
  .map((line) => {
    // Split the line into columns
    const [empty, UV, Groupe, GroupeNum, Jour, Début, Fin, Fréquence, Mode, Salles] =
      line.split(/\s+/);
    // Split the Salle(s) column into an array of room numbers
    const sallesArray = Salles.split(",");
    console.log([UV, Groupe, GroupeNum, Jour, Début, Fin, Fréquence, Mode, sallesArray]);
    return {
      UV,
      Groupe,
      GroupeNum,
      Jour,
      Début,
      Fin,
      Fréquence,
      Mode,
      Salles: sallesArray,
    };
  });
/*
  const eventObjects = events.map((event) => {
    const start = new Date();
    start.setDate(start.getDate() + ((7 + (event.Jour - start.getDay())) % 7));
    start.setHours(parseInt(event.Début.split(":")[0]));
    start.setMinutes(parseInt(event.Début.split(":")[1]));
    const end = new Date(start.getTime());
    end.setHours(parseInt(event.Fin.split(":")[0]));
    end.setMinutes(parseInt(event.Fin.split(":")[1]));
    return {
      start: 
      title: `${event.UV} - ${event.Groupe}`,
      description: `Groupe: ${event.GroupeNum}\nFréquence: ${event.Fréquence}\nMode: ${event.Mode}\nSalles: ${event.Salles.join(", ")}`,
      location: event.Salles.join(", "),
    };
  });

  ics.createEvents(eventObjects, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }
    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  });
*/
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(inputText); // Output the submitted text to the console
  };

  return (
    <div className="App">
      <h1>UTBM Calendar Export
      </h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="logo">
            <input
              className="input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="card">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
