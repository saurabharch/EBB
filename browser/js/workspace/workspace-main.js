// app.config(function($stateProvider) {
//     $stateProvider.state('workspaceMain', {
//         url: '/workspace/:workspaceId',
//         templateUrl: 'js/workspace/workspace-main.html',
//         controller: 'WorkspaceMainCtrl',
//         params: {
//             problemObj: null,
//             isInterviewer: false
//         },
//         resolve: {
//             user: (AuthService) => {
//                 return AuthService.getLoggedInUser();
//             },
//             workspace: ($stateParams, WorkspaceFactory) => {
//                 return WorkspaceFactory.getWorkspaceById($stateParams.workspaceId);
//             }
//         }
//     });
// });
//
// app.controller('WorkspaceMainCtrl', ($scope, $log, RunTests, user, workspace, WorkspaceFactory, $mdToast, $mdDialog, $state, LoggedInUsersFactory, Socket, VideoChatFactory, $stateParams) => {
//
//     const loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();
//     $scope.loggedInUsers = loggedInUsers;
//     $scope.user = user;
//     $scope.workspace = workspace;
//     $scope.problem = $stateParams.problemObj;
//     $scope.isInterviewer = $stateParams.isInterviewer;
//
//     console.log('isInterviewer', $scope.isInterviewer)
//
//     const isCreator = user._id === workspace.creator._id;
//     if (workspace.collaborator) {
//         $scope.partnerUser = isCreator ? workspace.collaborator : workspace.creator;
//     }
//
//     // $scope.submit = () => {
//     //     RunTests.submitCode({ code: $scope.theCode })
//     //         .then((returnedValue) => console.log(returnedValue))
//     //         .catch($log.error);
//     // };
//
// });
