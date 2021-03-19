" Prevents old bugs and limitations
set nocompatible
set t_Co=256

" Set line numbers
set nu
set showmatch

" Set highlight search
set hls

" Wrap text
set lbr
set ruler

" Tab settings
set expandtab
set tabstop=2
set shiftwidth=2
set smarttab
set autoindent

" For Ack.vim
let g:ackprg="ack-grep -H --nocolor --nogroup --nosql --column --ignore-dir=doc"

" Solarized
syntax enable
set background=dark

" Change autocomplete PINK background
highlight Pmenu ctermbg=238 gui=bold

" Setup ignore patterns for CommandT
set wildignore+=*.o,*.obj,.git,doc/**,*.sql,*.log

" Add spell check to git commits
autocmd FileType gitcommit setlocal spell
