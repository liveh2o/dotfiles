Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.$range = $range;
exports.$file = $file;
exports.copySelection = copySelection;
exports.getPathOfMessage = getPathOfMessage;
exports.getEditorsMap = getEditorsMap;
exports.filterMessages = filterMessages;
exports.filterMessagesByRangeOrPoint = filterMessagesByRangeOrPoint;
exports.visitMessage = visitMessage;
exports.htmlToText = htmlToText;
exports.openExternally = openExternally;
exports.sortMessages = sortMessages;
exports.sortSolutions = sortSolutions;
exports.applySolution = applySolution;

var _atom = require('atom');

var _electron = require('electron');

var severityScore = {
  error: 3,
  warning: 2,
  info: 1
};

exports.severityScore = severityScore;
var severityNames = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info'
};

exports.severityNames = severityNames;

function $range(message) {
  return message.version === 1 ? message.range : message.location.position;
}

function $file(message) {
  return message.version === 1 ? message.filePath : message.location.file;
}

function copySelection() {
  var selection = getSelection();
  if (selection) {
    atom.clipboard.write(selection.toString());
  }
}

function getPathOfMessage(message) {
  return atom.project.relativizePath($file(message) || '')[1];
}

function getEditorsMap(editors) {
  var editorsMap = {};
  var filePaths = [];
  for (var entry of editors.editors) {
    var filePath = entry.textEditor.getPath();
    if (editorsMap[filePath]) {
      editorsMap[filePath].editors.push(entry);
    } else {
      editorsMap[filePath] = {
        added: [],
        removed: [],
        editors: [entry]
      };
      filePaths.push(filePath);
    }
  }
  return { editorsMap: editorsMap, filePaths: filePaths };
}

function filterMessages(messages, filePath) {
  var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var filtered = [];
  messages.forEach(function (message) {
    if ((filePath === null || $file(message) === filePath) && (!severity || message.severity === severity)) {
      filtered.push(message);
    }
  });
  return filtered;
}

function filterMessagesByRangeOrPoint(messages, filePath, rangeOrPoint) {
  var filtered = [];
  var expectedRange = rangeOrPoint.constructor.name === 'Point' ? new _atom.Range(rangeOrPoint, rangeOrPoint) : _atom.Range.fromObject(rangeOrPoint);
  messages.forEach(function (message) {
    var file = $file(message);
    var range = $range(message);
    if (file && range && file === filePath && range.intersectsWith(expectedRange)) {
      filtered.push(message);
    }
  });
  return filtered;
}

function visitMessage(message) {
  var reference = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var messageFile = undefined;
  var messagePosition = undefined;
  if (reference) {
    if (message.version !== 2) {
      console.warn('[Linter-UI-Default] Only messages v2 are allowed in jump to reference. Ignoring');
      return;
    }
    if (!message.reference || !message.reference.file) {
      console.warn('[Linter-UI-Default] Message does not have a valid reference. Ignoring');
      return;
    }
    messageFile = message.reference.file;
    messagePosition = message.reference.position;
  } else {
    var messageRange = $range(message);
    messageFile = $file(message);
    if (messageRange) {
      messagePosition = messageRange.start;
    }
  }
  atom.workspace.open(messageFile, { searchAllPanes: true }).then(function () {
    var textEditor = atom.workspace.getActiveTextEditor();
    if (messagePosition && textEditor && textEditor.getPath() === messageFile) {
      textEditor.setCursorBufferPosition(messagePosition);
    }
  });
}

// NOTE: Code Point 160 === &nbsp;
var replacementRegex = new RegExp(String.fromCodePoint(160), 'g');

function htmlToText(html) {
  var element = document.createElement('div');
  if (typeof html === 'string') {
    element.innerHTML = html;
  } else {
    element.appendChild(html.cloneNode(true));
  }
  // NOTE: Convert &nbsp; to regular whitespace
  return element.textContent.replace(replacementRegex, ' ');
}

function openExternally(message) {
  if (message.version === 1 && message.type.toLowerCase() === 'trace') {
    visitMessage(message);
    return;
  }

  if (message.version === 2 && message.url) {
    _electron.shell.openExternal(message.url);
  }
}

