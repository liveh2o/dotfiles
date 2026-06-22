#!/usr/bin/env sh

set -eu

DOTFILES_DIR="${HOME}/.dotfiles"
REPO_URL="${DOTFILES_REPO:-https://github.com/liveh2o/dotfiles.git}"
GIT_WAIT_TIMEOUT="${GIT_WAIT_TIMEOUT:-1800}"
GIT_WAIT_INTERVAL="${GIT_WAIT_INTERVAL:-5}"

git_usable() {
  command -v git >/dev/null 2>&1 && git --version >/dev/null 2>&1
}

wait_for_macos_git() {
  printf 'git is installed but not ready yet. Installing Xcode Command Line Tools...\n'

  if ! xcode-select --install >/dev/null 2>&1; then
    printf 'Xcode Command Line Tools install may already be in progress.\n'
  fi

  start_time="$(date +%s)"

  while ! git_usable; do
    now="$(date +%s)"
    elapsed="$((now - start_time))"

    if [ "${elapsed}" -ge "${GIT_WAIT_TIMEOUT}" ]; then
      printf 'Error: git is still unavailable after %s seconds.\n' "${GIT_WAIT_TIMEOUT}" >&2
      printf 'Finish installing Xcode Command Line Tools and run setup again.\n' >&2
      exit 1
    fi

    remaining="$((GIT_WAIT_TIMEOUT - elapsed))"
    printf 'Waiting for Command Line Tools installation (%ss remaining)...\n' "${remaining}"
    sleep "${GIT_WAIT_INTERVAL}"
  done

  printf 'git is now available.\n'
}

if ! command -v git >/dev/null 2>&1; then
  printf 'Error: git is required but was not found in PATH.\n' >&2
  exit 1
fi

if ! git --version >/dev/null 2>&1; then
  if [ "$(uname -s)" = "Darwin" ]; then
    wait_for_macos_git
  else
    printf 'Error: git is present but not usable.\n' >&2
    exit 1
  fi
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

if ! command -v rake >/dev/null 2>&1 || ! rake --version >/dev/null 2>&1; then
  printf 'Error: rake is required but was not found in PATH.\n' >&2
  exit 1
fi

if ! (: </dev/tty) 2>/dev/null; then
  printf 'Error: setup is interactive and requires a terminal.\n' >&2
  printf 'Run this command in a terminal after cloning:\n' >&2
  printf '  cd "%s" && ./setup.sh\n' "${DOTFILES_DIR}" >&2
  exit 1
fi

printf 'Running setup task...\n'
(
  cd "${DOTFILES_DIR}"
  rake setup </dev/tty
)
