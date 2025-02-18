//---------------------------------------//
// Define parameters.
//---------------------------------------//

// Define short form.
const short_form = test_form_3;

// Define timing parameters.
const trial_duration = 30000;     // 30 seconds

// Define quality assurance parameters.
const rg_threshold = 3000;        // 3 seconds

// Define screen size parameters.
var min_width = 600;
var min_height = 600;

//---------------------------------------//
// Define images for preloading.
//---------------------------------------//

var images_task = [];
for (let i = 0; i < short_form.length; i++) {
  images_task.push('../../static/img/mars/mars_' + short_form[i].item + '_M_ss' + short_form[i].shape_set + '.jpeg');
  images_task.push('../../static/img/mars/mars_' + short_form[i].item + '_T1_ss' + short_form[i].shape_set + '_' + short_form[i].distractor + '.jpeg');
  images_task.push('../../static/img/mars/mars_' + short_form[i].item + '_T2_ss' + short_form[i].shape_set + '_' + short_form[i].distractor + '.jpeg');
  images_task.push('../../static/img/mars/mars_' + short_form[i].item + '_T3_ss' + short_form[i].shape_set + '_' + short_form[i].distractor + '.jpeg');
  images_task.push('../../static/img/mars/mars_' + short_form[i].item + '_T4_ss' + short_form[i].shape_set + '_' + short_form[i].distractor + '.jpeg');
};

//---------------------------------------//
// Define MARS task.
//---------------------------------------//

// Preallocate space.
var MARS = [];

// Define image constants.
const img_path = `../../static/img/mars/`;

// Iteratively construct trials.
for (let i = 0; i < short_form.length; i++) {

  // Define screen check.
  const screen_check = {
    timeline: [{
      type: 'screen-check',
      min_width: min_width,
      min_height: min_height
    }],
    conditional_function: function() {
      if (window.innerWidth >= min_width && window.innerHeight >= min_height) {
        return false;
      } else {
        return true;
      }
    }
  }

  // Define fixation.
  const fixation = {
    type: 'html-keyboard-response',
    stimulus: '',
    choices: jsPsych.NO_KEYS,
    trial_duration: 1200,
    on_start: function(trial) {
      const k = jsPsych.data.get().filter({trial_type: 'mars', item_set: 3}).count();
      trial.stimulus = `<div style="font-size:24px;">Loading puzzle:<br>${k+1} / 12</div>`;
    }
  }

  // Define trial.
  const trial = {
    type: 'mars',
    item: short_form[i].item,
    shape_set: short_form[i].shape_set,
    distractor: short_form[i].distractor,
    correct: 0,
    countdown: true,
    feedback: false,
    trial_duration: trial_duration,
    randomize_choice_order: true,
    img_path: img_path,
    data: {item_set: 3, short_form: short_form[i].form},
    on_finish: function(data) {

      // Store number of browser interactions
      data.browser_interactions = jsPsych.data.getInteractionData().filter({trial: data.trial_index}).count();

    }

  }

  // Define trial node.
  const trial_node = {
    timeline: [screen_check, fixation, trial]
  }

  // Push trial.
  MARS.push(trial_node);

}

//---------------------------------------//
// Define transition screens.
//---------------------------------------//

var FINISHED = {
  type: 'instructions',
  pages: [
    `<p>Great job! You've finished the task.</p><p>Press "Next" to end this section of the study.</p>`
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
}

//---------------------------------------//
// Define data quality check.
//---------------------------------------//

var QUALITY_CHECK = {
  type: 'call-function',
  func: function() {

    // Count number of correct trials.
    const correct = jsPsych.data.get().filterCustom(function(trial) {
      return (trial.trial_type == 'mars' && trial.item_set == 3 && trial.rt != null && trial.accuracy == 1);
    }).count()

    // Count number of rapid guessing trials.
    const rapid = jsPsych.data.get().filterCustom(function(trial) {
      return (trial.trial_type == 'mars' && trial.item_set == 3 && trial.rt != null && trial.rt < rg_threshold);
    }).count()

    // Count number of missing trials.
    const missing = jsPsych.data.get().filterCustom(function(trial) {
      return (trial.trial_type == 'mars' && trial.item_set == 3 && trial.rt == null);
    }).count()

    // Count number of screen minimized trials.
    const minimized = jsPsych.data.get().filter({trial_type: 'mars', item_set: 3, minimum_resolution: 0}).count();

    // Return summary scores.
    return [correct, rapid, missing, minimized];

  },
  on_finish: function(trial) {

    // Extract data quality scores.
    const scores = jsPsych.data.getLastTrialData().values()[0].value;

    // Check if rejection warranted.
    if (scores[0] <= 2 || scores[1] > 6 || scores[2] > 6 || scores[3] > 6) {
      low_quality = true;
      jsPsych.endExperiment();
    }
  }
}
