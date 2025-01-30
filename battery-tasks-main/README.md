# battery-tasks

## SQLite shortcuts

To convert the data table to CSV:

```
sqlite3 -header -csv app/app.db "select * from data;" > raw.csv
```

## SQLite performance

In the `/app/tests` directory, there is a script for testing the performance of SQLite under conditions realistic for this project. Some benchmarks:

#### Default settings
- N participants: 3000
- N tasks: 7
- N characters: 200000
- Time per insert: 3 ms
- Time per query: 0.28 ms
