{ inputs, ... }:
{
  imports = [
    (inputs.git-hooks + /flake-module.nix)
  ];
  perSystem = { ... }: {
    pre-commit.settings = {
      hooks = {
        nixpkgs-fmt.enable = true;
        rustfmt = {
          enable = true;
          entry = "bash -c 'cd apps/api && cargo fmt --all'";
        };
      };
    };
  };
}
