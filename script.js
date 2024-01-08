function submitForm() {
    var outputString = "";
    // Name
    var name = document.getElementById('name').value;
    outputString += "The patient's name is " + name + "\n";
    // Age
    var age = document.getElementById('age').value;
    outputString += "The patient is " + age + " years old\n";
    // Main Problem
    outputString += "Main Problem(s):\n"
    outputString += document.getElementById('dizziness').checked ? "Dizziness\n" : "";
    outputString += document.getElementById('imbalance').checked ? "Imbalance\n" : "";
    outputString += document.getElementById('earSymptoms').checked ? "Ear Symptoms\n": "";
    outputString += "\n";
    // Date
    var dateStarted = document.getElementById("Started").value;
    outputString += "Symptoms started on "+convertDates(dateStarted)+"\n";

    outputString += "When the dizziness started, it was "+document.getElementById("time").value+" and it lasted for the time period of "+document.getElementById("length").value+"\n";
    outputString += "Patient was doing "+document.getElementById("activity").value+"\nPatient's location was "+document.getElementById("location").value + "\n"
    outputString += `Prior to the dizziness, the patient had the following health issues or changes to medications: "${document.getElementById("priorIssues").value}"\n`

    outputString += "When the patient feels dizzy, they get the sensation of:\n"
    var dizzySymptoms = document.getElementsByClassName("dizzysymptom");
    var dizzySymptomsInOrder = 
        ["Swaying, spinning, tumbling, cart-wheeling, tilting or rocking",
        "Imbalance, veering to left side",
        "Imbalance, veering to right side",
        "Nausea, vomiting",
        "Double",
        "Blurred",
        "Jumping vision",
        "Light-headedness",
        "Loss of consciousness",
        "Headache",
        "Ear symptoms",
        "Other neurological symptoms"]
    for (var i=0; i<dizzySymptoms.length; i++) {
        if (dizzySymptoms[i].checked) {
            outputString += dizzySymptomsInOrder[dizzySymptoms[i].id.slice(5) -1] + "\n";
        }
    }

    outputString += "Since then, the patient's dizziness is "
    outputString += document.getElementById('yes1').checked ? "constant" : "not constant"
    outputString += " and the dizziness "
    outputString += document.getElementById('yes2').checked ? "comes in attacks." : "does not come in attacks." + "\n"

    if (document.getElementById('yes2').checked) {
        outputString += ("The attacks occur with the following frequency: "+document.getElementById("attack1").value
        + " and have the following length: "+document.getElementById("attack2").value+"\n")
        outputString += (document.getElementById('attack3').value='1') ? "Attacks can be provoked by "+document.getElementById("attack3-1").value+"\n" : "Attacks are not provoked by specific things.\n"
        outputString += document.getElementById('attack4').checked ? "There is a warning that an attack is about to start.\n" : "There is no warning that an attack is about to start.\n";
    }

    outputString += "The overall trend of the dizziness since initial onset is "+document.getElementById("trend").value.toLowerCase()+".\n"
    
    var provokedBy = document.getElementsByClassName("provoke")
    var provokedFactors = ["Turning over in bed to the left",
    "Turning over in bed to the right",
    "Lying down",
    "Going from lying to sitting",
    "Going from sitting to standing",
    "Standing still",
    "Rapid head movements",
    "Walking in a dark room",
    "Elevator",
    "Car travel",
    "Plane travel",
    "Sudden loud noises",
    "Sustained loud noises",
    "Coughing",
    "Blowing nose",
    "Straining",
    "Grocery Stores",
    "Narrow spaces",
    "Wide open spaces",
    "Salt",
    "MSG",
    "Food - which?",
    "Not eating",
    "Looking at moving objects",
    "Heat",
    "Hot showers",
    "Time of day - when?",
    "Seasons, which?",
    "Stress",
    "Alcohol",
    "Menstrual period (if relevant)",
    "Underwater diving",
    "Exercise",
    "Unprovoked/Randomly"]
    outputString += "The vertigo is provoked by:\n"
    for (var i=0; i<provokedBy.length; i++) {
        if (provokedBy[i].checked) {
            outputString += provokedFactors[provokedBy[i].id.slice(7) -1] + "\n";
        }
    }
    outputString += `The main provoking factor is: "${document.getElementById("factor1").value}", and other strong provoking factors are: "${document.getElementById("factor2").value}".\n`
    

    downloadResults("results.txt", outputString);
}

function downloadResults(filename, text) {
    /*var filename = "results.txt";
    var text = "This is a preliminary test."*/

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}
function convertDates(isoDate) {
    return isoDate.slice(8)+"/"+isoDate.slice(5,7)+"/"+isoDate.slice(0,4);
}