function sortMessages(sortInfo, rows) {
  var sortColumns = {};

  sortInfo.forEach(function (entry) {
    sortColumns[entry.column] = entry.type;
  });

  return rows.slice().sort(function (a, b) {
    if (sortColumns.severity) {
      var multiplyWith = sortColumns.severity === 'asc' ? 1 : -1;
      var severityA = severityScore[a.severity];
      var severityB = severityScore[b.severity];
      if (severityA !== severityB) {
        return multiplyWith * (severityA > severityB ? 1 : -1);
      }
    }
    if (sortColumns.linterName) {
      var multiplyWith = sortColumns.linterName === 'asc' ? 1 : -1;
      var sortValue = a.severity.localeCompare(b.severity);
      if (sortValue !== 0) {
        return multiplyWith * sortValue;
      }
    }
    if (sortColumns.file) {
      var multiplyWith = sortColumns.file === 'asc' ? 1 : -1;
      var fileA = getPathOfMessage(a);
      var fileALength = fileA.length;
      var fileB = getPathOfMessage(b);
      var fileBLength = fileB.length;
      if (fileALength !== fileBLength) {
        return multiplyWith * (fileALength > fileBLength ? 1 : -1);
      } else if (fileA !== fileB) {
        return multiplyWith * fileA.localeCompare(fileB);
      }
    }
    if (sortColumns.line) {
      var multiplyWith = sortColumns.line === 'asc' ? 1 : -1;
      var rangeA = $range(a);
      var rangeB = $range(b);
      if (rangeA && !rangeB) {
        return 1;
      } else if (rangeB && !rangeA) {
        return -1;
      } else if (rangeA && rangeB) {
        if (rangeA.start.row !== rangeB.start.row) {
          return multiplyWith * (rangeA.start.row > rangeB.start.row ? 1 : -1);
        }
        if (rangeA.start.column !== rangeB.start.column) {
          return multiplyWith * (rangeA.start.column > rangeB.start.column ? 1 : -1);
        }
      }
    }

    return 0;
  });
}

function sortSolutions(solutions) {
  return solutions.slice().sort(function (a, b) {
    return b.priority - a.priority;
  });
}

