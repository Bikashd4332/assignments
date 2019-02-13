// Making all the services ready that don't depend on the DOM.
const toastService = new ToastMaker(3000);
const spinnerService = new Spinner();
const popupService = new PopupWindow();

window.onload = () => {
  const formElements = document.querySelectorAll('.input-group  input');
  const selectElements = document.querySelectorAll('.input-group  select');
  const captchaElement = document.querySelector('.captcha-group > input');
  const captchaRefresh = document.querySelector(
      '.captcha-group .captcha-refresh'
  );

  const formElement = document.querySelector('form');
  const passwordElements = document.querySelectorAll('.password-show-hide');
  const passwordShowHideTriggers = document.querySelectorAll(
      '.password-show-hide > .password-show, .password-hide'
  );

  toastService.setToastParentElement(
      document.querySelector('.toast-container')
  );

  spinnerService.setSpinnerWidgetContainer(
      document.querySelector('.popup-content')
  );

  formElements.forEach(( formElement )=> {
    formElement.addEventListener('focus', showErrorOnFocus, false);
    formElement.addEventListener('blur', hideErrorOnFocusOut, false);
    formElement.addEventListener('input', removeInvalidIfValidOnInput, false);
  });

  selectElements.forEach( (selectElement) => {
    selectElement.addEventListener(
        'change',
        removeInvalidIfValidOnSelect,
        false
    );
  });

  formElement.onsubmit = validation;
  passwordElements.forEach((passwordElement) =>
    passwordElement.addEventListener('input', passwordShowHide, false)
  );
  passwordShowHideTriggers.forEach((passwordShowHideTrigger) =>
    passwordShowHideTrigger.addEventListener(
        'click',
        revealPasswordToggle,
        false
    )
  );
  captchaRefresh.addEventListener('click', captchaRefreshOnClick, false);
  refreshCaptchaWithNewRandomValues(captchaElement);
};

/**
 * Refreshes the captcha image with new values and operator.
 * @param {ClickEvent} event - The ClickEvent event object.
 */
function captchaRefreshOnClick(event) {
  refreshCaptchaWithNewRandomValues(event.target.parentElement);
}

/**
 * @desc This function toggles the appearance
 * of the eye inside the password elements.
 *  @param {ClickEvent} event - The event object object.
 */
function passwordShowHide(event) {
  const parentPasswordShowHide = event.target.parentElement;
  const showPasswordIcon = parentPasswordShowHide.querySelector(
      '.password-show'
  );
  const hidePasswordIcon = parentPasswordShowHide.querySelector(
      '.password-hide'
  );
  if (event.target.type === 'password') {
    showPasswordIcon.style.display = 'block';
    hidePasswordIcon.style.display = 'none';
    if (event.target.value === '') {
      showPasswordIcon.style.display = 'none';
      hidePasswordIcon.style.display = 'none';
    }
  } else {
    showPasswordIcon.style.display = 'none';
    hidePasswordIcon.style.display = 'block';
  }
}

/**
 * @desc This exposes the written characters inside the password elements.
 * @param {ClickEvent} event - The event object.
 */
function revealPasswordToggle(event) {
  const parentPasswordShowHide = event.target.parentElement;
  const passwordElement = parentPasswordShowHide.querySelector('.form-control');
  const showPasswordIcon = parentPasswordShowHide.querySelector(
      'a.password-show'
  );
  const hidePasswordIcon = parentPasswordShowHide.querySelector(
      'a.password-hide'
  );

  if (event.target === showPasswordIcon) {
    showPasswordIcon.style.display = 'none';
    hidePasswordIcon.style.display = 'block';
    passwordElement.type = 'text';
  } else {
    showPasswordIcon.style.display = 'block';
    hidePasswordIcon.style.display = 'none';
    passwordElement.type = 'password';
  }
}

/**
 * @desc This enables the apperance of validation messages
 * which convey the reason of invalid to the user.
 * @param {FocusEvent} event - the focus event associated with the element.
 */
