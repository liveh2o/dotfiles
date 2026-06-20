function rebase
    __git.status_check; or return 1
    if test (count $argv) -lt 1
        echo "Usage: rebase <n>" >&2
        return 1
    end
    git rebase -i HEAD~$argv[1]
end
