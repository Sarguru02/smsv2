# initialize a data directory
initdb -D ./pgdata

# start the server
pg_ctl -D ./pgdata -l logfile start

# create a db and user
createdb mydb
createuser -s postgres
