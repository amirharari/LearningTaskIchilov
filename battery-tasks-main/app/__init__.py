import os, sys, re, configparser, warnings
from collections import OrderedDict
from flask import (Flask, redirect, render_template, request, session, url_for)
from app import consent, experiment, complete, error
from .db import initialize_db
from .io import write_metadata
from .utils import gen_code
__version__ = 'nivturk-sqlite3-battery'

## Define root directory.
ROOT_DIR = os.path.dirname(os.path.realpath(__file__))

## Load and parse configuration file.
cfg = configparser.ConfigParser()
cfg.read(os.path.join(ROOT_DIR, 'app.ini'))

## Ensure output directories exist.
data_dir = os.path.join(ROOT_DIR, cfg['IO']['DATA'])
if not os.path.isdir(data_dir): os.makedirs(data_dir)
meta_dir = os.path.join(ROOT_DIR, cfg['IO']['METADATA'])
if not os.path.isdir(meta_dir): os.makedirs(meta_dir)
reject_dir = os.path.join(ROOT_DIR, cfg['IO']['REJECT'])
if not os.path.isdir(reject_dir): os.makedirs(reject_dir)

## Ensure database exists.
db_path = os.path.join(ROOT_DIR, cfg['IO']['DB'])
if not os.path.isfile(db_path): initialize_db(db_path)

## Check Flask mode; if debug mode, clear session variable.
debug = cfg['FLASK'].getboolean('DEBUG')
if debug:
    warnings.warn("WARNING: Flask currently in debug mode. This should be changed prior to production.")

## Check Flask password.
secret_key = cfg['FLASK']['SECRET_KEY']
if secret_key == "PLEASE_CHANGE_THIS":
    warnings.warn("WARNING: Flask password is currently default. This should be changed prior to production.")

## CUSTOM: Load mapping.
mapping = dict()
with open(os.path.join(ROOT_DIR, 'mapping'), 'r') as f:
    for line in f.readlines():
        k, v = line.strip().split(',')
        mapping[k] = v

## Initialize Flask application.
app = Flask(__name__)
app.secret_key = secret_key

## Apply blueprints to the application.
app.register_blueprint(consent.bp)
app.register_blueprint(experiment.bp)
app.register_blueprint(complete.bp)
app.register_blueprint(error.bp)

## Define root node.
@app.route('/')
def index():

    ## Debug mode: clear session.
    if debug:
        session.clear()

    ## Store directories in session object.
    session['data'] = data_dir
    session['metadata'] = meta_dir
    session['reject'] = reject_dir
    session['db_path'] = db_path

    ## Record incoming metadata.
    info = OrderedDict(
        workerId     = request.args.get('PROLIFIC_PID'),    # Prolific metadata
        assignmentId = request.args.get('SESSION_ID'),      # Prolific metadata
        hitId        = request.args.get('STUDY_ID'),        # Prolific metadata
        address      = request.remote_addr,                 # NivTurk metadata
        browser      = request.user_agent.browser,          # User metadata
        platform     = request.user_agent.platform,         # User metadata
        version      = request.user_agent.version,          # User metadata
        code_success = cfg['PROLIFIC'].get('CODE_SUCCESS', gen_code(8).upper()),
        code_reject  = cfg['PROLIFIC'].get('CODE_REJECT', gen_code(8).upper()),
    )

    ## Define subject id.
    info['subId'] = mapping.get(info['workerId'], gen_code(24))
    print(info['subId'])

    ## Case 1: workerId absent.
    if info['workerId'] is None:

        ## Redirect participant to error (missing workerId).
        return redirect(url_for('error.error', errornum=1000))

    ## Case 2: mobile / tablet user.
    elif info['platform'] in ['android','iphone','ipad','wii']:

        ## Redirect participant to error (platform error).
        return redirect(url_for('error.error', errornum=1001))

    ## Case 3: previous complete.
    elif 'complete' in session:

        ## Redirect participant to complete page.
        return redirect(url_for('complete.complete'))

    ## Case 4: repeat visit, preexisting activity.
    elif 'workerId' in session:

        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))

    ## Case 5: repeat visit, preexisting log but no session data.
    elif not 'workerId' in session and info['workerId'] in os.listdir(meta_dir):

        ## Parse log file.
        with open(os.path.join(session['metadata'], info['workerId']), 'r') as f:
            logs = f.read()

        ## Extract subject ID.
        info['subId'] = re.search('subId\t(.*)\n', logs).group(1)

        ## Check for previous consent.
        consent = re.search('consent\t(.*)\n', logs)
        if consent and consent.group(1) == 'True': info['consent'] = True
        elif consent and consent.group(1) == 'False': info['consent'] = False
        elif consent: info['consent'] = consent.group(1)

        ## Check for previous complete.
        complete = re.search('complete\t(.*)\n', logs)
        if complete: info['complete'] = complete.group(1)

        ## Update metadata.
        for k, v in info.items(): session[k] = v

        ## Redirect participant as appropriate.
        if 'complete' in session:
            return redirect(url_for('complete.complete'))
        else:
            return redirect(url_for('consent.consent'))

    ## Case 6: first visit, workerId present.
    else:

        ## Update metadata.
        for k, v in info.items(): session[k] = v
        write_metadata(session, ['workerId','hitId','assignmentId','subId','address','browser','platform','version'], 'w')

        ## Redirect participant to consent form.
        return redirect(url_for('consent.consent'))

## Define secret route.
@app.route('/reload_mapping')
def reload_mapping():
    from flask import render_template_string

    ## Re-load mapping file.
    with open(os.path.join(ROOT_DIR, 'mapping'), 'r') as f:
        for line in f.readlines():
            k, v = line.strip().split(',')
            mapping[k] = v

    return render_template_string("hope you're having a good day today :)")
