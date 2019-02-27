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

  const passwordElements =
    document.querySelectorAll('.password-show-hide  input');

  const passwordShowHideTriggers = document.querySelectorAll(
      '.password-show-hide > .password-show, .password-hide'
  );

  toastService.setToastParentElement(
      document.querySelector('.toast-container')
  );

  formElements.forEach(( formElement )=> {
    formElement.addEventListener('focus', showErrorOnFocus, false);
    formElement.addEventListener('blur', hideErrorOnFocusOut, false);
    formElement.addEventListener('input', removeInvalidIfValidOnInput, false);
    formElement
        .addEventListener('blur', validationFeedbackOfInputOnFocusOut, false);
  });

  selectElements.forEach( (selectElement) => {
    selectElement.addEventListener(
        'change',
        removeInvalidIfValidOnSelect,
        false
    );
    selectElement.addEventListener(
        'blur',
        validationFeedbackOfSelectOnFocusOut,
        false
    );
    if ( selectElement.name.includes( 'Country' ) ) {
      selectElement.addEventListener(
          'change',
          onSelectCountryPopulateState,
          false
      );
      populateCountrySelectWithValues( selectElement );
    }
  });

  formElement.onsubmit = validation;

  passwordElements.forEach((passwordElement) => {
    passwordElement.addEventListener('input', passwordShowHide, false);

    if (passwordElement.id === 'passwordInput') {
      passwordElement
          .addEventListener(
              'blur',
              validationFeedbackOfPasswordOnFocusOut,
              false
          );
    } else {
      passwordElement
          .addEventListener(
              'blur',
              validationFeedbackOfPasswordConfirmationOnFocusOut,
              false
          );
    }
  });

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

  if (event.target.classList.contains('invalid')) {
    errorMsg.style.top = '-30px';
    errorMsg.style.opacity = '1';

    if (event.target.validity.valueMissing) {
      emptyMsg.style.display = 'block';
    } else {
      if ( event.target.id == 'passwordConfirmationInput' ) {
        const passwordElement = document.querySelector('#passwordInput');
        if ( passwordElement.value === '') {
          const invalidMsgTwo =
          event.target.parentElement.querySelector('.invalid-msg-two');
          invalidMsgTwo.style.display = 'block';
        } else {
          invalidMsg.style.display = 'block';
        }
      } else {
        invalidMsg.style.display = 'block';
      }
    }
  }
}

/**
 * @desc Does the exact opposite of the showErrorOnFocus function.
 * This function hides the validation messages on focus out from
 * the focused invalid element.
 * @param {FocusEvent} event - the focus event of corresponding element.
 */
