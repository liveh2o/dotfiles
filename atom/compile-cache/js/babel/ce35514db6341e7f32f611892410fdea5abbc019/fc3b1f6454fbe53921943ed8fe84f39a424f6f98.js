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
    regexes: [/(^|\s|\.){word}\s*[:=]\s*function\s*\(/, /(^|\s)function\s+{word}\s*\(/, /(^|\s)class\s+{word}(\s|$)/, /(^|\s){word}\s*\([^(]*?\)\s*\{/],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9nb3RvLWRlZmluaXRpb24vbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFFZTtBQUNiLGNBQVksRUFBRTtBQUNaLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLEVBQUU7QUFDWCxTQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7QUFDakIsZ0JBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQztHQUNsRTs7QUFFRCxvQkFBa0IsRUFBRTtBQUNsQixRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFdBQU8sRUFBRSxFQUFFO0FBQ1gsU0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7QUFDbkMsZ0JBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDO0dBQzNEOztBQUVELFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1Asd0NBQXdDLEVBQ3hDLDhCQUE4QixFQUM5Qiw0QkFBNEIsRUFDNUIsZ0NBQWdDLENBQ2pDO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQ2YsZ0JBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUM7R0FDN0M7O0FBRUQsY0FBWSxFQUFFO0FBQ1osUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixXQUFPLEVBQUUsQ0FDUCw0QkFBNEIsRUFDNUIsa0RBQWtELENBQ25EO0FBQ0QsU0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQ25CLGdCQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0dBQzNDOztBQUVELFlBQVUsRUFBRTtBQUNWLFFBQUksRUFBRSxnQkFBZ0I7QUFDdEIsV0FBTyxFQUFFLENBQ1Asd0NBQXdDLEVBQ3hDLDhCQUE4QixFQUM5QixnQ0FBZ0MsRUFDaEMsNEJBQTRCLEVBQzVCLDZCQUE2QixFQUM3QixrREFBa0QsQ0FDbkQ7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDZixnQkFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQztHQUM3Qzs7QUFFRCxRQUFNLEVBQUU7QUFDTixRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCwyQkFBMkIsRUFDM0IseUJBQXlCLENBQzFCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCOztBQUVELEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxlQUFlO0FBQ3JCLFdBQU8sRUFBRSxDQUNQLCtCQUErQixFQUMvQixtQ0FBbUMsRUFDbkMsK0JBQStCLEVBQy9CLHNGQUFzRixFQUN0RixnQ0FBZ0MsQ0FDakM7QUFDRCxTQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztHQUN0Qzs7QUFFRCxLQUFHLEVBQUU7QUFDSCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCxvQ0FBb0MsQ0FDckM7QUFDRCxTQUFLLEVBQUUsQ0FBQyxPQUFPLENBQUM7R0FDakI7O0FBRUQsTUFBSSxFQUFFO0FBQ0osUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsK0JBQStCLEVBQy9CLG1DQUFtQyxFQUNuQyxzRkFBc0YsQ0FDdkY7QUFDRCxTQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7R0FDaEI7O0FBRUQsTUFBSSxFQUFFO0FBQ0osUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLEVBQzVCLDZCQUE2QixFQUM3QixxQ0FBcUMsRUFDckMsNkJBQTZCLEVBQzdCLHFDQUFxQyxFQUNyQyxtQ0FBbUMsRUFDbkMsbUNBQW1DLEVBQ25DLHNDQUFzQyxDQUN2QztBQUNELFNBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7R0FDckQ7O0FBRUQsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsNEJBQTRCLENBQzdCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCOztBQUVELEtBQUcsRUFBRTtBQUNILFFBQUksRUFBRSxlQUFlO0FBQ3JCLFdBQU8sRUFBRSxDQUNQLHlCQUF5QixFQUN6Qiw4QkFBOEIsRUFDOUIsbUVBQW1FLENBQ3BFO0FBQ0QsU0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztHQUMxQjs7QUFFRCxNQUFJLEVBQUU7QUFDSixRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCx5QkFBeUIsRUFDekIsb0NBQW9DLENBQ3JDO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztHQUN4Qjs7QUFFRCxTQUFPLEVBQUU7QUFDUCxRQUFJLEVBQUUsZUFBZTtBQUNyQixXQUFPLEVBQUUsQ0FDUCw0QkFBNEIsRUFDNUIsZ0NBQWdDLEVBQ2hDLDhCQUE4QixFQUM5QixpQ0FBaUMsRUFDakMsK0NBQStDLEVBQy9DLHFEQUFxRCxDQUN0RDtBQUNELFNBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7R0FDMUU7O0FBRUQsT0FBSyxFQUFFO0FBQ0wsUUFBSSxFQUFFLGVBQWU7QUFDckIsV0FBTyxFQUFFLENBQ1AsMEJBQTBCLENBQzNCO0FBQ0QsU0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0dBQ2hCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dvdG8tZGVmaW5pdGlvbi9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEh0bWxUZW1wbGV0ZToge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW10sXG4gICAgZmlsZXM6IFsnKi5odG1sJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0phdmFTY3JpcHQnLCAnQ29mZmVlU2NyaXB0JywgJ1R5cGVTY3JpcHQnLCAnUEhQJ10sXG4gIH0sXG5cbiAgSmF2YVNjcmlwdFRlbXBsZXRlOiB7XG4gICAgd29yZDogL1skMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXSxcbiAgICBmaWxlczogWycqLmpzeCcsICcqLnZ1ZScsICcqLmphZGUnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdDb2ZmZWVTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIEphdmFTY3JpcHQ6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpe3dvcmR9XFxzKlxcKFteKF0qP1xcKVxccypcXHsvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5qcyddLFxuICAgIGRlcGVuZGVuY2llczogWydDb2ZmZWVTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIENvZmZlZVNjcmlwdDoge1xuICAgIHdvcmQ6IC9bJDAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHN8XFwufEApe3dvcmR9XFxzKls6PV1cXHMqKFxcKFteKF0qP1xcKSk/XFxzKls9LV0+LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouY29mZmVlJ10sXG4gICAgZGVwZW5kZW5jaWVzOiBbJ0phdmFTY3JpcHQnLCAnVHlwZVNjcmlwdCddLFxuICB9LFxuXG4gIFR5cGVTY3JpcHQ6IHtcbiAgICB3b3JkOiAvWyQwLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHN8XFwuKXt3b3JkfVxccypbOj1dXFxzKmZ1bmN0aW9uXFxzKlxcKC8sXG4gICAgICAvKF58XFxzKWZ1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccylpbnRlcmZhY2VcXHMre3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccyl7d29yZH1cXChbXihdKj9cXClcXHMqXFx7LyxcbiAgICAgIC8oXnxcXHN8XFwufEApe3dvcmR9XFxzKls6PV1cXHMqKFxcKFteKF0qP1xcKSk/XFxzKls9LV0+LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyoudHMnXSxcbiAgICBkZXBlbmRlbmNpZXM6IFsnSmF2YVNjcmlwdCcsICdDb2ZmZWVTY3JpcHQnXSxcbiAgfSxcblxuICBQeXRob246IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH1cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpZGVmXFxzK3t3b3JkfVxccypcXCgvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5weSddLFxuICB9LFxuXG4gIFBIUDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpaW50ZXJmYWNlXFxzK3t3b3JkfShcXHN8XFx7fCQpLyxcbiAgICAgIC8oXnxcXHMpdHJhaXRcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccykoc3RhdGljXFxzKyk/KChwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXFxzKyk/KHN0YXRpY1xccyspP2Z1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgICAgLyhefFxccyljb25zdFxccyt7d29yZH0oXFxzfD18O3wkKS8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnBocCcsICcqLnBocDMnLCAnKi5waHRtbCddLFxuICB9LFxuXG4gIEFTUDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKShmdW5jdGlvbnxzdWIpXFxzK3t3b3JkfVxccypcXCgvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5hc3AnXSxcbiAgfSxcblxuICBIYWNrOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccylpbnRlcmZhY2VcXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccykoc3RhdGljXFxzKyk/KChwdWJsaWN8cHJpdmF0ZXxwcm90ZWN0ZWQpXFxzKyk/KHN0YXRpY1xccyspP2Z1bmN0aW9uXFxzK3t3b3JkfVxccypcXCgvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5oaCddLFxuICB9LFxuXG4gIFJ1Ynk6IHtcbiAgICB3b3JkOiAvWzAtOWEtekEtWl9dKy8sXG4gICAgcmVnZXhlczogW1xuICAgICAgLyhefFxccyljbGFzc1xccyt7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpbW9kdWxlXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccylkZWZcXHMrKD86c2VsZlxcLik/e3dvcmR9XFxzKlxcKD8vLFxuICAgICAgLyhefFxccylzY29wZVxccys6e3dvcmR9XFxzKlxcKD8vLFxuICAgICAgLyhefFxccylhdHRyX2FjY2Vzc29yXFxzKzp7d29yZH0oXFxzfCQpLyxcbiAgICAgIC8oXnxcXHMpYXR0cl9yZWFkZXJcXHMrOnt3b3JkfShcXHN8JCkvLFxuICAgICAgLyhefFxccylhdHRyX3dyaXRlclxccys6e3dvcmR9KFxcc3wkKS8sXG4gICAgICAvKF58XFxzKWRlZmluZV9tZXRob2RcXHMrOj97d29yZH1cXHMqXFwoPy8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnJiJywgJyoucnUnLCAnKi5oYW1sJywgJyouZXJiJywgJyoucmFrZSddLFxuICB9LFxuXG4gIFB1cHBldDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKWNsYXNzXFxzK3t3b3JkfShcXHN8JCkvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5wcCddLFxuICB9LFxuXG4gIEtSTDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKURFRlxccyt7d29yZH1cXHMqXFwoLyxcbiAgICAgIC8oXnxcXHMpREVDTFxccytcXHcqP3t3b3JkfVxccyo9Py8sXG4gICAgICAvKF58XFxzKShTSUdOQUx8SU5UfEJPT0x8UkVBTHxTVFJVQ3xDSEFSfEVOVU18RVhUfFxccylcXHMqXFx3Knt3b3JkfS4qLyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouc3JjJywgJyouZGF0J10sXG4gIH0sXG5cbiAgUGVybDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKXN1Ylxccyt7d29yZH1cXHMqXFx7LyxcbiAgICAgIC8oXnxcXHMpcGFja2FnZVxccysoXFx3Kzo6KSp7d29yZH1cXHMqOy8sXG4gICAgXSxcbiAgICBmaWxlczogWycqLnBtJywgJyoucGwnXSxcbiAgfSxcblxuICAnQy9DKysnOiB7XG4gICAgd29yZDogL1swLTlhLXpBLVpfXSsvLFxuICAgIHJlZ2V4ZXM6IFtcbiAgICAgIC8oXnxcXHMpY2xhc3NcXHMre3dvcmR9KFxcc3w6KS8sXG4gICAgICAvKF58XFxzKXN0cnVjdFxccyt7d29yZH0oXFxzfFxce3wkKS8sXG4gICAgICAvKF58XFxzKWVudW1cXHMre3dvcmR9KFxcc3xcXHt8JCkvLFxuICAgICAgLyhefFxccykjZGVmaW5lXFxzK3t3b3JkfShcXHN8XFwofCQpLyxcbiAgICAgIC8oXnxcXHMpZmlsZXNkZWZcXHMuKihcXHN8XFwqfFxcKCl7d29yZH0oXFxzfDt8XFwpfCQpLyxcbiAgICAgIC8oXnxcXHN8XFwqfDp8Jil7d29yZH1cXHMqXFwoLipcXCkoXFxzKnxcXHMqY29uc3RcXHMqKShcXHt8JCkvLFxuICAgIF0sXG4gICAgZmlsZXM6IFsnKi5jJywgJyouY2MnLCAnKi5jcHAnLCAnKi5jeHgnLCAnKi5oJywgJyouaGgnLCAnKi5ocHAnLCAnKi5pbmMnXSxcbiAgfSxcblxuICBTaGVsbDoge1xuICAgIHdvcmQ6IC9bMC05YS16QS1aX10rLyxcbiAgICByZWdleGVzOiBbXG4gICAgICAvKF58XFxzKXt3b3JkfVxccypcXChcXClcXHMqXFx7LyxcbiAgICBdLFxuICAgIGZpbGVzOiBbJyouc2gnXSxcbiAgfSxcbn07XG4iXX0=