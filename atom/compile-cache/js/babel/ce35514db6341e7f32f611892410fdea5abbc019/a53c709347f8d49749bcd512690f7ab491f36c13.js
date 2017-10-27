Object.defineProperty(exports, '__esModule', {
  value: true
});
/** @babel */

exports['default'] = {
  HtmlTemplete: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [],
    files: ['*.html'],
    dependencies: ['JavaScript', 'CoffeeScript', 'TypeScript', 'PHP']
  },

  JavaScriptTemplete: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [],
    files: ['*.jsx', '*.vue', '*.jade'],
    dependencies: ['JavaScript', 'CoffeeScript', 'TypeScript']
  },

  JavaScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [/(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s)class\s+{word}(\s|$)/, /(^|\s){word}\([^(]*?\)\s*\{/],
    files: ['*.js'],
    dependencies: ['CoffeeScript', 'TypeScript']
  },

  CoffeeScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s|\.|@){word}\s*[:=]\s*(\([^(]*?\))?\s*[=-]>/],
    files: ['*.coffee'],
    dependencies: ['JavaScript', 'TypeScript']
  },

  TypeScript: {
    word: /[$0-9a-zA-Z_]+/,
    regexes: [/(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s)interface\s+{word}(\s|$)/, /(^|\s)class\s+{word}(\s|$)/, /(^|\s){word}\([^(]*?\)\s*\{/, /(^|\s|\.|@){word}\s*[:=]\s*(\([^(]*?\))?\s*[=-]>/],
    files: ['*.ts'],
    dependencies: ['JavaScript', 'CoffeeScript']
  },

  Python: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}\s*\(/, /(^|\s)def\s+{word}\s*\(/],
    files: ['*.py']
  },

  PHP: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|\{|$)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)trait\s+{word}(\s|\{|$)/, /(^|\s)(static\s+)?((public|private|protected)\s+)?(static\s+)?function\s+{word}\s*\(/, /(^|\s)const\s+{word}(\s|=|;|$)/],
    files: ['*.php', '*.php3', '*.phtml']
  },

  ASP: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)(function|sub)\s+{word}\s*\(/],
    files: ['*.asp']
  },

  Hack: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|\{|$)/, /(^|\s)interface\s+{word}(\s|\{|$)/, /(^|\s)(static\s+)?((public|private|protected)\s+)?(static\s+)?function\s+{word}\s*\(/],
    files: ['*.hh']
  },

  Ruby: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|$)/, /(^|\s)module\s+{word}(\s|$)/, /(^|\s)def\s+(?:self\.)?{word}\s*\(?/, /(^|\s)scope\s+:{word}\s*\(?/, /(^|\s)attr_accessor\s+:{word}(\s|$)/, /(^|\s)attr_reader\s+:{word}(\s|$)/, /(^|\s)attr_writer\s+:{word}(\s|$)/, /(^|\s)define_method\s+:?{word}\s*\(?/],
    files: ['*.rb', '*.ru', '*.haml', '*.erb', '*.rake']
  },

  Puppet: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|$)/],
    files: ['*.pp']
  },

  KRL: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)DEF\s+{word}\s*\(/, /(^|\s)DECL\s+\w*?{word}\s*=?/, /(^|\s)(SIGNAL|INT|BOOL|REAL|STRUC|CHAR|ENUM|EXT|\s)\s*\w*{word}.*/],
    files: ['*.src', '*.dat']
  },

  Perl: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)sub\s+{word}\s*\{/, /(^|\s)package\s+(\w+::)*{word}\s*;/],
    files: ['*.pm', '*.pl']
  },

  'C/C++': {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s)class\s+{word}(\s|:)/, /(^|\s)struct\s+{word}(\s|\{|$)/, /(^|\s)enum\s+{word}(\s|\{|$)/, /(^|\s)#define\s+{word}(\s|\(|$)/, /(^|\s)filesdef\s.*(\s|\*|\(){word}(\s|;|\)|$)/, /(^|\s|\*|:|&){word}\s*\(.*\)(\s*|\s*const\s*)(\{|$)/],
    files: ['*.c', '*.cc', '*.cpp', '*.h', '*.hh', '*.hpp', '*.inc']
  },

  Shell: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s){word}\s*\(\)\s*\{/],
    files: ['*.sh']
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFFZTtBQUNiLGNBQVksRUFBRTtBQUNaLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLEVBQUU7QUFDWCxTQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDakIsZ0JBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQztHQUNsRTs7QUFFRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFdBQU8sRUFBRSxFQUFFO0FBQ1gsU0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7QUFDbkMsZ0JBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDO0dBQzNEOztBQUVELFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1Asd0NBQXdDLEVBQ3hDLDhCQUE4QixFQUM5Qiw0QkFBNEIsRUFDNUIsNkJBQTZCLENBQzlCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2YsZ0JBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUM7R0FDN0M7O0FBRUQsY0FBWSxFQUFFO0FBQ1osUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixXQUFPLEVBQUUsQ0FDUCw0QkFBNEIsRUFDNUIsa0RBQWtELENBQ25EO0FBQ0QsU0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ25CLGdCQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0dBQzNDOztBQUVELFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1Asd0NBQXdDLEVBQ3hDLDhCQUE4QixFQUM5QixnQ0FBZ0MsRUFDaEMsNEJBQTRCLEVBQzVCLDZCQUE2QixFQUM3QixrREFBa0QsQ0FDbkQ7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDZixnQkFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQztHQUM3Qzs7QUFFRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCwyQkFBMkIsRUFDM0IseUJBQXlCLENBQzFCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCOztBQUVELEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxlQUFlO0FBQ3JCLFdBQU8sRUFBRSxDQUNQLCtCQUErQixFQUMvQixtQ0FBbUMsRUFDbkMsK0JBQStCLEVBQy9CLHNGQUFzRixFQUN0RixnQ0FBZ0MsQ0FDakM7QUFDRCxTQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztHQUN0Qzs7QUFFRCxLQUFHLEVBQUU7QUFDSCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCxvQ0FBb0MsQ0FDckM7QUFDRCxTQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7R0FDakI7O0FBRUQsTUFBSSxFQUFFO0FBQ0osUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsK0JBQStCLEVBQy9CLG1DQUFtQyxFQUNuQyxzRkFBc0YsQ0FDdkY7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7R0FDaEI7O0FBRUQsTUFBSSxFQUFFO0FBQ0osUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLEVBQzVCLDZCQUE2QixFQUM3QixxQ0FBcUMsRUFDckMsNkJBQTZCLEVBQzdCLHFDQUFxQyxFQUNyQyxtQ0FBbUMsRUFDbkMsbUNBQW1DLEVBQ25DLHNDQUFzQyxDQUN2QztBQUNELFNBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7R0FDckQ7O0FBRUQsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLENBQzdCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCOztBQUVELEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxlQUFlO0FBQ3JCLFdBQU8sRUFBRSxDQUNQLHlCQUF5QixFQUN6Qiw4QkFBOEIsRUFDOUIsbUVBQW1FLENBQ3BFO0FBQ0QsU0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztHQUMxQjs7QUFFRCxNQUFJLEVBQUU7QUFDSixRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCx5QkFBeUIsRUFDekIsb0NBQW9DLENBQ3JDO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztHQUN4Qjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCw0QkFBNEIsRUFDNUIsZ0NBQWdDLEVBQ2hDLDhCQUE4QixFQUM5QixpQ0FBaUMsRUFDakMsK0NBQStDLEVBQy9DLHFEQUFxRCxDQUN0RDtBQUNELFNBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztHQUNqRTs7QUFFRCxPQUFLLEVBQUU7QUFDTCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCwwQkFBMEIsQ0FDM0I7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7R0FDaEI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ290by1kZWZpbml0aW9uL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSHRtbFRlbXBsZXRlOiB7XG4gICAgd29yZDogL1skMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXSxcbiAgICBmaWxlczogWycqLmh0bWwnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdDb2ZmZWVTY3JpcHQnLCAnVHlwZVNjcmlwdCcsICdQSFAnXSxcbiAgfSxcblxuICBKYXZhU2NyaXB0VGVtcGxldGU6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtdLFxuICAgIGZpbGVzOiBbJyouanN4JywgJyoudnVlJywgJyouamFkZSddLFxuICAgIGRlcGVuZGVuY2llczogWydKYXZhU2NyaXB0JywgJ0NvZmZlZVNjcmlwdCcsICdUeXBlU2NyaXB0J10sXG4gIH0sXG5cbiAgSmF2YVNjcmlwdDoge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxcc3xcXC4pe3dvcmR9XFxzKls6PV1cXHMqZnVuY3Rpb25cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpZnVuY3Rpb25cXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccyl7d29yZH1cXChbXihdKj9cXClcXHMqXFx7LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouanMnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnQ29mZmVlU2NyaXB0JywgJ1R5cGVTY3JpcHQnXSxcbiAgfSxcblxuICBDb2ZmZWVTY3JpcHQ6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzfFxcLnxAKXt3b3JkfVxccypbOj1dXFxzKihcXChbXihdKj9cXCkpP1xccypbPS1dPi8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLmNvZmZlZSddLFxuICAgIGRlcGVuZGVuY2llczogWydKYXZhU2NyaXB0JywgJ1R5cGVTY3JpcHQnXSxcbiAgfSxcblxuICBUeXBlU2NyaXB0OiB7XG4gICAgd29yZDogL1skMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzfFxcLil7d29yZH1cXHMqWzo9XVxccypmdW5jdGlvblxccypcXCgvLFxuICAgICAgLyhefFxccylmdW5jdGlvblxccyt7d29yZH1cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpaW50ZXJmYWNlXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpe3dvcmR9XFwoW14oXSo/XFwpXFxzKlxcey8sXG4gICAgICAvKF58XFxzfFxcLnxAKXt3b3JkfVxccypbOj1dXFxzKihcXChbXihdKj9cXCkpP1xccypbPS1dPi8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnRzJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0phdmFTY3JpcHQnLCAnQ29mZmVlU2NyaXB0J10sXG4gIH0sXG5cbiAgUHl0aG9uOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWRlZlxccyt7d29yZH1cXHMqXFwoLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoucHknXSxcbiAgfSxcblxuICBQSFA6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKWludGVyZmFjZVxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKXRyYWl0XFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpKHN0YXRpY1xccyspPygocHVibGljfHByaXZhdGV8cHJvdGVjdGVkKVxccyspPyhzdGF0aWNcXHMrKT9mdW5jdGlvblxccyt7d29yZH1cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpY29uc3RcXHMre3dvcmR9KFxcc3w9fDt8JCkvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5waHAnLCAnKi5waHAzJywgJyoucGh0bWwnXSxcbiAgfSxcblxuICBBU1A6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccykoZnVuY3Rpb258c3ViKVxccyt7d29yZH1cXHMqXFwoLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouYXNwJ10sXG4gIH0sXG5cbiAgSGFjazoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpaW50ZXJmYWNlXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpKHN0YXRpY1xccyspPygocHVibGljfHByaXZhdGV8cHJvdGVjdGVkKVxccyspPyhzdGF0aWNcXHMrKT9mdW5jdGlvblxccyt7d29yZH1cXHMqXFwoLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouaGgnXSxcbiAgfSxcblxuICBSdWJ5OiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKW1vZHVsZVxccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpZGVmXFxzKyg/OnNlbGZcXC4pP3t3b3JkfVxccypcXCg/LyxcbiAgICAgIC8oXnxcXHMpc2NvcGVcXHMrOnt3b3JkfVxccypcXCg/LyxcbiAgICAgIC8oXnxcXHMpYXR0cl9hY2Nlc3Nvclxccys6e3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWF0dHJfcmVhZGVyXFxzKzp7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpYXR0cl93cml0ZXJcXHMrOnt3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccylkZWZpbmVfbWV0aG9kXFxzKzo/e3dvcmR9XFxzKlxcKD8vLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5yYicsICcqLnJ1JywgJyouaGFtbCcsICcqLmVyYicsICcqLnJha2UnXSxcbiAgfSxcblxuICBQdXBwZXQ6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoucHAnXSxcbiAgfSxcblxuICBLUkw6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccylERUZcXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgICAvKF58XFxzKURFQ0xcXHMrXFx3Kj97d29yZH1cXHMqPT8vLFxuICAgICAgLyhefFxccykoU0lHTkFMfElOVHxCT09MfFJFQUx8U1RSVUN8Q0hBUnxFTlVNfEVYVHxcXHMpXFxzKlxcdyp7d29yZH0uKi8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnNyYycsICcqLmRhdCddLFxuICB9LFxuXG4gIFBlcmw6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccylzdWJcXHMre3dvcmR9XFxzKlxcey8sXG4gICAgICAvKF58XFxzKXBhY2thZ2VcXHMrKFxcdys6Oikqe3dvcmR9XFxzKjsvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5wbScsICcqLnBsJ10sXG4gIH0sXG5cbiAgJ0MvQysrJzoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8OikvLFxuICAgICAgLyhefFxccylzdHJ1Y3RcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccyllbnVtXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpI2RlZmluZVxccyt7d29yZH0oXFxzfFxcKHwkKS8sXG4gICAgICAvKF58XFxzKWZpbGVzZGVmXFxzLiooXFxzfFxcKnxcXCgpe3dvcmR9KFxcc3w7fFxcKXwkKS8sXG4gICAgICAvKF58XFxzfFxcKnw6fCYpe3dvcmR9XFxzKlxcKC4qXFwpKFxccyp8XFxzKmNvbnN0XFxzKikoXFx7fCQpLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouYycsICcqLmNjJywgJyouY3BwJywgJyouaCcsICcqLmhoJywgJyouaHBwJywgJyouaW5jJ10sXG4gIH0sXG5cbiAgU2hlbGw6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyl7d29yZH1cXHMqXFwoXFwpXFxzKlxcey8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnNoJ10sXG4gIH0sXG59O1xuIl19