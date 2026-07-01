require "rake"
require "erb"
require "shellwords"

require_relative "tasks/brew"
require_relative "tasks/divvy"
require_relative "tasks/gh"
require_relative "tasks/pg"
require_relative "tasks/nova"

task :dotfiles do
  force = false
  files = Dir["*"] - %w[LICENSE Rakefile README.md config setup.sh tasks]

  # Skip all Brewfiles
  files.reject! { |file| file.start_with?("Brewfile") }

  files << "config/fish"
  files << "config/gh"
  files << "config/ghostty"
  files << "config/mise"
  files << "config/opencode"
  files << "config/starship.toml"

  # Create ~/.config if it does not exist
  system %(mkdir -p #{File.join(ENV["HOME"], ".config")})

  files.each do |file|
    if File.exist?(File.join(ENV["HOME"], ".#{file.sub(".erb", "")}"))
      if File.identical? file, File.join(ENV["HOME"], ".#{file.sub(".erb", "")}")
        puts "Identical ~/.#{file.sub(".erb", "")}"
      elsif force
        replace_file(file)
      else
        print "Overwrite ~/.#{file.sub(".erb", "")}? [Ynaq] "
        case $stdin.gets.chomp
        when "a"
          force = true
          replace_file(file)
        when "Y", "y", ""
          replace_file(file)
        when "q"
          exit
        end
      end
    else
      link_dotfile(file)
    end
  end

  system %(source #{File.join(ENV["HOME"], ".zshrc")}) if ENV["SHELL"] == "/bin/zsh"
end

namespace :setup do
  desc "Setup GitHub CLI and add a new SSH key to your account for authentication and signing"
  task gh: ["gh:sshkey", "gh:sshkey:add"] do
    system("git config --global commit.gpgsign true")
    system("git config --global gpg.format ssh")
    system("git config --global user.signingkey #{ENV["GITHUB_SSHKEY"]}")
    puts "Git configured to sign commits with SSH key"
  end
end

desc "Setup dotfiles, developer tools, Homebrew, and switch to fish"
task setup: [:dotfiles, "brew:install"] do
  # Create ~/Code if it does not exist
  system %(mkdir -p #{File.join(ENV["HOME"], "Code")})

  # Install Fish shell and switch to it
  system("/opt/homebrew/bin/brew install fish -q")
  fish_path = `command -v fish`.strip

  if ENV["SHELL"] == fish_path
    puts "Using Fish"
  else
    shells_file = "/etc/shells"
    unless File.exist?(shells_file) && File.readlines(shells_file, chomp: true).include?(fish_path)
      system("sudo sh -c 'echo #{fish_path.shellescape} >> /etc/shells'") or abort "Failed to add fish"
    end
    system("chsh", "-s", fish_path)
  end
end

def ask(prompt, &block)
  print "#{prompt} [Ynq]"
  case $stdin.gets.chomp
  when "Y", "y", ""
    yield
  when "q"
    exit
  else
    false
  end
end

def link_dotfile(file)
  if /.erb$/.match?(file)
    puts "Generating ~/.#{file.sub(".erb", "")}"

    if /gitconfig/.match?(file)
      print "  git user.name: "
      ENV["GIT_USER_NAME"] = $stdin.gets.chomp
      print "  git user.email: "
      ENV["GIT_USER_EMAIL"] = $stdin.gets.chomp
    end

    File.write(File.join(ENV["HOME"], ".#{file.sub(".erb", "")}"), ERB.new(File.read(file)).result(binding))
  else
    puts "Linking ~/.#{file}"
    link_file("$PWD/#{file}", file)
  end
end

def link_file(source, dotfile)
  system %(ln -s "#{source}" "$HOME/.#{dotfile}")
end

def replace_file(file)
  system %(rm -rf "$HOME/.#{file.sub(".erb", "")}")
  link_dotfile("$PWD/#{file}", file)
end
