#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <dossier-exercice>"
  exit 1
fi

npx playwright test "$1/tests"
