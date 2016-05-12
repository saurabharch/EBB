app.factory('InviteFriendFactory', function($http) {
    let InviteFriendFactory = {};

    function getData(res) {
        return res.data;
    }

    InviteFriendFactory.getFriends = function(userId) {
        return $http.get('/api/members/' + userId + '/friends')
        .then(getData);
    };

    return InviteFriendFactory;
});
