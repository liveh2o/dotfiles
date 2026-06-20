function turbo -d "Run a command with derp and jitless opts"
    if test (count $argv) -eq 0
        return 0
    end

    derp jitless $argv
end