function showErrorOnFocus(event) {
  const parentInputGroup = event.target.parentElement;
  const errorMsg = parentInputGroup.querySelector('.error-msg');
  const emptyMsg = errorMsg.querySelector('.empty-msg');
  const invalidMsg = errorMsg.querySelector('.invalid-msg');

  if (emptyMsg) {
    emptyMsg.style.display = 'none';
  }

  if (invalidMsg) {
    invalidMsg.style.display = 'none';
  }

  if (event.target.classList.contains('invalid')) {
    if (event.target.validity.valueMissing) {
      errorMsg.style.top = '-30px';
      errorMsg.style.opacity = '1';
      emptyMsg.style.display = 'block';
    } else {
      errorMsg.style.top = '-30px';
      errorMsg.style.opacity = '1';
      invalidMsg.style.display = 'block';
    }
  }
}

/**
 * @desc Does the exact opposite of the previous function.
 * This function hides the validation messages on focus out from
 * the focused invalid element.
 * @param {FocusEvent} event - the focus event of corresponding element.
 */
function hideErrorOnFocusOut(event) {
  const parentInputGroup = event.target.parentElement;
  const errorMsg = parentInputGroup.querySelector('.error-msg');

  if (event.target.classList.contains('invalid')) {
    if (event.target.validity.valueMissing) {
      errorMsg.style.top = '0px';
      errorMsg.style.opacity = '0';
    } else {
      errorMsg.style.top = '0px';
      errorMsg.style.opacity = '0';
    }
  }
}

/**
 * @desc If the user attemps to correct any earlier invalid elements by entering
 * text into it this function checks the input value
 * and sets the validity accordingly.
 * @param {InputEvent} event - the input event object.
 */
function removeInvalidIfValidOnInput(event) {
  if (event.target.classList.contains('invalid')) {
    const parentInputGroup = event.target.parentElement;
    const errorIcon = parentInputGroup.querySelector('.error-icon');
    const errorMsg = parentInputGroup.querySelector('.error-msg');

    if (event.target.validity.valid) {
      event.target.classList.remove('invalid');
      errorIcon.style.display = 'none';
      errorMsg.style.top = '0px';
      errorMsg.style.opacity = '0';
    }
  }
}

/**
 * @desc The function makes required select element valid on
 * user select if the select was previously invalid.
 * No effect if previously valid.
 * @param {SelectEvent} event - The select event fired from any select element.
 */
function removeInvalidIfValidOnSelect(event) {
  const parentInputGroup = event.target.parentElement;
  const errorIcon = parentInputGroup.querySelector('.error-icon');

  if (event.target.selectedIndex != 0) {
    event.target.classList.remove('invalid');
    errorIcon.style.display = 'none';
  }
}

/**
 * @desc This the function decides if each of the element's state
 * is valid and if it is then prepares to send this to
 * the server by an Ajax call.
 * @return {Boolean}
 */
function validation() {
  const formElements = document.querySelectorAll('.input-group  input');
  const selectElements = document.querySelectorAll('.input-group select');
  const passwordElements = document.querySelectorAll(
      '.password-show-hide > input'
  );
  const captchaElements = document.querySelectorAll('.captcha-group input');

  let isAllValid = true;

  if (document.querySelectorAll('.invalid').length != 0) {
    toastService.show('The form still has invalid values.');
  }

  formElements.forEach((formElement) => {
    const isValidElement = isValid(formElement);
    if (!isValidElement) {
      formElement.classList.add('invalid');
      const parentInputGroup = formElement.parentElement;
      const errorIcon = parentInputGroup.querySelector('.error-icon');
      errorIcon.style.display = 'block';
      isAllValid = false;
    }
  });

  selectElements.forEach((selectElement) => {
    const parentInputGroup = selectElement.parentElement;
    if (selectElement.selectedIndex === 0 && selectElement.requrieds) {
      const errorIcon = parentInputGroup.querySelector('.error-icon');
      errorIcon.style.display = 'block';
      selectElement.classList.add('invalid');
      isAllValid = false;
    }
  });

  captchaElements.forEach((captchaElement) => {
    if (!isCaptchaCorrect(captchaElement)) {
      isAllValid = false;
      refreshCaptchaWithNewRandomValues(captchaElement);
      console.log('wrong');
    }
  });

  if (!isPasswordMatched(passwordElements)) {
    const parentInputGroup = passwordElements[1].parentElement;
    const errorIcon = parentInputGroup.querySelector('.error-icon');
    errorIcon.style.display = 'block';
    errorIcon.style.right = '55px';
    passwordElements[1].classList.add('invalid');
    isAllValid = false;
  }

  if (isAllValid) {
    const formElement = document.querySelector('form');
    sendFormDataToProcess(formElement);
    formElement.reset();
  }

  return false;
}

