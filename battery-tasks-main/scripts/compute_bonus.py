import os, json
import numpy as np
from os.path import dirname
from pandas import DataFrame, concat
from scipy.stats import norm
ROOT_DIR = dirname(dirname(os.path.realpath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, 'data')
METADATA_DIR = os.path.join(ROOT_DIR, 'metadata')

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Metadata directory.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

## Locate files.
files = sorted([f for f in os.listdir(METADATA_DIR) if f[0] in ['5','6']])

METADATA = []
for f in files:

    ## Load file.
    worker = f
    with open(os.path.join(METADATA_DIR, f), 'r') as f:
        for line in f.readlines():
            if 'subId' in line:
                METADATA.append( dict(workerId=worker, subId=line.strip().split('\t')[-1]) )

## Convert to DataFrame.
METADATA = DataFrame(METADATA)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Data directory.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

DATA = []
for subId in METADATA.subId.values:

    ## Initialize dictionary.
    dd = {'subId': subId, 'horizons': np.nan, 'risk': np.nan, 'pit': np.nan, 'two-step': np.nan}
    
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    ### Horizons task.
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    
    ## Check if file exists.
    f = os.path.join(DATA_DIR, f'{subId}_horizons.json')
    if not os.path.isfile(f): continue
        
    ## Load file.
    with open(f, 'r') as f: JSON = json.load(f)
        
    ## Assemble behavioral data.
    games = [dd for dd in JSON if 'game' in dd]
    dd['horizons'] = np.concatenate([np.array(game['outcomes']).astype(float) for game in games]).sum()
    
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    ### Risk task.
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    
    ## Check if file exists.
    f = os.path.join(DATA_DIR, f'{subId}_risk.json')
    if not os.path.isfile(f): continue
        
    ## Load file.
    with open(f, 'r') as f: JSON = json.load(f)
        
    ## Assemble behavioral data.
    data = DataFrame([dd for dd in JSON if dd['trial_type'] == 'mrst-trial'])
    data = data.query('phase == "experiment" and missing == False')
    dd['risk'] = data.outcome.astype(float).sum()
    
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    ### PIT task.
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    
    ## Check if file exists.
    f = os.path.join(DATA_DIR, f'{subId}_pit.json')
    if not os.path.isfile(f): continue
    
    ## Load file.
    with open(f, 'r') as f: JSON = json.load(f)
        
     ## Assemble behavioral data.
    data = DataFrame([dd for dd in JSON if dd['trial_type'] == 'pit-trial'])
    data = data.query('block > 0').reset_index(drop=True)
    dd['pit'] = data.outcome.astype(float).sum()
    
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    ### Two-step task.
    #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
    
    ## Check if file exists.
    f = os.path.join(DATA_DIR, f'{subId}_two-step.json')
    if not os.path.isfile(f): continue
    
    ## Load file.
    with open(f, 'r') as f: JSON = json.load(f)

     ## Assemble behavioral data.
    data = DataFrame([dd for dd in JSON if dd['trial_type'] == 'two-step-trial']).query('trial > 0')
    dd['two-step'] = float(data.outcome.sum())

    ## Append.
    DATA.append(dd)
    
## Convert to DataFrame.
DATA = DataFrame(DATA)

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
### Compute bonus.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#

## Merge DataFrames.
BONUS = METADATA.merge(DATA, on='subId', how='inner').dropna()

## Compute bonus.
cols = ['horizons', 'risk', 'pit', 'two-step']
zscore = lambda x: (x - np.nanmean(x)) / np.nanstd(x)
for col in cols: 
    BONUS[col] = zscore(BONUS[col])
    BONUS[col] = norm.cdf(BONUS[col])
    BONUS[col] = np.round(BONUS[col] * (5.00 / len(cols)), 2)
BONUS['bonus'] = BONUS[cols].sum(axis=1).round(2)

total = BONUS.bonus.sum()
print('%0.3f, %0.3f' %(total, total * 1.33))

BONUS.to_csv(os.path.join(ROOT_DIR, 'scripts', 'complete.csv'), index=False, header=False)
BONUS.to_csv(os.path.join(ROOT_DIR, 'scripts', 'bonus.csv'), index=False, header=False, columns=('workerId','bonus'))
