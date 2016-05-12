app.controller('InterviewCtrl', function($scope){
  
});

app.config(function($stateProvider){
  $stateProvider.state('interviewer', {
    url: '/interviewer',
    templateUrl: '/js/interview/views/interviewer.html'
  }).state('interviewee', {
    url: '/interviewee',
    templateUrl: '/js/interview/views/interviewee.html'
  });
});
