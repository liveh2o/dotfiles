if type -q starship && test "$TERM_PROGRAM" = "ghostty"
    starship init fish | source
end
