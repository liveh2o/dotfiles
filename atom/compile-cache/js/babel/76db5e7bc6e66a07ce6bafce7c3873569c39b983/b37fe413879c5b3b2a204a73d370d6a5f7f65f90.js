/**
 * Sample quicksort code
 * TODO: This is the first todo
 *
 * LOONG: Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam, id ante molestias, ipsum lorem magnis et. A eleifend ipsum. Pellentesque aliquam, proin mollis sed odio, at amet vestibulum velit. Dolor sed, urna integer suspendisse ut a. Pharetra amet dui accumsan elementum, vitae et ac ligula turpis semper donec.
 * LOONG_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSumtJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF7sPZ8AiCVy22sE=SpgL_E84Ms1K4DSumtJDoNn8ZECZLLVR0DoGydy54vUoSpgLE84Ms1K4DSumtJ_DoNn8ZECZLLVR0DoGydy54vUo
 */

var quicksort = function quicksort() {
  var sort = function sort(items) {
    if (items.length <= 1) {
      return items;
    }
    var pivot = items.shift(),
        current,
        left = [],
        right = [];
    while (items.length > 0) {
      current = items.shift();
      current < pivot ? left.push(current) : right.push(current);
    }
    return sort(left).concat(pivot).concat(sort(right));
  };

  // TODO: This is the second todo

  return sort(Array.apply(this, arguments)); // DEBUG

  // FIXME: Add more annnotations :)

  // CHANGED one
  // CHANGED: two
  // @CHANGED three
  // @CHANGED: four
  // changed: non-matching tag

  // XXX one
  // XXX: two
  // @XXX three
  // @XXX: four
  //xxx: non-matching tag

  // IDEA one
  // IDEA: two
  // @IDEA three
  // @IDEA: four
  //idea: non-matching tag

  // HACK one
  // HACK: two
  // @HACK three
  // @HACK: four
  //hack: non-matching tag

  // NOTE one
  // NOTE: two
  // @NOTE three
  // @NOTE: four
  //note: non-matching tag

  // REVIEW one
  // REVIEW: two
  // @REVIEW three
  // @REVIEW: four
  //review: non-matching tag
};