function hideErrorOnFocusOut(event) {
  const parentInputGroup = event.target.parentElement;
  const errorMsg = parentInputGroup.querySelector('.error-msg');
  const emptyMsg = errorMsg.querySelector('.empty-msg');
  const invalidMsg = errorMsg.querySelector('.invalid-msg');
  const invalidMsgTwo = errorMsg.querySelector('.invalid-msg-two');


  if (event.target.classList.contains('invalid')) {
    errorMsg.style.top = '0px';
    errorMsg.style.opacity = '0';
    setTimeout(() => {
      if ( emptyMsg !== null ) {
        emptyMsg.style.display = 'none';
      }
      if ( invalidMsg !== null ) {
        invalidMsg.style.display = 'none';
      }
      if ( event.target.id === 'passwordConfirmationInput' ) {
        invalidMsgTwo.style.display = 'none';
      }
    }, 300);
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
 * @desc This the function decides if all the required fields have some
 * value filled in by the user and those are vlaid. It also
 * validates captcha. If it is then prepares to
 * send this to the server by an Ajax call.
 * @return {Boolean}
 */
function validation() {
  const captchaElements = document.querySelectorAll('.captcha-group input');

  const allRequiredFields =
  document.querySelectorAll('input:required, select:required');

  let isAllValid = true;
  let isAllRequiredFilled = true;

  allRequiredFields.forEach((requiredElement) => {
    if ( requiredElement instanceof HTMLInputElement
      && requiredElement.value === ''
    ) {
      isAllRequiredFilled = false;
    }

    if ( requiredElement instanceof HTMLSelectElement
        && requiredElement.selectedIndex === 0
    ) {
      isAllRequiredFilled = false;
    }
  });

  captchaElements.forEach((captchaElement) => {
    if (!isCaptchaCorrect(captchaElement)) {
      isAllValid = false;
      refreshCaptchaWithNewRandomValues(captchaElement);
      captchaElement.value = '';
    }
  });

  if (document.querySelectorAll('.invalid').length > 0) {
    toastService.show('There are still invalid values present');
    isAllValid = false;
  } else if (!isAllRequiredFilled) {
    toastService.show('Required Fields are still blank.');
  }

  if (isAllValid && isAllRequiredFilled) {
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
  if ( formElement.id === 'currentZipCodeInput' || formElement === 'permanentZipCodeInput') {
    if ( /0{5,6}/.test(formElement.value )) {
      console.log('executing');
      return false;
    }
  } else if (formElement.id === 'primaryCellPhoneInput' || formElement.id === 'secondaryCellPhoneInput') {
    if (/0{10}/.test(formElement.value)) {
      return false;
    }
  }
  if (formElement.validity.valid) {
    return true;
  }
  return false;
}

/**
 * This validates the provided zip code string. (Only India for now).
 * @param {String} pincode - The string of the pincode
 * which is being validated.
 * @return {Promise} - returns a promise of the request.
 */
// function validatePinCode(pincode) {
//   return new Promise((resolve, reject) => {
//     if (/^0+$/.test(pincode)) {
//       reject(new Error('Pincode Can\'t have all zeros'));
//     } else {
//       const myValidationRequest = new XMLHttpRequest();
//       myValidationRequest.onreadystatechange = () => {
//         if (myValidationRequest.readyState === 4) {
//           if (myValidationRequest.readyState === 200) {
//             const jsonString = myValidationRequest.response; 
//             console.log(jsonString);
//             const stateName = JSON.parse(jsonString).PostOffice[0].State;
//             resolve(stateName);
//           } else {
//             reject(new Error('Pincode can\'t be validated'));
//           }
//         }
//       };
//       myValidationRequest.open('GET', 'https://postalpincode.in/api/pincode/' + pincode, true);
//       myValidationRequest.send();
//     }
//   });
// }

/**
 * This function validates the password field by
 * matching the value with the regular expression.
 * @param {HTMLInputElement} passwordElement - The password which is validated.
 * @return {Boolean} - it retuns a true if matched else false otherwise.
 */
function validatePassword(passwordElement) {
  const enteredValue = passwordElement.value;
  const specialCharacterRegExp = /[^a-zA-Z0-9\s]/;
  const alphaNumericTestRegExp = /[a-zA-Z0-9]/;

  return specialCharacterRegExp.test(enteredValue)
      && alphaNumericTestRegExp.test(enteredValue)
      && enteredValue.length >= 8;
}

/**
 * This function does a simple matching check if the entered the text
 * in the password inputElement matches with the passwordConfirmation
 * inputElement.
 * @param {HTMLInputElement} passwordElement
 * - The password confirmation inputElement.
 * @return {Boolean}
 */
function isPasswordMatched(passwordElement) {
  const passwordInputString = document.querySelector('#passwordInput').value;
  const passwordInputConfirmationString = passwordElement.value;

  if (passwordInputString === '' && passwordInputConfirmationString === '') {
    return false;
  }
  return passwordInputConfirmationString === passwordInputString;
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
    case '+':
      return firstOperand + secondOperand;
  }
}

/**
 * @desc This function validates by evaluating the numString and comparing it
 * with the entered value inside the capthca.
 * @param {HTMLInputElement} captchaElement - An input element of the
 * captcha which has the value.
 * @return {Boolean} - returns true if evaluates to correct else false.
 */
function isCaptchaCorrect(captchaElement) {
  const captchaImgDiv = captchaElement.parentElement.querySelector(
      '.captcha-image > p'
  );
  const numString = captchaImgDiv.innerText;
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
  const captchaImgDiv = parentCaptchaInputGroup.querySelector(
      '.captcha-image > p'
  );

  const getRandomOperator = () => {
    const operators = ['-', '*', '/', '+'];
    return operators[Math.floor(Math.random(1, 9) * 4)];
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
      firstRandomOperand = getRandomOperands(); secondRandomOperand = getRandomOperands();
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

  captchaImgDiv.innerText =
    firstRandomOperand + randomOperator + secondRandomOperand;
}

/**
 This is the constructor for the ToastMaker object. Which
 * generates alert boxes on the document to alert an error.
 * @constructor
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

ToastMaker.prototype.show = function( content = 'Toast message goes here.' ) {
  const toastBodyDiv = document.createElement( 'div' );
  const toastDiv = document.createElement('div');
  const toastIconDiv = document.createElement( 'div' );
  const toastIcon = document.createElement( 'i' );
  const contentSpan = document.createElement( 'span' );

  toastDiv.classList.add( 'toast' );
  toastBodyDiv.classList.add( 'toast-body' );
  toastIcon.classList.add( 'fa', 'fa-exclamation-circle' );
  toastIconDiv.classList.add( 'toast-icon' );
  contentSpan.classList.add( 'toast-message' );

  toastBodyDiv.appendChild( toastIconDiv );
  contentSpan.innerText = content;
  toastBodyDiv.appendChild( contentSpan );
  toastIconDiv.appendChild( toastIcon );
  this.__proto__.count++;

  toastDiv.appendChild( toastBodyDiv );

  toastDiv.style.top = `${this.__proto__.count * 51}px`;
  toastDiv.classList.add( 'animate-in' );

  this.__proto__.toastParentElement.appendChild( toastDiv );

  setTimeout(() => {
    toastDiv.classList.add( 'animate-out' );
    setTimeout(() => {
      this.__proto__.toastParentElement.removeChild( toastDiv );
      this.__proto__.count--;

      const currentShowingToast = document.querySelectorAll( '.toast' );
      currentShowingToast.forEach(( toastDiv ) => {
        toastDiv.style.top = `${parseInt( toastDiv.style.top, 10 ) - 51}px`;
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
    const popupOverlay = document.createElement( 'div' );
    const popupContent = document.createElement( 'div' );
    const spinnerWidget = document.createElement( 'div' );
    const spinnerCircle = document.createElement( 'i' );
    const spinnerSpin = document.createElement( 'div' );

    // Adding all the classes to the corresponding elements.
    spinnerWidget.classList.add( 'spinner-widget' );
    spinnerCircle.classList.add( 'circle' );
    spinnerSpin.classList.add( 'spinner' );
    spinnerWidget.classList.add( 'animate-in' );
    popupOverlay.classList.add( 'popup-overlay' );
    popupContent.classList.add( 'popup-content' );

    // Adding the elements to its right DOM place.
    spinnerWidget.appendChild( spinnerCircle );
    spinnerWidget.appendChild( spinnerSpin );
    popupContent.appendChild( spinnerWidget );
    popupOverlay.appendChild( popupContent );
    document.body.appendChild( popupOverlay );

    this.__proto__.isShown = true;
  } else {
    const spinnerWidget = document.querySelector('.spinner-widget');
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupContent = document.querySelector('.popup-content');

    /* Once after adding the animate-out class which makes
    the spinner to fade out.
  */
    spinnerWidget.classList.add( 'animate-out');
    // This is waiting to finnish the above animation which is defined 300ms.
    setTimeout(() => {
      popupContent.removeChild( spinnerWidget );
      document.body.removeChild( popupOverlay );
    }, 300 );
    this.__proto__.isShown = false;
  }
};

/**
 * @desc This is a constructor for PopupWindow objects which displays
 * success and error message of submit operation.
 * @constructor
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
  let popupOverlay = document.createElement( 'div' );
  const popupContent = document.createElement( 'div' );
  let popup = document.createElement( 'div' );
  const popupHeader = document.createElement( 'div' );
  const popupBody = document.createElement( 'div' );
  const popupButton1 = document.createElement( 'a' );
  const popupButton2 = document.createElement( 'a' );

  // Adding all the classes to the corresponding elements.
  popupOverlay.classList.add( 'popup-overlay' );
  popupContent.classList.add( 'popup-content' );
  popup.classList.add('popup');
  popupHeader.classList.add( 'popup-header' );
  popupBody.classList.add( 'popup-body' );
  popupButton1.classList.add( 'popup-button' );
  popupButton2.classList.add( 'popup-button' );

  // Adding Content inside the respective elements.
  const h3Header = document.createElement( 'h3' );
  h3Header.innerText = messageHeader;
  popupHeader.appendChild( h3Header );

  const pBody = document.createElement( 'p' );
  pBody.innerText = messageBody;
  popupBody.appendChild( pBody );

  popupButton1.innerText = 'Ok';
  popupButton1.href = '#';

  popupButton1.addEventListener(
      'click',
      () => {
        popup.classList.add( 'animate-out' );
        setTimeout(() => {
          popupContent.removeChild( popup );
          document.body.removeChild( popupOverlay );
          popup = null; // Garbage collecting the object.
          popupOverlay = null; // Also to this.
          if ( typeof onPressingOk === 'function' ) {
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
        popup.classList.add( 'animate-out' );
        setTimeout(() => {
          popupContent.removeChild( popup );
          document.body.removeChild( popupOverlay );
          popup = null;
          popupOverlay = null;
          if ( typeof onPressingClose === 'function' ) {
            onPressingClose();
          }
        }, 300 );
      },
      false
  );

  popupButton2.innerText = 'Close';
  popupButton2.href = '#';

  // Adding the elements to its right DOM place.
  popup.appendChild( popupHeader );
  popup.appendChild( popupBody );
  popup.appendChild( popupButton1 );
  popup.appendChild( popupButton2 );
  popupContent.appendChild( popup );
  popupOverlay.appendChild( popupContent );

  document.body.appendChild( popupOverlay );
  popup.classList.add( 'animate-in' );
};


/**
 * @desc This is the function where an ajax call is made to the server
 * to process the form values.
 * @param {HTMLFormElement} formElement - This is the form element
 * of whose values will be sent to the server.
 */
function sendFormDataToProcess( formElement ) {
  const registrationFormData = new FormData( formElement );

  const sendingDataToProcessPromise = new Promise(( resolve, reject ) => {
    const myXmlHttpRequest = new XMLHttpRequest();

    myXmlHttpRequest.open( 'POST', 'php/saveFormData.php', true );

    myXmlHttpRequest.onreadystatechange = () => {
      if ( myXmlHttpRequest.readyState === 4 ) {
        if ( myXmlHttpRequest.status === 200 ) {
          const jsonResponseData = JSON.parse( myXmlHttpRequest.response );
          resolve( jsonResponseData );
        }

        if ( myXmlHttpRequest.status === 404 ) {
          reject( new Error('Resource is\'nt available') );
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

/**
 * This function validates it self with the value
 * as soon as the the input element loses its focus.
 * @param {FocusEvent} event - This focus event generated by HTMLInputEelements.
 */
function validationFeedbackOfInputOnFocusOut( event ) {
  const isValidElement = isValid( event.target );
  if ( !isValidElement ) {
    event.target.classList.add( 'invalid' );
    const parentInputGroup = event.target.parentElement;
    const errorIcon = parentInputGroup.querySelector( '.error-icon' );
    errorIcon.style.display = 'block';
  }
}

/**
 * This funciton also validates its own selection as soon as
 * loses its focus.
 * @param {FocusEvent} event - This is the event generated
 *  by HTMLSelectElements.
 */
function validationFeedbackOfSelectOnFocusOut( event ) {
  const parentInputGroup = event.target.parentElement;
  if ( event.target.selectedIndex === 0 && event.target.required ) {
    const errorIcon = parentInputGroup.querySelector( '.error-icon' );
    errorIcon.style.display = 'block';
    event.target.classList.add( 'invalid' );
  }
}

/**
 * This function validates the password on focus out.
 * @param {FocusEvent} event - This is Focus event
 * generated by password elements.
 */
function validationFeedbackOfPasswordOnFocusOut( event ) {
  if ( !validatePassword( event.target ) ) {
    const parentInputGroup = event.target.parentElement;
    const errorIcon = parentInputGroup.querySelector( '.error-icon' );
    event.target.classList.add( 'invalid' );
    errorIcon.style.display = 'block';

    if ( event.target.value !== '' ) {
      errorIcon.style.right = '55px';
    } else {
      errorIcon.style.right = '10px';
    }
  }
}

/**
 * This function validates password confirmation input.
 * @param {FocusEvent} event - This event is generated by the
 * passwordConfimration input.
 */
function validationFeedbackOfPasswordConfirmationOnFocusOut( event ) {
  if ( !isPasswordMatched( event.target ) ) {
    const parentInputGroup = event.target.parentElement;
    const errorIcon = parentInputGroup.querySelector( '.error-icon' );
    event.target.classList.add( 'invalid' );

    if ( event.target.value !== '' ) {
      errorIcon.style.display = 'block';
      errorIcon.style.right = '55px';
    } else {
      errorIcon.style.display = 'block';
      errorIcon.style.right = '10px';
    }
  }
}

/**
 * This is a helper function providing the list of states by an
 * ajax call.
 * @param {String} countryName - The name of the country for
 * which state lists need to be fetched.
 * @return {Promise} - Returns a promise of the ajax request.
 */
function getStateList( countryName ) {
  const myPromise = new Promise(( resolve, reject ) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if ( xhr.readyState === 4 ) {
        if ( xhr.status === 200 ) {
          const countryStateResourceJson = JSON.parse( xhr.response );
          let stateList = [];
          countryStateResourceJson.countries.forEach(( object ) => {
            if ( object.country === countryName ) {
              stateList = [...object.states];
            }
          });
          resolve( stateList );
        }
        if ( xhr.status === 404 ) {
          reject( new Error( 'Resource is\'nt available' ) );
        }
      }
    };
    xhr.open( 'GET', '/js/country_state_json/gistfile1.json', true );
    xhr.send();
  });
  return myPromise;
}

/**
 * This function deletes all the child options inside of it.
 * By doing this the selectElement gets a fresh list of states each time.
 * @param {HTMLSelectElement} selectElement - This is the element
 * whose child optoins are deleted.
 */
function removeAllSelectOptions( selectElement ) {
  const optionElements = selectElement.querySelectorAll( 'option' );

  optionElements.forEach(( optionElement ) => {
    selectElement.removeChild( optionElement );
  });
}

/**
 * This function handles the selection in the country select element and
 * loads new states values inside the state select element.
 * @param {SelectEvent} event - The select event
 * generated by the HTMLSelectElement.
 */
function onSelectCountryPopulateState( event ) {
  const siblingInputGroup =
  event.target.parentElement.nextElementSibling;

  const stateSelectElement =
  siblingInputGroup.querySelector('select.form-control');

  const selectedCountryName = event.target.value;
  let stateList = [];
  removeAllSelectOptions( stateSelectElement );
  stateSelectElement.disabled = false;
  getStateList( selectedCountryName )
      .then(( states ) => {
        stateList = [...states];
        // Add this in the index 0 as the default selected inex.
        stateList.unshift( 'Select State' );
        stateList.forEach((stateString, index ) => {
          const optionElement = document.createElement('option');
          optionElement.value = stateString;
          optionElement.innerText = stateString;
          if (index === 0) {
            // Make the string in index 0 as the selected and default value.
            optionElement.selected = true;
          }
          stateSelectElement.appendChild(optionElement);
        });
      });
}

/**
 * @desc The function does add all the list of country into the country
 * select dyanimcally. This saves a huge lines in html without hardcoding.
 * @param {HMLTSelectElement} countrySelectElemnet - The country
 * select element which is loaded with a huge list of countries.
 */
function populateCountrySelectWithValues(countrySelectElemnet) {
  new Promise( (resolve, reject) => {
    const myCountryRequest = new XMLHttpRequest();
    myCountryRequest.open('GET', '/js/country_state_json/gistfile1.json', true);
    myCountryRequest.send();
    myCountryRequest.onreadystatechange = () => {
      if ( myCountryRequest.readyState === 4 ) {
        if ( myCountryRequest.status === 200 ) {
          countrySelectElemnet.item(0).innerText = 'Select Country.';
          resolve(JSON.parse( myCountryRequest.response ));
        } else if ( myCountryRequest.status === 400 ) {
          reject( new Error( 'Resource is\'nt available') );
        }
      }
      if ( myCountryRequest.readyState === 3 ) {
        countrySelectElemnet.item(0).innerText = 'Loading....';
      }
    };
  }).then((jsonCountryState) => {
    jsonCountryState.countries.forEach((countryObject) => {
      const option = document.createElement( 'option' );
      option.value = countryObject.country;
      option.innerText = countryObject.country;
      countrySelectElemnet.appendChild(option);
    });
  });
}
