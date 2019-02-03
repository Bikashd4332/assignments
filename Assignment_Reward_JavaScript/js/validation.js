window.onload = () => {
    const formElements = document.querySelectorAll(".input-group  input");
    const selectElements = document.querySelectorAll(".input-group  select");
    const captchaRefresh = document.querySelector(".captcha-group .captcha-refresh");

    formElements.forEach((formElement) => {
        formElement.addEventListener("focus", showErrorOnFocus, false);
        formElement.addEventListener("blur", hideErrorOnFocusOut, false);
        formElement.addEventListener("input", removeInvalidIfValidOnInput, false);
    });

    selectElements.forEach((selectElement) => {
        selectElement.addEventListener("change", removeInvalidIfValidOnSelect, false);
    });

    const formElement = document.querySelector("form");
    formElement.onsubmit = validation;

    captchaRefresh.addEventListener("click", captchaRefreshOnClick, false);
}

function captchaRefreshOnClick(event) {
    refreshCaptchaWithNewRandomValues(event.target.parentElement);
}

function showErrorOnFocus(event) {
    const parentInputGroup = event.target.parentElement;
    const errorMsg = parentInputGroup.querySelector(".error-msg")
    const emptyMsg = errorMsg.querySelector(".empty-msg");
    const invalidMsg = errorMsg.querySelector(".invalid-msg");

    if (emptyMsg) {
        emptyMsg.style.display = "none";
    }

    if (invalidMsg) {
        invalidMsg.style.display = "none";
    }

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
    const passwordElements = document.querySelectorAll(".input-group input[type='password']");
    const captchaElements = document.querySelectorAll(".captcha-group input");
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

    captchaElements.forEach((captchaElement) => {
        if (!isCaptchaCorrect(captchaElement)) {
            isAllValid = false;
            refreshCaptchaWithNewRandomValues(captchaElement);
            console.log("wrong");
        }
    });

    if (!isPasswordMatched(passwordElements)) {
        const parentInputGroup = passwordElements[1].parentElement;
        const errorIcon = parentInputGroup.querySelector(".error-icon");
        errorIcon.style.display = "block";
        passwordElements[1].classList.add("invalid");
        isAllValid = false;
    }

    return isAllValid;
}


function isValid(formElement) {
    if (formElement.validity.valid) {
        return true;
    }
    return false;
}


function isPasswordMatched(passwordElements) {
    return passwordElements[0].value === passwordElements[1].value;
}


function isCaptchaCorrect(captchaElement) {
    const captchaImg = captchaElement.parentElement.querySelector(".captcha-image > img");
    const numString = captchaImg.src.split("=")[1];
    const enteredValue = captchaElement.value;

    if (enteredValue == "") {
        return false;
    } else {
        return eval(numString) === Number(enteredValue);
    }
}

function refreshCaptchaWithNewRandomValues(captchaElement) {

    let parentCaptchaInputGroup = captchaElement.parentElement;
    let captchaImg = parentCaptchaInputGroup.querySelector(".captcha-image > img");
    let captchaURL = "https://dummyimage.com/100x40/E1F3F1/f0731f.gif&text=";

    var getRandomOperator = () => {
        const operators = ['-', '*'];
        return operators[Math.floor(Math.random(1, 9) * 2)];
    }

    var getRandomOperands = () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        return numbers[Math.floor(Math.random(1, 9) * 9)];
    }

    captchaImg.src = captchaURL + getRandomOperands() + getRandomOperator() + getRandomOperands();

}