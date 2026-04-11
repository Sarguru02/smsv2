{ ... }:
{
  perSystem = { pkgs, ... }: {
    packages.web = pkgs.stdenv.mkDerivation {
      pname = "smsv2";
      version = "0.1.0";

      src = ../../apps/web;

      nativeBuildInputs = with pkgs; [
        nodejs_20
        pnpm
        pnpmConfigHook
      ];

      pnpmDeps = pkgs.fetchPnpmDeps {
        pname = "smsv2";
        version = "0.1.0";
        src = ../../apps/web;
        hash = "sha256-jjX2UI44Fvh20tHrIxAkLUhAlvhZtVo5qcvt30JKpjg=";
        fetcherVersion = 3;
      };

      buildPhase = ''
        export HOME=$TMPDIR

        pnpm run build
      '';

      installPhase = ''
        mkdir -p $out/{bin,lib/smsv2}
        cp -r .next public package.json node_modules $out/lib/smsv2

        cat > $out/bin/smsv2 <<EOF
        #!${pkgs.runtimeShell}
        export NODE_ENV=production
        cd $out/lib/smsv2
        exec ${pkgs.nodejs_20}/bin/node ./node_modules/next/dist/bin/next start
        EOF

        chmod +x $out/bin/smsv2
      '';

      dontFixup = true;
    };
  };
}
