require 'rake'
require 'erb'

desc "Install the dot files into user's home directory"
task :dotfiles do
  replace_all = false
  Dir['*'].each do |file|
    next if %w[Rakefile README.rdoc LICENSE].include? file

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

desc "setup the environment"
task :env do
  puts "Installing oh-my-zsh..."
  system 'sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"'
  puts "Installing Xcode Command Line Tools..."
  system %Q(xcode-select --install)
  puts "Installing Homebrew..."
  system '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"'
  puts "Installing all dependencies from the Brewfile"
  system %Q(brew bundle --file ~/.dotfiles/Brewfile)
  puts "Creating postgres user"
  system %Q(createuser -s postgres)
desc "link default ruby"
task :link_default_ruby do
  link_default_ruby
end

desc "Link dotfiles"
task :install => [:dotfiles]
desc "Setup environment, install apps, and link dotfiles"

def link_default_ruby
  puts "linking default ruby"
  system %Q{ln -s -i "$rvm_path/rubies/default/bin/ruby" "$rvm_bin_path/default_ruby"}
end
task :setup => [:env, :dotfiles]

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
