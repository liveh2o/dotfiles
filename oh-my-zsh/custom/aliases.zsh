# General aliases
alias ...=../..
alias ....=../../..
alias .....=../../../..
alias ......=../../../../..
alias 1='cd -1'
alias 2='cd -2'
alias 3='cd -3'
alias 4='cd -4'
alias 5='cd -5'
alias 6='cd -6'
alias 7='cd -7'
alias 8='cd -8'
alias 9='cd -9'
alias cd..='cd ..'
alias globurl='noglob urlglobber '
alias l='ls -lah'
alias la='ls -lAh'
alias ll='ls -lh'
alias lp='ls -p'
alias ls='ls -G'
alias lsa='ls -lah'
alias md='mkdir -p'
alias rd=rmdir
alias _='sudo '

# Grep aliases
alias egrep='grep -E'
alias fgrep='grep -F'

# Bundler aliases
alias b='bundle install'
alias ba='bundle add'
alias bc='bundle console'
alias bck='bundle check'
alias bcn='bundle clean'
alias be='bundle exec'
alias bi='bundle install'
alias bl='bundle list'
alias bo='EDITOR=nova bundle open'
alias bout='bundle outdated'
alias bp='bundle package'
alias bu='bundle update'
alias bx='bundle exec'
alias tb='t b'
alias tbu='t bu'
alias tbx='t bx'

# Additional docker-compose aliases
alias dc='docker-compose'
alias dcx='dc exec web'

# Additional git aliases
alias ghe='g rev-parse HEAD'
alias gpo='ggpush --set-upstream'
alias grbm='grb $(git_main_branch)'
alias gs='g status'
alias pop='g stash pop'
alias stash='g stash'

# GitHub CLI aliases
alias ghpr='gh pr create --web'

# Editor aliases
alias m='mate -w .'
alias n='nova .'

# Development aliases
alias bullet='BULLET=1'
alias ci='bin/rails ci'
alias derp='RUBYOPT=W0'
alias jitless='JRUBY_OPTS="$JRUBY_OPTS -J-Djruby.compile.mode=OFF"'
alias jrbdev='JRUBY_OPTS="$JRUBY_OPTS --dev --disable:did_you_mean --debug"'
alias redis='redis-server $HOMEBREW_REPOSITORY/etc/redis.conf'
alias spec='t rspec'
alias specf='spec --only-failures'
alias specm='spec $(git ls-files --modified spec)'
alias sp='spec'
alias spf='specf'
alias spm='specm'
alias std='standardize'
alias std!='standardize!'
alias standardize='bin/standardrb --fix'
alias standardize!='bin/standardrb --fix-unsafely'
alias t='turbo'
alias turbo='derp jrbdev'

# Misc aliases
alias cloud='cd ~/Library/Mobile\ Documents/com~apple~CloudDocs'
alias dotfiles='cd ~/.dotfiles'
alias http='python -m SimpleHTTPServer'
alias kp='ps auxwww' # the "kp" alias ("que pasa"), in honor of tony p.
alias ns='nslookup'
alias o='open .'
alias path='echo $PATH'
alias reload='. ~/.zshrc'
