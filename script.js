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

    outputString += "When the dizziness started, it was "+document.getElementById("time").value+"and it lasted for the time period of "+document.getElementById("length").value+"\n";
    outputString += "Patient was doing "+document.getElementById("activity").value+" at "+document.getElementById("location").value + "\n"



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