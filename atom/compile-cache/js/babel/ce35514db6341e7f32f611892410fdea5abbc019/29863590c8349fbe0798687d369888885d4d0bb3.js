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
    files: ['*.c', '*.cc', '*.cpp', '*.cxx', '*.h', '*.hh', '*.hpp', '*.inc']
  },

  Shell: {
    word: /[0-9a-zA-Z_]+/,
    regexes: [/(^|\s){word}\s*\(\)\s*\{/],
    files: ['*.sh']
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFFZTtBQUNiLGNBQVksRUFBRTtBQUNaLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLEVBQUU7QUFDWCxTQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDakIsZ0JBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQztHQUNsRTs7QUFFRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFdBQU8sRUFBRSxFQUFFO0FBQ1gsU0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7QUFDbkMsZ0JBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDO0dBQzNEOztBQUVELFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1Asd0NBQXdDLEVBQ3hDLDhCQUE4QixFQUM5Qiw0QkFBNEIsRUFDNUIsNkJBQTZCLENBQzlCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2YsZ0JBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUM7R0FDN0M7O0FBRUQsY0FBWSxFQUFFO0FBQ1osUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixXQUFPLEVBQUUsQ0FDUCw0QkFBNEIsRUFDNUIsa0RBQWtELENBQ25EO0FBQ0QsU0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ25CLGdCQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0dBQzNDOztBQUVELFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1Asd0NBQXdDLEVBQ3hDLDhCQUE4QixFQUM5QixnQ0FBZ0MsRUFDaEMsNEJBQTRCLEVBQzVCLDZCQUE2QixFQUM3QixrREFBa0QsQ0FDbkQ7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDZixnQkFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQztHQUM3Qzs7QUFFRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCwyQkFBMkIsRUFDM0IseUJBQXlCLENBQzFCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCOztBQUVELEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxlQUFlO0FBQ3JCLFdBQU8sRUFBRSxDQUNQLCtCQUErQixFQUMvQixtQ0FBbUMsRUFDbkMsK0JBQStCLEVBQy9CLHNGQUFzRixFQUN0RixnQ0FBZ0MsQ0FDakM7QUFDRCxTQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztHQUN0Qzs7QUFFRCxLQUFHLEVBQUU7QUFDSCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCxvQ0FBb0MsQ0FDckM7QUFDRCxTQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7R0FDakI7O0FBRUQsTUFBSSxFQUFFO0FBQ0osUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsK0JBQStCLEVBQy9CLG1DQUFtQyxFQUNuQyxzRkFBc0YsQ0FDdkY7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7R0FDaEI7O0FBRUQsTUFBSSxFQUFFO0FBQ0osUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLEVBQzVCLDZCQUE2QixFQUM3QixxQ0FBcUMsRUFDckMsNkJBQTZCLEVBQzdCLHFDQUFxQyxFQUNyQyxtQ0FBbUMsRUFDbkMsbUNBQW1DLEVBQ25DLHNDQUFzQyxDQUN2QztBQUNELFNBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7R0FDckQ7O0FBRUQsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLENBQzdCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCOztBQUVELEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxlQUFlO0FBQ3JCLFdBQU8sRUFBRSxDQUNQLHlCQUF5QixFQUN6Qiw4QkFBOEIsRUFDOUIsbUVBQW1FLENBQ3BFO0FBQ0QsU0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztHQUMxQjs7QUFFRCxNQUFJLEVBQUU7QUFDSixRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCx5QkFBeUIsRUFDekIsb0NBQW9DLENBQ3JDO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztHQUN4Qjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCw0QkFBNEIsRUFDNUIsZ0NBQWdDLEVBQ2hDLDhCQUE4QixFQUM5QixpQ0FBaUMsRUFDakMsK0NBQStDLEVBQy9DLHFEQUFxRCxDQUN0RDtBQUNELFNBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7R0FDMUU7O0FBRUQsT0FBSyxFQUFFO0FBQ0wsUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsMEJBQTBCLENBQzNCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEh0bWxUZW1wbGV0ZToge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW10sXG4gICAgZmlsZXM6IFsnKi5odG1sJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0phdmFTY3JpcHQnLCAnQ29mZmVlU2NyaXB0JywgJ1R5cGVTY3JpcHQnLCAnUEhQJ10sXG4gIH0sXG5cbiAgSmF2YVNjcmlwdFRlbXBsZXRlOiB7XG4gICAgd29yZDogL1skMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXSxcbiAgICBmaWxlczogWycqLmpzeCcsICcqLnZ1ZScsICcqLmphZGUnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdDb2ZmZWVTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIEphdmFTY3JpcHQ6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpe3dvcmR9XFwoW14oXSo/XFwpXFxzKlxcey8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLmpzJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0NvZmZlZVNjcmlwdCcsICdUeXBlU2NyaXB0J10sXG4gIH0sXG5cbiAgQ29mZmVlU2NyaXB0OiB7XG4gICAgd29yZDogL1skMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxcc3xcXC58QCl7d29yZH1cXHMqWzo9XVxccyooXFwoW14oXSo/XFwpKT9cXHMqWz0tXT4vLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5jb2ZmZWUnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdUeXBlU2NyaXB0J10sXG4gIH0sXG5cbiAgVHlwZVNjcmlwdDoge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxcc3xcXC4pe3dvcmR9XFxzKls6PV1cXHMqZnVuY3Rpb25cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpZnVuY3Rpb25cXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWludGVyZmFjZVxccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKXt3b3JkfVxcKFteKF0qP1xcKVxccypcXHsvLFxuICAgICAgLyhefFxcc3xcXC58QCl7d29yZH1cXHMqWzo9XVxccyooXFwoW14oXSo/XFwpKT9cXHMqWz0tXT4vLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi50cyddLFxuICAgIGRlcGVuZGVuY2llczogWydKYXZhU2NyaXB0JywgJ0NvZmZlZVNjcmlwdCddLFxuICB9LFxuXG4gIFB5dGhvbjoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccylkZWZcXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnB5J10sXG4gIH0sXG5cbiAgUEhQOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccylpbnRlcmZhY2VcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccyl0cmFpdFxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKShzdGF0aWNcXHMrKT8oKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClcXHMrKT8oc3RhdGljXFxzKyk/ZnVuY3Rpb25cXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWNvbnN0XFxzK3t3b3JkfShcXHN8PXw7fCQpLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoucGhwJywgJyoucGhwMycsICcqLnBodG1sJ10sXG4gIH0sXG5cbiAgQVNQOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpKGZ1bmN0aW9ufHN1YilcXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLmFzcCddLFxuICB9LFxuXG4gIEhhY2s6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKWludGVyZmFjZVxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKShzdGF0aWNcXHMrKT8oKHB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClcXHMrKT8oc3RhdGljXFxzKyk/ZnVuY3Rpb25cXHMre3dvcmR9XFxzKlxcKC8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLmhoJ10sXG4gIH0sXG5cbiAgUnVieToge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccyltb2R1bGVcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWRlZlxccysoPzpzZWxmXFwuKT97d29yZH1cXHMqXFwoPy8sXG4gICAgICAvKF58XFxzKXNjb3BlXFxzKzp7d29yZH1cXHMqXFwoPy8sXG4gICAgICAvKF58XFxzKWF0dHJfYWNjZXNzb3JcXHMrOnt3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccylhdHRyX3JlYWRlclxccys6e3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWF0dHJfd3JpdGVyXFxzKzp7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpZGVmaW5lX21ldGhvZFxccys6P3t3b3JkfVxccypcXCg/LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoucmInLCAnKi5ydScsICcqLmhhbWwnLCAnKi5lcmInLCAnKi5yYWtlJ10sXG4gIH0sXG5cbiAgUHVwcGV0OiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnBwJ10sXG4gIH0sXG5cbiAgS1JMOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpREVGXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccylERUNMXFxzK1xcdyo/e3dvcmR9XFxzKj0/LyxcbiAgICAgIC8oXnxcXHMpKFNJR05BTHxJTlR8Qk9PTHxSRUFMfFNUUlVDfENIQVJ8RU5VTXxFWFR8XFxzKVxccypcXHcqe3dvcmR9LiovLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5zcmMnLCAnKi5kYXQnXSxcbiAgfSxcblxuICBQZXJsOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpc3ViXFxzK3t3b3JkfVxccypcXHsvLFxuICAgICAgLyhefFxccylwYWNrYWdlXFxzKyhcXHcrOjopKnt3b3JkfVxccyo7LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoucG0nLCAnKi5wbCddLFxuICB9LFxuXG4gICdDL0MrKyc6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfDopLyxcbiAgICAgIC8oXnxcXHMpc3RydWN0XFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpZW51bVxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKSNkZWZpbmVcXHMre3dvcmR9KFxcc3xcXCh8JCkvLFxuICAgICAgLyhefFxccylmaWxlc2RlZlxccy4qKFxcc3xcXCp8XFwoKXt3b3JkfShcXHN8O3xcXCl8JCkvLFxuICAgICAgLyhefFxcc3xcXCp8OnwmKXt3b3JkfVxccypcXCguKlxcKShcXHMqfFxccypjb25zdFxccyopKFxce3wkKS8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLmMnLCAnKi5jYycsICcqLmNwcCcsICcqLmN4eCcsICcqLmgnLCAnKi5oaCcsICcqLmhwcCcsICcqLmluYyddLFxuICB9LFxuXG4gIFNoZWxsOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpe3dvcmR9XFxzKlxcKFxcKVxccypcXHsvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5zaCddLFxuICB9LFxufTtcbiJdfQ==