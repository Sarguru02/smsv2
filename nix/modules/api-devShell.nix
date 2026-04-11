{ ... }:
{
  perSystem = { self', pkgs, config, ... }: {
    devShells.api = pkgs.mkShell {
      name = "Rust api shell";
      inputsFrom = [
        self'.devShells.common
        self'.devShells.rust
        config.pre-commit.devShell
      ];

      shellHook = ''
        echo "HELLO FROM Rust DEVsheLL"
      '';
      packages = with pkgs; [
        bacon
        deadnix
        diesel-cli
        sqlite
      ];
    };
  };
}
