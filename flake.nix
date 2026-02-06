{
  description = "Student management system";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      perSystem = { config, self', inputs', pkgs, ... }: {
        devShells.default = pkgs.mkShell {
          name = "Bun + nextjs shell";
          packages = with pkgs; [bun nodejs_20 vtsls prisma postgresql_18];

          shellHook= ''
            echo "🚀 Bun + Next.js dev shell"
            echo "• bun: $(bun --version)"
            echo "• node: $(node --version)"
          '';
        };

        packages.default = pkgs.mkStdDerivation {
          pname = "Student Management System";
          version = "0.1.0";

          src = ./.;

          nativeBuildInputs = with pkgs; [bun nodejs_20];

          buildPhase = ''
            export HOME=$TMPDIR
            bun install --frozen-lockfile
            bun run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r .next public package.json $out/
          '';

          dontFixup = true;
        };
      };
    };
}
