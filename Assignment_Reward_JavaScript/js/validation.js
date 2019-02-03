window.onload = () => {
    const formElements = document.querySelectorAll(".input-group  input");
    const selectElements = document.querySelectorAll(".input-group  select");

    formElements.forEach((formElement) => {
        formElement.addEventListener("focus", showErrorOnFocus, false);
        formElement.addEventListener("blur", hideErrorOnFocusOut, false);
        formElement.addEventListener("input", removeInvalidIfValidOnInput, false);
    });

    selectElements.forEach((selectElement) => {
        // selectElement.addEventListener("focus", showErrorOnFocus, false);
        // selectElement.addEventListener("blur", hideErrorOnFocusOut, false);
        selectElement.addEventListener("change", removeInvalidIfValidOnSelect, false);
    });

    const formElement = document.querySelector("form");
    formElement.onsubmit = validation;
}

function showErrorOnFocus(event) {
    const parentInputGroup = event.target.parentElement;
    const errorMsg = parentInputGroup.querySelector(".error-msg")
    const emptyMsg = errorMsg.querySelector(".empty-msg");
    const invalidMsg = errorMsg.querySelector(".invalid-msg");

    emptyMsg.style.display = "none";
    invalidMsg.style.display = "none";

    if (event.target.classList.contains("invalid")) {
        if (event.target.validity.valueMissing) {
            errorMsg.style.top = "-30px";
            errorMsg.style.opacity = "1";
            emptyMsg.style.display = "block";
        } else {
            errorMsg.style.top = "-30px";
            errorMsg.style.opacity = "1";
            invalidMsg.style.display = "block";

        }
    }
}

function hideErrorOnFocusOut(event) {
    const parentInputGroup = event.target.parentElement;
    const errorMsg = parentInputGroup.querySelector(".error-msg");

    if (event.target.classList.contains("invalid")) {
        if (event.target.validity.valueMissing) {
            errorMsg.style.top = "0px";
            errorMsg.style.opacity = "0";
        } else {
            errorMsg.style.top = "0px";
            errorMsg.style.opacity = "0";

        }
    }
}

function removeInvalidIfValidOnInput(event) {
    if (event.target.classList.contains("invalid")) {
        const parentInputGroup = event.target.parentElement;
        const errorIcon = parentInputGroup.querySelector(".error-icon");
        const errorMsg = parentInputGroup.querySelector(".error-msg");

        if (event.target.validity.valid) {
            event.target.classList.remove("invalid");
            errorIcon.style.display = "none";
            errorMsg.style.top = "0px";
            errorMsg.style.opacity = "0";
        }
    }
}

function removeInvalidIfValidOnSelect(event) {
    const parentInputGroup = event.target.parentElement;
    const errorIcon = parentInputGroup.querySelector(".error-icon");

    if (event.target.selectedIndex != 0) {
        event.target.classList.remove("invalid");
        errorIcon.style.display = "none";
    }
}

function validation() {
    const formElements = document.querySelectorAll(".input-group  input");
    const selectElements = document.querySelectorAll(".input-group select");
    let isAllValid = true;


    formElements.forEach((formElement) => {

        const isValidElement = isValid(formElement);
        if (!isValidElement) {
            formElement.classList.add("invalid");
            const parentInputGroup = formElement.parentElement;
            const errorIcon = parentInputGroup.querySelector(".error-icon")
            errorIcon.style.display = "block";
            isAllValid = false;
        }
    });

    selectElements.forEach((selectElement) => {
        const parentInputGroup = selectElement.parentElement;
        if (selectElement.selectedIndex == 0 && selectElement.requrieds) {
            const errorIcon = parentInputGroup.querySelector(".error-icon");
            errorIcon.style.display = "block";
            selectElement.classList.add("invalid");
            isAllValid = false;
        }
    });


    return isAllValid;
}


function isValid(formElement) {
    if (formElement.validity.valid) {
        return true;
    }
    return false;
}