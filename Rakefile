require 'rake'
require 'erb'

desc "Install the dot files into user's home directory"
task :install do
  install_oh_my_zsh
  switch_to_zsh
  replace_all = false

  files = Dir['*'] - %w[Rakefile README.md LICENSE oh-my-zsh]
  files.reject! { |file| file.start_with?('Brewfile') }
  files << "oh-my-zsh/custom/aliases.zsh"
  files << "oh-my-zsh/custom/plugins/liveh2o"
  files.each do |file|
    if File.exist?(File.join(ENV['HOME'], ".#{file.sub('.erb', '')}"))
      if File.identical? file, File.join(ENV['HOME'], ".#{file.sub('.erb', '')}")
        puts "identical ~/.#{file.sub('.erb', '')}"
      elsif replace_all
        replace_file(file)
      else
        print "overwrite ~/.#{file.sub('.erb', '')}? [ynaq] "
        case $stdin.gets.chomp
        when 'a'
          replace_all = true
          replace_file(file)
        when 'y'
          replace_file(file)
        when 'q'
          exit
        else
          puts "skipping ~/.#{file.sub('.erb', '')}"
        end
      end
    else
      link_dotfile(file)
    end
  end
end

desc "Setup the environment"
task :env do
  puts "Installing Xcode Command Line Tools..."
  system %Q(xcode-select --install)
  puts "Installing Homebrew..."
  system '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"'
  puts "Installing all dependencies from the Brewfile"
  system %Q(brew bundle --file ~/.dotfiles/Brewfile)
  puts "Creating postgres user"
  system %Q(createuser -s postgres)
end

desc "Setup environment, install apps, and link dotfiles"
task :setup => [:env, :dotfiles]

def install_oh_my_zsh
  if File.exist?(File.join(ENV['HOME'], ".oh-my-zsh"))
    puts "found ~/.oh-my-zsh"
  else
    print "install oh-my-zsh? [ynq] "
    case $stdin.gets.chomp
    when 'y'
      puts "installing oh-my-zsh"
      system %Q{git clone https://github.com/robbyrussell/oh-my-zsh.git "$HOME/.oh-my-zsh"}
    when 'q'
      exit
    else
      puts "skipping oh-my-zsh, you will need to change ~/.zshrc"
    end
  end
end

def link_dotfile(file)
  if file =~ /.erb$/
    puts "generating ~/.#{file.sub('.erb', '')}"

    if file =~ /gitconfig/
      print "  git user.name: "
      ENV['GIT_USER_NAME'] = $stdin.gets.chomp
      print "  git user.email: "
      ENV['GIT_USER_EMAIL'] = $stdin.gets.chomp
    end

    File.open(File.join(ENV['HOME'], ".#{file.sub('.erb', '')}"), 'w') do |new_file|
      new_file.write ERB.new(File.read(file)).result(binding)
    end
  else
    puts "linking ~/.#{file}"
    link_file("$PWD/#{file}", file)
  end
end

def link_file(source, dotfile)
  system %Q{ln -s "#{source}" "$HOME/.#{dotfile}"}
end

def replace_file(file)
  system %Q{rm -rf "$HOME/.#{file.sub('.erb', '')}"}
  link_file("$PWD/#{file}", file)
end

def switch_to_zsh
  if ENV["SHELL"] =~ /zsh/
    puts "using zsh"
  else
    print "switch to zsh? (recommended) [ynq] "
    case $stdin.gets.chomp
    when 'y'
      puts "switching to zsh"
      system %Q{chsh -s `which zsh`}
    when 'q'
      exit
    else
      puts "skipping zsh"
    end
  end
end