function bullet -d "Run a command with BULLET=1"
    if test (count $argv) -eq 0
        return 0
    end

    set -lx BULLET 1
    $argv
end
