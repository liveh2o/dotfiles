function spm -d "Run rspec on modified spec files"
    rspec (git ls-files --modified spec) $argv
end
