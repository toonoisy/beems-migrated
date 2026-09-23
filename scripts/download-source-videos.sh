#!/usr/bin/env bash
# One-off helper: downloads the original site's real lesson videos (480p)
# from Wix's video CDN into scripts/source-videos/, so they can be
# re-uploaded to Firebase Storage by scripts/seed.js. Not needed again
# once source-videos/ is populated and the videos are seeded.
set -euo pipefail
cd "$(dirname "$0")/.."

RES="480p"
BASE="scripts/source-videos"

download() {
  local dir="$1" lang="$2" file_id="$3"
  local url="https://video.wixstatic.com/video/${file_id}/${RES}/mp4/file.mp4"
  local dest="${BASE}/${dir}/${lang}.mp4"
  echo "Downloading ${dest}..."
  curl -sS --fail -o "$dest" "$url"
}

download home                                            en cbce6b_c9bd537fb6544940a29eade82dcbb9d6
download home                                            hi cbce6b_e6f15fc5a28c4eb1a01c14d59c620ca9
download enculturation-acculturation                     en cbce6b_8f21c83b6e91408eabdbc0813a2f65ec
download enculturation-acculturation                     hi cbce6b_235eaa9074b241f0abb65c0756937102
download four-ways-of-acculturation                      en cbce6b_abda50d2382b4150b90d68df0b7cdafd
download four-ways-of-acculturation                      hi cbce6b_cfaa49d0677a436287336dac3e0cc901
download children-adapt-faster                           en cbce6b_cc02a5ad4f2a497a8db2a55b512a118b
download children-adapt-faster                           hi cbce6b_66651b80ea6c47929862f1b59435cb02
download lived-experiences                                en cbce6b_f31769b5e2f442bc93020d8429b2f024
download lived-experiences                                hi cbce6b_4a719291b93b481d9d93ca696cf53df2
download protective-parental-factors                      en cbce6b_798435570dfd4167b6df9114ffe53f40
download protective-parental-factors                      hi cbce6b_3554b34d37c94e9c8a36d0b2fef325a2
download less-helpful-parenting-approaches                en cbce6b_0a9c7f8cd81c4632a82c80f00b333fd5
download less-helpful-parenting-approaches                hi cbce6b_46aeec6bf72540eeab900755474b8aa7
download mental-health-wellbeing-spectrum                 en cbce6b_fd43d244b2154e32a154c31d2386ed2e
download mental-health-wellbeing-spectrum                 hi cbce6b_cc8ad7ed531040258f3283706cb9f5dd
download immigrant-specific-mental-health-risk-factors    en cbce6b_710a42353fbf41dc8cf150e68b8e3f5b
download immigrant-specific-mental-health-risk-factors    hi cbce6b_895d9160ae634af7a2d2bf3f400febb4

echo "Done. Downloaded $(find "$BASE" -name '*.mp4' | wc -l | tr -d ' ') files ($(du -sh "$BASE" | cut -f1))."
