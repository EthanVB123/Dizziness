console.log("Hi");

function submitForm() {
    var outputString = "";
    // Name
    var name = document.getElementById('name').value;
    outputString += "Your name is " + name + "\n";
    // Age
    var age = document.getElementById('age').value;
    outputString += "You are " + age + " years old\n";
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
    //.forEach(function (item) {if (item.checked) {outputString += `${item.id}\n`;}})

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