function applySolution(textEditor, version, solution) {
  if (solution.apply) {
    solution.apply();
    return true;
  }
  var range = version === 1 ? solution.range : solution.position;
  var currentText = version === 1 ? solution.oldText : solution.currentText;
  var replaceWith = version === 1 ? solution.newText : solution.replaceWith;
  if (currentText) {
    var textInRange = textEditor.getTextInBufferRange(range);
    if (currentText !== textInRange) {
      console.warn('[linter-ui-default] Not applying fix because text did not match the expected one', 'expected', currentText, 'but got', textInRange);
      return false;
    }
  }
  textEditor.setTextInBufferRange(range, replaceWith);
  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztvQkFFc0IsTUFBTTs7d0JBQ04sVUFBVTs7QUFLekIsSUFBTSxhQUFhLEdBQUc7QUFDM0IsT0FBSyxFQUFFLENBQUM7QUFDUixTQUFPLEVBQUUsQ0FBQztBQUNWLE1BQUksRUFBRSxDQUFDO0NBQ1IsQ0FBQTs7O0FBRU0sSUFBTSxhQUFhLEdBQUc7QUFDM0IsT0FBSyxFQUFFLE9BQU87QUFDZCxTQUFPLEVBQUUsU0FBUztBQUNsQixNQUFJLEVBQUUsTUFBTTtDQUNiLENBQUE7Ozs7QUFFTSxTQUFTLE1BQU0sQ0FBQyxPQUFzQixFQUFXO0FBQ3RELFNBQU8sT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQTtDQUN6RTs7QUFDTSxTQUFTLEtBQUssQ0FBQyxPQUFzQixFQUFXO0FBQ3JELFNBQU8sT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQTtDQUN4RTs7QUFDTSxTQUFTLGFBQWEsR0FBRztBQUM5QixNQUFNLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQTtBQUNoQyxNQUFJLFNBQVMsRUFBRTtBQUNiLFFBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0dBQzNDO0NBQ0Y7O0FBQ00sU0FBUyxnQkFBZ0IsQ0FBQyxPQUFzQixFQUFVO0FBQy9ELFNBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQzVEOztBQUVNLFNBQVMsYUFB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O0FBQ2xCLFlBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNoQixXQUFPLElBQUksQ0FBQTtHQUNaO0FBQ0QsTUFBTSxLQUFLLEdBQUcsT0FBTyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUE7QUFDaEUsTUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUE7QUFDM0UsTUFBTSxXQUFXLEdBQUcsT0FBTyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUE7QUFDM0UsTUFBSSxXQUFXLEVBQUU7QUFDZixRQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDMUQsUUFBSSxXQUFXLEtBQUssV0FBVyxFQUFFO0FBQy9CLGFBQU8sQ0FBQyxJQUFJLENBQUMsa0ZBQWtGLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDakosYUFBTyxLQUFLLENBQUE7S0FDYjtHQUNGO0FBQ0QsWUFBVSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNuRCxTQUFPLElBQUksQ0FBQTtDQUNaIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgdHlwZSB7IFBvaW50LCBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIEVkaXRvcnMgZnJvbSAnLi9lZGl0b3JzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IHNldmVyaXR5U2NvcmUgPSB7XG4gIGVycm9yOiAzLFxuICB3YXJuaW5nOiAyLFxuICBpbmZvOiAxLFxufVxuXG5leHBvcnQgY29uc3Qgc2V2ZXJpdHlOYW1lcyA9IHtcbiAgZXJyb3I6ICdFcnJvcicsXG4gIHdhcm5pbmc6ICdXYXJuaW5nJyxcbiAgaW5mbzogJ0luZm8nLFxufVxuXG5leHBvcnQgZnVuY3Rpb24gJHJhbmdlKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UpOiA/T2JqZWN0IHtcbiAgcmV0dXJuIG1lc3NhZ2UudmVyc2lvbiA9PT0gMSA/IG1lc3NhZ2UucmFuZ2UgOiBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uXG59XG5leHBvcnQgZnVuY3Rpb24gJGZpbGUobWVzc2FnZTogTGludGVyTWVzc2FnZSk6ID9zdHJpbmcge1xuICByZXR1cm4gbWVzc2FnZS52ZXJzaW9uID09PSAxID8gbWVzc2FnZS5maWxlUGF0aCA6IG1lc3NhZ2UubG9jYXRpb24uZmlsZVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlTZWxlY3Rpb24oKSB7XG4gIGNvbnN0IHNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbigpXG4gIGlmIChzZWxlY3Rpb24pIHtcbiAgICBhdG9tLmNsaXBib2FyZC53cml0ZShzZWxlY3Rpb24udG9TdHJpbmcoKSlcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGhPZk1lc3NhZ2UobWVzc2FnZTogTGludGVyTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoJGZpbGUobWVzc2FnZSkgfHwgJycpWzFdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0b3JzTWFwKGVkaXRvcnM6IEVkaXRvcnMpOiB7IGVkaXRvcnNNYXA6IE9iamVjdCwgZmlsZVBhdGhzOiBBcnJheTxzdHJpbmc+IH0ge1xuICBjb25zdCBlZGl0b3JzTWFwID0ge31cbiAgY29uc3QgZmlsZVBhdGhzID0gW11cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlZGl0b3JzLmVkaXRvcnMpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVudHJ5LnRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgKGVkaXRvcnNNYXBbZmlsZVBhdGhdKSB7XG4gICAgICBlZGl0b3JzTWFwW2ZpbGVQYXRoXS5lZGl0b3JzLnB1c2goZW50cnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVkaXRvcnNNYXBbZmlsZVBhdGhdID0ge1xuICAgICAgICBhZGRlZDogW10sXG4gICAgICAgIHJlbW92ZWQ6IFtdLFxuICAgICAgICBlZGl0b3JzOiBbZW50cnldLFxuICAgICAgfVxuICAgICAgZmlsZVBhdGhzLnB1c2goZmlsZVBhdGgpXG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVkaXRvcnNNYXAsIGZpbGVQYXRocyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNZXNzYWdlcyhtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sIGZpbGVQYXRoOiA/c3RyaW5nLCBzZXZlcml0eTogP3N0cmluZyA9IG51bGwpOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IGZpbHRlcmVkID0gW11cbiAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgaWYgKChmaWxlUGF0aCA9PT0gbnVsbCB8fCAkZmlsZShtZXNzYWdlKSA9PT0gZmlsZVBhdGgpICYmICghc2V2ZXJpdHkgfHwgbWVzc2FnZS5zZXZlcml0eSA9PT0gc2V2ZXJpdHkpKSB7XG4gICAgICBmaWx0ZXJlZC5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICB9KVxuICByZXR1cm4gZmlsdGVyZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQobWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPiB8IEFycmF5PExpbnRlck1lc3NhZ2U+LCBmaWxlUGF0aDogc3RyaW5nLCByYW5nZU9yUG9pbnQ6IFBvaW50IHwgUmFuZ2UpOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IGZpbHRlcmVkID0gW11cbiAgY29uc3QgZXhwZWN0ZWRSYW5nZSA9IHJhbmdlT3JQb2ludC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnUG9pbnQnID8gbmV3IFJhbmdlKHJhbmdlT3JQb2ludCwgcmFuZ2VPclBvaW50KSA6IFJhbmdlLmZyb21PYmplY3QocmFuZ2VPclBvaW50KVxuICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBmaWxlID0gJGZpbGUobWVzc2FnZSlcbiAgICBjb25zdCByYW5nZSA9ICRyYW5nZShtZXNzYWdlKVxuICAgIGlmIChmaWxlICYmIHJhbmdlICYmIGZpbGUgPT09IGZpbGVQYXRoICYmIHJhbmdlLmludGVyc2VjdHNXaXRoKGV4cGVjdGVkUmFuZ2UpKSB7XG4gICAgICBmaWx0ZXJlZC5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICB9KVxuICByZXR1cm4gZmlsdGVyZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpc2l0TWVzc2FnZShtZXNzYWdlOiBMaW50ZXJNZXNzYWdlLCByZWZlcmVuY2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICBsZXQgbWVzc2FnZUZpbGVcbiAgbGV0IG1lc3NhZ2VQb3NpdGlvblxuICBpZiAocmVmZXJlbmNlKSB7XG4gICAgaWYgKG1lc3NhZ2UudmVyc2lvbiAhPT0gMikge1xuICAgICAgY29uc29sZS53YXJuKCdbTGludGVyLVVJLURlZmF1bHRdIE9ubHkgbWVzc2FnZXMgdjIgYXJlIGFsbG93ZWQgaW4ganVtcCB0byByZWZlcmVuY2UuIElnbm9yaW5nJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIW1lc3NhZ2UucmVmZXJlbmNlIHx8ICFtZXNzYWdlLnJlZmVyZW5jZS5maWxlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMaW50ZXItVUktRGVmYXVsdF0gTWVzc2FnZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVmZXJlbmNlLiBJZ25vcmluZycpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbWVzc2FnZUZpbGUgPSBtZXNzYWdlLnJlZmVyZW5jZS5maWxlXG4gICAgbWVzc2FnZVBvc2l0aW9uID0gbWVzc2FnZS5yZWZlcmVuY2UucG9zaXRpb25cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBtZXNzYWdlUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICBtZXNzYWdlRmlsZSA9ICRmaWxlKG1lc3NhZ2UpXG4gICAgaWYgKG1lc3NhZ2VSYW5nZSkge1xuICAgICAgbWVzc2FnZVBvc2l0aW9uID0gbWVzc2FnZVJhbmdlLnN0YXJ0XG4gICAgfVxuICB9XG4gIGF0b20ud29ya3NwYWNlLm9wZW4obWVzc2FnZUZpbGUsIHsgc2VhcmNoQWxsUGFuZXM6IHRydWUgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKG1lc3NhZ2VQb3NpdGlvbiAmJiB0ZXh0RWRpdG9yICYmIHRleHRFZGl0b3IuZ2V0UGF0aCgpID09PSBtZXNzYWdlRmlsZSkge1xuICAgICAgdGV4dEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihtZXNzYWdlUG9zaXRpb24pXG4gICAgfVxuICB9KVxufVxuXG4vLyBOT1RFOiBDb2RlIFBvaW50IDE2MCA9PT0gJm5ic3A7XG5jb25zdCByZXBsYWNlbWVudFJlZ2V4ID0gbmV3IFJlZ0V4cChTdHJpbmcuZnJvbUNvZGVQb2ludCgxNjApLCAnZycpXG5leHBvcnQgZnVuY3Rpb24gaHRtbFRvVGV4dChodG1sOiBhbnkpOiBzdHJpbmcge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgaWYgKHR5cGVvZiBodG1sID09PSAnc3RyaW5nJykge1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbFxuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoaHRtbC5jbG9uZU5vZGUodHJ1ZSkpXG4gIH1cbiAgLy8gTk9URTogQ29udmVydCAmbmJzcDsgdG8gcmVndWxhciB3aGl0ZXNwYWNlXG4gIHJldHVybiBlbGVtZW50LnRleHRDb250ZW50LnJlcGxhY2UocmVwbGFjZW1lbnRSZWdleCwgJyAnKVxufVxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5FeHRlcm5hbGx5KG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UpOiB2b2lkIHtcbiAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMSAmJiBtZXNzYWdlLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3RyYWNlJykge1xuICAgIHZpc2l0TWVzc2FnZShtZXNzYWdlKVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMiAmJiBtZXNzYWdlLnVybCkge1xuICAgIHNoZWxsLm9wZW5FeHRlcm5hbChtZXNzYWdlLnVybClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydE1lc3NhZ2VzKHNvcnRJbmZvOiBBcnJheTx7IGNvbHVtbjogc3RyaW5nLCB0eXBlOiAnYXNjJyB8ICdkZXNjJyB9Piwgcm93czogQXJyYXk8TGludGVyTWVzc2FnZT4pOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IHNvcnRDb2x1bW5zIDoge1xuICAgIHNldmVyaXR5PzogJ2FzYycgfCAnZGVzYycsXG4gICAgbGludGVyTmFtZT86ICdhc2MnIHwgJ2Rlc2MnLFxuICAgIGZpbGU/OiAnYXNjJyB8ICdkZXNjJyxcbiAgICBsaW5lPzogJ2FzYycgfCAnZGVzYydcbiAgfSA9IHt9XG5cbiAgc29ydEluZm8uZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIHNvcnRDb2x1bW5zW2VudHJ5LmNvbHVtbl0gPSBlbnRyeS50eXBlXG4gIH0pXG5cbiAgcmV0dXJuIHJvd3Muc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAoc29ydENvbHVtbnMuc2V2ZXJpdHkpIHtcbiAgICAgIGNvbnN0IG11bHRpcGx5V2l0aCA9IHNvcnRDb2x1bW5zLnNldmVyaXR5ID09PSAnYXNjJyA/IDEgOiAtMVxuICAgICAgY29uc3Qgc2V2ZXJpdHlBID0gc2V2ZXJpdHlTY29yZVthLnNldmVyaXR5XVxuICAgICAgY29uc3Qgc2V2ZXJpdHlCID0gc2V2ZXJpdHlTY29yZVtiLnNldmVyaXR5XVxuICAgICAgaWYgKHNldmVyaXR5QSAhPT0gc2V2ZXJpdHlCKSB7XG4gICAgICAgIHJldHVybiBtdWx0aXBseVdpdGggKiAoc2V2ZXJpdHlBID4gc2V2ZXJpdHlCID8gMSA6IC0xKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc29ydENvbHVtbnMubGludGVyTmFtZSkge1xuICAgICAgY29uc3QgbXVsdGlwbHlXaXRoID0gc29ydENvbHVtbnMubGludGVyTmFtZSA9PT0gJ2FzYycgPyAxIDogLTFcbiAgICAgIGNvbnN0IHNvcnRWYWx1ZSA9IGEuc2V2ZXJpdHkubG9jYWxlQ29tcGFyZShiLnNldmVyaXR5KVxuICAgICAgaWYgKHNvcnRWYWx1ZSAhPT0gMCkge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogc29ydFZhbHVlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzb3J0Q29sdW1ucy5maWxlKSB7XG4gICAgICBjb25zdCBtdWx0aXBseVdpdGggPSBzb3J0Q29sdW1ucy5maWxlID09PSAnYXNjJyA/IDEgOiAtMVxuICAgICAgY29uc3QgZmlsZUEgPSBnZXRQYXRoT2ZNZXNzYWdlKGEpXG4gICAgICBjb25zdCBmaWxlQUxlbmd0aCA9IGZpbGVBLmxlbmd0aFxuICAgICAgY29uc3QgZmlsZUIgPSBnZXRQYXRoT2ZNZXNzYWdlKGIpXG4gICAgICBjb25zdCBmaWxlQkxlbmd0aCA9IGZpbGVCLmxlbmd0aFxuICAgICAgaWYgKGZpbGVBTGVuZ3RoICE9PSBmaWxlQkxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogKGZpbGVBTGVuZ3RoID4gZmlsZUJMZW5ndGggPyAxIDogLTEpXG4gICAgICB9IGVsc2UgaWYgKGZpbGVBICE9PSBmaWxlQikge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogZmlsZUEubG9jYWxlQ29tcGFyZShmaWxlQilcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNvcnRDb2x1bW5zLmxpbmUpIHtcbiAgICAgIGNvbnN0IG11bHRpcGx5V2l0aCA9IHNvcnRDb2x1bW5zLmxpbmUgPT09ICdhc2MnID8gMSA6IC0xXG4gICAgICBjb25zdCByYW5nZUEgPSAkcmFuZ2UoYSlcbiAgICAgIGNvbnN0IHJhbmdlQiA9ICRyYW5nZShiKVxuICAgICAgaWYgKHJhbmdlQSAmJiAhcmFuZ2VCKSB7XG4gICAgICAgIHJldHVybiAxXG4gICAgICB9IGVsc2UgaWYgKHJhbmdlQiAmJiAhcmFuZ2VBKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfSBlbHNlIGlmIChyYW5nZUEgJiYgcmFuZ2VCKSB7XG4gICAgICAgIGlmIChyYW5nZUEuc3RhcnQucm93ICE9PSByYW5nZUIuc3RhcnQucm93KSB7XG4gICAgICAgICAgcmV0dXJuIG11bHRpcGx5V2l0aCAqIChyYW5nZUEuc3RhcnQucm93ID4gcmFuZ2VCLnN0YXJ0LnJvdyA/IDEgOiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAocmFuZ2VBLnN0YXJ0LmNvbHVtbiAhPT0gcmFuZ2VCLnN0YXJ0LmNvbHVtbikge1xuICAgICAgICAgIHJldHVybiBtdWx0aXBseVdpdGggKiAocmFuZ2VBLnN0YXJ0LmNvbHVtbiA+IHJhbmdlQi5zdGFydC5jb2x1bW4gPyAxIDogLTEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydFNvbHV0aW9ucyhzb2x1dGlvbnM6IEFycmF5PE9iamVjdD4pOiBBcnJheTxPYmplY3Q+IHtcbiAgcmV0dXJuIHNvbHV0aW9ucy5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTb2x1dGlvbih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCB2ZXJzaW9uOiAxIHwgMiwgc29sdXRpb246IE9iamVjdCk6IGJvb2xlYW4ge1xuICBpZiAoc29sdXRpb24uYXBwbHkpIHtcbiAgICBzb2x1dGlvbi5hcHBseSgpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCByYW5nZSA9IHZlcnNpb24gPT09IDEgPyBzb2x1dGlvbi5yYW5nZSA6IHNvbHV0aW9uLnBvc2l0aW9uXG4gIGNvbnN0IGN1cnJlbnRUZXh0ID0gdmVyc2lvbiA9PT0gMSA/IHNvbHV0aW9uLm9sZFRleHQgOiBzb2x1dGlvbi5jdXJyZW50VGV4dFxuICBjb25zdCByZXBsYWNlV2l0aCA9IHZlcnNpb24gPT09IDEgPyBzb2x1dGlvbi5uZXdUZXh0IDogc29sdXRpb24ucmVwbGFjZVdpdGhcbiAgaWYgKGN1cnJlbnRUZXh0KSB7XG4gICAgY29uc3QgdGV4dEluUmFuZ2UgPSB0ZXh0RWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgIGlmIChjdXJyZW50VGV4dCAhPT0gdGV4dEluUmFuZ2UpIHtcbiAgICAgIGNvbnNvbGUud2FybignW2xpbnRlci11aS1kZWZhdWx0XSBOb3QgYXBwbHlpbmcgZml4IGJlY2F1c2UgdGV4dCBkaWQgbm90IG1hdGNoIHRoZSBleHBlY3RlZCBvbmUnLCAnZXhwZWN0ZWQnLCBjdXJyZW50VGV4dCwgJ2J1dCBnb3QnLCB0ZXh0SW5SYW5nZSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICB0ZXh0RWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCByZXBsYWNlV2l0aClcbiAgcmV0dXJuIHRydWVcbn1cbiJdfQ==