// Don't match the following
define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");
// XXXe�d��RPPP0�
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvc3BlYy9maXh0dXJlcy9zYW1wbGUxL3NhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVFBLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxHQUFlO0FBQzFCLE1BQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFZLEtBQUssRUFBRTtBQUN6QixRQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQUUsYUFBTyxLQUFLLENBQUM7S0FBRTtBQUN4QyxRQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFO1FBQUUsT0FBTztRQUFFLElBQUksR0FBRyxFQUFFO1FBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUMxRCxXQUFNLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLGFBQU8sR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEIsYUFBTyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDNUQ7QUFDRCxXQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0dBQ3JELENBQUM7Ozs7QUFJRixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F3QzNDLENBQUM7OztBQUdGLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy90b2RvLXNob3cvc3BlYy9maXh0dXJlcy9zYW1wbGUxL3NhbXBsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2FtcGxlIHF1aWNrc29ydCBjb2RlXG4gKiBUT0RPOiBUaGlzIGlzIHRoZSBmaXJzdCB0b2RvXG4gKlxuICogTE9PTkc6IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBkYXBpYnVzIHJob25jdXMuIFNjZWxlcmlzcXVlIHF1YW0sIGlkIGFudGUgbW9sZXN0aWFzLCBpcHN1bSBsb3JlbSBtYWduaXMgZXQuIEEgZWxlaWZlbmQgaXBzdW0uIFBlbGxlbnRlc3F1ZSBhbGlxdWFtLCBwcm9pbiBtb2xsaXMgc2VkIG9kaW8sIGF0IGFtZXQgdmVzdGlidWx1bSB2ZWxpdC4gRG9sb3Igc2VkLCB1cm5hIGludGVnZXIgc3VzcGVuZGlzc2UgdXQgYS4gUGhhcmV0cmEgYW1ldCBkdWkgYWNjdW1zYW4gZWxlbWVudHVtLCB2aXRhZSBldCBhYyBsaWd1bGEgdHVycGlzIHNlbXBlciBkb25lYy5cbiAqIExPT05HX1NwZ0xFODRNczFLNERTdW10SkRvTm44WkVDWkxMK1ZSMERvR3lkeTU0dlVvU3BnTEU4NE1zMUs0RFN1bXRKRG9ObjhaRUNaTExWUjBEb0d5ZHk1NHZVb25SQ2xYd0xiRmhYMmdNd1pnangyNTBheStWMGxGN3NQWjhBaUNWeTIyc0U9U3BnTF9FODRNczFLNERTdW10SkRvTm44WkVDWkxMVlIwRG9HeWR5NTR2VW9TcGdMRTg0TXMxSzREU3VtdEpfRG9ObjhaRUNaTExWUjBEb0d5ZHk1NHZVb1xuICovXG5cbnZhciBxdWlja3NvcnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzb3J0ID0gZnVuY3Rpb24oaXRlbXMpIHtcbiAgICBpZiAoaXRlbXMubGVuZ3RoIDw9IDEpIHsgcmV0dXJuIGl0ZW1zOyB9XG4gICAgdmFyIHBpdm90ID0gaXRlbXMuc2hpZnQoKSwgY3VycmVudCwgbGVmdCA9IFtdLCByaWdodCA9IFtdO1xuICAgIHdoaWxlKGl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIGN1cnJlbnQgPSBpdGVtcy5zaGlmdCgpO1xuICAgICAgY3VycmVudCA8IHBpdm90ID8gbGVmdC5wdXNoKGN1cnJlbnQpIDogcmlnaHQucHVzaChjdXJyZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnQobGVmdCkuY29uY2F0KHBpdm90KS5jb25jYXQoc29ydChyaWdodCkpO1xuICB9O1xuXG4gIC8vIFRPRE86IFRoaXMgaXMgdGhlIHNlY29uZCB0b2RvXG5cbiAgcmV0dXJuIHNvcnQoQXJyYXkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7ICAvLyBERUJVR1xuXG4gIC8vIEZJWE1FOiBBZGQgbW9yZSBhbm5ub3RhdGlvbnMgOilcblxuICAvLyBDSEFOR0VEIG9uZVxuICAvLyBDSEFOR0VEOiB0d29cbiAgLy8gQENIQU5HRUQgdGhyZWVcbiAgLy8gQENIQU5HRUQ6IGZvdXJcbiAgLy8gY2hhbmdlZDogbm9uLW1hdGNoaW5nIHRhZ1xuXG4gIC8vIFhYWCBvbmVcbiAgLy8gWFhYOiB0d29cbiAgLy8gQFhYWCB0aHJlZVxuICAvLyBAWFhYOiBmb3VyXG4gIC8veHh4OiBub24tbWF0Y2hpbmcgdGFnXG5cbiAgLy8gSURFQSBvbmVcbiAgLy8gSURFQTogdHdvXG4gIC8vIEBJREVBIHRocmVlXG4gIC8vIEBJREVBOiBmb3VyXG4gIC8vaWRlYTogbm9uLW1hdGNoaW5nIHRhZ1xuXG4gIC8vIEhBQ0sgb25lXG4gIC8vIEhBQ0s6IHR3b1xuICAvLyBASEFDSyB0aHJlZVxuICAvLyBASEFDSzogZm91clxuICAvL2hhY2s6IG5vbi1tYXRjaGluZyB0YWdcblxuICAvLyBOT1RFIG9uZVxuICAvLyBOT1RFOiB0d29cbiAgLy8gQE5PVEUgdGhyZWVcbiAgLy8gQE5PVEU6IGZvdXJcbiAgLy9ub3RlOiBub24tbWF0Y2hpbmcgdGFnXG5cbiAgLy8gUkVWSUVXIG9uZVxuICAvLyBSRVZJRVc6IHR3b1xuICAvLyBAUkVWSUVXIHRocmVlXG4gIC8vIEBSRVZJRVc6IGZvdXJcbiAgLy9yZXZpZXc6IG5vbi1tYXRjaGluZyB0YWdcblxufTtcblxuLy8gRG9uJ3QgbWF0Y2ggdGhlIGZvbGxvd2luZ1xuZGVmaW5lKFwiX0pTX1RPRE9fQUxFUlRfXCIsIFwianM6YWxlcnQoJnF1b3Q7VE9ETyZxdW90Oyk7XCIpO1xuLy8gWFhYZe+/vWTvv73vv71SUFBQMFx1MDAwNu+/vVx1MDAwZlxuIl19