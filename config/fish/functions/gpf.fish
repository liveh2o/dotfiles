function gpf -d "git push origin current branch with force-with-lease"
    if not type -q __git.current_branch
        echo "__git.current_branch not available" >&2
        return 1
    end
    git push origin (__git.current_branch) --force-with-lease $argv
end
