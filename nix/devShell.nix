{ pkgs, ... }:

pkgs.mkShell {

  name = "Bun + nextjs shell";
  packages = with pkgs; [
    bun
    nodejs_20
    vtsls
    prisma
    prisma-engines
    postgresql_18
    deadnix
    just
    hurl
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
}
