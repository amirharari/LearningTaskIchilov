while true
do

  ## Clear screen
  clear

  date

  ## Update results

  echo "dsst     |" $(grep -iP -m 1 "dsst\tstart" metadata/[0-9]** | wc -l) "|" $(grep -iP -m 1 "dsst\tsuccess" metadata/[0-9]** | wc -l)
  echo "mars     |" $(grep -iP -m 1 "mars\tstart" metadata/[0-9]** | wc -l) "|" $(grep -iP -m 1 "mars\tsuccess" metadata/[0-9]** | wc -l)
  echo "horizons |" $(grep -iP -m 1 "horizons\tstart" metadata/[0-9]** | wc -l) "|" $(grep -iP -m 1 "horizons\tsuccess" metadata/[0-9]** | wc -l)
  echo "risk     |" $(grep -iP -m 1 "risk\tstart" metadata/[0-9]** | wc -l) "|" $(grep -iP -m 1 "risk\tsuccess" metadata/[0-9]** | wc -l)
  echo "pit      |" $(grep -iP -m 1 "pit\tstart" metadata/[0-9]** | wc -l) "|" $(grep -iP -m 1 "pit\tsuccess" metadata/[0-9]** | wc -l)
  echo "two-step |" $(grep -iP -m 1 "two-step\tstart" metadata/[0-9]** | wc -l) "|" $(grep -iP -m 1 "two-step\tsuccess" metadata/[0-9]** | wc -l)
  echo "complete |" $(grep -iP -m 1 "code_success" metadata/[0-9]** | wc -l)
  echo "reject   |" $(grep -iP -m 1 "reject" metadata/[0-9]** | wc -l)

  ## Sleep
  sleep 30

done
