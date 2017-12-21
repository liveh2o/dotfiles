'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  useCustomUrlTemplateIfStandardRemotesFail: {
    type: 'boolean',
    'default': false
  },
  customCommitUrlTemplateString: {
    type: 'string',
    'default': 'Example -> https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>'
  },
  columnWidth: {
    type: 'integer',
    'default': 210
  },
  dateFormatString: {
    type: 'string',
    'default': 'YYYY-MM-DD'
  },
  ignoreWhiteSpaceDiffs: {
    type: 'boolean',
    'default': false
  },
  showOnlyLastNames: {
    type: 'boolean',
    'default': false
  },
  showHash: {
    type: 'boolean',
    'default': true
  },
  colorCommitAuthors: {
    type: 'boolean',
    'default': false
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7QUFDYiwyQ0FBeUMsRUFBRTtBQUN6QyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0FBQ0QsK0JBQTZCLEVBQUU7QUFDN0IsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLGlGQUFpRjtHQUMzRjtBQUNELGFBQVcsRUFBRTtBQUNYLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxHQUFHO0dBQ2I7QUFDRCxrQkFBZ0IsRUFBRTtBQUNoQixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsWUFBWTtHQUN0QjtBQUNELHVCQUFxQixFQUFFO0FBQ3JCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2Y7QUFDRCxtQkFBaUIsRUFBRTtBQUNqQixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0FBQ0QsVUFBUSxFQUFFO0FBQ1IsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvdGVzdC8uZG90ZmlsZXMvYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVzZUN1c3RvbVVybFRlbXBsYXRlSWZTdGFuZGFyZFJlbW90ZXNGYWlsOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxuICBjdXN0b21Db21taXRVcmxUZW1wbGF0ZVN0cmluZzoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdFeGFtcGxlIC0+IGh0dHBzOi8vZ2l0aHViLmNvbS88JS0gcHJvamVjdCAlPi88JS0gcmVwbyAlPi9jb21taXQvPCUtIHJldmlzaW9uICU+JyxcbiAgfSxcbiAgY29sdW1uV2lkdGg6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjEwLFxuICB9LFxuICBkYXRlRm9ybWF0U3RyaW5nOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ1lZWVktTU0tREQnLFxuICB9LFxuICBpZ25vcmVXaGl0ZVNwYWNlRGlmZnM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG4gIHNob3dPbmx5TGFzdE5hbWVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxuICBzaG93SGFzaDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICB9LFxuICBjb2xvckNvbW1pdEF1dGhvcnM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gIH0sXG59O1xuIl19