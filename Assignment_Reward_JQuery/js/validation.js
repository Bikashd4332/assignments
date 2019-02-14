// Making all the services ready that don't depend on the DOM.
const toastService = new ToastMaker(3000);
const spinnerService = new Spinner();
const popupService = new PopupWindow();

$(document).ready(function() {
  spinnerService.hideInitial();
  popupService.hideInitial();
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
  const parentPasswordShowHide = event.target.parentElement;
  const showPasswordIcon = $(event.target).parent('div.password-show-hide').find('a.password-show');
  const hidePasswordIcon = $(event.target).parent('div.password-show-hide').find('a.password-hide');

  if ($(event.target).attr('type') === 'password') {
    showPasswordIcon.css('display', 'block');
    hidePasswordIcon.css('display', 'none');
    if ($(event.target).val() === '') {
      showPasswordIcon.css('display', 'none');
      hidePasswordIcon.css('display', 'none');
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

  if (event.target === passwordShow.get(0)){
    $(passwordShow)
        .css('display', 'none');
    $(passwordHide)
        .css('display', 'block');
    $(event.target)
        .parent('div.input-group')
        .find('input.form-control')
        .attr('type', 'text');
  } else {
    $(passwordShow)
        .css('display', 'block');
    $(passwordHide)
        .css('display', 'none');
    $(event.target)
        .parent('div.input-group')
        .find('input.form-control')
        .attr('type', 'password');
  }
}

/**
 * @desc This enables the apperance of validation messages
 * which convey the reason of invalid to the user.
 * @param {FocusEvent} event - the focus event associated with the element.
 */
function showErrorOnFocus(event) {
  $(event.target)
      .parent('div.input-group')
      .find('div.error-msg > p.empty-msg')
      .css('display', 'none');
  $(event.target)
      .parent('div.input-group')
      .find('div.error-msg > p.invalid-msg')
      .css('display', 'none');

  if ($(event.target).hasClass('invalid')) {
    if ($(event.target).prop('validity').valueMissing) {
      $(event.target)
          .parent('div.input-group')
          .find('div.error-msg')
          .css({
            top: '-30px',
            opacity: '1',
          })
          .find('p.empty-msg')
          .css('display', 'block');
        } else {
          $(event.target)
              .parent('div.input-group')
              .find('div.error-msg')
              .css({
                top: '-30px',
                opacity: '1',
              })
              .find('p.invalid-msg')
              .css('display', 'block');
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
  if ($(event.target).hasClass('invalid')) {
      $(event.target).parent('div.input-group').find('div.error-msg').css({
        top: '0px',
        opacity: '0'
      });
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

/**
 * @desc The function makes required select element valid on
 * user select if the select was previously invalid.
 * No effect if previously valid.
 * @param {SelectEvent} event - The select event fired from any select element.
 */
function removeInvalidIfValidOnSelect(event) {
  if ($(event.target).prop('selectedIndex') != 0) {
    $(event.target).removeClass('invalid');
    $(event.target).parent("div.input-group").find('i.error-icon').css('display', 'none');
  }
}

/**
 * @desc This the function decides if each of the element's state
 * is valid and if it is then prepares to send this to
 * the server by an Ajax call.
 * @return {Boolean}
 */
function validation() {
  const passwordElements = document.querySelectorAll(
      '.password-show-hide > input'
  );

  let isAllValid = true;

  if ($('.invalid').length != 0) {
    toastService.show('The form still has invalid values.');
  }

  $('body').find('div.input-group > input.form-control')
      .each(function(index, formElement) {
        const isValidElement = isValid(formElement);
        if (!isValidElement) {
          $(formElement).addClass('invalid');
          $(formElement)
              .parent('div.input-group')
              .find('i.error-icon')
              .css('display', 'block');
          isAllValid = false;
        }
      });

  $('body').find('div.input-group  select.form-control')
      .each(function(index, selectElement) {
        if ($(selectElement).prop('selectedIndex') === 0 && $(selectElement).prop('required')) {
          $(selectElement).addClass('invlaid');
          $(selectElement)
              .parent('div.input-group')
              .find('i.error-icon')
              .css('display', 'block');
          isAllValid = false;
        }
      });

  $('body').find('div.input-group div.captcha-group > input.form-control')
      .each( function( index, captchaElement ) {
        if ( !isCaptchaCorrect( captchaElement )) {
          isAllValid = false;
          refreshCaptchaWithNewRandomValues( captchaElement );
        }
      });

  if ( !isPasswordMatched( passwordElements ) ) {
    $(passwordElements[1])
        .parent('div.input-group')
        .find('i.error-icon')
        .css({
          'right': '55px',
          'display': 'block',
        });
    $(passwordElements[1]).addClass('invalid');
    isAllValid = false;
  }

  if (isAllValid) {
    sendFormDataToProcess($('body').find('form').get(0));
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
  return $(passwordElements[0]).val() === $(passwordElements[1]).val();
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
  const numString = $(captchaElement)
      .parent('div.captcha-group')
      .find('div.captcha-image > img')
      .attr('src')
      .split('=')[1];
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
  $(captchaElement)
      .parent('div.captcha-group')
      .find('div.captcha-image > img')
      .attr('src',
          captchaURL +
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
    $('body').find('div.popup-overlay-spinner').show();
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
      .on('click', function() {
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
      .on('click', function() {
        $('div.popup').addClass('animate-out').removeClass('animate-in');
        setTimeout(() => {
          $('body').find('div.popup-overlay-window').find('div.popup').hide();
          $('body').find('div.popup-overlay-window').hide();
          if ( typeof onPressingClose === 'function' ) {
            onPressingClose();
          }
        }, 300);
      });
  $('div.popup-overlay-window').show();
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
          'Thanks for signing up, your' +
          ' details have been successfully stored.',
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
