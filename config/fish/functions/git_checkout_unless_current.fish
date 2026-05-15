function git_checkout_unless_current
    if test -n "$argv[1]" -a "$argv[1]" != (git_current_branch)
        git checkout $argv[1]
    end
end