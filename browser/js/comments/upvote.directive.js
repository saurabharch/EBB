app.directive('upvote', function(CommentsFactory){
  return {
    restrict: "E",
    templateUrl: 'js/comments/views/upvote.html',
    scope: {
      theComment: "=",
      upvotes: "="
    },
    link: function(scope){
      scope.hasUpvoted = false;
      scope.hasDownvoted = false;
      scope.upvoteById = (id) => {
        if (!scope.hasUpvoted && scope.hasDownvoted) {
          CommentsFactory.upvoteById(id);
          scope.hasUpvoted = false;
          scope.hasDownvoted = false;
          scope.upvotes++;
        } else if (!scope.hasUpvoted){
          CommentsFactory.upvoteById(id);
          scope.hasUpvoted = true;
          scope.hasDownvoted = false;
          scope.upvotes++;
        }
      };
      scope.downvoteById = (id) => {
        if(scope.hasUpvoted && !scope.hasDownvoted){
          CommentsFactory.downvoteById(id);
          scope.hasUpvoted = false;
          scope.hasDownvoted = false;
          scope.upvotes--;
        } else if (!scope.hasDownvoted) {
          CommentsFactory.downvoteById(id);
          scope.hasUpvoted = false;
          scope.hasDownvoted = true;
          scope.upvotes--;
        }
      };
    }
  };
});
