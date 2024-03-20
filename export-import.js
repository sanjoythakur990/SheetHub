/*
let userInfo={
    name: "Sanjoy",
    age: 24,
    role: "SDE"
}
// data.json
// Blob => constructor function => file data
let blob= new Blob([JSON.stringify(userInfo)], {type: "text/plain"});
// for the above file object or blob object, create a downloadable link
let downloadableLink =URL.createObjectURL(blob);   // it generates a local downloadable link

let anchor= document.createElement("a");
anchor.href=downloadableLink;
anchor.download="newData.json";
anchor.innerText="Download here";

document.body.appendChild(anchor);

anchor.click();
*/

const fileInput= document.querySelector("input");
fileInput.addEventListener("change", (event) => {
    // debugger
    let file= event.target.files[0];
    console.log(file.name);

    let fileReader= new FileReader();   // built-in obj helps to read a file

    fileReader.onload= function (e) {
        // this function will be triggered when the file is completely loaded on the browser
        // debugger
        let extractedData= e.target.result;         // this extractedData is made after the execution of line no. 38
        console.log(extractedData);
        console.log(JSON.parse(extractedData));
    }
    fileReader.readAsText(file);   // reads the data inside the file obj

})