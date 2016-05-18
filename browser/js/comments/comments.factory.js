'use strict';

app.factory('CommentsFactory', ($http) => {

    const Comments = {};
    const commentUrl = '/api/comments/';

    const getData = (res) => res.data;

    Comments.fetchByProblem = (problemId) => {
        return $http.get(`${commentUrl}/problem/${problemId}`)
        .then(getData);
    };

    Comments.fetchByUser = (userId) => {
        return $http.get(`${commentUrl}/user/${userId}`)
        .then(getData);
    };

    Comments.add = (commentData) => {
        return $http.post(commentUrl, commentData)
        .then(getData);
    };

    Comments.edit = (id, editsToMake) => {
        return $http.put(commentUrl + id, editsToMake)
        .then(getData);
    };

    Comments.destroy = (id) => $http.delete(commentUrl + id);

    return Comments;

});
