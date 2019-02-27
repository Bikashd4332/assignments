// Making all the services ready that don't depend on the DOM.
const toastService = new ToastMaker(3000);
const spinnerService = new Spinner();
const popupService = new PopupWindow();

$(document).ready(function() {
  spinnerService.hideInitial();
  popupService.hideInitial();

  toastService.setToastParentElement(
      $('.toast-container').get(0)
  );

  $('div.input-group > input.form-control')
      .each(function(index, formElement) {
        $(formElement).bind('focus', showErrorOnFocus);
        $(formElement).bind('blur', hideErrorOnFocusOut);
        $(formElement).bind('input', removeInvalidIfValidOnInput);
        $(formElement).bind('blur', validationFeedbackOfInputOnFocusOut);
      });

  $('div.input-group > select.form-control')
      .each(function(index, selectElement) {
        $(selectElement).bind('change', removeInvalidIfValidOnSelect);
        $(selectElement).bind('blur', validationFeedbackOfSelectOnFocusOut);
        if ( $(selectElement).prop('name').includes( 'Country' ) ) {
          $(selectElement).bind('change', onSelectCountryPopulateState);
          populateCountrySelectWithValues(selectElement);
        }
      });

  $('form').bind('submit', validation);

  $('div.password-show-hide > input.form-control')
      .each(function(index, passwordElement) {
        $(passwordElement).bind('input', passwordShowHide);
        if (passwordElement.id === 'passwordInput') {
          $(passwordElement).bind('blur', validationFeedbackOfPasswordOnFocusOut);
        } else {
          $(passwordElement).bind('blur', validationFeedbackOfPasswordConfirmationOnFocusOut);
        }
      });

  $('.password-show, .password-hide')
      .each(function(index, passwordShowHideTrigger) {
        $(passwordShowHideTrigger).bind('click', revealPasswordToggle);
      });

  $('div.captcha-group > .captcha-refresh').bind('click', captchaRefreshOnClick);
  refreshCaptchaWithNewRandomValues($('div.captcha-group input.captcha-element').get(0));
});

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
  const showPasswordIcon = $(event.target).parent('div.password-show-hide').find('a.password-show');
  const hidePasswordIcon = $(event.target).parent('div.password-show-hide').find('a.password-hide');

  if ($(event.target).attr('type') === 'password') {
    showPasswordIcon.css('display', 'block');
    hidePasswordIcon.css('display', 'none');

    if ($(event.target).val() === '') {
      showPasswordIcon.css('display', 'none');
    }
  } else {
    showPasswordIcon.css('display', 'none');
    hidePasswordIcon.css('display', 'block');
  }
}

/**
 * @desc This exposes the written characters inside the password elements.
 * @param {ClickEvent} event - The event object.
 */
function revealPasswordToggle(event) {
  const passwordShow = $(event.target).parent('div.password-show-hide').find('.password-show');
  const passwordHide = $(event.target).parent('div.password-show-hide').find('.password-hide');
  const inputPasswordElement = $(event.target).parent('div.input-group').find('input.form-control');

  if (event.target === passwordShow.get(0)) {
    $(passwordShow).css('display', 'none');
    $(passwordHide).css('display', 'block');
    inputPasswordElement.attr('type', 'text');
  } else {
    $(passwordShow).css('display', 'block');
    $(passwordHide).css('display', 'none');
    inputPasswordElement.attr('type', 'password');
  }
}

/**
 * @desc This enables the apperance of validation messages
 * which convey the reason of invalid to the user.
 * @param {FocusEvent} event - the focus event associated with the element.
 */
