require "rake"
require "erb"

desc "Install the dot files into user's home directory"
task :install do
  install_oh_my_zsh
  switch_to_zsh
  replace_all = false

  files = Dir["*"] - %w[Rakefile README.md LICENSE oh-my-zsh]
  files.reject! { |file| file.start_with?("Brewfile") }
  files << "oh-my-zsh/custom/aliases.zsh"
  files << "oh-my-zsh/custom/plugins/liveh2o"
  files.each do |file|
    if File.exist?(File.join(ENV["HOME"], ".#{file.sub(".erb", "")}"))
      if File.identical? file, File.join(ENV["HOME"], ".#{file.sub(".erb", "")}")
        puts "Identical ~/.#{file.sub(".erb", "")}"
      elsif replace_all
        replace_file(file)
      else
        print "Overwrite ~/.#{file.sub(".erb", "")}? [Ynaq] "
        case $stdin.gets.chomp
        when "a"
          replace_all = true
          replace_file(file)
        when "Y", "y", ""
          replace_file(file)
        when "q"
          exit
        else
          puts "Skipping ~/.#{file.sub(".erb", "")}"
        end
      end
    else
      link_dotfile(file)
    end
  end
end

desc "Setup the environment"
task :env do
  install_command_line_tools
  install_homebrew
  install_homebrew_packages
  create_postgresql_user
end

desc "Setup environment, install apps, and link dotfiles"
task setup: [:env, :dotfiles]

def create_postgresql_user
  print "Create PostgreSQL user? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    print "username [postgres]: "
    username = $stdin.gets.chomp
    username = "postgres" if username.empty?
    puts "Creating PostgreSQL user: postgres"
    system %(createuser -s #{username})
  when "q"
    exit
  else
    puts "Skipping PostgreSQL user"
  end
end

def install_command_line_tools
  print "Installing Xcode Command Line Tools? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    puts "Installing Xcode Command Line Tools..."
    system %(xcode-select --install)
  when "q"
    exit
  else
    puts "Skipping Xcode Command Line Tools"
  end
end

def install_homebrew
  if File.exist?(File.join("/opt/homebrew"))
    puts "Found /opt/homebrew"
  else
    print "Install Homebrew? [Ynq] "
    case $stdin.gets.chomp
    when "Y", "y", ""
      puts "Installing Homebrew..."
      system '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"'
      system "/opt/homebrew/bin/brew shellenv"
    when "q"
      exit
    else
      puts "Skipping Homebrew"
    end
  end
end

def install_homebrew_packages
  print "Install Homebrew packages from #{ENV["HOMEBREW_BUNDLE_FILE"]}? [Ynq] "
  case $stdin.gets.chomp
  when "Y", "y", ""
    system %(brew bundle --no-upgrade)
  when "q"
    exit
  else
    puts "Skipping Homebrew packages"
  end
end

def install_oh_my_zsh
  if File.exist?(File.join(ENV["HOME"], ".oh-my-zsh"))
    puts "Found ~/.oh-my-zsh"
  else
    print "Install Oh My Zsh? [Ynq] "
    case $stdin.gets.chomp
    when "Y", "y", ""
      puts "Installing Oh My Zsh"
      system %(git clone https://github.com/robbyrussell/oh-my-zsh.git "$HOME/.oh-my-zsh")
    when "q"
      exit
    else
      puts "Skipping Oh My Zsh, you will need to change ~/.zshrc"
    end
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
    puts "linking ~/.#{file}"
    link_file("$PWD/#{file}", file)
  end
end

def link_file(source, dotfile)
  system %(ln -s "#{source}" "$HOME/.#{dotfile}")
end

def replace_file(file)
  system %(rm -rf "$HOME/.#{file.sub(".erb", "")}")
  link_file("$PWD/#{file}", file)
end

def switch_to_zsh
  if /zsh/.match?(ENV["SHELL"])
    puts "Using Zsh"
  else
    print "Switch to Zsh? (recommended) [Ynq] "
    case $stdin.gets.chomp
    when "Y", "y", ""
      puts "Switching to Zsh"
      system %(chsh -s `which zsh`)
    when "q"
      exit
    else
      puts "Skipping Zsh"
    end
  end
end
