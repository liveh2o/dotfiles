desc "Create PostgreSQL user"
task "pg:user" do
  print "username [postgres]: "
  username = $stdin.gets.chomp
  username = "postgres" if username.empty?
  puts "Creating PostgreSQL user: #{username}"
  system %(createuser -s #{username})
end
