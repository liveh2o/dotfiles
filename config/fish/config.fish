set -gx DOTFILES $HOME/.dotfiles
set -gx EDITOR vim
set -gx HOMEBREW_BUNDLE_FILE $DOTFILES/Brewfile
set -gx PROJECT_PATH $HOME/Code

fish_add_path $HOME/.bin
fish_add_path $HOME/.local/bin

set -g fish_greeting

set -g fish_glob_sort_as_case false
