{ inputs, ... }:
{
  imports = [
    inputs.process-compose.flakeModule
  ];
  perSystem = { ... }: {
    process-compose.services = {
      imports = [
        inputs.services-flake.processComposeModules.default
        ../external-services.nix
      ];
    };
  };
}
