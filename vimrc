" Prevents old bugs and limitations
set nocompatible
set t_Co=256

" Remove toolbar if running in mvim
if has("gui_running")
  set guioptions=aAce
  set transparency=8
endif

filetype off " for pathogen to load
" Calling pathogen to load the bundles
call pathogen#runtime_append_all_bundles()
call pathogen#helptags()

" Setup indent for snipMate
filetype plugin indent on

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

" Ruby Autocomplete stuff
" autocmd FileType ruby,eruby set omnifunc=rubycomplete#Complete
" autocmd FileType ruby,eruby let g:rubycomplete_buffer_loading = 1
" autocmd FileType ruby,eruby let g:rubycomplete_rails = 1
" autocmd FileType ruby,eruby let g:rubycomplete_classes_in_global = 1
" autocmd BufNewFile,BufRead *.mobile.erb let b:eruby_subtype = 'html'

" Remove history file if created
autocmd VimLeave * if filereadable($HOME."/.vim/.netrwhist") | call delete($HOME."/.vim/.netrwhist") | endif

" For Ack.vim
let g:ackprg="ack-grep -H --nocolor --nogroup --nosql --column --ignore-dir=doc"

" Solarized
syntax enable
set background=dark
colorscheme vibrantink

" Change autocomplete PINK background
highlight Pmenu ctermbg=238 gui=bold

" Setup ignore patterns for CommandT
set wildignore+=*.o,*.obj,.git,doc/**,*.sql,*.log

" Open NERDTree by default and move to edit window
"autocmd VimEnter * NERDTree
"
" Load Command P on launch
"autocmd VimEnter * wincmd p

