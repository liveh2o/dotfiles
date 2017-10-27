var quicksort = function quicksort() {
  var sort = (function (_sort) {
    function sort(_x) {
      return _sort.apply(this, arguments);
    }

    sort.toString = function () {
      return _sort.toString();
    };

    return sort;
  })(function (items) {
    if (items.length <= 1) return items;
    var pivot = items.shift(),
        current,
        left = [],
        right = [];
    while (items.length > 0) {
      current = items.shift();
      current < pivot ? left.push(current) : right.push(current);
    }
    return sort(left).concat(pivot).concat(sort(right));
  });

  return sort(Array.apply(this, arguments));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvc3BlYy9maXh0dXJlcy9yb290LWRpcjEvc2FtcGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksU0FBUyxHQUFHLHFCQUFZO0FBQzFCLE1BQUksSUFBSTs7Ozs7Ozs7OztLQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3pCLFFBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDcEMsUUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRTtRQUFFLE9BQU87UUFBRSxJQUFJLEdBQUcsRUFBRTtRQUFFLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDMUQsV0FBTSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUN0QixhQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3hCLGFBQU8sR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVEO0FBQ0QsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUNyRCxDQUFBLENBQUM7O0FBRUYsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztDQUMzQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvc3BlYy9maXh0dXJlcy9yb290LWRpcjEvc2FtcGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHF1aWNrc29ydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNvcnQgPSBmdW5jdGlvbihpdGVtcykge1xuICAgIGlmIChpdGVtcy5sZW5ndGggPD0gMSkgcmV0dXJuIGl0ZW1zO1xuICAgIHZhciBwaXZvdCA9IGl0ZW1zLnNoaWZ0KCksIGN1cnJlbnQsIGxlZnQgPSBbXSwgcmlnaHQgPSBbXTtcbiAgICB3aGlsZShpdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdXJyZW50ID0gaXRlbXMuc2hpZnQoKTtcbiAgICAgIGN1cnJlbnQgPCBwaXZvdCA/IGxlZnQucHVzaChjdXJyZW50KSA6IHJpZ2h0LnB1c2goY3VycmVudCk7XG4gICAgfVxuICAgIHJldHVybiBzb3J0KGxlZnQpLmNvbmNhdChwaXZvdCkuY29uY2F0KHNvcnQocmlnaHQpKTtcbiAgfTtcblxuICByZXR1cm4gc29ydChBcnJheS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbn07Il19