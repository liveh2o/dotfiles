" ruby_bashrockets.vim
" http://github.com/danchoi/ruby_bashrockets.vim
" 
" This gives you Vim commands to convert Ruby hashes from the older hashrocket
" notation to the newer ':' notation and back.
" 
" ## Synopsis
" 
"     :Bashrockets   {:foo => 'bar', :boston => 'rocks'}  ==>   {foo: 'bar', boston: 'rocks'}
"     :Hashrockets   {foo: 'bar', boston: 'rocks'}        ==>   {:foo => 'bar', :boston => 'rocks'}
" 
" You can select a range before entering these commands. They will apply the 
" conversion to all the text in the range.
" 
" You can also type the first few characters of either command and try to let 
" Vim tab-autocomplete it.
" 
" ## Install
" 
" Copy ftplugin/ruby_bashrockets.vim to ~/.vim/ftplugin/
" 
" Make sure your .vimrc has these lines:
" 
"     filetype on
"     filetype plugin on
" 
" Also, there should already be a ruby.vim file in your ~/.vim/ftdetect/
" directory. If not, you can grab this one from Tim Pope's [vim-ruby][vim-ruby]
" library or just install vim-ruby.
" 
" [vim-ruby]:https://github.com/vim-ruby/vim-ruby/tree/master/ftdetect
"
" ## Author
" 
" Daniel Choi http://github.com/danchoi

function! s:hashrockets() range
  let lnum = a:firstline
  while lnum <= a:lastline
    let newline = substitute(getline(lnum), '\(\w\+\):', ':\1 =>', 'g')
    call setline(lnum, newline)
    let lnum += 1
  endwhile
endfunction

function! s:bashrockets() range
  let lnum = a:firstline
  while lnum <= a:lastline
    let newline = substitute(getline(lnum), ':\(\w\+\)\s*=>', '\1:', 'g')
    call setline(lnum, newline)
    let lnum += 1
  endwhile
endfunction
command! -range Bashrockets :<line1>,<line2>call s:bashrockets()
command! -range Hashrockets :<line1>,<line2>call s:hashrockets()
