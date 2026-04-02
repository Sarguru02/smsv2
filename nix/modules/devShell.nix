{...}:
{
  perSystem = {self', pkgs, ...}: {
    devShells.default =
      let web_devshell = (self'.devShells.web.overrideAttrs ({...}: {shellHook = "";}));
          rust_devshell = (self'.devShells.api.overrideAttrs ({...}: {shellHook = "";}));
      in
        pkgs.mkShell {
          name = "Student management system shell";
          inputsFrom = [
            self'.devShells.common
            web_devshell
            rust_devshell
          ];
          shellHook= ''
    echo "🚀 Bun + Next.js dev shell"
    echo "• bun: $(bun --version)"
    echo "• node: $(node --version)"
    echo
    echo
    if [ -f "justfile" ]; then
    echo "🍎🍎 Run 'just <recipe>' to get started"
    just
    fi
          '';
        };
  };
}