function showErrorOnFocus(event) {
  const parentInputGroup = $(event.target).parent();

  if ($(event.target).hasClass('invalid')) {
    parentInputGroup
        .find('div.error-msg')
        .css({
          top: '-30px',
          opacity: '1',
        });

    if ($(event.target).prop('validity').valueMissing) {
      parentInputGroup.find('p.empty-msg').css('display', 'block');
    } else {
      if (event.target.id === 'passwordConfirmationInput') {
        if ($('#passwordInput').val() === '') {
          parentInputGroup.find('p.invalid-msg-two').css('display', 'block');
        } else {
          parentInputGroup.find('p.invalid-msg').css('display', 'block');
        }
      } else {
        parentInputGroup.find('p.invalid-msg').css('display', 'block');
      }
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
  const parentInputGroup = $(event.target).parent();
  if ($(event.target).hasClass('invalid')) {
    parentInputGroup.find('div.error-msg').css({
      top: '0px',
      opacity: '0',
    });
    setTimeout(() => {
      parentInputGroup.find('.empty-msg').css('display', 'none');
      parentInputGroup.find('.invalid-msg').css('display', 'none');
      if (event.target.id === 'passwordConfirmationInput') {
        parentInputGroup.find('.invalid-msg-two').css('display', 'none');
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
    if ($(event.target).prop('validity').valid) {
      $(event.target).removeClass('invalid');
      $(event.target).parent('div.input-group').find('i.error-icon').css('display', 'none');
      $(event.target).parent('div.input-group').find('div.error-msg').css({
        top: '0px',
        opacity: '0',
      });
    }
  }
}
-
/**
 * @desc The function makes required select element valid on
 * user select if the select was previously invalid.
 * No effect if previously valid.
 * @param {SelectEvent} event - The select event fired from any select element.
 */
function removeInvalidIfValidOnSelect(event) {
  if ($(event.target).prop('selectedIndex') !== 0) {
    $(event.target).removeClass('invalid');
    $(event.target).parent('div.input-group').find('i.error-icon').css('display', 'none');
  }
}

/**
 * @desc This the function decides if each of the element's state
 * is valid and if it is then prepares to send this to
 * the server by an Ajax call.
 * @return {Boolean}
 */
function validation() {
  let isAllValid = true;
  let isAllRequiredFilled = true;

  if ($('.invalid').length !== 0) {
    toastService.show('The form has invalid values.');
    return false;
  }

  $('input:required, select:required').each(
      function(index, formControl) {
        if (formControl instanceof HTMLInputElement && formControl.value === '') {
          isAllRequiredFilled = false;
        } else if (formControl instanceof HTMLSelectElement && formControl.selectedIndex === 0) {
          isAllRequiredFilled = false;
        }
      }
  );


  $('body').find('div.input-group div.captcha-group > input.form-control')
      .each( function(index, captchaElement ) {
        if ( !isCaptchaCorrect( captchaElement )) {
          isAllValid = false;
          toastService.show('The captcha answer was incorrect.');
          refreshCaptchaWithNewRandomValues( captchaElement );
        }
      });

  if (!isAllRequiredFilled) {
    toastService.show('All the required fields are not filled yet.');
    return false;
  }

  if (isAllValid && isAllRequiredFilled) {
    sendFormDataToProcess($('form').get(0));
    refreshCaptchaWithNewRandomValues($('div.captcha-group > input.form-control').get(0));
    $('body').find('form').get(0).reset();
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
  if (formElement.id === 'currentZipCodeInput' || formElement.id === 'permanentZipCodeInput' ) {
    if (/0{5,6}/.test(formElement.value)) {
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
 * This function does a simple matching check if the entered the text
 * in the password inputElement matches with the passwordConfirmation
 * inputElement.
 * @param {HTMLInputElement}  passwordElement - The password inputElement.
 * @return {Boolean}
 */
function isPasswordMatched(passwordElement) {
  const passwordInputString = $('#passwordInput').val();
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
      return firstoperand + secondOperand;
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
  const numString = $(captchaElement)
      .parent('div.captcha-group')
      .find('div.captcha-image > p')
      .text();
  const enteredValue = $(captchaElement).val();

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

  $('div.captcha-image > p')
      .text(
          firstRandomOperand +
          randomOperator +
          secondRandomOperand);
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

ToastMaker.prototype.show = function(content = 'Toast message goes here.') {
  const myToastLayout =
  $( '<div></div>' )
      .addClass( 'toast' )
      .append(
          $( '<div></div>' )
              .addClass( 'toast-body' )
              .append(
                  $( '<div></div>' )
                      .addClass( 'toast-icon' )
                      .append(
                          $( '<i></i>' )
                              .addClass( 'fa fa-exclamation-circle' )
                      )
              ).append(
                  $( '<span></span>' )
                      .addClass( 'toast-message' )
                      .text(content)
              )
      );

  this.__proto__.count++;

  $(this.__proto__.toastParentElement)
      .append(
          $(myToastLayout)
              .css('top', `${this.__proto__.count * 51}px`)
              .addClass('animate-in')
      );

  setTimeout(() => {
    $( myToastLayout ).addClass( 'animate-out' );
    setTimeout(() => {
      $(myToastLayout).remove();
      this.__proto__.count--;

      $( this.__proto__.toastParentElement )
          .find( 'div.toast' )
          .each(
              function(index, element) {
                const top = element.style.top;
                $(element).css('top', `${parseInt(top, 10) - 51}px`);
              }
          );
    }, 300);
  }, this.__proto__.duration);
};

/**
 * @description This is a Spinner constructor for displaying
 * spinner when any background action perfomred.
 * @constructor
 */
function Spinner() {}

Spinner.prototype.isShown = false;
Spinner.prototype.hideInitial = function() {
  $('body').find('div.spinner-widget').hide();
  $('body').find('div.popup-overlay-spinner').hide();
};
/**
 * @desc This function is for toggling the state of the spinner
 * to show and hide.
 */
Spinner.prototype.toggleSpinner = function() {
  if (this.__proto__.isShown === false) {
    $('body').find('div.popup-overlay-spinner').show().css('display', 'flex');
    $('body').find('div.popup-overlay-spinner').find('div.spinner-widget').show();
    $('body').find('div.spinner-widget').removeClass('animate-out').addClass('animate-in');
    this.__proto__.isShown = true;
  } else {
    const popupOverlay = $('.popup-overlay-spinner');

    /* Once after adding the animate-out class which makes
    the spinner to fade out.
    */
    popupOverlay.find('div.spinner-widget').removeClass('animate-in').addClass('animate-out');
    // This is waiting to finnish the above animation which is defined 300ms.

    setTimeout(() => {
      popupOverlay.find('div.spinner-widget').hide();
      popupOverlay.hide();
    }, 300);
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
 * @description This functoin is added to intially hide the
 * the popupModal on the document. The Reason of adding this
 * function is because of the already written html divs.
 */
PopupWindow.prototype.hideInitial = function() {
  $('body').find('div.popup-overlay-window').hide();
  $('body').find('div.popup-overlay-window').find('div.popup').hide();
};

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
  $('div.popup').find('div.popup-header > h2').text(messageHeader);
  $('div.popup').find('div.popup-body > p').text(messageBody);
  $('div.popup > a.popup-button:nth-of-type(1)')
      .bind('click', function() {
        $('div.popup').removeClass('animate-in').addClass('animate-out');
        setTimeout(() => {
          $('body').find('div.popup-overlay-window').find('div.popup').hide();
          $('body').find('div.popup-overlay-window').hide();
          if ( typeof onPressingClose === 'function' ) {
            onPressingOk();
          }
        }, 300);
      });
  $('div.popup > a.popup-button:nth-of-type(2)')
      .bind('click', function() {
        $('div.popup').addClass('animate-out').removeClass('animate-in');
        setTimeout(() => {
          $('body').find('div.popup-overlay-window').find('div.popup').hide();
          $('body').find('div.popup-overlay-window').hide();
          if ( typeof onPressingClose === 'function' ) {
            onPressingClose();
          }
        }, 300);
      });
  $('div.popup-overlay-window').show().css('display', 'flex');
  $('div.popup-overlay-window').find('div.popup').show();
  $('div.popup').addClass('animate-in').removeClass('animate-out');
};
/**
 * @desc This is the function where an ajax call is made to the server
 * to process the form values.
 * @param {HTMLFormElement} formElement - This is the form element
 * of whose values will be sent to the server.
 */
function sendFormDataToProcess(formElement) {
  const registrationFormData = new FormData(formElement);
  spinnerService.toggleSpinner();
  $.ajax({
    method: 'post',
    url: 'php/saveFormData.php',
    async: true,
    data: JSON.stringify(registrationFormData),
    success: function(responseData) {
      spinnerService.toggleSpinner();
      const jsonResponseData = JSON.parse(responseData);
      popupService.showPopup(
          'Registration Successfull',
          'Thank you for signing up we\'ve got all of your details stored.',
          () => console.log('Pressed OK'),
          () => console.log('Pressed Close')
      );
      console.log(jsonResponseData);
    },
    error: function(errorReason) {
      spinnerService.toggleSpinner();
      popupService.showPopup(
          'Registration Unsuccessfull'+
          ', We could not sign you up because'+
          'the server sent some errorneous response.' +
        errorReason,
          () => console.log('Pressed OK'),
          () => console.log('Pressed Close')
      );
    },
  });
}

/**
 * This function validates it self with the value
 * as soon as the the input element loses its focus.
 * @param {FocusEvent} event - This focus event generated by HTMLInputEelements.
 */
function validationFeedbackOfInputOnFocusOut(event) {
  const isValidElement = isValid( event.target );
  if ( !isValidElement ) {
    $(event.target).addClass( 'invalid' );
    $(event.target).parent('div.input-group').find('.error-icon').css('display', 'block');
  }
}

/**
 * This funciton also validates its own selection as soon as
 * loses its focus.
 * @param {FocusEvent} event - This is the event generated
 *  by HTMLSelectElements.
 */
function validationFeedbackOfSelectOnFocusOut( event ) {
  if ( event.target.selectedIndex === 0 && event.target.required ) {
    $(event.target)
        .addClass('invalid')
        .parent('div.input-group')
        .find('.error-icon').css('display', 'block');
  }
}

/**
 * This function handles the selection in the country select element and
 * loads new states values inside the state select element.
 * @param {SelectEvent} event - The select event
 * generated by the HTMLSelectElement.
 */
function onSelectCountryPopulateState(event) {
  const siblingInputGroup = event.target.parentElement.nextElementSibling;
  const stateSelectinput = $(siblingInputGroup).find('select.form-control');
  const selectedCountryString = event.target.value;
  let stateList = [];
  getStateList( selectedCountryString )
      .then(function(states) {
        stateList = [...states];
        stateList.unshift(' Select State' );
        stateSelectinput.find('option').remove();
        stateList.forEach(function(stateString, index) {
          stateSelectinput.attr('disabled', false);
          const optionElement = $('<option></option>');
          optionElement.attr('value', stateString);
          optionElement.text(stateString);
          if ( index === 0 ) {
            optionElement.attr('selected', true);
          }
          stateSelectinput.append(optionElement);
        });
      }).catch(function(errorReason) {
        toastService.show('There\'s some problem fetching the list of state');
      });
}
/**
 * This is a helper function providing the list of states by an
 * ajax call.
 * @param {String} countryName - The name of the country for
 * which state lists need to be fetched.
 * @return {Promise} - Returns a promise of the ajax request.
 */
function getStateList( countryName ) {
  const myPromise = new Promise( function(resolve, reject) {
    $.getJSON('/js/country_state_json/gistfile1.json', function(jsonData) {
      jsonData.countries.forEach(function(countryObj) {
        if (countryObj.country === countryName) {
          resolve(countryObj.states);
        }
      });
    });
  });
  return myPromise;
}

/**
 * @desc The function does add all the list of country into the country
 * select dyanimcally. This saves a huge lines in html without hardcoding.
 * @param {HMLTSelectElement} countrySelectElemnet - The country
 * select element which is loaded with a huge list of countries.
 */
function populateCountrySelectWithValues(countrySelectElemnet) {
  $.getJSON('/js/country_state_json/gistfile1.json', function(responseJson) {
    responseJson.countries.forEach(function(countryObj) {
      $(countrySelectElemnet)
          .append(
              $('<option></option>')
                  .attr('value', countryObj.country)
                  .text(countryObj.country)
          );
    });
  });
}
/**
 * This function validates the password on focus out.
 * @param {FocusEvent} event - This is Focus event
 * generated by password elements.
 */
function validationFeedbackOfPasswordOnFocusOut( event ) {
  if (!validatePassword(event.target)) {
    const errorIcon = $(event.target).parent('div.input-group').find('.error-icon');
    $(event.target).addClass('invalid');

    if ($(event.target).val() !== '') {
      errorIcon.css({
        'display': 'block',
        'right': '55px',
      });
    } else {
      errorIcon.css({
        'display': 'block',
        'right': '10px',
      });
    }
  }
}

/**
 * This function validates password confirmation input.
 * @param {FocusEvent} event - This event is generated by the
 * passwordConfimration input.
 */
function validationFeedbackOfPasswordConfirmationOnFocusOut(event) {
  if (!isPasswordMatched( event.target )) {
    const errorIcon = $(event.target).parent('div.input-group').find('.error-icon');
    $(event.target).addClass('invalid');
    if ( event.target.value !== '' ) {
      errorIcon.css({
        'display': 'block',
        'right': '55px',
      });
    } else {
      errorIcon.css({
        'display': 'block',
        'right': '10px',
      });
    }
  }
}
/**
 * This function validates the password field by
 * matching the value with the regular expression.
 * @param {HTMLInputElement} passwordElement - The password which is validated.
 * @return {Boolean} - it retuns a true if matched else false otherwise.
 */
function validatePassword(passwordElement) {
  const enteredValue = $(passwordElement).val();
  const specialCharacterRegExp = /[^a-zA-Z0-9\s]/;
  const alphaNumericTestRegExp = /[a-zA-Z0-9]/;

  return specialCharacterRegExp.test(enteredValue)
      && alphaNumericTestRegExp.test(enteredValue)
      && enteredValue.length >= 8;
}
