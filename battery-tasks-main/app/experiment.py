from flask import (Blueprint, redirect, render_template, request, session, url_for)
from .db import add_data, get_worker
from .io import write_data, write_metadata

## Initialize blueprint.
bp = Blueprint('experiment', __name__)

@bp.route('/main')
def main():
    """Present game select screen to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Previous completion.
    elif 'complete' in session:

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Query database for record of experiment completions.
    stage = get_worker(session['db_path'], session['workerId'])

    ## Case 1: context survey incomplete.
    if not stage:

        ## Present game select page.
        return redirect(url_for('experiment.context'))

    ## Case 2: context survey complete.
    else:

        ## Present game select page.
        return render_template('main.html', stage=(stage-1), workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/context')
def context():
    """Present context survey to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['context'] = 'start'
        write_metadata(session, ['context'], 'a')

        ## Present experiment.
        return render_template('experiments/context.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/dsst')
def dsst():
    """Present digit symbol substitution task to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['dsst'] = 'start'
        write_metadata(session, ['dsst'], 'a')

        ## Present experiment.
        return render_template('experiments/dsst.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/mars')
def mars():
    """Present matrix reasoning task to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['mars'] = 'start'
        write_metadata(session, ['mars'], 'a')

        ## Present experiment.
        return render_template('experiments/mars.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/horizons')
def horizons():
    """Present horizons task to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['horizons'] = 'start'
        write_metadata(session, ['horizons'], 'a')

        ## Present experiment.
        return render_template('experiments/horizons.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/risk')
def risk():
    """Present risk sensitivity task to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['risk'] = 'start'
        write_metadata(session, ['risk'], 'a')

        ## Present experiment.
        return render_template('experiments/risk.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/pit')
def pit():
    """Present valenced go / no-go task to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['pit'] = 'start'
        write_metadata(session, ['pit'], 'a')

        ## Present experiment.
        return render_template('experiments/pit.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiments/two-step')
def two_step():
    """Present risk sensitivity task to participant."""

    ## Error-catching: screen for missing session.
    if not 'workerId' in session:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    else:

        ## Update participant metadata.
        session['two-step'] = 'start'
        write_metadata(session, ['two-step'], 'a')

        ## Present experiment.
        return render_template('experiments/two-step.html',  workerId=session['workerId'], assignmentId=session['assignmentId'], hitId=session['hitId'], code_success=session['code_success'], code_reject=session['code_reject'])

@bp.route('/experiment', methods=['POST'])
def pass_message():
    """Write jsPsych message to metadata."""

    ## Retrieve experiment.
    page = request.args.get('experiment')

    if request.is_json:

        ## Retrieve jsPsych data.
        msg = request.get_json()

        ## Update participant metadata.
        session[page] = msg
        write_metadata(session, [page], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)

@bp.route('/on_success', methods = ['POST'])
def on_success():
    """Save complete jsPsych dataset to disk."""

    ## Retrieve experiment.
    page = request.args.get('experiment')

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsych data to disk.
        session['page'] = page
        write_data(session, JSON, method='success')

        ## Save jsPsych data to database.
        add_data(session['db_path'], (session['workerId'], session['subId'], session['page'], JSON))

    ## Update participant metadata.
    session[page] = 'success'
    write_metadata(session, [page], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The corresponding jsPsych function handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)

@bp.route('/redirect_success')
def redirect_success():
    """Save complete jsPsych dataset to disk."""

    ## Flag experiment as complete.
    session['complete'] = 'success'
    write_metadata(session, ['complete','code_success'], 'a')

    return redirect(url_for('complete.complete'))

@bp.route('/redirect_reject', methods = ['POST'])
def redirect_reject():
    """Save rejected jsPsych dataset to disk."""

    ## Retrieve experiment.
    session['page'] = request.args.get('experiment')

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsych data to disk.
        write_data(session, JSON, method='reject')

    ## Flag experiment as complete.
    session['complete'] = 'reject'
    write_metadata(session, ['complete'], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The corresponding jsPsych function handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)

@bp.route('/redirect_error', methods = ['POST'])
def redirect_error():
    """Save rejected jsPsych dataset to disk."""

    if request.is_json:

        ## Retrieve jsPsych data.
        JSON = request.get_json()

        ## Save jsPsch data to disk.
        write_data(session, JSON, method='reject')

    ## Flag experiment as complete.
    session['complete'] = 'error'
    write_metadata(session, ['complete'], 'a')

    ## DEV NOTE:
    ## This function returns the HTTP response status code: 200
    ## Code 200 signifies the POST request has succeeded.
    ## The corresponding jsPsych function handles the redirect.
    ## For a full list of status codes, see:
    ## https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    return ('', 200)
