{ ... }:
{
  perSystem = { pkgs, config, ... }: {
    devShells.common =
      pkgs.mkShell {
        name = "Common shell";
        inputsFrom = [
          config.pre-commit.devShell
        ];
        packages = with pkgs; [
          vtsls
          deadnix
          just
          hurl
          nixd
          config.process-compose.services.services.postgres."postgres".package
        ];
      };
  };
}
