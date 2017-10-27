Object.defineProperty(exports, '__esModule', {
  value: true
});

var _atom = require('atom');

var _helpers = require('./helpers');

var VALID_SEVERITY = new Set(['error', 'warning', 'info']);

function validateUI(ui) {
  var messages = [];

  if (ui && typeof ui === 'object') {
    if (typeof ui.name !== 'string') {
      messages.push('UI.name must be a string');
    }
    if (typeof ui.didBeginLinting !== 'function') {
      messages.push('UI.didBeginLinting must be a function');
    }
    if (typeof ui.didFinishLinting !== 'function') {
      messages.push('UI.didFinishLinting must be a function');
    }
    if (typeof ui.render !== 'function') {
      messages.push('UI.render must be a function');
    }
    if (typeof ui.dispose !== 'function') {
      messages.push('UI.dispose must be a function');
    }
  } else {
    messages.push('UI must be an object');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid UI received', 'These issues were encountered while registering the UI named \'' + (ui && ui.name ? ui.name : 'Unknown') + '\'', messages);
    return false;
  }

  return true;
}

function validateLinter(linter, version) {
  var messages = [];

  if (linter && typeof linter === 'object') {
    if (typeof linter.name !== 'string') {
      if (version === 2) {
        messages.push('Linter.name must be a string');
      } else linter.name = 'Unknown';
    }
    if (typeof linter.scope !== 'string' || linter.scope !== 'file' && linter.scope !== 'project') {
      messages.push("Linter.scope must be either 'file' or 'project'");
    }
    if (version === 1 && typeof linter.lintOnFly !== 'boolean') {
      messages.push('Linter.lintOnFly must be a boolean');
    } else if (version === 2 && typeof linter.lintsOnChange !== 'boolean') {
      messages.push('Linter.lintsOnChange must be a boolean');
    }
    if (!Array.isArray(linter.grammarScopes)) {
      messages.push('Linter.grammarScopes must be an Array');
    }
    if (typeof linter.lint !== 'function') {
      messages.push('Linter.lint must be a function');
    }
  } else {
    messages.push('Linter must be an object');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Linter received', 'These issues were encountered while registering a Linter named \'' + (linter && linter.name ? linter.name : 'Unknown') + '\'', messages);
    return false;
  }

  return true;
}

function validateIndie(indie) {
  var messages = [];

  if (indie && typeof indie === 'object') {
    if (typeof indie.name !== 'string') {
      messages.push('Indie.name must be a string');
    }
  } else {
    messages.push('Indie must be an object');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Indie received', 'These issues were encountered while registering an Indie Linter named \'' + (indie && indie.name ? indie.name : 'Unknown') + '\'', messages);
    return false;
  }

  return true;
}

function validateMessages(linterName, entries) {
  var messages = [];

  if (Array.isArray(entries)) {
    var invalidURL = false;
    var invalidIcon = false;
    var invalidExcerpt = false;
    var invalidLocation = false;
    var invalidSeverity = false;
    var invalidSolution = false;
    var invalidReference = false;
    var invalidDescription = false;

    for (var i = 0, _length = entries.length; i < _length; ++i) {
      var message = entries[i];
      var reference = message.reference;
      if (!invalidIcon && message.icon && typeof message.icon !== 'string') {
        invalidIcon = true;
        messages.push('Message.icon must be a string');
      }
      if (!invalidLocation && (!message.location || typeof message.location !== 'object' || typeof message.location.file !== 'string' || typeof message.location.position !== 'object' || !message.location.position)) {
        invalidLocation = true;
        messages.push('Message.location must be valid');
      } else if (!invalidLocation) {
        var range = _atom.Range.fromObject(message.location.position);
        if (Number.isNaN(range.start.row) || Number.isNaN(range.start.column) || Number.isNaN(range.end.row) || Number.isNaN(range.end.column)) {
          invalidLocation = true;
          messages.push('Message.location.position should not contain NaN coordinates');
        }
      }
      if (!invalidSolution && message.solutions && !Array.isArray(message.solutions)) {
        invalidSolution = true;
        messages.push('Message.solutions must be valid');
      }
      if (!invalidReference && reference && (typeof reference !== 'object' || typeof reference.file !== 'string' || typeof reference.position !== 'object' || !reference.position)) {
        invalidReference = true;
        messages.push('Message.reference must be valid');
      } else if (!invalidReference && reference) {
        var position = _atom.Point.fromObject(reference.position);
        if (Number.isNaN(position.row) || Number.isNaN(position.column)) {
          invalidReference = true;
          messages.push('Message.reference.position should not contain NaN coordinates');
        }
      }
      if (!invalidExcerpt && typeof message.excerpt !== 'string') {
        invalidExcerpt = true;
        messages.push('Message.excerpt must be a string');
      }
      if (!invalidSeverity && !VALID_SEVERITY.has(message.severity)) {
        invalidSeverity = true;
        messages.push("Message.severity must be 'error', 'warning' or 'info'");
      }
      if (!invalidURL && message.url && typeof message.url !== 'string') {
        invalidURL = true;
        messages.push('Message.url must a string');
      }
      if (!invalidDescription && message.description && typeof message.description !== 'function' && typeof message.description !== 'string') {
        invalidDescription = true;
        messages.push('Message.description must be a function or string');
      }
    }
  } else {
    messages.push('Linter Result must be an Array');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Linter Result received', 'These issues were encountered while processing messages from a linter named \'' + linterName + '\'', messages);
    return false;
  }

  return true;
}

