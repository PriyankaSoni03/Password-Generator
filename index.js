const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const indicator = document.querySelector("[data-indicator]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_`,.-+/:;<=>?[]\{}|'


// Default values
let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle to grey
handleSlider();

// set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

// set Indicator color
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
    
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateSymobol(){
    const randomNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randomNum);
}

// calculating the strength of password
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
        setIndicator('#0f0');
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6)
        setIndicator('#ff0');
    else
        setIndicator('#f00');
}

// await keyword tabhi use aata h jb aapn function ko async bana dete h tabhi await use hoga
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'Copied';
    }
    catch(e){
        copyMsg.innerText = 'Failed';
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

// adding event listner in slider so that on movement its changes its value
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// adding event listner on copy button
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
});

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    // Special Condition - when the password Length is less than the boxes checked than also we will 
    // get the password length as the no of boxes checked. Eg- no of boxes checked is 4 and password
    // length is 1 then it should change to 4 as all for checkboxes are checked. 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        // // Method 1: to swap using temp variable
        // const temp = array[i];
        // array[i] = array[j];
        // array[j] = temp;

        // Method 2: to swap using destructing Assignment
        // [array[i],array[j]] = [array[j],array[i]];
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    // if no checkbox is checked then return nothing
    if(checkCount == 0) return;

    // if password length is less than checkCount then do some changes
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    // First creating the password with all the checkboxes checked 
    // if(uppercaseCheck.checked)
    //     password += generateUpperCase;
    // if(lowercaseCheck.checked)
    //     password += generateLowerCase;
    // if(numbersCheck.checked)
    //     password += generateRandomNumber;
    // if(symbolsCheck.checked)
    //     password += generateSymobol;

    // but we will not use above commentted lines of code as we will use optimized this so all the 
    // cases are adjusted in it, like the checked ones and after that the mandatory ones being completed
    // and then the others
    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funArr.push(generateSymobol);

    // compulsory addition
    for(let i = 0; i < funArr.length; i++)
        password += funArr[i]();

    // remaining addition
    for(let i = 0; i < passwordLength - funArr.length; i++){
        let randomIndex = getRndInteger(0,funArr.length);
        password += funArr[randomIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // Displaying password
    passwordDisplay.value = password;

    // set the stength
    calcStrength();
});