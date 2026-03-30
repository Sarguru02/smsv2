{ ... }:
{
  perSystem = { self', pkgs, ... }: {
    devShells.web = pkgs.mkShell {
      name = "web-devshell";
      inputsFrom = [
        self'.devShells.common
      ];

      buildInputs = with pkgs; [
        bun
        nodejs_20
        prisma
        prisma-engines
      ];

      shellHook = ''
        echo "🌐 Web shell"
      '';
    };
  };
}
