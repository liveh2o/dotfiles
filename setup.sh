#!/usr/bin/env sh

set -eu

DOTFILES_DIR="${HOME}/.dotfiles"
REPO_URL="${DOTFILES_REPO:-https://github.com/liveh2o/dotfiles.git}"

if ! command -v git >/dev/null 2>&1; then
  printf 'Error: git is required but was not found in PATH.\n' >&2
  exit 1
fi

if ! command -v rake >/dev/null 2>&1; then
  printf 'Error: rake is required but was not found in PATH.\n' >&2
  exit 1
fi

if [ -d "${DOTFILES_DIR}/.git" ]; then
  printf 'Found existing clone at %s.\n' "${DOTFILES_DIR}"
elif [ -e "${DOTFILES_DIR}" ]; then
  printf 'Error: %s exists and is not a git clone.\n' "${DOTFILES_DIR}" >&2
  exit 1
else
  printf 'Cloning dotfiles into %s...\n' "${DOTFILES_DIR}"
  git clone "${REPO_URL}" "${DOTFILES_DIR}"
fi

printf 'Running setup task...\n'
(
  cd "${DOTFILES_DIR}"
  rake setup
)
