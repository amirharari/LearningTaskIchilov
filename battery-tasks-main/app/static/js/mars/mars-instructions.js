//---------------------------------------//
// Define parameters.
//---------------------------------------//

// Define image scaling CSS.
const style = "width:auto; height:auto; max-width:100%; max-height:200px;";

//---------------------------------------//
// Define instructions screens.
//---------------------------------------//

var instructions_01 = {
  type: 'instructions',
  pages: [
    `<p>In this task, you will be shown a 3x3 grid of patterns. The last one, in the bottom right-hand corner, <b>will be missing:</b></p><img src="../../static/img/mars/p1_M1.png" style="${style}"</img><p>You will need to select <b>which of the four possible patterns</b> along the bottom <b>fits into the gap</b>:</p><img src="../../static/img/mars/p1_T1.png" style="${style}"</img>`,
    '<p>The task contains a mix of easy, medium, and hard puzzles.</p><p>You will have <b>30 seconds</b> to complete each puzzle.</p><p>Try to be as accurate as you can be.</p><p>If you cannot solve the puzzle before time runs out, then you should guess.</p>',
    '<p>Now, we will practice on three puzzles.</p><p>Press the "next" button to get started.</p>'
  ],
  show_clickable_nav: true,
  button_label_previous: 'Prev',
  button_label_next: 'Next'
}

var instructions_02 = {
  type: 'instructions',
  pages: [
    '<p>Great job! Now you understand what to do.</p>',
    '<p>Now, we will move onto the real puzzles.</p><p>There are 12 puzzles in total. You will have <b>30 seconds</b> to complete each one.<br>For these puzzles, you will <u>not</u> receive feedback after you make your choice.</p><p>At the end of the study, your total number of correct answers will be factored<br>into your <b>performance bonus</b>. So try your hardest to solve the puzzles!</p><p>If you cannot solve the puzzle before time runs out, then you should guess.</p><p>Press the "next" button to get started.</p>'
  ],
  show_clickable_nav: true,
  button_label_previous: 'Prev',
  button_label_next: 'Next',
  on_finish: function(data) {
    pass_message('mars', 'starting task');
  }
}

//---------------------------------------//
// Define practice block.
//---------------------------------------//

// Preallocate space.
const practice_block = [];
var images_practice = [
  '../../static/img/mars/p1_M1.png',
  '../../static/img/mars/p1_T1.png'
];

// Iteratively add trials.
[5,2,8].forEach(i => {

  // Define images.
  const puzzle = `../../static/img/mars/mars_${i}_M_ss1.jpeg`;
  const choices = [
    `../../static/img/mars/mars_${i}_T1_ss1_pd.jpeg`,
    `../../static/img/mars/mars_${i}_T2_ss1_pd.jpeg`,
    `../../static/img/mars/mars_${i}_T3_ss1_pd.jpeg`,
    `../../static/img/mars/mars_${i}_T4_ss1_pd.jpeg`,
  ];

  // Append to preload cache.
  images_practice = images_practice.concat(puzzle);
  images_practice = images_practice.concat(choices);

  // Define trial.
  const practice_trial = {
    type: 'mars',
    item: i,
    shape_set: 1,
    distractor: 'pd',
    correct: 0,
    countdown: true,
    feedback: true,
    incorrect_feedback: '<p style="font-size: 18px">Not quite! Look carefully - can you spot a pattern?</p>',
    trial_duration: trial_duration,
    randomize_choice_order: true,
    img_path: '../../static/img/mars',
    data: {item_set: 'practice'}
  }

  // Define looping node.
  const practice_trial_node = {
    timeline: [practice_trial],
    loop_function: function(data) {
      if ( data.values()[0].accuracy == 1 ){
        return false;
      } else {
        return true;
      }
    }
  }

  // Push trial.
  practice_block.push(practice_trial_node);

});

//---------------------------------------//
// Define instructions timeline.
//---------------------------------------//

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

// Define instructions timeline.
var INSTRUCTIONS = [];
INSTRUCTIONS = INSTRUCTIONS.concat(screen_check);
INSTRUCTIONS = INSTRUCTIONS.concat(instructions_01);
INSTRUCTIONS = INSTRUCTIONS.concat(practice_block);
INSTRUCTIONS = INSTRUCTIONS.concat(instructions_02);
