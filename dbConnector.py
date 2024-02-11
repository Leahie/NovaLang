import sqlite3

connection = sqlite3.connect('database.db')

with open('dbTables.sql') as f:
    connection.executescript(f.read())