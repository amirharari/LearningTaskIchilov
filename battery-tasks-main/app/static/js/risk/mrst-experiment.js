//---------------------------------------//
// Define parameters.
//---------------------------------------//

// Define bandit parameters.
const probs = [0.20, 0.40, 0.60, 0.80];

// Define response parameters.
const valid_responses = ['arrowleft', 'arrowright'];

// Define trial timings.
const choice_duration = 6000;
const feedback_duration = 450;
const outcome_duration = 1300;

// Define screen size parameters.
var min_width = 480;
var min_height = 295;

//---------------------------------------//
// Define stimuli.
//---------------------------------------//

// Define stimuli.
var stimuli = jsPsych.randomization.shuffle([
  jsPsych.randomization.shuffle([
    '../../static/img/risk/animals/bird-crane-shape.svg',
    '../../static/img/risk/animals/deer-silhouette.svg',
    '../../static/img/risk/animals/gecko-reptile-shape.svg',
    '../../static/img/risk/animals/seahorse-silhouette.svg',
  ]),
  jsPsych.randomization.shuffle([
    '../../static/img/risk/animals/snail-shape.svg',
    '../../static/img/risk/animals/kangaroo-shape.svg',
    '../../static/img/risk/animals/frog-shape.svg',
    '../../static/img/risk/animals/parrot-shape.svg'
  ]),
  jsPsych.randomization.shuffle([
    '../../static/img/risk/animals/bear-black-shape.svg',
    '../../static/img/risk/animals/bird-shape.svg',
    '../../static/img/risk/animals/crocodile-shape.svg',
    '../../static/img/risk/animals/monkey.svg'
  ]),
  jsPsych.randomization.shuffle([
    '../../static/img/risk/animals/squirrel-shape.svg',
    '../../static/img/risk/animals/bull-silhouette.svg',
    '../../static/img/risk/animals/dolphin-mammal-animal-silhouette.svg',
    '../../static/img/risk/animals/swift-bird-shape.svg'
  ])
])
stimuli = [].concat.apply([], stimuli);
stimuli = stimuli.concat([
  '../../static/img/risk/instructions.png',
  '../../static/img/risk/animals/rabbit-shape.svg',
  '../../static/img/risk/animals/horse-black-shape.svg',
]);

// Define colors.
var order = jsPsych.randomization.sampleWithoutReplacement([
  [0,2,1,3], [0,2,3,1], [2,0,1,3], [2,0,3,1],
  [1,3,0,2], [1,3,2,0], [3,1,0,2], [3,1,2,0]
], 1)[0];

var colors = [];
order.forEach((i) => {
  if (i==0) {
    colors = colors.concat(jsPsych.randomization.shuffle(['#387da2','#993333','#b19e3c','#6e6e6e']));
  } else if (i==1) {
    colors = colors.concat(jsPsych.randomization.shuffle(['#245169','#732626','#8b7c2f','#5c5c5c']));
  } else if (i==2) {
    colors = colors.concat(jsPsych.randomization.shuffle(['#538348','#bc6d2f','#6a4173','#56391c']));
  } else {
    colors = colors.concat(jsPsych.randomization.shuffle(['#3e6236','#a15417','#4c2f52','#4e3419']));
  }
})

//---------------------------------------//
// Define trials.
//---------------------------------------//

// Preallocate space.
var MRST = [];

// Iteratively construct trials.
var exposure = Array(16).fill(0);
var trial_no = 0;

// Iterate over (pseudo) blocks.
for (let i = 0; i < 4; i++) {

  // Define bandits
  var bandits = [...Array(4).keys()].map(j => i * 4 + j);

  // Iterate over trials.
  for (let j = 0; j < 15; j++) {

    // Randomize bandit orders.
    bandits = jsPsych.randomization.shuffle(bandits);

    // Iterate over bandits
    bandits.forEach((k) => {

      // RNG elements
      const points = Math.random() < probs[k % 4] ? 10 : 0;

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

      // Define trial
      var trial = {
        type: 'mrst-trial',
        stimulus: stimuli[k],
        color: colors[k],
        points: points,
        randomize: true,
        valid_responses: valid_responses,
        choice_duration: choice_duration,
        feedback_duration: feedback_duration,
        outcome_duration: outcome_duration,
        data: {
          phase: 'experiment',
          block: Math.floor(i / 2) + 1,
          trial: trial_no + 1,
          exposure: exposure[k]+1,
          bandit: k + 1,
          probability: probs[k % 4],
        },
        on_finish: function(data) {

          // Store number of browser interactions
          data.browser_interactions = jsPsych.data.getInteractionData().filter({trial: data.trial_index}).count();

          // Evaluate missing data
          if ( data.choice == null ) {

            // Set missing data to true.
            data.missing = true;

          } else {

            // Set missing data to false.
            data.missing = false;

          }

        }

      }

      // Define looping node.
      const trial_node = {
        timeline: [screen_check, trial],
        loop_function: function(data) {
          return data.values()[0].missing;
        }
      }

      // Append trial.
      MRST.push(trial_node);

      // Increment counters
      trial_no++;
      exposure[k]++;

    })

  }

}

//------------------------------------//
// Define transition screens.
//------------------------------------//

// Define ready screen.
var READY_01 = {
  type: 'mrst-instructions',
  pages: [
    {
      prompt: "<p>Great job! We will now begin the real game.</p><p>The game will be broken into two parts.</p>",
    },
    {
      prompt: "<p>You will be able to take a break between each part of the game.</p><p>However, please give your undivided attention during the game.</p>",
    },
    {
      prompt: "<p style='line-height: 1.7em;'><b>Remember</b>: To win the most points, choose the animal card if you<br>think it has a greater chance of giving you 10 points than 0 points.<br>Otherwise choose the face-up card.</p>"
    },
    {
      prompt: "<p>Get ready to begin <b>Block 1/2</b>. It will take 6-7 minutes.</p><p>Press next when you're ready to start.</p>",
    }
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
  on_finish: function(trial) {
    pass_message('risk', 'block 1')
  }
}

var READY_02 = {
  type: 'mrst-instructions',
  pages: [
    {
      prompt: "<p>Take a break for a few moments and press any button</p><p>when you are ready to continue.</p>",
    },
    {
      prompt: "<p>Get ready to begin <b>Block 2/2</b>. It will take 6-7 minutes.</p><p>Press next when you're ready to start.</p>",
    }
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
  on_finish: function(trial) {
    pass_message('risk', 'block 2')
  }
}

var FINISHED = {
  type: 'mrst-instructions',
  pages: [
    {
      prompt: "<p>Great job! You've finished the task.</p><p>Press the Next button to continue.</p>"
    }
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next"
}
