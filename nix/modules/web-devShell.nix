{ ... }:
{
  perSystem = {self', pkgs, config, ...}: {
    devShells.web = pkgs.mkShell {
      name = "web-devshell";
      inputsFrom = [
        self'.devShells.common
      ];

      buildInputs = with pkgs; [
        pnpm
        nodejs_20
        config.process-compose.services.services.postgres."postgres".package
      ];

      shellHook = ''
      echo "🌐 Web shell"
      '';
    };
  };
}
