//---------------------------------------//
// Define experiment parameters.
//---------------------------------------//

// Define screen size parameters.
var min_width = 300;
var min_height = 400;

//---------------------------------------//
// Define experiment timeline.
//---------------------------------------//

// Preallocate space.
var HORIZONS = [];

// Iteratively generate trials.
for (let i=0; i < runsheet.length; i++){

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

  // Define trial.
  const trial = {
    type: 'horizons-trial',
    horizon: runsheet[i].horizon,
    rewards_L: runsheet[i].rewards_L,
    rewards_R: runsheet[i].rewards_R,
    forced_choices: runsheet[i].forced_choices,
    data: runsheet[i].data,
    on_finish: function(data) {

      // Store number of browser interactions
      data.browser_interactions = jsPsych.data.getInteractionData().filter({trial: data.trial_index}).count();

    }
  }

  // Define looping node.
  const trial_node = {
    timeline: [screen_check, trial],
  }

  // Append trial.
  HORIZONS.push(trial_node);

}
