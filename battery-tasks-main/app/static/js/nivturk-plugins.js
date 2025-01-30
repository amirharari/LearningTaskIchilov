// Pass message from jsPsych to NivTurk
function pass_message(experiment, msg) {

  $.ajax({
    url: "/experiment?experiment=" + experiment,
    method: 'POST',
    data: JSON.stringify(msg),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    // do nothing on success
  }).fail(function(error) {
    console.log(error);
  });

}

// Successful completion of experiment: redirect to experiment page.
function on_success(experiment) {

  $.ajax({
    url: "/on_success?experiment=" + experiment,
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace('/main');
  }).fail(function(error) {
    console.log(error);
  });

}

// Successful completion of all experiments.
function redirect_success() {
  window.location.replace('/redirect_success');
}

// Unsuccessful completion of experiment: redirect with decoy code.
function redirect_reject(error) {

  // Concatenate metadata into complete URL (returned on reject).
  var url = "/error/" + error;

  $.ajax({
    url: "/redirect_reject",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });
}

// Unsuccessful completion of experiment: redirect to error page.
function redirect_error(error) {

  // error is the error number to redirect to.
  var url = "/error/" + error;

  $.ajax({
    url: "/redirect_error",
    method: 'POST',
    data: JSON.stringify(jsPsych.data.get().json()),
    contentType: "application/json; charset=utf-8",
  }).done(function(data, textStatus, jqXHR) {
    window.location.replace(url);
  }).fail(function(error) {
    console.log(error);
  });
}