/**
 * @desc This function checks the validity state of the element of the
 * defined type by using Validation APIs.
 * @param {HTMLInputElement | HTMLSelectElement} formElement -
 * The element object inside which can be invalid.
 * @return {Boolean}
 */
function isValid(formElement) {
  if (formElement.validity.valid) {
    return true;
  }
  return false;
}

/**
 * This function does a simple matching check if the entered the text
 * in the password inputElement matches with the passwordConfirmation
 * inputElement.
 * @param {Object[]} passwordElements - The array of the password inputElement.
 * @param {HTMLInputElement} - The password inputElement.
 * @return {Boolean}
 */
function isPasswordMatched(passwordElements) {
  return passwordElements[0].value === passwordElements[1].value;
}

/**
 * @desc This is a simple function for evaluating arithmatic
 * expression of single digit operands.
 * @param {Strign} numString - An arithmatic expression string.
 * @return {Number} - Evaluated value after performing operation.
 */
function myEval(numString) {
  const firstOperand = numString[0];
  const secondOperand = numString[2];
  switch (numString[1]) {
    case '-':
      return firstOperand - secondOperand;
    case '*':
      return firstOperand * secondOperand;
    case '/':
      return firstOperand / secondOperand;
  }
}

/**
 * @desc This function validates by evaluating the numString and comparing it
 * with the entered value inside the capthca.
 * @param {HTMLInputElement} captchaElement - An input element of the
 * captcha which has the value.
 * @return {Boolean} - returns true/false if evaluates to correct.
 */
function isCaptchaCorrect(captchaElement) {
  const captchaImg = captchaElement.parentElement.querySelector(
      '.captcha-image > img'
  );
  const numString = captchaImg.src.split('=')[1];
  const enteredValue = captchaElement.value;

  if (enteredValue === '') {
    return false;
  } else {
    return myEval(numString) === parseInt(enteredValue, 10);
  }
}

/**
 * @desc This function loads the captcha image with new random values.
 * @param {HTMLInputElement} captchaElement - The inputElement
 * inside the captcha-group
 */
function refreshCaptchaWithNewRandomValues(captchaElement) {
  const parentCaptchaInputGroup = captchaElement.parentElement;
  const captchaImg = parentCaptchaInputGroup.querySelector(
      '.captcha-image > img'
  );
  const captchaURL = 'https://dummyimage.com/100x40/E1F3F1/f0731f.gif&text=';

  const getRandomOperator = () => {
    const operators = ['-', '*', '/'];
    return operators[Math.floor(Math.random(1, 9) * 3)];
  };

  const getRandomOperands = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    return numbers[Math.floor(Math.random(1, 9) * 9)];
  };

  const randomOperator = getRandomOperator();
  let firstRandomOperand;
  let secondRandomOperand;

  if (randomOperator === '/') {
    do {
      firstRandomOperand = getRandomOperands();
      secondRandomOperand = getRandomOperands();
    } while (firstRandomOperand % secondRandomOperand != 0);
  } else if (randomOperator === '-') {
    do {
      firstRandomOperand = getRandomOperands();
      secondRandomOperand = getRandomOperands();
    } while (firstRandomOperand < secondRandomOperand);
  } else {
    firstRandomOperand = getRandomOperands();
    secondRandomOperand = getRandomOperands();
  }

  captchaImg.src =
    captchaURL + firstRandomOperand + randomOperator + secondRandomOperand;
}

/**
 * This is the constructor for the ToastMaker object. Which
 * generates alert boxes on the document to alert an error.
 * @param {Number} duration - A number represening how milisecond long the popup
 * should display.
 * @param {HTMLDivElement} toastParentElement - The parent div element where
 * the generated toast should be placed inside.
 */
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

/**
 * @desc This function sets the parent div element for toast
 * where toasts are places inside.
 * @param {HTMLDivElement} toastParentElement
 */
