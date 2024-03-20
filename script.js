const header = document.querySelector(".header");
const snoContainer = document.querySelector(".sno-container");
const rowsContainer = document.querySelector(".rows-container");
const form = document.querySelector("form");
const selectedCellElement = document.querySelector(".selected-cell");
const fx = document.getElementById("f(x)");

const defaultStyles = {
    fontFamily: "monospace",
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    align: "left",
    bgColor: "#ffffff",
    textColor: "#000000"
}
let state = {};
let columns = 27, rows = 50;
for (let i = 0; i < columns; i++) {
    const cell = document.createElement("div");
    if (i != 0) cell.innerText = String.fromCharCode(64 + i);   // 64+1=65 =>A, 66 =>B....
    i === 0 ? (cell.className = "first-cell") : cell.className = "cell";
    header.appendChild(cell);
}

for (let i = 1; i <= rows; i++) {
    const sno = document.createElement("div");
    sno.innerText = i;
    sno.className = "sno";
    snoContainer.appendChild(sno);

    let rowElement = createRow(i);
    rowsContainer.appendChild(rowElement);
}

function createRow(rowNumber) {
    const row = document.createElement("div");
    row.className = "row";

    for (let i = 1; i < columns; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.contentEditable = true;
        cell.id = `${String.fromCharCode(64 + i)}${rowNumber}`;
        cell.addEventListener("focus", onCellFocus);
        row.appendChild(cell);
    }
    return row;
}

let selectedCell = null;
let prev = null;
function onCellFocus(event) {
    if (selectedCell) {        // if the selectedCell is not null
        // remove the active-cell class from the previously focused cell
        document.getElementById(selectedCell).classList.remove("active-cell");
        prev=selectedCell;
    }
    selectedCell = event.target.id;
    selectedCellElement.innerText = selectedCell;
    if (!state[selectedCell]) {
        // when the cell is focused for the first time
        state[selectedCell] = defaultStyles;
    }
    // add active-cell class to the newly focused element
    document.getElementById(selectedCell).classList.add("active-cell");
    applyCurrentCellStylesToForm();
}

function applyCurrentCellStylesToForm() {
    // apply styles of the current selected cell in the form
    // form.bold.checked=state[selectedCell].bold;
    // form.italic.checked=state[selectedCell].italic;
    // form.underline.checked=state[selectedCell].underline;

    // form.align.value=state[selectedCell].align;
    // form.fontSize.value=state[selectedCell].fontSize;
    // form.fontFamily.value= state[selectedCell].fontFamily;
    // form.textColor.value= state[selectedCell].textColor;
    // form.bgColor.value= state[selectedCell].bgColor;


    for (let key in state[selectedCell]) {
        if (form[key].type === "checked") {
            form[key].checked = state[selectedCell][key];
        }
        else form[key].value = state[selectedCell][key];
    }
}

function applyStylesToElement(element, styles){
    element.style.fontFamily = styles.fontFamily;
    element.style.fontSize = `${styles.fontSize}px`;
    element.style.textAlign = styles.align;
    element.style.fontSize = styles.fontSize;
    element.style.fontWeight = styles.bold ? "bold" : "lighter"
    element.style.fontStyle = styles.italic ? "italic" : "normal"
    element.style.textDecoration = styles.underline ? "underline" : "none"
    element.style.color = styles.textColor;
    element.style.backgroundColor = styles.bgColor;
}

form.addEventListener("change", () => {
    const selectedValues = {
        fontFamily: form.fontFamily.value,
        fontSize: form.fontSize.value,
        bold: form.bold.checked,
        italic: form.italic.checked,
        underline: form.underline.checked,
        align: form.align.value,
        textColor: form.textColor.value,
        bgColor: form.bgColor.value
    }
    // console.log(selectedValues);

    // apply the styles to the selected cell
    const selectedCellElement2 = document.getElementById(selectedCell);
    // console.log(selectedCellElement2);

    applyStylesToElement(selectedCellElement2, selectedValues);
    // selectedCellElement2.style.fontFamily = selectedValues.fontFamily;
    // selectedCellElement2.style.fontSize = `${selectedValues.fontSize}px`;
    // selectedCellElement2.style.textAlign = selectedValues.align;
    // selectedCellElement2.style.fontSize = selectedValues.fontSize;
    // selectedCellElement2.style.fontWeight = selectedValues.bold ? "bold" : "lighter"
    // selectedCellElement2.style.fontStyle = selectedValues.italic ? "italic" : "normal"
    // selectedCellElement2.style.textDecoration = selectedValues.underline ? "underline" : "none"
    // selectedCellElement2.style.color = selectedValues.textColor;
    // selectedCellElement2.style.backgroundColor = selectedValues.bgColor;


    state[selectedCell] = selectedValues;
})


fx.addEventListener("keyup", (e) => {
    if (e.code === "Enter" && selectedCell) {   // selectedCell is not null
        let expression = fx.value;
        let result = eval(expression);
        document.getElementById(selectedCell).innerText = result;
        fx.value = "";
    }
})

/*
New Sheet Flow

when user switches to new sheet
i. save the old sheet's data
ii. clear all the cells which were affected in previous sheet
    1. remove active-cell class
    2. remove `style` attribute
    3. remove innerText
    4. reset the form
*/

function clearCell(cellId) {
    const cell = document.getElementById(cellId);
    cell.classList.remove("active-cell");
    cell.removeAttribute("style");
    cell.innerText = "";
}
let totalSheets=1, activeSheetName="sheet1";
const footForm = document.querySelector(".foot-form");

footForm.addEventListener("change", (event) => {
    let newSheetName= event.target.value;
    // console.log(newSheetName);
    // console.log(activeSheetName, state);
    // save the current sheet into the localStorage
    localStorage.setItem(activeSheetName, JSON.stringify(state));
    // clear all the cells affected/edited in the current sheet
    for(let cellId in state){
        clearCell(cellId);
    } 
    let existingData= localStorage.getItem(newSheetName);
    if(existingData){
        state= JSON.parse(existingData);
        // TODO: apply the styles to all the individual cells present in the existing data
        for(cellId in state){
            const celleElement= document.getElementById(cellId);
            applyStylesToElement(celleElement, state[cellId]);
        }
    }
    else{
        // there's no existing data in the localStorage
        // reset the state obj
        state= {};
    }
    // update the active sheet name to be the selected one
    activeSheetName=newSheetName;
})
function createNewSheet() {
    totalSheets++;
    /*
    (<div>
        <input type="radio" name="sheet" id="sheet1">
        <label for="sheet1">Sheet1</label>
    </div>
    */
   let newSheetName=`sheet${totalSheets}`;
   const inputContainer = document.createElement("div");
   inputContainer.innerHTML=`
        <input type="radio" name="sheet" id="${newSheetName}" value="${newSheetName}">
        <label for="${newSheetName}">Sheet${totalSheets}</label>`
    footForm.appendChild(inputContainer);
}

document.getElementById("merge").addEventListener("click",()=>{
    
})