function validateMessagesLegacy(linterName, entries) {
  var messages = [];

  if (Array.isArray(entries)) {
    var invalidFix = false;
    var invalidType = false;
    var invalidClass = false;
    var invalidRange = false;
    var invalidTrace = false;
    var invalidContent = false;
    var invalidFilePath = false;
    var invalidSeverity = false;

    for (var i = 0, _length2 = entries.length; i < _length2; ++i) {
      var message = entries[i];
      if (!invalidType && typeof message.type !== 'string') {
        invalidType = true;
        messages.push('Message.type must be a string');
      }
      if (!invalidContent && (typeof message.text !== 'string' && typeof message.html !== 'string' && !(message.html instanceof HTMLElement) || !message.text && !message.html)) {
        invalidContent = true;
        messages.push('Message.text or Message.html must have a valid value');
      }
      if (!invalidFilePath && message.filePath && typeof message.filePath !== 'string') {
        invalidFilePath = true;
        messages.push('Message.filePath must be a string');
      }
      if (!invalidRange && message.range && typeof message.range !== 'object') {
        invalidRange = true;
        messages.push('Message.range must be an object');
      } else if (!invalidRange && message.range) {
        var range = _atom.Range.fromObject(message.range);
        if (Number.isNaN(range.start.row) || Number.isNaN(range.start.column) || Number.isNaN(range.end.row) || Number.isNaN(range.end.column)) {
          invalidRange = true;
          messages.push('Message.range should not contain NaN coordinates');
        }
      }
      if (!invalidClass && message['class'] && typeof message['class'] !== 'string') {
        invalidClass = true;
        messages.push('Message.class must be a string');
      }
      if (!invalidSeverity && message.severity && !VALID_SEVERITY.has(message.severity)) {
        invalidSeverity = true;
        messages.push("Message.severity must be 'error', 'warning' or 'info'");
      }
      if (!invalidTrace && message.trace && !Array.isArray(message.trace)) {
        invalidTrace = true;
        messages.push('Message.trace must be an Array');
      }
      if (!invalidFix && message.fix && (typeof message.fix.range !== 'object' || typeof message.fix.newText !== 'string' || message.fix.oldText && typeof message.fix.oldText !== 'string')) {
        invalidFix = true;
        messages.push('Message.fix must be valid');
      }
    }
  } else {
    messages.push('Linter Result must be an Array');
  }

  if (messages.length) {
    (0, _helpers.showError)('Invalid Linter Result received', 'These issues were encountered while processing messages from a linter named \'' + linterName + '\'', messages);
    return false;
  }

  return true;
}

