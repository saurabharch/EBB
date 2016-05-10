app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope) {
    $scope.myInterval = 3000;
    $scope.slides = [
    {
      image: '/images/pair-programming.jpg',
      heading: 'Pair programming',
      subheading: 'Pair up to solve coding problems together',
      text: ['Pair with a friend', 'Meet new friends at your level to pair with', 'Live edit your code together', 'Video chat with your coding partner']
    },
    {
      image: '/images/interview.jpg',
      heading: 'Live interview practice',
      subheading: 'Practice live interviews with others',
      text: ['Be the interviewer or interviewee', 'Use your own problems or use one of ours', 'Record your interview so you can review your performance', 'Video chat with your interviewer / interviewee']
    },
    {
      image: '/images/help-ticket.jpg',
      heading: 'Collaborative workspaces',
      subheading: 'Solve coding issues collaboratively',
      text: ['Invite a friend to help you with your code', 'Request assistance from another user to help you', 'Share your code and let others edit it live']
    }
  ];

});
