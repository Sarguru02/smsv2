{ ... }:
{
  perSystem = { self', pkgs, ... }: {
    devShells.api = pkgs.mkShell {
      name = "Rust api shell";
      inputsFrom = [
        self'.devShells.rust
        self'.devShells.common
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
