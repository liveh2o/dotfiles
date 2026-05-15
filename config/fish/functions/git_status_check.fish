function git_status_check
    if not git rev-parse --git-dir >/dev/null 2>&1
        echo "Not a git repo."
        return 1
    end

    git status -s
    git diff-index --quiet HEAD --

    if test $status -ne 0
        echo "You have local changes that haven't been committed!"
        return 1
    end
end