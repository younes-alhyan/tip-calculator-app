// Inputs
const inputs = document.querySelectorAll("input"); // Include other input types if necessary
const billInput = document.querySelector("#bill-input");
const tipsRadio = document.querySelectorAll(".tip-radio");
const peopleInput = document.querySelector("#people");
// Headers
const tipAmountHeader = document.querySelector("#tip-amount");
const totalHeader = document.querySelector("#total");
// Buttons
const reset = document.querySelector("#reset");
// Other
const errorMessage = document.querySelector("#error-message");

// Helper functions
const getRadioValue = (radio) => {
  // Use Array.prototype.find to get the checked radio button, or null if none is checked
  return Array.from(radio).find((r) => r.checked) || null;
};

const getCustomTip = () => {
  const customTipInput = document.querySelector("#custom .custom-input");
  return customTipInput.value;
};

// Function to sanitize input values
const sanitizeInput = (value) => {
  // Remove all non-numerical characters except periods
  value = value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point is allowed
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  return value;
};

const updateResetButton = () => {
  let hasValue = false;

  for (const input of inputs) {
    if (input.type === "checkbox" || input.type === "radio") {
      // For checkboxes and radios, check if any are checked
      if (input.checked) {
        hasValue = true;
        break;
      }
    } else {
      // For other input types, check if the value is not empty
      if (input.value.trim() !== "" && input.id !== "custom") {
        hasValue = true;
        break;
      }
    }
  }

  reset.classList.toggle("active", hasValue);
};

// Input event listener
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    updateResetButton();
    if (input === billInput) {
      // Sanitize input only for billInput
      input.value = sanitizeInput(input.value);
    } else if (input.type === "text") {
      // For other text inputs, remove non-numeric characters if needed
      input.value = input.value.replace(/[^0-9]/g, "");
    }
  });
});

// Functions
function calculateTip(bill, peopleNumber, tipPercent) {
  // Ensure the tip calculation is correct
  const tip = (bill * (tipPercent / 100)) / peopleNumber;
  tipAmountHeader.textContent = `$${tip.toFixed(2)}`;
}

function calculateTotal(bill, peopleNumber, tipPercent) {
  // Ensure the total calculation includes the tip
  const tip = bill * (tipPercent / 100);
  const total = (bill + tip) / peopleNumber;
  totalHeader.textContent = `$${total.toFixed(2)}`;
}

// Main event listener
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let bill = Number(billInput.value);
    let peopleNumber = Number(peopleInput.value);
    let selectedTip = getRadioValue(tipsRadio);
    let tipPercent = selectedTip
      ? selectedTip.value === "custom"
        ? Number(getCustomTip())
        : Number(selectedTip.value)
      : 0;

    if (!bill) {
      bill = 0;
    }
    if (!tipPercent) {
      tipPercent = 0;
    }
    if (peopleNumber <= 0) {
      // Added validation for peopleNumber
      peopleInput.parentElement.classList.add("error");
      errorMessage.classList.toggle("hide", false);
    } else {
      peopleInput.parentElement.classList.remove("error");
      errorMessage.classList.toggle("hide", true);
    }
    calculateTip(bill, peopleNumber, tipPercent);
    calculateTotal(bill, peopleNumber, tipPercent); // Pass tipPercent here
  }
});

// Reset button event listener

// Initialization
const init = () => {
  for (const radio of tipsRadio) {
    radio.checked = false;
  }
  billInput.value = "";
  peopleInput.value = "";
  updateResetButton();
};

reset.addEventListener("click", init);
init();
