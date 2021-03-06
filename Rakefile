require 'rake'
require 'erb'

desc "install the dot files into user's home directory"
task :install do
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

  link_default_ruby
end

desc "Download "
task :apps do
  puts "Installing 1Password..."
  system %Q(brew cask install 1password)
  puts "Installing Alfred..."
  system %Q(brew cask install alfred)
  puts "Installing Atom.io..."
  system %Q(brew cask install atom)
  puts "Installing Deckset..."
  system %Q(brew cask install daisydisk)
  puts "Installing GitHub Desktop..."
  system %Q(brew cask install github)
  puts "Installing iTerm2..."
  system %Q(brew cask install iterm2)
  puts "Installing Little Snitch..."
  system %Q(brew cask install little-snitch)
  puts "Installing Sharemouse..."
  system %Q(brew cask install sharemouse)
end

desc "Setup the environment"
task :setup do
  puts "Installing Xcode Command Line Tools..."
  system %Q(xcode-select --install)
  puts "Installing Homebrew..."
  system %Q(/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)")
  puts "Installing Git..."
  system %Q(brew install git)
  puts "Installing RVM..."
  system %Q(curl -sSL https://get.rvm.io | bash -s stable --rails)
  puts "Installing JDK..."
  system %Q(brew tap AdoptOpenJDK/openjdk && brew cask install adoptopenjdk)
end

desc "link default ruby"
task :link_default_ruby do
  link_default_ruby
end

desc "convert OSX keychain to certfile to fix OpenSSL issues"
task :convert_osx_keychain_to_certfile do
  # https://gist.github.com/docwhat/24f0add92c2f43d8ec9e#file-keychain2certfile-rb-L30
  require 'fileutils'
  require 'openssl'
  require 'digest/md5'
  require 'digest/sha1'

  CERT_FILE = ENV.fetch('SSL_CERT_FILE', '/usr/local/etc/openssl/cert.pem')

  keychains = %w(
    /Library/Keychains/System.keychain
    /System/Library/Keychains/SystemRootCertificates.keychain
  )

  # Get all the certs!
  # We filter out:
  # * Not yet valid certificates
  # * Expired certificates
  # * Certificates with multiple extendedKeyUsage extensions break Java/JRuby.
  #   See https://github.com/jruby/jruby-openssl/issues/56
  certs = `security find-certificate -a -p #{keychains.join(' ')}`
          .scan(/-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----/m)
          .map { |pem| OpenSSL::X509::Certificate.new pem }
          .reject { |cert| cert.not_before > Time.now }
          .reject { |cert| cert.not_after < Time.now }
          .reject { |cert| cert.extensions.map(&:oid).count { |x| x == 'extendedKeyUsage' } > 1 }

  # Write out the new certs.
  File.open(CERT_FILE, 'w') do |f|
    certs.each do |cert|
      md5_fingerprint  = Digest::MD5.hexdigest(cert.to_der).upcase
      sha1_fingerprint = Digest::SHA1.hexdigest(cert.to_der).upcase

      f.puts
      f.puts '=' * 60
      f.puts "Subject: #{cert.subject}"
      f.puts "Issuer:  #{cert.issuer}" unless cert.issuer.to_s == cert.subject.to_s
      f.puts
      f.puts "Not Before:       #{cert.not_before}"
      f.puts "Not After:        #{cert.not_after}"
      f.puts "MD5 Fingerprint:  #{md5_fingerprint}"
      f.puts "SHA1 Fingerprint: #{sha1_fingerprint}"
      f.puts
      f.puts cert.to_pem
    end
  end

  puts <<-MESSAGE
  You need to ensure that you export the SSL_CERT_FILE environment variable.

  In sh/zsh/bash use:

      export SSL_CERT_FILE='#{CERT_FILE}'
  MESSAGE
end

def link_default_ruby
  puts "linking default ruby"
  system %Q{ln -s -i "$rvm_path/rubies/default/bin/ruby" "$rvm_bin_path/default_ruby"}
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
