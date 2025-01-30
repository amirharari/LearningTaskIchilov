/**
 * jspsych-survey-context
 * author(s): sam zorowitz
 *
 * a jspsych plugin for querying current context
 */

jsPsych.plugins['survey-context'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-context',
    description: '',
    parameters: {
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      },
    }
  }
  plugin.trial = function(display_element, trial) {

    //---------------------------------------//
    // Define HTML.
    //---------------------------------------//

    // Initialize HTML
    var html = '';

    // Inject CSS
    html += `<style>
    .survey-context-instructions {
      width: 900px;
      margin: auto;
      text-align: center;
      font-size: 18px;
      line-height: 1.15em;
      padding-top: 12px;
    }
    .survey-context-container {
      display: grid;
      grid-template-columns: 50% 50%;
      grid-row-gap: 3px;
      width: 900px;
      margin: auto;
      border-radius: 12px;
    }
    .survey-context-item {
      display: flex;
      flex-direction: row;
      line-height: 1.5em;
      padding-top: 4px;
      padding-bottom: 4px;
      background-color: #F8F8F8;
      align-items: center;
    }
    .survey-context-item[type='prompt'] p {
      text-align: left;
      font-size: 16px;
      padding-left: 16px;
    }
    .survey-context-item[type='response'] {
      justify-content: space-evenly;
    }
    .radiogroup {
      width: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .radiogroup label {
      font-size: 15px;
      display: block;
      margin-bottom: 4px;
    }
    .radiogroup input[type="radio"] {
      position: relative;
      height: 16px;
      width: 16px;
      margin: auto;
    }
    .radiogroup input[type="radio"]:before {
      display: block;
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      -webkit-transform : translateY(-50%);
      width: 45px;
      height: 2px;
      background: #d8dcd6;
      content: '';
    }
    .radiogroup:last-child input[type="radio"]:before {
      display: none;
    }
    .checkboxgroup {
      width: 20px;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: center;
      white-space: nowrap;
    }
    .checkboxgroup label {
      font-size: 16px;
      display: block;
      margin-left: 42px;
    }
    .checkboxgroup input[type="checkbox"] {
      position: relative;
      height: 14px;
      width: 14px;
      margin: auto;
      margin-right: 8px;
    }
    .checkboxgroup input[type=text]  {
      width: 300px;
      height: 16px;
      padding: 3px 3px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-left: 8px;
    }
    .survey-context-footer {
      margin: auto;
      width: 900px;
      padding: 0 0 0 0;
      text-align: right;
    }
    .survey-context-footer input[type=submit] {
      background-color: #F0F0F0;
      padding: 8px 20px;
      border: none;
      border-radius: 4px;
      margin-top: 5px;
      margin-bottom: 20px;
      margin-right: 0px;
      font-size: 1.15vw;
      color: black;
    }
    </style>`;

    // initialize HTML
    html += '<form id="jspsych-survey-context">';

    // add preamble
    html += '<div class=survey-context-instructions>';
    html += '<p>Please answer the questions below. <font color="#c87606">Your answers will not affect your payment or bonus.</font></p>'
    html += '</div>';

    // initialize survey container
    html += '<div class="survey-context-container">';

    // add prompt
    html += '<div class="survey-context-item" type="prompt">';
    html += '<p>How alert and focused are you right now?</p>';
    html += '</div>';

    // iteratively add response options
    html += '<div class="survey-context-item" type="response">';
    ['Not at all', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', 'Very much'].forEach((k, v) => {
      html += '<div class="radiogroup">';
      html += '<label for="focus">' + k + '</label>';
      html += '<input type="radio" name="focus" value="' + v + '" required>';
      html += '</div>';
    });
    html += '</div>';

    // add prompt
    html += '<div class="survey-context-item" type="prompt">';
    html += '<p>How noisy or distracting is your environment right now?</p>';
    html += '</div>';

    // iteratively add response options
    html += '<div class="survey-context-item" type="response">';
    ['Not at all', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', 'Very much'].forEach((k, v) => {
      html += '<div class="radiogroup">';
      html += '<label for="distraction">' + k + '</label>';
      html += '<input type="radio" name="distraction" value="' + v + '" required>';
      html += '</div>';
    });
    html += '</div>';

    // add prompt
    html += '<div class="survey-context-item" type="prompt">';
    html += '<p>How is your mood right now?</p>';
    html += '</div>';

    // iteratively add response options
    html += '<div class="survey-context-item" type="response">';
    ['Very bad', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', 'Very good'].forEach((k, v) => {
      html += '<div class="radiogroup">';
      html += '<label for="mood">' + k + '</label>';
      html += '<input type="radio" name="mood" value="' + v + '" required>';
      html += '</div>';
    });
    html += '</div>';

    // add prompt
    html += '<div class="survey-context-item" type="prompt">';
    html += '<p>How would you rate the quality of your sleep last night?</p>';
    html += '</div>';

    // iteratively add response options
    html += '<div class="survey-context-item" type="response">';
    ['Very bad', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', 'Very good'].forEach((k, v) => {
      html += '<div class="radiogroup">';
      html += '<label for="sleep">' + k + '</label>';
      html += '<input type="radio" name="sleep" value="' + v + '" required>';
      html += '</div>';
    });
    html += '</div>';

    // add prompt
    html += '<div class="survey-context-item" type="prompt" style="align-items: start;">';
    html += '<p>For what reasons do you complete studies on Prolific?<br><small>(Check all that apply)</small></p>';
    html += '</div>';

    // add response options
    html += '<div class="survey-context-item" type="response" style="justify-content: start;">';
    html += '<div class="checkboxgroup">';
    html += '<label><input type="checkbox" name="money" value="money">To earn money</label>';
    html += '<label><input type="checkbox" name="science" value="science">To help science</label>';
    html += '<label><input type="checkbox" name="fun" value="fun">To have fun</label>';
    html += '<label><input type="checkbox" name="other" value="other">Other <input type="text" name="other-free-response" maxlength="300" size="10"></label></label>';
    html += '</div>';
    html += '</div>';

    // Close survey-context-container.
    html += '</div>';

    // Add submit button.
    html += '<div class="survey-context-footer">';
    html += `<input type="submit" id="jspsych-survey-context-next" class="jspsych-btn jspsych-survey-context" value="${trial.button_label}"></input>`;
    html += '</div>';

    // End survey.
    html += '</form>';

    // Display HTML
    display_element.innerHTML = html;

    //---------------------------------------//
    // Define functions.
    //---------------------------------------//

    // Scroll to top of screen.
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }

    display_element.querySelector('#jspsych-survey-context').addEventListener('submit', function(event) {

        // Wait for response
        event.preventDefault();

        // verify that at least one box has been checked for the race question
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');

          // Measure response time
          var endTime = performance.now();
          var response_time = endTime - startTime;

          var question_data = serializeArray(this);
          question_data = objectifyForm(question_data);

          // Store data
          var trialdata = {
            "rt": response_time,
            "responses": question_data
          };

          // Update screen
          display_element.innerHTML = '';

          // Move onto next trial
          jsPsych.finishTrial(trialdata);

    });

    var startTime = performance.now();

  };

  /*!
   * Serialize all form data into an array
   * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
   * @param  {Node}   form The form to serialize
   * @return {String}      The serialized form data
   */
  var serializeArray = function (form) {
    // Setup our serialized data
    var serialized = [];

    // Loop through each field in the form
    for (var i = 0; i < form.elements.length; i++) {
      var field = form.elements[i];

      // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
      if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

      // If a multi-select, get all selections
      if (field.type === 'select-multiple') {
        for (var n = 0; n < field.options.length; n++) {
          if (!field.options[n].selected) continue;
          serialized.push({
            name: field.name,
            value: field.options[n].value
          });
        }
      }

      // Convert field data to a query string
      else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
        serialized.push({
          name: field.name,
          value: field.value
        });
      }
    }

    return serialized;
  };

  // from https://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
  function objectifyForm(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
  }

  return plugin;

})();
