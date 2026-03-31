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
  setActiveOperator(null);
  updateDisplay();
}

function inputDigit(digit) {
  if (currentInput === "Error") {
    currentInput = digit;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (shouldResetDisplay) {
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
    updateDisplay();
    return;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function toggleSign() {
  if (currentInput === "0" || currentInput === "Error") {
    return;
  }

  currentInput = currentInput.startsWith("-")
    ? currentInput.slice(1)
    : `-${currentInput}`;

  updateDisplay();
}

function convertToPercent() {
  if (currentInput === "Error") {
    return;
  }

  currentInput = formatNumber(Number(currentInput) / 100);
  updateDisplay();
}

function calculate(firstValue, secondValue, currentOperator) {
  const firstNumber = Number(firstValue);
  const secondNumber = Number(secondValue);

  if (currentOperator === "+") {
    return firstNumber + secondNumber;
  }

  if (currentOperator === "-") {
    return firstNumber - secondNumber;
  }

  if (currentOperator === "*") {
    return firstNumber * secondNumber;
  }

  if (currentOperator === "/") {
    if (secondNumber === 0) {
      return "Error";
    }

    return firstNumber / secondNumber;
  }

  return secondNumber;
}

function setActiveOperator(nextOperator) {
  document.querySelectorAll('[data-action="operator"]').forEach((button) => {
    button.classList.toggle("active-operator", button.dataset.value === nextOperator);
  });
}

function chooseOperator(nextOperator) {
  if (currentInput === "Error") {
    return;
  }

  if (operator && !shouldResetDisplay) {
    const result = calculate(previousInput, currentInput, operator);
    currentInput = result === "Error" ? "Error" : formatNumber(result);
    if (currentInput === "Error") {
      previousInput = null;
      operator = null;
      setActiveOperator(null);
      updateDisplay();
      return;
    }
  }

  previousInput = currentInput;
  operator = nextOperator;
  shouldResetDisplay = true;
  setActiveOperator(operator);
  updateDisplay();
}

function runEquals() {
  if (!operator || previousInput === null || currentInput === "Error") {
    return;
  }

  const result = calculate(previousInput, currentInput, operator);
  currentInput = result === "Error" ? "Error" : formatNumber(result);
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
  setActiveOperator(null);
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const { action, value } = button.dataset;

    if (action === "digit") {
      inputDigit(value);
      return;
    }

    if (action === "decimal") {
      inputDecimal();
      return;
    }

    if (action === "clear") {
      clearCalculator();
      return;
    }

    if (action === "toggle-sign") {
      toggleSign();
      return;
    }

    if (action === "percent") {
      convertToPercent();
      return;
    }

    if (action === "operator") {
      chooseOperator(value);
      return;
    }

    if (action === "equals") {
      runEquals();
    }
  });
});

updateDisplay();