ToastMaker.prototype.setToastParentElement = function(toastParentElement) {
  this.__proto__.toastParentElement = toastParentElement;
};

ToastMaker.prototype.show = function(content = 'Toast message goes here.') {
  const toastBodyDiv = document.createElement('div');
  const toastDiv = document.createElement('div');
  const toastIconDiv = document.createElement('div');
  const toastIcon = document.createElement('i');
  const contentSpan = document.createElement('span');

  toastDiv.classList.add('toast');
  toastBodyDiv.classList.add('toast-body');
  toastIcon.classList.add('fa', 'fa-exclamation-circle');
  toastIconDiv.classList.add('toast-icon');
  contentSpan.classList.add('toast-message');

  toastBodyDiv.appendChild(toastIconDiv);
  contentSpan.innerText = content;
  toastBodyDiv.appendChild(contentSpan);
  toastIconDiv.appendChild(toastIcon);
  this.__proto__.count++;

  toastDiv.appendChild(toastBodyDiv);

  toastDiv.style.top = `${this.__proto__.count * 51}px`;
  toastDiv.classList.add('animate-in');

  this.__proto__.toastParentElement.appendChild(toastDiv);

  setTimeout(() => {
    toastDiv.classList.add('animate-out');
    setTimeout(() => {
      this.__proto__.toastParentElement.removeChild(toastDiv);
      this.__proto__.count--;

      const currentShowingToast = document.querySelectorAll('.toast');
      currentShowingToast.forEach((toastDiv) => {
        toastDiv.style.top = `${parseInt(toastDiv.style.top, 10) - 51}px`;
      });
    }, 300);
  }, this.__proto__.duration);
};

/**
 * @description This is a Spinner constructor for displaying
 * spinner when any background action perfomred.
 */
function Spinner() {}

Spinner.prototype.spinnerWidgetContainer = null;
Spinner.prototype.setSpinnerWidgetContainer = function(spinnerWidgetContainer) {
  this.__proto__.spinnerWidgetContainer = spinnerWidgetContainer;
};
Spinner.prototype.isShown = false;

/**
 * @desc This function is for toggling the state of the spinner
 * to show and hide.
 */
Spinner.prototype.toggleSpinner = function() {
  if (this.__proto__.isShown === false) {
    const popupOverlay = document.createElement('div');
    const popupContent = document.createElement('div');
    const spinnerWidget = document.createElement('div');
    const spinnerCircle = document.createElement('i');
    const spinnerSpin = document.createElement('div');

    // Adding all the classes to the corresponding elements.
    spinnerWidget.classList.add('spinner-widget');
    spinnerCircle.classList.add('circle');
    spinnerSpin.classList.add('spinner');
    spinnerWidget.classList.add('animate-in');
    popupOverlay.classList.add('popup-overlay');
    popupContent.classList.add('popup-content');

    // Adding the elements to its right DOM place.
    spinnerWidget.appendChild(spinnerCircle);
    spinnerWidget.appendChild(spinnerSpin);
    popupContent.appendChild(spinnerWidget);
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    this.__proto__.isShown = true;
  } else {
    const spinnerWidget = document.querySelector('.spinner-widget');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupContent = document.querySelector('.popup-content');

    /* Once after adding the animate-out class which makes
    the spinner to fade out.
  */
    spinnerWidget.classList.add('animate-out');
    // This is waiting to finnish the above animation which is defined 300ms.
    setTimeout(() => {
      popupContent.removeChild(spinnerWidget);
      document.body.removeChild(popupOverlay);
    }, 300);
    this.__proto__.isShown = false;
  }
};

/**
 * @desc This is a constructor for PopupWindow objects which displays
 * success and error message of submit operation.
 */
function PopupWindow() {}

/**
 * @desc This makes the popup window visible by setting the corresponding
 * contents.
 * @param {string} messageHeader - This is the string wihch is placed inside
 * the header of the popup window.
 * @param {string} messageBody - This is the content of message which is placed
 * inside popup window body
 * @param {Callback?} onPressingOk - This is an optional callback
 * which is triggered on pressing close button in the popup window.
 * @param {Callback?} onPressingClose - This is also an optional callback
 * which is triggered on pressing ok button in the popup window.
 */
