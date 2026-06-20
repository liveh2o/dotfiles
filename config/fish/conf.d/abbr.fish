# Bundler abbreviations
abbr --add --global b "bundle install"
abbr --add --global ba "bundle add"
abbr --add --global bc "bundle console"
abbr --add --global bck "bundle check"
abbr --add --global bcn "bundle clean"
abbr --add --global be "bundle exec"
abbr --add --global bi "bundle install"
abbr --add --global bl "bundle list"
abbr --add --global bo "env EDITOR=nova bundle open"
abbr --add --global bout "bundle outdated"
abbr --add --global bp "bundle package"
abbr --add --global bu "bundle update"
abbr --add --global bx "bundle exec"

# Docker abbreviations
abbr --add --global dc docker-compose
abbr --add --global dcx "docker-compose exec web"

# Additional git abbreviations
abbr --add --global ghe "git rev-parse HEAD"
abbr --add --global gs "git status"
abbr --add --global pop "git stash pop"
abbr --add --global stash "git stash"

# GitHub CLI
abbr --add --global ghpr "gh pr create --web"

# Editor abbreviations
abbr --add --global m "mate -w ."
abbr --add --global n "nova ."

# Development abbreviations
abbr --add --global ci "bin/rails ci"
abbr --add --global sp "rspec"
abbr --add --global spf "rspec --only-failures"
abbr --add --global std "bin/standardrb --fix"
abbr --add --global std! "bin/standardrb --fix-unsafely"
abbr --add --global t "turbo"

# Misc abbreviations
abbr --add --global cd.. "cd .."
abbr --add --global cloud "cd ~/Library/Mobile\ Documents/com~apple~CloudDocs"
abbr --add --global dotfiles "cd ~/.dotfiles"
abbr --add --global http "python -m http.server"
abbr --add --global kp "ps auxwww"
abbr --add --global l "ls -lA"
abbr --add --global ll "ls -lAh"
abbr --add --global lll "ls -lah"
abbr --add --global ls "ls -AG"
abbr --add --global md "mkdir -p"
abbr --add --global rd rmdir
abbr --add --global ns nslookup
abbr --add --global o "open ."
abbr --add --global reload "source ~/.config/fish/config.fish"
abbr --add --global restart "exec fish"
