{...}:
{
  perSystem = {pkgs, ...}: {
    devShells.common =
      pkgs.mkShell {
        name = "Common shell";
        packages = with pkgs; [
          vtsls
          postgresql_18
          deadnix
          just
          hurl
          nixd
        ];
      };
  };
}
