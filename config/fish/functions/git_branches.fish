function git_branches
    git branch | sed -e 's|* ||g' -e 's|^[ ]*||'
end