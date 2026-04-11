{ ... }:
{
  perSystem = { self', pkgs, ... }: {
    devShells.web = pkgs.mkShell {
      name = "web-devshell";
      inputsFrom = [
        self'.devShells.common
      ];

      buildInputs = with pkgs; [
        pnpm
        nodejs_20
      ];

      shellHook = ''
        echo "🌐 Web shell"
      '';
    };
  };
}
