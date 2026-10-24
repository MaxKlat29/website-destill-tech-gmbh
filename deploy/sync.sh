#!/usr/bin/env bash
# Holt alle website-*-Ordner aus den Quell-Repos nach sites/<slug>/, vergibt jeder neuen Site
# eine feste ID (deploy/sites.tsv), erzeugt deploy/Caddyfile und legt fuer Sites ohne Passwort
# eines an: bcrypt-Hash als Coolify-Variable, Klartext nur lokal in $CREDS.
# Danach: committen, pushen, in Coolify deployen.
set -euo pipefail

ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC=${SRC:-$ROOT/../SITEBUILDER-repos}
REPOS=(Renchtal Kinzigtal)
TOKEN_FILE=${TOKEN_FILE:-$HOME/.config/coolify/hosting-token}
CREDS=${CREDS:-$HOME/.config/coolify/demo-sites-creds.tsv}
API=http://100.67.244.85:8000/api/v1
APP=l3bwvz2xekgw160embjv98ze

cd "$ROOT"
for r in "${REPOS[@]}"; do
  [ -d "$SRC/$r" ] || git clone -q "https://github.com/BenTreyer/Projekt-Websiten-$r.git" "$SRC/$r"
  git -C "$SRC/$r" pull -q --ff-only
done

# 1. Dateien spiegeln. Doppelte Ordner (die Vorlagen) gewinnt das erste Repo in REPOS.
mkdir -p sites
seen=$(mktemp); pwfile=$(mktemp); trap 'rm -f "$seen" "$pwfile"' EXIT
for r in "${REPOS[@]}"; do
  for d in "$SRC/$r"/website-*/; do
    slug=$(basename "$d"); slug=${slug#website-}
    grep -qx "$slug" "$seen" && continue
    echo "$slug" >> "$seen"
    rsync -a --delete --exclude .git --exclude .DS_Store "$d" "sites/$slug/"
  done
done
for d in sites/*/; do
  slug=$(basename "$d")
  grep -qx "$slug" "$seen" || { echo "entfernt: $slug"; rm -rf "sites/$slug"; }
done

# 2. IDs: bestehende bleiben stabil, neue Sites bekommen eine zufaellige.
touch deploy/sites.tsv
for slug in $(sort "$seen"); do
  grep -q "^$slug	" deploy/sites.tsv || printf '%s\t%s\n' "$slug" "$(openssl rand -hex 4)" >> deploy/sites.tsv
done
awk -F'\t' 'NR==FNR{keep[$1]=1;next} keep[$1]' "$seen" deploy/sites.tsv | sort > deploy/sites.tsv.new
mv deploy/sites.tsv.new deploy/sites.tsv

envname() { echo "DEMO_HASH_$(echo "$1" | tr 'a-z-' 'A-Z_')"; }

# 3. Caddyfile
{
  cat deploy/Caddyfile.head
  echo ':80 {'
  while IFS=$'\t' read -r slug id; do
    printf '\timport site %s %s {$%s}\n' "$id" "$slug" "$(envname "$slug")"
  done < deploy/sites.tsv
  printf '\n\thandle {\n\t\trespond "not found" 404\n\t}\n}\n'
} > deploy/Caddyfile

# 4. Passwoerter fuer Sites, die noch keins haben
umask 077; touch "$CREDS"
missing=()
while IFS=$'\t' read -r slug id; do
  grep -q "^$slug	" "$CREDS" || missing+=("$slug")
done < deploy/sites.tsv
[ ${#missing[@]} -eq 0 ] && { echo "keine neuen Sites"; exit 0; }
[ -n "${DRY_RUN:-}" ] && { echo "DRY_RUN: ${#missing[@]} Sites ohne Passwort"; exit 0; }

TOKEN=$(cat "$TOKEN_FILE")
for slug in "${missing[@]}"; do
  printf '%s\t%s\n' "$slug" "$(LC_ALL=C tr -dc 'A-HJ-NP-Za-km-z2-9' </dev/urandom | head -c 14)"
done > "$pwfile"
hashes=$(cut -f2 "$pwfile" | docker run --rm -i caddy:2.8.4-alpine sh -c \
  'while read -r p; do caddy hash-password --plaintext "$p"; done')
paste "$pwfile" <(echo "$hashes") | python3 -c '
import json, sys
data = []
for line in sys.stdin:
    slug, pw, h = line.rstrip("\n").split("\t")
    data.append({"key": "DEMO_HASH_" + slug.upper().replace("-", "_"), "value": h,
                 "is_literal": True, "is_buildtime": False, "is_runtime": True})
print(json.dumps({"data": data}))' |
  curl -sf -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    "$API/applications/$APP/envs/bulk" -d @- > /dev/null
cat "$pwfile" >> "$CREDS"
echo "${#missing[@]} neue Passwoerter in Coolify und $CREDS"
