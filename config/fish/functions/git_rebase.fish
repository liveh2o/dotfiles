function git_rebase
    git_status_check
    git rebase -i HEAD~$argv[1]
end