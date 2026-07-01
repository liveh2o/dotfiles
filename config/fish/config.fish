set -gx CODE_PATH $HOME/Code
set -gx DOTFILES $HOME/.dotfiles
set -gx EDITOR vim
set -gx GITHUB_SSHKEY $HOME/.ssh/github_ed25519
set -gx HOMEBREW_BUNDLE_FILE $DOTFILES/Brewfile
set -gx JRUBY_OPTS "--dev --disable=did_you_mean"
set -gx JRUBY_LATEST_VERSION 10.1

# Add ~/.bin and ~/.local/bin to $PATH if they exist
for bin_path in $HOME/.bin $HOME/.local/bin
    if test -d $bin_path
        fish_add_path $bin_path
    end
end

# Suppress the fish startup message
set -g fish_greeting

# Interactive-only settings...
if status is-interactive
    # Accept autocompletion with Tab instead of Right Arrow
    bind \t accept-autosuggestion
end
