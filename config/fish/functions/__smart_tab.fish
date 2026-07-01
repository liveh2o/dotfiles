function __smart_tab -d "Tab: accept autosuggestion if present, otherwise complete"
    # If the completion pager is already open, keep completing/cycling.
    if commandline --paging-mode
        commandline -f complete
        return
    end

    # Only offer to accept an autosuggestion when the cursor is at the end of
    # the buffer (that's the only place fish draws one).
    if test (commandline -C) -eq (string length -- (commandline))
        # Ask fish whether an autosuggestion is currently being shown by
        # comparing the buffer before and after attempting to accept it.
        set -l before (commandline)
        commandline -f accept-autosuggestion
        # accept-autosuggestion is applied synchronously here, so re-read.
        if test (commandline) != "$before"
            return
        end
    end

    # No autosuggestion was accepted -> fall back to normal completion.
    commandline -f complete
end
