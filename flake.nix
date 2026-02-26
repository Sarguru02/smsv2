{
  description = "Student management system";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    process-compose.url = "github:Platonic-Systems/process-compose-flake";
    services-flake.url = "github:juspay/services-flake";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.process-compose.flakeModule
      ];
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      perSystem = { pkgs, ... }: {

        process-compose.services = {
          imports = [
            inputs.services-flake.processComposeModules.default
            ./nix/services.nix
          ];
        };

        devShells.default = import ./nix/devShell.nix { inherit pkgs; };

        packages.default = import ./nix/package.nix { inherit pkgs; };
      };
    };
}
