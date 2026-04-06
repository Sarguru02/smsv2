{ ... }:
{
  perSystem = { pkgs, ... }: {
    packages.web = pkgs.stdenv.mkDerivation {
      pname = "smsv2";
      version = "0.1.0";

      src = ../../apps/web;

      nativeBuildInputs = with pkgs; [ bun nodejs_20 prisma_6 prisma-engines_6 ];

      buildPhase = ''
            export HOME=$TMPDIR

            export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig"
            export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/schema-engine"
            export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines_6}/lib/libquery_engine.node"
            export PRISMA_FMT_BINARY="${pkgs.prisma-engines_6}/bin/prisma-fmt"

        bun install --frozen-lockfile
        bunx prisma generate
        bun run build
      '';

      installPhase = ''
        mkdir -p $out/{bin,lib/smsv2}
        cp -r .next public package.json node_modules $out/lib/smsv2

        # Copy the generated Prisma client (required at runtime)
        mkdir -p $out/lib/smsv2/src/generated
        cp -r src/generated/prisma $out/lib/smsv2/src/generated/

        # Replace the bundled query engine with a symlink to the nix store
        # This ensures the correct platform-specific engine is used at runtime
        rm -f $out/lib/smsv2/src/generated/prisma/libquery_engine*.node
        ln -s ${pkgs.prisma-engines_6}/lib/libquery_engine.node $out/lib/smsv2/src/generated/prisma/libquery_engine.node

        cat > $out/bin/smsv2 <<EOF
        #!${pkgs.runtimeShell}
        export NODE_ENV=production
        export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines_6}/lib/libquery_engine.node"
        cd $out/lib/smsv2
        exec ${pkgs.bun}/bin/bun run start
        EOF

            chmod +x $out/bin/smsv2
      '';

      dontFixup = true;
    };
  };
}