PopupWindow.prototype.showPopup = function(
    messageHeader,
    messageBody,
    onPressingOk,
    onPressingClose
) {
  let popupOverlay = document.createElement('div');
  const popupContent = document.createElement('div');
  let popup = document.createElement('div');
  const popupHeader = document.createElement('div');
  const popupBody = document.createElement('div');
  const popupButton1 = document.createElement('a');
  const popupButton2 = document.createElement('a');

  // Adding all the classes to the corresponding elements.
  popupOverlay.classList.add('popup-overlay');
  popupContent.classList.add('popup-content');
  popup.classList.add('popup');
  popupHeader.classList.add('popup-header');
  popupBody.classList.add('popup-body');
  popupButton1.classList.add('popup-button');
  popupButton2.classList.add('popup-button');

  // Adding Content inside the respective elements.
  const h3Header = document.createElement('h3');
  h3Header.innerText = messageHeader;
  popupHeader.appendChild(h3Header);

  const pBody = document.createElement('p');
  pBody.innerText = messageBody;
  popupBody.appendChild(pBody);

  popupButton1.innerText = 'Ok';
  popupButton1.href = '#';

  popupButton1.addEventListener(
      'click',
      () => {
        popup.classList.add('animate-out');
        setTimeout(() => {
          popupContent.removeChild(popup);
          document.body.removeChild(popupOverlay);
          popup = null; // Garbage collecting the object.
          popupOverlay = null; // Also to this.
          if (typeof onPressingOk === 'function') {
            // Call the onPressingOk if is provided and is a function.
            onPressingOk();
          }
        }, 300);
      },
      false
  );

  popupButton2.addEventListener(
      'click',
      () => {
        popup.classList.add('animate-out');
        setTimeout(() => {
          popupContent.removeChild(popup);
          document.body.removeChild(popupOverlay);
          popup = null;
          popupOverlay = null;
          if (typeof onPressingClose === 'function') {
            onPressingClose();
          }
        }, 300);
      },
      false
  );

  popupButton2.innerText = 'Close';
  popupButton2.href = '#';

  // Adding the elements to its right DOM place.
  popup.appendChild(popupHeader);
  popup.appendChild(popupBody);
  popup.appendChild(popupButton1);
  popup.appendChild(popupButton2);
  popupContent.appendChild(popup);
  popupOverlay.appendChild(popupContent);

  document.body.appendChild(popupOverlay);
  popup.classList.add('animate-in');
};
/**
 * @desc This is the function where an ajax call is made to the server
 * to process the form values.
 * @param {HTMLFormElement} formElement - This is the form element
 * of whose values will be sent to the server.
 */
function sendFormDataToProcess(formElement) {
  const registrationFormData = new FormData(formElement);
  const sendingDataToProcessPromise = new Promise((resolve, reject) => {
    const myXmlHttpRequest = new XMLHttpRequest();
    myXmlHttpRequest.open('POST', 'php/saveFormData.php', true);
    myXmlHttpRequest.onreadystatechange = () => {
      if (myXmlHttpRequest.readyState === 4) {
        if (myXmlHttpRequest.status === 200) {
          const jsonResponseData = JSON.parse(myXmlHttpRequest.response);
          resolve(jsonResponseData);
        }

        if (myXmlHttpRequest.status === 404) {
          throw new Error(`Resource isn't available.`);
        }
      }
    };
    spinnerService.toggleSpinner();
    myXmlHttpRequest.send(registrationFormData);
  });
  sendingDataToProcessPromise.then(
      (jsonResponseData) => {
        spinnerService.toggleSpinner();
        popupService.showPopup(
            'Registration Successfull',
            'Thanks for signing up, your' +
            'details have been successfully stored.',
            () => console.log('Pressed OK'),
            () => console.log('Pressed Close')
        );
        console.log(jsonResponseData);
      },
      (errorReason) => {
        spinnerService.toggleSpinner();
        popupService.showPopup(
            'Registration Unsuccessfull',
            'We could not sign you up because'+
            'the server sent some errorneous response, ' +
          errorReason,
            () => console.log('Pressed OK'),
            () => console.log('Pressed Close')
        );
      }
  );
}
