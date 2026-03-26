{
  services.postgres.postgres = {
    enable = true;
    port = 5432;
    initialDatabases = [{
      name = "sms";
    }];
    listen_addresses = "127.0.0.1";
    initialScript.before = ''
      CREATE ROLE postgres SUPERUSER;
      CREATE ROLE admin WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD 'docker';
    '';
    initialScript.after = ''
      GRANT ALL PRIVILEGES ON DATABASE sms TO admin;
    '';
  };
}
