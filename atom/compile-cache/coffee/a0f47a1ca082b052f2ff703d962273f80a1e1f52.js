(function() {
  var RspecView;

  RspecView = require('../lib/rspec-view');

  describe("RspecView", function() {
    beforeEach(function() {
      return this.rspecView = new RspecView('example_spec.rb');
    });
    return describe('addOutput', function() {
      it('adds output', function() {
        this.rspecView.addOutput('foo');
        return expect(this.rspecView.output.html()).toBe('foo');
      });
      return it('corectly formats complex output', function() {
        var output;
        output = '[31m# ./foo/bar_spec.rb:123:in `block (3 levels) in <top (required)>[0m';
        this.rspecView.addOutput(output);
        return expect(this.rspecView.output.html()).toBe('<p class="rspec-color tty-31">' + '# <a href="./foo/bar_spec.rb" data-line="123" data-file="./foo/bar_spec.rb">' + './foo/bar_spec.rb:123' + '</a>' + ':in `block (3 levels) in &lt;top (required)&gt;' + '</p>');
      });
    });
  });

}).call(this);
