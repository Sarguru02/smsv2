{pkgs, ...}:

pkgs.stdenv.mkDerivation {
  pname = "smsv2";
  version = "0.1.0";

  src = ../.;

  nativeBuildInputs = with pkgs; [bun nodejs_20 prisma_6 prisma-engines_6];

  buildPhase = ''
            export HOME=$TMPDIR

            export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig"
            export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/schema-engine"
            export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines_6}/lib/libquery_engine.node"
            export PRISMA_FMT_BINARY="${pkgs.prisma-engines_6}/bin/prisma-fmt"

            bun install --frozen-lockfile
            prisma generate
            bun run build
            '';

  installPhase = ''
            mkdir -p $out
            cp -r .next public package.json node_modules $out/
            
            mkdir -p $out/bin

            cat > $out/bin/smsv2 <<EOF
            #!${pkgs.runtimeShell}
            export NODE_ENV=production
            exec ${pkgs.bun}/bin/bun run start
            EOF

            chmod +x $out/bin/smsv2
            '';

  dontFixup = true;
}
