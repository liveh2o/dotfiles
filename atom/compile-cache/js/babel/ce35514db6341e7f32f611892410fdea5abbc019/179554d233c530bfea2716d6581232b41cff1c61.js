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
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsMkNBQXlDLEVBQUc7QUFDMUMsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELCtCQUE2QixFQUFHO0FBQzlCLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxpRkFBaUY7R0FDM0Y7QUFDRCxhQUFXLEVBQUc7QUFDWixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsR0FBRztHQUNiO0FBQ0Qsa0JBQWdCLEVBQUc7QUFDakIsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLFlBQVk7R0FDdEI7QUFDRCx1QkFBcUIsRUFBRztBQUN0QixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmO0FBQ0QsbUJBQWlCLEVBQUc7QUFDbEIsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjtBQUNELFVBQVEsRUFBRztBQUNULFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0dBQ2Q7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICB1c2VDdXN0b21VcmxUZW1wbGF0ZUlmU3RhbmRhcmRSZW1vdGVzRmFpbCA6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcbiAgY3VzdG9tQ29tbWl0VXJsVGVtcGxhdGVTdHJpbmcgOiB7XG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ0V4YW1wbGUgLT4gaHR0cHM6Ly9naXRodWIuY29tLzwlLSBwcm9qZWN0ICU+LzwlLSByZXBvICU+L2NvbW1pdC88JS0gcmV2aXNpb24gJT4nXG4gIH0sXG4gIGNvbHVtbldpZHRoIDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMTBcbiAgfSxcbiAgZGF0ZUZvcm1hdFN0cmluZyA6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnWVlZWS1NTS1ERCdcbiAgfSxcbiAgaWdub3JlV2hpdGVTcGFjZURpZmZzIDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9LFxuICBzaG93T25seUxhc3ROYW1lcyA6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcbiAgc2hvd0hhc2ggOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbn1cbiJdfQ==