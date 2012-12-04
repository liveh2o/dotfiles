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
autocmd BufNewFile,BufRead *.mobile.erb let b:eruby_subtype = 'html'

" Remove history file if created
autocmd VimLeave * if filereadable($HOME."/.vim/.netrwhist") | call delete($HOME."/.vim/.netrwhist") | endif

" SuperTab Config stuff
" let g:SuperTabDefaultCompletionType = "context"

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

" Add NERDTree open by default and move to edit window
" autocmd VimEnter * NERDTree
autocmd VimEnter * wincmd p

" Setup stuff for SnipMate
source ~/.vim/bundle/vim-snipmate/snippets/support_functions.vim
autocmd vimenter * call s:SetupSnippets()
function! s:SetupSnippets()
  " if in rails dir
  if filereadable("./config/environment.rb")
    let g:snipMate.scope_aliases={"ruby": "ruby-rails,ruby","eruby": "eruby-rails,eruby,html", "javascript": "javascript,javascript-jquery"}

    if filereadable("./spec/spec_helper.rb")
      call extend(g:snipMate.scope_aliases, {"ruby": "ruby-rails,ruby-rspec,ruby"})
    endif

    if filereadable("./spec/factories.rb")
      call extend(g:snipMate.scope_aliases, {"ruby": "ruby-rails,ruby-rspec,ruby,ruby-factorygirl"})
    endif
  endif
endfunction
