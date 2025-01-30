//------------------------------------//
// Define parameters.
//------------------------------------//

// Define comprehension threshold.
var max_errors = 0;

//------------------------------------//
// Define images for preloading.
//------------------------------------//

preload_images = [
  "../../static/img/horizons/instructions02.png",
  "../../static/img/horizons/instructions03.png",
  "../../static/img/horizons/instructions06.png",
  "../../static/img/horizons/instructions07.png",
  "../../static/img/horizons/instructions08.png",
  "../../static/img/horizons/instructions09.png",
];

//------------------------------------//
// Define instructions.
//------------------------------------//

// Define image scaling CSS.
const style = "width:auto; height:auto; max-width:100%; max-height:75vh;";

// Instructions (part 01)
var instructions_01 = {
  type: 'instructions',
  pages: [],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
  on_start: function(trial) {

    // Check if previous comprehension check.
    if (jsPsych.data.get().filter({trial_type: 'horizons-comprehension'}).count() == 0) {

      trial.pages = [
        "<p>We are now beginning the <b>Slot Machines</b> game.</p><p>Use the buttons below, or your keyboard's arrow keys, to navigate the instructions.</p>",
        `<img src='../../static/img/horizons/instructions02.png' style="${style}"></img>`,
        `<img src='../../static/img/horizons/instructions03.png' style="${style}"></img>`,
        "<p>During a game, each slot machine will pay out a different number of points on<br>average. In particular, <b>one of the machines will always pay more on<br>average</b> and will be the better option to choose in a game.</p>",
        "<p>However, it may be difficult to tell which is the better machine during a game.</p><p>This is because, when played, a machine will give points with some spread around its average.</p>",
        "<p>Your goal is to <b>figure out the average worth</b> of each machine, so you can<br>choose the better machine and earn as many points as possible.</p>",
        `<img src='../../static/img/horizons/instructions07.png' style="${style}"></img>`,
        `<img src='../../static/img/horizons/instructions08.png' style="${style}"></img>`,
        `<img src='../../static/img/horizons/instructions09.png' style="${style}"></img>`,
        "<p>To get a sense of what this will be like, let's try two practice games.</p><p>On the next screen, use the <b>left/right arrow keys</b> to choose machines.</p><p>For the first 4 turns, choose the machines the green square tells you to.<br>After that, you can choose freely.</p>"
      ];

    } else {

      trial.pages = [
        `<img src='../../static/img/horizons/instructions02.png' style="${style}"></img>`,
        `<img src='../../static/img/horizons/instructions03.png' style="${style}"></img>`,
        "<p>During a game, each slot machine will pay out a different number of points on<br>average. In particular, <b>one of the machines will always pay more on<br>average</b> and will be the better option to choose in a game.</p>",
        "<p>However, it may be difficult to tell which is the better machine during a game.</p><p>This is because, when played, a machine will give points with some spread around its average.</p>",
        "<p>Your goal is to <b>figure out the average worth</b> of each machine, so you can<br>choose the better machine and earn as many points as possible.</p>",
        "<p>At the end of the task, the total number of points you've earned<br>will be factored into your <b>performance bonus.</b></p>",
      ];

    }
  }
}

// Define practice trials
var practice = {
  timeline: [
    {
      type: "horizons-trial",
      horizon: 5,
      rewards_L: [44, 57, 74, 72, 62],
      rewards_R: [31, 33, 24, 39, 29],
      forced_choices: [1, 0, 1, 1],
      data: {phase: "practice"},
    },
    {
      type: "horizons-trial",
      horizon: 10,
      rewards_L: [64, 50, 57, 35, 52, 38, 44, 61, 39, 38],
      rewards_R: [70, 69, 76, 71, 75, 58, 81, 84, 57, 61],
      forced_choices: [0, 0, 1, 1],
      data: {phase: "practice"}
    }
  ],
  conditional_function: function() {
    if (jsPsych.data.get().filter({trial_type: 'horizons-comprehension'}).count() == 0) {
      return true;
    } else {
      return false;
    }
  }
}

// Instructions (part 02)
var instructions_02 = {
  timeline: [{
    type: "instructions",
    pages: [
      "<p>Great job! Now you know the rules of the game.</p>",
      "<p>At the end of the task, the total number of points you've earned<br>will be factored into your <b>performance bonus.</b></p>",
      "<p>Remember, your goal is to figure out the average worth of each machine,<br>so you can choose the better machine and earn as many points as possible.</p>",
      "<p>Next, we will ask you some questions about the task.</p><p>You need to answer all questions correctly to proceed.</p>"
    ],
    show_clickable_nav: true,
    button_label_previous: "Prev",
    button_label_next: "Next"
  }],
  conditional_function: function() {
    if (jsPsych.data.get().filter({trial_type: 'horizons-comprehension'}).count() == 0) {
      return true;
    } else {
      return false;
    }
  }
}


// Comprehension check.
var comprehension = {
  type: 'horizons-comprehension'
}

const instructions_help_node = {
  timeline: [{
    type: 'instructions',
    pages: [
      "<p>You did not answer all of the quiz questions correctly.</p><p>Please review the following instructions carefully.</p>"
    ],
    show_clickable_nav: true,
    button_label_previous: "Prev",
    button_label_next: "Next",
    on_start: function(trial) {
      pass_message('horizons', 'restarting instructions');
    }
  }],
  conditional_function: function() {
    if (jsPsych.data.get().filter({trial_type: 'horizons-comprehension'}).count() > 0) {
      return true;
    } else {
      return false;
    }
  }
}

// Define instructions loop.
var INSTRUCTIONS = {
  timeline: [
    instructions_help_node,
    instructions_01,
    practice,
    instructions_02,
    comprehension
  ],
  loop_function: function(data) {

    // Extract number of errors.
    const num_errors = data.values().slice(-1)[0].num_errors;

    // Check if instructions should repeat.
    if (num_errors > max_errors) {
      return true;
    } else {
      return false;
    }

  }
}

//------------------------------------//
// Define transition screens.
//------------------------------------//

var READY_01 = {
  type: 'instructions',
  pages: [
    "Great job! You've passed the comprehension check.",
    "Get ready to begin <b>Block 1/2</b>. It will take ~6 minutes.<br>Press next when you're ready to start.",
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
  on_finish: function(trial) {
    pass_message('horizons', 'block 1');
  }
}

var READY_02 = {
  type: 'instructions',
  pages: [
    "Take a break for a few moments and press any button when you are ready to continue.",
    "Get ready to begin <b>Block 2/2</b>. It will take ~6 minutes.<br>Press next when you're ready to start.",
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
  on_finish: function(trial) {
    pass_message('horizons', 'block 2');
  }
}

// Define finish screen.
var FINISHED = {
  type: 'instructions',
  pages: [
    "<p>Great job! You've finished the task.</p><p>Press the Next button to continue.</p>"
  ],
  show_clickable_nav: true,
  button_label_previous: "Prev",
  button_label_next: "Next",
}