exports.ui = validateUI;
exports.linter = validateLinter;
exports.indie = validateIndie;
exports.messages = validateMessages;
exports.messagesLegacy = validateMessagesLegacy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZhbGlkYXRlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRTZCLE1BQU07O3VCQUNULFdBQVc7O0FBR3JDLElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBOztBQUU1RCxTQUFTLFVBQVUsQ0FBQyxFQUFNLEVBQVc7QUFDbkMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBOztBQUVuQixNQUFJLEVBQUUsSUFBSSxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUU7QUFDaEMsUUFBSSxPQUFPLEVBQUUsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQy9CLGNBQVEsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtLQUMxQztBQUNELFFBQUksT0FBTyxFQUFFLENBQUMsZUFBZSxLQUFLLFVBQVUsRUFBRTtBQUM1QyxjQUFRLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUE7S0FDdkQ7QUFDRCxRQUFJLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixLQUFLLFVBQVUsRUFBRTtBQUM3QyxjQUFRLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUE7S0FDeEQ7QUFDRCxRQUFJLE9BQU8sRUFBRSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7QUFDbkMsY0FBUSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0tBQzlDO0FBQ0QsUUFBSSxPQUFPLEVBQUUsQ0FBQyxPQUFPLEtBQUssVUFBVSxFQUFFO0FBQ3BDLGNBQVEsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQTtLQUMvQztHQUNGLE1BQU07QUFDTCxZQUFRLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUE7R0FDdEM7O0FBRUQsTUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ25CLDRCQUFVLHFC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LENBQUE7R0FDaEQ7O0FBRUQsTUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ25CLDRCQUFVLGdDQUFnQyxxRkFBa0YsVUFBVSxTQUFLLFFBQVEsQ0FBQyxDQUFBO0FBQ3BKLFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQsU0FBTyxJQUFJLENBQUE7Q0FDWjs7UUFHZSxFQUFFLEdBQWhCLFVBQVU7UUFDUSxNQUFNLEdBQXhCLGNBQWM7UUFDRyxLQUFLLEdBQXRCLGFBQWE7UUFDTyxRQUFRLEdBQTVCLGdCQUFnQjtRQUNVLGNBQWMsR0FBeEMsc0JBQXNCIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZhbGlkYXRlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgUmFuZ2UsIFBvaW50IH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHNob3dFcnJvciB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgVUksIExpbnRlciwgTWVzc2FnZSwgTWVzc2FnZUxlZ2FjeSwgSW5kaWUgfSBmcm9tICcuLi90eXBlcydcblxuY29uc3QgVkFMSURfU0VWRVJJVFkgPSBuZXcgU2V0KFsnZXJyb3InLCAnd2FybmluZycsICdpbmZvJ10pXG5cbmZ1bmN0aW9uIHZhbGlkYXRlVUkodWk6IFVJKTogYm9vbGVhbiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gW11cblxuICBpZiAodWkgJiYgdHlwZW9mIHVpID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh0eXBlb2YgdWkubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goJ1VJLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgdWkuZGlkQmVnaW5MaW50aW5nICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5kaWRCZWdpbkxpbnRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB1aS5kaWRGaW5pc2hMaW50aW5nICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5kaWRGaW5pc2hMaW50aW5nIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgdWkucmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5yZW5kZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB1aS5kaXNwb3NlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdVSS5kaXNwb3NlIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2VzLnB1c2goJ1VJIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgfVxuXG4gIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICBzaG93RXJyb3IoJ0ludmFsaWQgVUkgcmVjZWl2ZWQnLCBgVGhlc2UgaXNzdWVzIHdlcmUgZW5jb3VudGVyZWQgd2hpbGUgcmVnaXN0ZXJpbmcgdGhlIFVJIG5hbWVkICcke3VpICYmIHVpLm5hbWUgPyB1aS5uYW1lIDogJ1Vua25vd24nfSdgLCBtZXNzYWdlcylcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTGludGVyKGxpbnRlcjogTGludGVyLCB2ZXJzaW9uOiAxIHwgMik6IGJvb2xlYW4ge1xuICBjb25zdCBtZXNzYWdlcyA9IFtdXG5cbiAgaWYgKGxpbnRlciAmJiB0eXBlb2YgbGludGVyID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh0eXBlb2YgbGludGVyLm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodmVyc2lvbiA9PT0gMikge1xuICAgICAgICBtZXNzYWdlcy5wdXNoKCdMaW50ZXIubmFtZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICAgIH0gZWxzZSBsaW50ZXIubmFtZSA9ICdVbmtub3duJ1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpbnRlci5zY29wZSAhPT0gJ3N0cmluZycgfHwgKGxpbnRlci5zY29wZSAhPT0gJ2ZpbGUnICYmIGxpbnRlci5zY29wZSAhPT0gJ3Byb2plY3QnKSkge1xuICAgICAgbWVzc2FnZXMucHVzaChcIkxpbnRlci5zY29wZSBtdXN0IGJlIGVpdGhlciAnZmlsZScgb3IgJ3Byb2plY3QnXCIpXG4gICAgfVxuICAgIGlmICh2ZXJzaW9uID09PSAxICYmIHR5cGVvZiBsaW50ZXIubGludE9uRmx5ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goJ0xpbnRlci5saW50T25GbHkgbXVzdCBiZSBhIGJvb2xlYW4nKVxuICAgIH0gZWxzZSBpZiAodmVyc2lvbiA9PT0gMiAmJiB0eXBlb2YgbGludGVyLmxpbnRzT25DaGFuZ2UgIT09ICdib29sZWFuJykge1xuICAgICAgbWVzc2FnZXMucHVzaCgnTGludGVyLmxpbnRzT25DaGFuZ2UgbXVzdCBiZSBhIGJvb2xlYW4nKVxuICAgIH1cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobGludGVyLmdyYW1tYXJTY29wZXMpKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKCdMaW50ZXIuZ3JhbW1hclNjb3BlcyBtdXN0IGJlIGFuIEFycmF5JylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaW50ZXIubGludCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbWVzc2FnZXMucHVzaCgnTGludGVyLmxpbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWVzc2FnZXMucHVzaCgnTGludGVyIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgfVxuXG4gIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICBzaG93RXJyb3IoJ0ludmFsaWQgTGludGVyIHJlY2VpdmVkJywgYFRoZXNlIGlzc3VlcyB3ZXJlIGVuY291bnRlcmVkIHdoaWxlIHJlZ2lzdGVyaW5nIGEgTGludGVyIG5hbWVkICcke2xpbnRlciAmJiBsaW50ZXIubmFtZSA/IGxpbnRlci5uYW1lIDogJ1Vua25vd24nfSdgLCBtZXNzYWdlcylcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlSW5kaWUoaW5kaWU6IEluZGllKTogYm9vbGVhbiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gW11cblxuICBpZiAoaW5kaWUgJiYgdHlwZW9mIGluZGllID09PSAnb2JqZWN0Jykge1xuICAgIGlmICh0eXBlb2YgaW5kaWUubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2goJ0luZGllLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2VzLnB1c2goJ0luZGllIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgfVxuXG4gIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICBzaG93RXJyb3IoJ0ludmFsaWQgSW5kaWUgcmVjZWl2ZWQnLCBgVGhlc2UgaXNzdWVzIHdlcmUgZW5jb3VudGVyZWQgd2hpbGUgcmVnaXN0ZXJpbmcgYW4gSW5kaWUgTGludGVyIG5hbWVkICcke2luZGllICYmIGluZGllLm5hbWUgPyBpbmRpZS5uYW1lIDogJ1Vua25vd24nfSdgLCBtZXNzYWdlcylcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlTWVzc2FnZXMobGludGVyTmFtZTogc3RyaW5nLCBlbnRyaWVzOiBBcnJheTxNZXNzYWdlPik6IGJvb2xlYW4ge1xuICBjb25zdCBtZXNzYWdlcyA9IFtdXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZW50cmllcykpIHtcbiAgICBsZXQgaW52YWxpZFVSTCA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRJY29uID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZEV4Y2VycHQgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkTG9jYXRpb24gPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkU2V2ZXJpdHkgPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkU29sdXRpb24gPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkUmVmZXJlbmNlID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZERlc2NyaXB0aW9uID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZW50cmllc1tpXVxuICAgICAgY29uc3QgcmVmZXJlbmNlID0gbWVzc2FnZS5yZWZlcmVuY2VcbiAgICAgIGlmICghaW52YWxpZEljb24gJiYgbWVzc2FnZS5pY29uICYmIHR5cGVvZiBtZXNzYWdlLmljb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGludmFsaWRJY29uID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLmljb24gbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRMb2NhdGlvbiAmJiAoIW1lc3NhZ2UubG9jYXRpb24gfHwgdHlwZW9mIG1lc3NhZ2UubG9jYXRpb24gIT09ICdvYmplY3QnIHx8IHR5cGVvZiBtZXNzYWdlLmxvY2F0aW9uLmZpbGUgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uICE9PSAnb2JqZWN0JyB8fCAhbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbikpIHtcbiAgICAgICAgaW52YWxpZExvY2F0aW9uID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLmxvY2F0aW9uIG11c3QgYmUgdmFsaWQnKVxuICAgICAgfSBlbHNlIGlmICghaW52YWxpZExvY2F0aW9uKSB7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uKVxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKHJhbmdlLnN0YXJ0LnJvdykgfHwgTnVtYmVyLmlzTmFOKHJhbmdlLnN0YXJ0LmNvbHVtbikgfHwgTnVtYmVyLmlzTmFOKHJhbmdlLmVuZC5yb3cpIHx8IE51bWJlci5pc05hTihyYW5nZS5lbmQuY29sdW1uKSkge1xuICAgICAgICAgIGludmFsaWRMb2NhdGlvbiA9IHRydWVcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uIHNob3VsZCBub3QgY29udGFpbiBOYU4gY29vcmRpbmF0ZXMnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRTb2x1dGlvbiAmJiBtZXNzYWdlLnNvbHV0aW9ucyAmJiAhQXJyYXkuaXNBcnJheShtZXNzYWdlLnNvbHV0aW9ucykpIHtcbiAgICAgICAgaW52YWxpZFNvbHV0aW9uID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLnNvbHV0aW9ucyBtdXN0IGJlIHZhbGlkJylcbiAgICAgIH1cbiAgICAgIGlmICghaW52YWxpZFJlZmVyZW5jZSAmJiByZWZlcmVuY2UgJiYgKHR5cGVvZiByZWZlcmVuY2UgIT09ICdvYmplY3QnIHx8IHR5cGVvZiByZWZlcmVuY2UuZmlsZSAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIHJlZmVyZW5jZS5wb3NpdGlvbiAhPT0gJ29iamVjdCcgfHwgIXJlZmVyZW5jZS5wb3NpdGlvbikpIHtcbiAgICAgICAgaW52YWxpZFJlZmVyZW5jZSA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5yZWZlcmVuY2UgbXVzdCBiZSB2YWxpZCcpXG4gICAgICB9IGVsc2UgaWYgKCFpbnZhbGlkUmVmZXJlbmNlICYmIHJlZmVyZW5jZSkge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IFBvaW50LmZyb21PYmplY3QocmVmZXJlbmNlLnBvc2l0aW9uKVxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKHBvc2l0aW9uLnJvdykgfHwgTnVtYmVyLmlzTmFOKHBvc2l0aW9uLmNvbHVtbikpIHtcbiAgICAgICAgICBpbnZhbGlkUmVmZXJlbmNlID0gdHJ1ZVxuICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UucmVmZXJlbmNlLnBvc2l0aW9uIHNob3VsZCBub3QgY29udGFpbiBOYU4gY29vcmRpbmF0ZXMnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRFeGNlcnB0ICYmIHR5cGVvZiBtZXNzYWdlLmV4Y2VycHQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGludmFsaWRFeGNlcnB0ID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLmV4Y2VycHQgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRTZXZlcml0eSAmJiAhVkFMSURfU0VWRVJJVFkuaGFzKG1lc3NhZ2Uuc2V2ZXJpdHkpKSB7XG4gICAgICAgIGludmFsaWRTZXZlcml0eSA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaChcIk1lc3NhZ2Uuc2V2ZXJpdHkgbXVzdCBiZSAnZXJyb3InLCAnd2FybmluZycgb3IgJ2luZm8nXCIpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRVUkwgJiYgbWVzc2FnZS51cmwgJiYgdHlwZW9mIG1lc3NhZ2UudXJsICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkVVJMID0gdHJ1ZVxuICAgICAgICBtZXNzYWdlcy5wdXNoKCdNZXNzYWdlLnVybCBtdXN0IGEgc3RyaW5nJylcbiAgICAgIH1cbiAgICAgIGlmICghaW52YWxpZERlc2NyaXB0aW9uICYmIG1lc3NhZ2UuZGVzY3JpcHRpb24gJiYgdHlwZW9mIG1lc3NhZ2UuZGVzY3JpcHRpb24gIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG1lc3NhZ2UuZGVzY3JpcHRpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGludmFsaWREZXNjcmlwdGlvbiA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5kZXNjcmlwdGlvbiBtdXN0IGJlIGEgZnVuY3Rpb24gb3Igc3RyaW5nJylcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbWVzc2FnZXMucHVzaCgnTGludGVyIFJlc3VsdCBtdXN0IGJlIGFuIEFycmF5JylcbiAgfVxuXG4gIGlmIChtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICBzaG93RXJyb3IoJ0ludmFsaWQgTGludGVyIFJlc3VsdCByZWNlaXZlZCcsIGBUaGVzZSBpc3N1ZXMgd2VyZSBlbmNvdW50ZXJlZCB3aGlsZSBwcm9jZXNzaW5nIG1lc3NhZ2VzIGZyb20gYSBsaW50ZXIgbmFtZWQgJyR7bGludGVyTmFtZX0nYCwgbWVzc2FnZXMpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KGxpbnRlck5hbWU6IHN0cmluZywgZW50cmllczogQXJyYXk8TWVzc2FnZUxlZ2FjeT4pOiBib29sZWFuIHtcbiAgY29uc3QgbWVzc2FnZXMgPSBbXVxuXG4gIGlmIChBcnJheS5pc0FycmF5KGVudHJpZXMpKSB7XG4gICAgbGV0IGludmFsaWRGaXggPSBmYWxzZVxuICAgIGxldCBpbnZhbGlkVHlwZSA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRDbGFzcyA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRSYW5nZSA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRUcmFjZSA9IGZhbHNlXG4gICAgbGV0IGludmFsaWRDb250ZW50ID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZEZpbGVQYXRoID0gZmFsc2VcbiAgICBsZXQgaW52YWxpZFNldmVyaXR5ID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBlbnRyaWVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZW50cmllc1tpXVxuICAgICAgaWYgKCFpbnZhbGlkVHlwZSAmJiB0eXBlb2YgbWVzc2FnZS50eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkVHlwZSA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS50eXBlIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkQ29udGVudCAmJiAoKHR5cGVvZiBtZXNzYWdlLnRleHQgIT09ICdzdHJpbmcnICYmICh0eXBlb2YgbWVzc2FnZS5odG1sICE9PSAnc3RyaW5nJyAmJiAhKG1lc3NhZ2UuaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkpIHx8ICghbWVzc2FnZS50ZXh0ICYmICFtZXNzYWdlLmh0bWwpKSkge1xuICAgICAgICBpbnZhbGlkQ29udGVudCA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS50ZXh0IG9yIE1lc3NhZ2UuaHRtbCBtdXN0IGhhdmUgYSB2YWxpZCB2YWx1ZScpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRGaWxlUGF0aCAmJiBtZXNzYWdlLmZpbGVQYXRoICYmIHR5cGVvZiBtZXNzYWdlLmZpbGVQYXRoICE9PSAnc3RyaW5nJykge1xuICAgICAgICBpbnZhbGlkRmlsZVBhdGggPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UuZmlsZVBhdGggbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRSYW5nZSAmJiBtZXNzYWdlLnJhbmdlICYmIHR5cGVvZiBtZXNzYWdlLnJhbmdlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBpbnZhbGlkUmFuZ2UgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UucmFuZ2UgbXVzdCBiZSBhbiBvYmplY3QnKVxuICAgICAgfSBlbHNlIGlmICghaW52YWxpZFJhbmdlICYmIG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpXG4gICAgICAgIGlmIChOdW1iZXIuaXNOYU4ocmFuZ2Uuc3RhcnQucm93KSB8fCBOdW1iZXIuaXNOYU4ocmFuZ2Uuc3RhcnQuY29sdW1uKSB8fCBOdW1iZXIuaXNOYU4ocmFuZ2UuZW5kLnJvdykgfHwgTnVtYmVyLmlzTmFOKHJhbmdlLmVuZC5jb2x1bW4pKSB7XG4gICAgICAgICAgaW52YWxpZFJhbmdlID0gdHJ1ZVxuICAgICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UucmFuZ2Ugc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghaW52YWxpZENsYXNzICYmIG1lc3NhZ2UuY2xhc3MgJiYgdHlwZW9mIG1lc3NhZ2UuY2xhc3MgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGludmFsaWRDbGFzcyA9IHRydWVcbiAgICAgICAgbWVzc2FnZXMucHVzaCgnTWVzc2FnZS5jbGFzcyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICAgIH1cbiAgICAgIGlmICghaW52YWxpZFNldmVyaXR5ICYmIG1lc3NhZ2Uuc2V2ZXJpdHkgJiYgIVZBTElEX1NFVkVSSVRZLmhhcyhtZXNzYWdlLnNldmVyaXR5KSkge1xuICAgICAgICBpbnZhbGlkU2V2ZXJpdHkgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goXCJNZXNzYWdlLnNldmVyaXR5IG11c3QgYmUgJ2Vycm9yJywgJ3dhcm5pbmcnIG9yICdpbmZvJ1wiKVxuICAgICAgfVxuICAgICAgaWYgKCFpbnZhbGlkVHJhY2UgJiYgbWVzc2FnZS50cmFjZSAmJiAhQXJyYXkuaXNBcnJheShtZXNzYWdlLnRyYWNlKSkge1xuICAgICAgICBpbnZhbGlkVHJhY2UgPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UudHJhY2UgbXVzdCBiZSBhbiBBcnJheScpXG4gICAgICB9XG4gICAgICBpZiAoIWludmFsaWRGaXggJiYgbWVzc2FnZS5maXggJiYgKHR5cGVvZiBtZXNzYWdlLmZpeC5yYW5nZSAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIG1lc3NhZ2UuZml4Lm5ld1RleHQgIT09ICdzdHJpbmcnIHx8IChtZXNzYWdlLmZpeC5vbGRUZXh0ICYmIHR5cGVvZiBtZXNzYWdlLmZpeC5vbGRUZXh0ICE9PSAnc3RyaW5nJykpKSB7XG4gICAgICAgIGludmFsaWRGaXggPSB0cnVlXG4gICAgICAgIG1lc3NhZ2VzLnB1c2goJ01lc3NhZ2UuZml4IG11c3QgYmUgdmFsaWQnKVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBtZXNzYWdlcy5wdXNoKCdMaW50ZXIgUmVzdWx0IG11c3QgYmUgYW4gQXJyYXknKVxuICB9XG5cbiAgaWYgKG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgIHNob3dFcnJvcignSW52YWxpZCBMaW50ZXIgUmVzdWx0IHJlY2VpdmVkJywgYFRoZXNlIGlzc3VlcyB3ZXJlIGVuY291bnRlcmVkIHdoaWxlIHByb2Nlc3NpbmcgbWVzc2FnZXMgZnJvbSBhIGxpbnRlciBuYW1lZCAnJHtsaW50ZXJOYW1lfSdgLCBtZXNzYWdlcylcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCB7XG4gIHZhbGlkYXRlVUkgYXMgdWksXG4gIHZhbGlkYXRlTGludGVyIGFzIGxpbnRlcixcbiAgdmFsaWRhdGVJbmRpZSBhcyBpbmRpZSxcbiAgdmFsaWRhdGVNZXNzYWdlcyBhcyBtZXNzYWdlcyxcbiAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeSBhcyBtZXNzYWdlc0xlZ2FjeSxcbn1cbiJdfQ==