set -gx CODE_PATH $HOME/Code
set -gx DOTFILES $HOME/.dotfiles
set -gx EDITOR vim
set -gx GITHUB_SSHKEY $HOME/.ssh/github_ed25519
set -gx HOMEBREW_BUNDLE_FILE $DOTFILES/Brewfile
set -gx JRUBY_OPTS "--dev --disable=did_you_mean"
set -gx JRUBY_LATEST_VERSION 10.1

for bin_path in $HOME/.bin $HOME/.local/bin
    if test -d $bin_path
        fish_add_path $bin_path
    end
end

set -g fish_greeting

set -g fish_glob_sort_as_case false
