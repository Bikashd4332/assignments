const toastService = new ToastMaker(3000);


window.onload = () => {
  const formElements = document.querySelectorAll(".input-group  input");
  const selectElements = document.querySelectorAll(".input-group  select");
  const captchaRefresh = document.querySelector(
    ".captcha-group .captcha-refresh"
  );
  toastService.setToastParentElement(
    document.querySelector(".toast-container")
  );

  formElements.forEach(formElement => {
    formElement.addEventListener("focus", showErrorOnFocus, false);
    formElement.addEventListener("blur", hideErrorOnFocusOut, false);
    formElement.addEventListener("input", removeInvalidIfValidOnInput, false);
  });

  selectElements.forEach(selectElement => {
    selectElement.addEventListener(
      "change",
      removeInvalidIfValidOnSelect,
      false
    );
  });

  const formElement = document.querySelector("form");
  formElement.onsubmit = validation;

  captchaRefresh.addEventListener("click", captchaRefreshOnClick, false);
};

function captchaRefreshOnClick(event) {
  refreshCaptchaWithNewRandomValues(event.target.parentElement);
}

function showErrorOnFocus(event) {
  const parentInputGroup = event.target.parentElement;
  const errorMsg = parentInputGroup.querySelector(".error-msg");
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
  const passwordElements = document.querySelectorAll(
    ".input-group input[type='password']"
  );
  const captchaElements = document.querySelectorAll(".captcha-group input");

  let isAllValid = true;

  if (document.querySelectorAll(".invalid").length != 0) {
    toastService.show("The form still has invalid values.");
  }

  formElements.forEach(formElement => {
    const isValidElement = isValid(formElement);
    if (!isValidElement) {
      formElement.classList.add("invalid");
      const parentInputGroup = formElement.parentElement;
      const errorIcon = parentInputGroup.querySelector(".error-icon");
      errorIcon.style.display = "block";
      isAllValid = false;
    }
  });

  selectElements.forEach(selectElement => {
    const parentInputGroup = selectElement.parentElement;
    if (selectElement.selectedIndex == 0 && selectElement.requrieds) {
      const errorIcon = parentInputGroup.querySelector(".error-icon");
      errorIcon.style.display = "block";
      selectElement.classList.add("invalid");
      isAllValid = false;
    }
  });

  captchaElements.forEach(captchaElement => {
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
  const captchaImg = captchaElement.parentElement.querySelector(
    ".captcha-image > img"
  );
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
  let captchaImg = parentCaptchaInputGroup.querySelector(
    ".captcha-image > img"
  );
  let captchaURL = "https://dummyimage.com/100x40/E1F3F1/f0731f.gif&text=";

  var getRandomOperator = () => {
    const operators = ["-", "*"];
    return operators[Math.floor(Math.random(1, 9) * 2)];
  };

  var getRandomOperands = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return numbers[Math.floor(Math.random(1, 9) * 9)];
  };

  captchaImg.src =
    captchaURL +
    getRandomOperands() +
    getRandomOperator() +
    getRandomOperands();
}

function ToastMaker(duration, toastParentElement) {

  if (duration != undefined) {
    this.__proto__.duration = duration;
  }

  if (toastParentElement != undefined) {
    this.__proto__.toastParentElement = toastParentElement;
  }

}

ToastMaker.prototype.duration = 3000;
ToastMaker.prototype.toastParentElement = null;
ToastMaker.prototype.count = 0;
ToastMaker.prototype.setToastParentElement = function (toastParentElement) {
  this.__proto__.toastParentElement = toastParentElement;
}


ToastMaker.prototype.show = function (content = "Toast message goes here.") {
  const toastBodyDiv = document.createElement("div");
  const toastDiv = document.createElement("div");
  const toastIconDiv = document.createElement("div");
  const toastIcon = document.createElement("i");
  const contentSpan = document.createElement("span");

  toastDiv.classList.add("toast");
  toastBodyDiv.classList.add("toast-body");
  toastIcon.classList.add("fa", "fa-exclamation-circle");
  toastIconDiv.classList.add("toast-icon");
  contentSpan.classList.add("toast-message");

  toastBodyDiv.appendChild(toastIconDiv);
  contentSpan.innerText = content;
  toastBodyDiv.appendChild(contentSpan);
  toastIconDiv.appendChild(toastIcon);
  this.__proto__.count++;

  toastDiv.appendChild(toastBodyDiv);

  toastDiv.style.top = `${this.__proto__.count * 51}px`;
  toastDiv.classList.add("animate-in");

  this.__proto__.toastParentElement.appendChild(toastDiv);

  setTimeout(() => {
    toastDiv.classList.add("animate-out");
    setTimeout(() => {
      this.__proto__.toastParentElement.removeChild(toastDiv);
      this.__proto__.count--;

      const currentShowingToast = document.querySelectorAll(".toast");
      currentShowingToast.forEach(toastDiv => {
        toastDiv.style.top = `${parseInt(toastDiv.style.top, 10) - 51}px`;
      });
    }, 300);
  }, this.__proto__.duration);
}