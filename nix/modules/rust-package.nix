{ inputs, ... }:
{
  imports = [
    inputs.rust-flake.flakeModules.default
    inputs.rust-flake.flakeModules.nixpkgs
    inputs.cargo-doc-live.flakeModule
  ];
  perSystem = { self', pkgs, ... }: {
    rust-project= 
      let crate_path = ../../apps/api;
      in
      {
      src = crate_path;
      cargoToml = builtins.fromTOML (builtins.readFile (crate_path + "/Cargo.toml"));
      toolchain = (pkgs.rust-bin.fromRustupToolchainFile (crate_path + /rust-toolchain.toml)).override {
        extensions = [
          "rust-src"
          "rust-analyzer"
          "clippy"
        ];
      };
      crates  = {
        smsv2 = {
          path = crate_path;
        };
      };
    };
    packages.default = self'.packages.smsv2;
  };
}
