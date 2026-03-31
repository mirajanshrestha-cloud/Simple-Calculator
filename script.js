const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function formatNumber(value) {
  const stringValue = String(value);
  if (stringValue.length > 12) {
    return Number(value).toPrecision(8).replace(/\.0+$|(\.\d*[1-9])0+$/, "$1");
  }
  return stringValue;
}

function updateDisplay() {
  display.textContent = currentInput;
}

function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function inputDigit(digit) {
  if (currentInput === "Error") {
    currentInput = digit;
    shouldResetDisplay = false;
  } else if (shouldResetDisplay) {
    currentInput = digit;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === "0" ? digit : currentInput + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0.";
    shouldResetDisplay = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function toggleSign() {
  if (currentInput === "0" || currentInput === "Error") {
    return;
  }
  currentInput = currentInput.startsWith("-") ? currentInput.slice(1) : `-${currentInput}`;
  updateDisplay();
}

function convertToPercent() {
  if (currentInput === "Error") {
    return;
  }
  currentInput = formatNumber(Number(currentInput) / 100);
  updateDisplay();
}

function chooseOperator(nextOperator) {
  previousInput = currentInput;
  operator = nextOperator;
  shouldResetDisplay = true;
}

function runEquals() {
  if (operator !== "-" || previousInput === null || currentInput === "Error") {
    return;
  }
  currentInput = formatNumber(Number(previousInput) - Number(currentInput));
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const { action, value } = button.dataset;

    if (action === "digit") inputDigit(value);
    if (action === "decimal") inputDecimal();
    if (action === "clear") clearCalculator();
    if (action === "toggle-sign") toggleSign();
    if (action === "percent") convertToPercent();
    if (action === "operator") chooseOperator(value);
    if (action === "equals") runEquals();
  });
});

updateDisplay();
