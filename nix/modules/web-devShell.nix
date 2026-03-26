{ ... }:
{
  perSystem = {self', pkgs, config, ...}: {
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
        config.process-compose.services.services.postgres."postgres".package
      ];

      shellHook = ''
      echo "🌐 Web shell"
      '';
    };
  };
}
