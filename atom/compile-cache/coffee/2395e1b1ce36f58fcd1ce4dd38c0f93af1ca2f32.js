(function() {
  var TextFormatter;

  TextFormatter = require('../lib/text-formatter');

  describe('htmlEscaped', function() {
    return it('escapes html tags', function() {
      var formatter;
      formatter = new TextFormatter('<b>bold</b> text');
      return expect(formatter.htmlEscaped().text).toBe('&lt;b&gt;bold&lt;/b&gt; text');
    });
  });

  describe('fileLinked', function() {
    it('adds atom hyperlinks on files with line numbers', function() {
      var formatter, text;
      text = '# ./foo/bar_spec.rb:123:in `block (3 levels) in <top (required)>';
      formatter = new TextFormatter(text);
      return expect(formatter.fileLinked().text).toBe('# <a href="./foo/bar_spec.rb" ' + 'data-line="123" data-file="./foo/bar_spec.rb">./foo/bar_spec.rb:123</a>' + ':in `block (3 levels) in <top (required)>');
    });
    it('adds links when line number is at the end of line', function() {
      var formatter, text;
      text = './foo/bar_spec.rb:123\n';
      formatter = new TextFormatter(text);
      return expect(formatter.fileLinked().text).toBe('<a href="./foo/bar_spec.rb" ' + 'data-line="123" data-file="./foo/bar_spec.rb">./foo/bar_spec.rb:123</a>\n');
    });
    it('adds links when file paths is wrapped with color marks', function() {
      var formatter, text;
      text = '[31m./foo/bar_spec.rb:123[0m';
      formatter = new TextFormatter(text);
      return expect(formatter.fileLinked().text).toBe('[31m<a href="./foo/bar_spec.rb" ' + 'data-line="123" data-file="./foo/bar_spec.rb">./foo/bar_spec.rb:123</a>[0m');
    });
    return it('adds links when file path is absolute', function() {
      var formatter, text;
      text = '/foo/bar_spec.rb:123';
      formatter = new TextFormatter(text);
      return expect(formatter.fileLinked().text).toBe('<a href="/foo/bar_spec.rb" ' + 'data-line="123" data-file="/foo/bar_spec.rb">/foo/bar_spec.rb:123</a>');
    });
  });

  describe('colorized', function() {
    return it('corretly sets colors to fail/pass marks', function() {
      var formatter;
      formatter = new TextFormatter("[31mF[0m[31mF[0m[31mF[0m[33m*[0m[33m*[0m[31mF[0m");
      return expect(formatter.colorized().text).toBe('<p class="rspec-color tty-31">F</p>' + '<p class="rspec-color tty-31">F</p>' + '<p class="rspec-color tty-31">F</p>' + '<p class="rspec-color tty-33">*</p>' + '<p class="rspec-color tty-33">*</p>' + '<p class="rspec-color tty-31">F</p>');
    });
  });

}).call(this);
